import assert from "node:assert/strict";
import { createServer } from "node:https";
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  readlink,
  rm,
  symlink,
  utimes,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot, requiredFiles, sha256 } from "../lib.mjs";
import { execute, mustRun } from "./process.mjs";

const enabled = process.env.FENBEI_INTEGRATION === "1";
const script = path.join(projectRoot, "deploy/remote-release.sh");

async function certificate(directory) {
  const cert = path.join(directory, "fullchain.cer"),
    key = path.join(directory, "fenbeiceshi.com.key");
  await mustRun("openssl", [
    "req",
    "-x509",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-keyout",
    key,
    "-out",
    cert,
    "-days",
    "1",
    "-subj",
    "/CN=fenbeiceshi.com",
    "-addext",
    "subjectAltName=DNS:fenbeiceshi.com,DNS:*.fenbeiceshi.com",
  ]);
  return { cert, key };
}

async function artifact(directory, release) {
  const source = path.join(directory, `source-${release}`);
  await mkdir(source);
  const assets = [
    `/_next/static/chunks/app/%5B...slug%5D/${release}.js`,
    `/_next/static/css/${release}.css`,
  ];
  for (const file of requiredFiles) {
    await mkdir(path.dirname(path.join(source, file)), { recursive: true });
    await writeFile(path.join(source, file), `<!doctype html><p>${release}</p>`);
  }
  for (const asset of assets) {
    const file = path.join(source, decodeURIComponent(asset));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `/* ${release} */`);
  }
  await writeFile(path.join(source, "_release.txt"), `${release}\n`);
  await writeFile(path.join(source, "_release-assets.txt"), `${assets.join("\n")}\n`);
  const file = path.join(directory, `${release}.tar.gz`);
  await mustRun("tar", ["-czf", file, "-C", source, "."]);
  return { source, input: await readFile(file), digest: await sha256(file) };
}

test(
  "Linux 真实 TLS 下验证三版保留、资源缓冲、失败恢复与手动回滚",
  { skip: !enabled, timeout: 120000 },
  async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-linux-"));
    const base = path.join(directory, "fenbeiceshi");
    const tls = await certificate(directory);
    const counts = new Map();
    const server = createServer(
      { cert: await readFile(tls.cert), key: await readFile(tls.key) },
      async (request, response) => {
        try {
          response.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
          const url = new URL(request.url, "https://fenbeiceshi.com");
          const current = await readlink(path.join(base, "current"));
          const release = path.basename(current);
          if (release === "bad-policy") response.setHeader("Permissions-Policy", "microphone=()");
          if (url.pathname === "/_release.txt") {
            const count = (counts.get(release) ?? 0) + 1;
            counts.set(release, count);
            if (release === "bad-marker" || (release === "bad-public" && count === 2)) {
              response.end("wrong-version");
              return;
            }
          }
          if (
            (release === "bad-page" && url.pathname === "/knowledge/decibel-chart/") ||
            (release === "bad-asset" && url.pathname.endsWith(".js"))
          ) {
            response.writeHead(404);
            response.end("missing");
            return;
          }
          if (release === "bad-404" && url.pathname.startsWith("/_missing-")) {
            response.end("fallback");
            return;
          }
          const relative = decodeURIComponent(url.pathname);
          const file = relative.startsWith("/_next/static/")
            ? path.join(base, "shared", relative)
            : path.join(current, relative, relative.endsWith("/") ? "index.html" : "");
          response.setHeader(
            "Content-Type",
            release === "bad-mime"
              ? "text/plain"
              : relative.endsWith(".js")
                ? "application/javascript"
                : relative.endsWith(".css")
                  ? "text/css"
                  : "text/html",
          );
          response.end(await readFile(file));
        } catch (error) {
          response.writeHead(error.code === "ENOENT" ? 404 : 500);
          response.end(error.code === "ENOENT" ? "missing" : error.message);
        }
      },
    );
    await new Promise((resolve) => server.listen(443, "0.0.0.0", resolve));
    const env = { ...process.env, CURL_CA_BUNDLE: tls.cert };
    const deploy = async (release) => {
      const build = await artifact(directory, release);
      return execute("bash", [script, base, release, build.digest, "fenbeiceshi.com", "deploy"], {
        input: build.input,
        env,
      });
    };
    try {
      assert.notEqual((await deploy("bad-marker")).code, 0);
      await assert.rejects(lstat(path.join(base, "current")), { code: "ENOENT" });
      assert.deepEqual(await readdir(path.join(base, "releases")), []);
      for (const release of ["v1", "v2", "v3", "v4"]) {
        const result = await deploy(release);
        assert.equal(result.code, 0, result.stderr);
      }
      assert.deepEqual((await readdir(path.join(base, "releases"))).sort(), ["v2", "v3", "v4"]);
      assert.ok(await lstat(path.join(base, "shared/_next/static/chunks/app/[...slug]/v1.js")));
      for (const release of [
        "bad-page",
        "bad-asset",
        "bad-public",
        "bad-404",
        "bad-mime",
        "bad-policy",
      ]) {
        const result = await deploy(release);
        assert.notEqual(result.code, 0, result.stderr);
        assert.equal(path.basename(await readlink(path.join(base, "current"))), "v4");
        assert.deepEqual((await readdir(path.join(base, "releases"))).sort(), ["v2", "v3", "v4"]);
        assert.match(result.stderr, /已恢复旧版/);
      }
      const old = new Date(Date.now() - 9 * 86400000);
      await utimes(path.join(base, "shared/_next/static/chunks/app/[...slug]/v1.js"), old, old);
      await utimes(path.join(base, "shared/_next/static/chunks/app/[...slug]/v3.js"), old, old);
      const next = await deploy("v5");
      assert.equal(next.code, 0, next.stderr);
      await assert.rejects(
        lstat(path.join(base, "shared/_next/static/chunks/app/[...slug]/v1.js")),
        {
          code: "ENOENT",
        },
      );
      assert.ok(await lstat(path.join(base, "shared/_next/static/chunks/app/[...slug]/v3.js")));
      const rollback = await execute(
        "bash",
        [script, base, "v3", "-", "fenbeiceshi.com", "rollback"],
        { env },
      );
      assert.equal(rollback.code, 0, rollback.stderr);
      assert.equal(path.basename(await readlink(path.join(base, "current"))), "v3");
      const duplicate = await execute(
        "bash",
        [script, base, "v3", "a".repeat(64), "fenbeiceshi.com", "deploy"],
        { env },
      );
      assert.notEqual(duplicate.code, 0);
      const unsafe = await execute(
        "bash",
        [script, "/", "v6", "a".repeat(64), "fenbeiceshi.com", "deploy"],
        { env },
      );
      assert.notEqual(unsafe.code, 0);
      const badSource = path.join(directory, "unsafe-source");
      await mkdir(badSource);
      await writeFile(path.join(badSource, "file.txt"), "escape");
      await symlink("/etc/passwd", path.join(badSource, "link"));
      const badArchive = path.join(directory, "unsafe.tar.gz");
      await mustRun("tar", ["-czf", badArchive, "-C", badSource, "."]);
      const linked = await execute(
        "bash",
        [script, base, "linked", await sha256(badArchive), "fenbeiceshi.com", "deploy"],
        { input: await readFile(badArchive), env },
      );
      assert.notEqual(linked.code, 0);
      assert.match(linked.stderr, /非普通文件/);
      await rm(path.join(badSource, "link"));
      await mustRun("tar", [
        "-czf",
        badArchive,
        "--transform",
        "s|file.txt|../escape.txt|",
        "-C",
        badSource,
        "file.txt",
      ]);
      const traversal = await execute(
        "bash",
        [script, base, "traversal", await sha256(badArchive), "fenbeiceshi.com", "deploy"],
        { input: await readFile(badArchive), env },
      );
      assert.notEqual(traversal.code, 0);
      await assert.rejects(lstat(path.join(directory, "escape.txt")), { code: "ENOENT" });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await rm(directory, { recursive: true, force: true });
    }
  },
);

test(
  "真实 Nginx 验证 TLS、主域名跳转、缓存策略与 404",
  { skip: !enabled, timeout: 30000 },
  async (t) => {
    const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-nginx-"));
    const config = path.join(directory, "nginx.conf");
    t.after(async () => {
      try {
        let running = false;
        try {
          await lstat(path.join(directory, "nginx.pid"));
          running = true;
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        if (running)
          await mustRun("nginx", ["-s", "quit", "-c", config], {
            stdio: ["ignore", "ignore", "inherit"],
            timeout: 5000,
            label: "停止测试 Nginx",
          });
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    });
    const base = path.join(directory, "fenbeiceshi");
    const tls = await certificate(directory);
    const certRoot = path.join(directory, "ssl");
    await mkdir(path.join(certRoot, "fenbeiceshi.com"), { recursive: true });
    await writeFile(path.join(certRoot, "fenbeiceshi.com/fullchain.cer"), await readFile(tls.cert));
    await writeFile(
      path.join(certRoot, "fenbeiceshi.com/fenbeiceshi.com.key"),
      await readFile(tls.key),
    );
    await mkdir(path.join(base, "current"), { recursive: true });
    await mkdir(path.join(base, "shared/_next/static"), { recursive: true });
    await writeFile(path.join(base, "current/index.html"), "homepage");
    await writeFile(path.join(base, "current/404.html"), "not found");
    for (const locale of ["en", "zh-tw"]) {
      await mkdir(path.join(base, "current", locale), { recursive: true });
      await writeFile(path.join(base, "current", locale, "index.html"), `${locale} homepage`);
    }
    await writeFile(path.join(base, "current/_release.txt"), "test-release");
    await writeFile(path.join(base, "shared/_next/static/app.js"), "js");
    await writeFile(path.join(base, "current/.env"), "test-only");
    await mustRun("chmod", ["-R", "a+rX", directory]);
    const site = (
      await readFile(path.join(projectRoot, "deploy/nginx/fenbeiceshi.conf.template"), "utf8")
    )
      .replaceAll("__DOMAIN__", "fenbeiceshi.com")
      .replaceAll("__DEPLOY_PATH__", base)
      .replaceAll("__CERT_ROOT__", certRoot);
    await writeFile(
      config,
      `pid ${directory}/nginx.pid;\nerror_log ${directory}/nginx-error.log info;\nevents {}\nhttp {\ninclude /etc/nginx/mime.types;\n${site}\n}\n`,
    );
    await mustRun("nginx", ["-t", "-c", config]);
    const bootstrap = await readFile(path.join(projectRoot, "deploy/bootstrap-server.sh"), "utf8");
    const running = () =>
      execute("bash", ["-c", `${bootstrap}\nnginx_is_running "$(nginx -T -c '${config}')"`]);
    assert.equal((await running()).code, 1);
    // 后台 Nginx 不继承命令输出管道，启动命令退出后即可继续请求检查。
    await mustRun("nginx", ["-c", config], {
      stdio: ["ignore", "ignore", "inherit"],
      signal: t.signal,
      label: "启动测试 Nginx",
    });
    assert.equal((await running()).code, 0);
    const curl = (args) =>
      mustRun(
        "curl",
        [
          "--silent",
          "--show-error",
          "--connect-timeout",
          "3",
          "--max-time",
          "5",
          "--noproxy",
          "*",
          "--cacert",
          tls.cert,
          ...args,
        ],
        { signal: t.signal, label: `请求 ${args.at(-1)}` },
      );
    const home = await curl(["-i", "https://fenbeiceshi.com/"]);
    assert.match(home.stdout, /HTTP\/(?:1\.1|2) 200/);
    assert.match(home.stdout, /Cache-Control: no-cache/i);
    assert.match(
      home.stdout,
      /Permissions-Policy: camera=\(\), microphone=\(self\), geolocation=\(\)/i,
    );
    const asset = await curl(["-i", "https://fenbeiceshi.com/_next/static/app.js"]);
    assert.match(asset.stdout, /max-age=31536000, immutable/);
    assert.match(asset.stdout, /X-Content-Type-Options: nosniff/i);
    assert.match(asset.stdout, /Permissions-Policy:.*microphone=\(self\)/i);
    assert.match(asset.stdout, /Content-Type: (?:application|text)\/javascript/i);
    const marker = await curl(["-i", "https://fenbeiceshi.com/_release.txt"]);
    assert.match(marker.stdout, /Cache-Control: no-store/i);
    for (const url of [
      "http://fenbeiceshi.com/path/?a=1",
      "https://www.fenbeiceshi.com/path/?a=1",
    ]) {
      const redirect = await curl(["-i", url]);
      assert.match(redirect.stdout, /301/);
      assert.match(redirect.stdout, /Location: https:\/\/fenbeiceshi.com\/path\/\?a=1/i);
    }
    for (const [route, label] of [
      ["/missing/", "not found"],
      ["/en/missing/", "not found"],
      ["/en/tools/missing?lang=zh", "not found"],
      ["/zh-tw/missing/", "not found"],
      ["/zh-tw/knowledge/missing/?lang=en", "not found"],
      ["/english/missing/", "not found"],
      ["/zh-tw-other/missing/", "not found"],
      ["/en/404/", "not found"],
      ["/zh-tw/404/", "not found"],
    ]) {
      const missing = await curl(["-i", `https://fenbeiceshi.com${route}`]);
      assert.match(missing.stdout, /HTTP\/(?:1\.1|2) 404/);
      assert.ok(missing.stdout.endsWith(label), `${route} 应返回 ${label}`);
    }
    for (const locale of ["en", "zh-tw"]) {
      const localizedHome = await curl(["-i", `https://fenbeiceshi.com/${locale}/`]);
      assert.match(localizedHome.stdout, /HTTP\/(?:1\.1|2) 200/);
      assert.ok(localizedHome.stdout.endsWith(`${locale} homepage`));
      const direct = await curl(["-i", `https://fenbeiceshi.com/${locale}/404/index.html`]);
      assert.match(direct.stdout, /HTTP\/(?:1\.1|2) 404/);
      const privateFile = await curl(["-i", `https://fenbeiceshi.com/${locale}/.env`]);
      assert.match(privateFile.stdout, /HTTP\/(?:1\.1|2) 403/);
    }
    const hidden = await curl(["-i", "https://fenbeiceshi.com/.env"]);
    assert.match(hidden.stdout, /HTTP\/(?:1\.1|2) 403/);
    assert.doesNotMatch(hidden.stdout, /test-only/);
  },
);

test(
  "初始化验证凭据权限、模板加载、通配符和失败恢复",
  { skip: !enabled, timeout: 30000 },
  async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-setup-"));
    const base = path.join(directory, "fenbeiceshi");
    const tls = await certificate(directory);
    const nginxPath = path.join(directory, "conf");
    const certRoot = path.join(directory, "ssl");
    const acmeHome = path.join(directory, "acme");
    const bin = path.join(directory, "bin");
    const credentials = path.join(directory, "cloudflare.env");
    const rootConfig = path.join(directory, "nginx.conf");
    const config = path.join(nginxPath, "fenbeiceshi.conf");
    const token = "test-token-with-no-real-permissions";
    const template = await readFile(
      path.join(projectRoot, "deploy/nginx/fenbeiceshi.conf.template"),
    );
    for (const folder of [nginxPath, acmeHome, bin]) await mkdir(folder);
    const mainConfig = `events {}\nhttp { include /etc/nginx/mime.types; include ${nginxPath}/*.conf; }\n`;
    await writeFile(rootConfig, mainConfig);
    await writeFile(
      path.join(bin, "nginx"),
      `#!/bin/sh
if [ "$1" = -s ] && [ "$2" = reload ]; then
  [ ! -e '${directory}/fail-reload' ] || exit 1
  printf '%s\\n' "$*" >> '${directory}/reload.log'
  exit 0
fi
exec /usr/sbin/nginx -c '${rootConfig}' "$@"
`,
      { mode: 0o700 },
    );
    // 避免操作测试机的全局服务和真实 DNS API；配置验证仍使用真实 Nginx。
    const cronFile = path.join(directory, "crontab");
    const existingCron =
      '0 0 23 * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null\n';
    await writeFile(cronFile, existingCron);
    await writeFile(
      path.join(bin, "crontab"),
      `#!/bin/sh\nif [ "$1" = -l ]; then cat '${cronFile}'; else cp "$1" '${cronFile}'; fi\n`,
      { mode: 0o700 },
    );
    await writeFile(
      path.join(acmeHome, "acme.sh"),
      `#!/usr/bin/env bash
set -euo pipefail
args=("$@")
mkdir -p '${acmeHome}/fenbeiceshi.com_ecc'
cp '${tls.cert}' '${acmeHome}/fenbeiceshi.com_ecc/fullchain.cer'
cp '${tls.key}' '${acmeHome}/fenbeiceshi.com_ecc/fenbeiceshi.com.key'
touch '${acmeHome}/fenbeiceshi.com_ecc/fenbeiceshi.com.conf'
for arg in "$@"; do
    if [[ "$arg" == --issue ]]; then
        [[ " $* " == *" --dns dns_cf "* && " $* " == *" -d *.fenbeiceshi.com "* ]]
        [[ -n "\u0024{CF_Token:-}" && -n "\u0024{CF_Zone_ID:-}" ]]
        exit 2
    fi
done
for ((index=0; index<\u0024{#args[@]}; index++)); do
    case "\u0024{args[index]}" in
        --fullchain-file)
            cp '${tls.cert}' "\u0024{args[index+1]}"
            printf '%s\\n' "Le_RealFullChainPath='\u0024{args[index+1]}'" >> '${acmeHome}/fenbeiceshi.com_ecc/fenbeiceshi.com.conf' ;;
        --key-file)
            cp '${tls.key}' "\u0024{args[index+1]}"
            printf '%s\\n' "Le_RealKeyPath='\u0024{args[index+1]}'" >> '${acmeHome}/fenbeiceshi.com_ecc/fenbeiceshi.com.conf' ;;
        --reloadcmd)
            saved=$(printf '%s' "\u0024{args[index+1]}" | base64 | tr -d '\\n')
            printf '%s\\n' "Le_ReloadCmd='__ACME_BASE64__START_\u0024{saved}__ACME_BASE64__END_'" >> '${acmeHome}/fenbeiceshi.com_ecc/fenbeiceshi.com.conf' ;;
    esac
done
`,
      { mode: 0o700 },
    );
    const env = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
    const setup = (input) =>
      execute(
        "bash",
        [
          path.join(projectRoot, "deploy/setup-server.sh"),
          base,
          "fenbeiceshi.com",
          nginxPath,
          certRoot,
          credentials,
          "",
          acmeHome,
        ],
        { env, input },
      );
    try {
      const escaped = path.join(directory, "escaped");
      await writeFile(credentials, `CF_Token=$(touch ${escaped})\nCF_Zone_ID=${"0".repeat(32)}\n`, {
        mode: 0o600,
      });
      assert.notEqual((await setup(template)).code, 0);
      await assert.rejects(lstat(escaped), { code: "ENOENT" });
      await writeFile(credentials, `CF_Token=${token}\nCF_Zone_ID=${"0".repeat(32)}\n`);
      const first = await setup(template);
      assert.equal(first.code, 0, first.stderr);
      assert.doesNotMatch(first.stdout + first.stderr, new RegExp(token));
      const original = await readFile(config);
      const certFile = path.join(certRoot, "fenbeiceshi.com/fullchain.cer");
      const originalCert = await readFile(certFile);
      const second = await setup(template);
      assert.equal(second.code, 0, second.stderr);
      assert.match(second.stdout, /复用已有证书/);
      assert.match(second.stdout, /跳过替换/);
      const cron = await readFile(cronFile, "utf8");
      assert.ok(cron.startsWith(existingCron));
      assert.ok(cron.includes(`"${acmeHome}/acme.sh" --cron --home "${acmeHome}"`));
      assert.equal(cron.split("--cron").length, 3);
      assert.equal(
        (await readFile(path.join(directory, "reload.log"), "utf8")).trim(),
        "-s reload",
      );
      const badTemplate = await setup("server { invalid_directive on; }\n");
      assert.notEqual(badTemplate.code, 0);
      assert.deepEqual(await readFile(config), original);
      assert.deepEqual(await readFile(certFile), originalCert);
      assert.match(badTemplate.stderr, /已恢复原 Nginx 配置和证书/);
      await writeFile(rootConfig, "events {}\nhttp {}\n");
      const missingInclude = await setup(template);
      assert.notEqual(missingInclude.code, 0);
      assert.match(missingInclude.stderr, /没有 include/);
      assert.deepEqual(await readFile(config), original);
      await writeFile(rootConfig, mainConfig);
      await mustRun("openssl", [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        tls.key,
        "-out",
        tls.cert,
        "-days",
        "1",
        "-subj",
        "/CN=fenbeiceshi.com",
        "-addext",
        "subjectAltName=DNS:fenbeiceshi.com",
      ]);
      const missingWildcard = await setup(template);
      assert.notEqual(missingWildcard.code, 0);
      assert.match(missingWildcard.stderr, /没有包含通配符/);
      assert.deepEqual(await readFile(certFile), originalCert);
      await mustRun("openssl", [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        tls.key,
        "-out",
        tls.cert,
        "-days",
        "1",
        "-subj",
        "/CN=*.fenbeiceshi.com",
        "-addext",
        "subjectAltName=DNS:*.fenbeiceshi.com",
      ]);
      const missingApex = await setup(template);
      assert.notEqual(missingApex.code, 0);
      assert.match(missingApex.stderr, /没有包含主域名/);
      assert.deepEqual(await readFile(certFile), originalCert);
      await mustRun("openssl", [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        tls.key,
        "-out",
        tls.cert,
        "-days",
        "1",
        "-subj",
        "/CN=fenbeiceshi.com",
        "-addext",
        "subjectAltName=DNS:fenbeiceshi.com,DNS:*.fenbeiceshi.com.invalid",
      ]);
      const wrongWildcard = await setup(template);
      assert.notEqual(wrongWildcard.code, 0);
      assert.match(wrongWildcard.stderr, /没有包含通配符/);
      assert.deepEqual(await readFile(certFile), originalCert);
      await writeFile(tls.cert, originalCert);
      await writeFile(path.join(directory, "fail-reload"), "");
      const failedRestore = await setup("server { invalid_directive on; }\n");
      assert.notEqual(failedRestore.code, 0);
      assert.match(failedRestore.stderr, /恢复后的验证失败/);
      assert.match(failedRestore.stderr, /恢复文件已保留/);
      const recoveryFolders = (await readdir(path.join(base, "shared"))).filter((name) =>
        name.startsWith(".ssl-backup-"),
      );
      assert.equal(recoveryFolders.length, 1);
      assert.deepEqual(
        await readFile(path.join(base, "shared", recoveryFolders[0], "fullchain.cer")),
        originalCert,
      );
      await chmod(credentials, 0o644);
      const badPermissions = await setup(template);
      assert.notEqual(badPermissions.code, 0);
      assert.match(badPermissions.stderr, /权限必须为 600 或 400/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
