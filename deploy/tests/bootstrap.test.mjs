import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot, shellQuote } from "../lib.mjs";
import { execute } from "./process.mjs";

const token = "test-token-with-no-real-permissions";
const zone = "0".repeat(32);
const credentials = `CF_Token=${token}\nCF_Zone_ID=${zone}\n`;

test("Actions 的环境准备默认关闭，只在手动勾选时执行，失败阻止发布", async () => {
  const workflow = await readFile(path.join(projectRoot, ".github/workflows/deploy.yml"), "utf8");
  assert.match(
    workflow,
    /prepare_environment:\s+description: 初始化或检查部署环境\s+type: boolean\s+required: false\s+default: false/,
  );
  const prepare = workflow.match(
    / {6}- name: 初始化或检查部署环境\n([\s\S]*?) {6}- name: 发布与健康检查/,
  );
  assert.ok(prepare);
  assert.match(
    prepare[1],
    /if: github.event_name == 'workflow_dispatch' && inputs.prepare_environment/,
  );
  assert.match(prepare[1], /run: npm run deploy:setup -- --bootstrap/);
  assert.doesNotMatch(prepare[1], /continue-on-error|always\(\)/);
  for (const name of ["CF_TOKEN", "CF_ZONE_ID"])
    assert.ok(prepare[1].includes(`${name}: \u0024{{ secrets.${name} }}`));
  assert.ok(prepare[1].includes("SSL_EMAIL: \u0024{{ vars.SSL_EMAIL }}"));
  assert.ok(
    prepare[1].includes("NGINX_CONF_PATH: \u0024{{ vars.NGINX_CONF_PATH || '/etc/nginx/conf.d' }}"),
  );
});

test("初始化 CLI 提前拒绝缺失凭据与非 root，SSH 参数和输出不含凭据", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-bootstrap-cli-"));
  try {
    const captured = path.join(directory, "captured.json");
    const key = path.join(directory, "key");
    await writeFile(key, "test-only private key");
    await writeFile(
      path.join(directory, "ssh"),
      `#!${process.execPath}
const fs = require("node:fs");
let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => fs.writeFileSync(${JSON.stringify(captured)}, JSON.stringify({ args: process.argv.slice(2), input })));
`,
      { mode: 0o700 },
    );
    const env = {
      ...process.env,
      PATH: `${directory}:${process.env.PATH}`,
      GITHUB_ACTIONS: "true",
      SSH_HOST: "server.example.com",
      SSH_USER: "root",
      SSH_PRIVATE_KEY_FILE: key,
      SSH_KNOWN_HOSTS_FILE: "",
      SSL_EMAIL: "test@example.com",
      CF_TOKEN: token,
      CF_ZONE_ID: zone,
    };
    const invoke = (args, values = {}) =>
      spawnSync(process.execPath, ["deploy/setup-server.mjs", ...args], {
        cwd: projectRoot,
        env: { ...env, ...values },
        encoding: "utf8",
        timeout: 5000,
      });
    for (const values of [
      { CF_TOKEN: "" },
      { CF_ZONE_ID: "invalid" },
      { SSH_USER: "deploy" },
      { SSL_EMAIL: "" },
    ]) {
      const result = invoke(["--bootstrap"], values);
      assert.equal(result.status, 1);
      assert.doesNotMatch(result.stderr, new RegExp(token));
      await assert.rejects(readFile(captured), { code: "ENOENT" });
    }
    const dry = invoke(["--bootstrap", "--dry-run"]);
    assert.equal(dry.status, 0, dry.stderr);
    assert.equal(JSON.parse(dry.stdout).bootstrap, true);
    assert.doesNotMatch(dry.stdout, new RegExp(token));
    await assert.rejects(readFile(captured), { code: "ENOENT" });
    for (const bootstrap of [false, true]) {
      const result = invoke(bootstrap ? ["--bootstrap"] : []);
      assert.equal(result.status, 0, result.stderr);
      const sent = JSON.parse(await readFile(captured, "utf8"));
      assert.doesNotMatch(sent.args.join(" "), new RegExp(token));
      assert.doesNotMatch(result.stdout + result.stderr, new RegExp(token));
      assert.equal(sent.input.startsWith(credentials), bootstrap);
      assert.equal(sent.args.at(-1).includes("prepare_environment()"), bootstrap);
    }
    const file = path.join(directory, "cloudflare.local");
    const config = path.join(directory, "deploy.local");
    await writeFile(file, credentials, { mode: 0o600 });
    await writeFile(config, `DNS_CREDENTIALS_FILE="${file}"\n`);
    const local = invoke(["--bootstrap", "--env-file", config], {
      GITHUB_ACTIONS: "false",
      CF_TOKEN: "",
      CF_ZONE_ID: "",
    });
    assert.equal(local.status, 0, local.stderr);
    assert.ok(JSON.parse(await readFile(captured, "utf8")).input.startsWith(credentials));
    await chmod(file, 0o644);
    const permissions = invoke(["--bootstrap", "--env-file", config], { GITHUB_ACTIONS: "false" });
    assert.equal(permissions.status, 1);
    assert.match(permissions.stderr, /权限为 600 或 400/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

// GNU 工具和服务命令仅操作临时目录；真实 Bash、OpenSSL 验证控制流和证书。
async function serverFixture() {
  const directory = await realpath(await mkdtemp(path.join(tmpdir(), "fenbeiceshi-bootstrap-")));
  const bin = path.join(directory, "bin");
  const tools = path.join(directory, "tools");
  const base = path.join(directory, "fenbeiceshi");
  const nginxPath = path.join(directory, "conf");
  const certRoot = path.join(directory, "ssl");
  const acmeHome = path.join(directory, "acme");
  const dnsEnv = path.join(directory, "dns/cloudflare.env");
  for (const folder of [bin, tools, nginxPath]) await mkdir(folder);
  for (const command of [
    "bash",
    "sh",
    "base64",
    "dirname",
    "mkdir",
    "chmod",
    "mktemp",
    "rm",
    "mv",
    "cp",
    "cat",
    "grep",
    "tr",
    "awk",
    "cmp",
    "tar",
    "gzip",
    "openssl",
    "find",
  ])
    await symlink(
      spawnSync("which", [command], { encoding: "utf8" }).stdout.trim(),
      path.join(bin, command),
    );
  const log = path.join(directory, "commands.log");
  const mock = async (name, code, folder = bin) =>
    writeFile(
      path.join(folder, name),
      `#!${process.execPath}
const fs = require("node:fs"), path = require("node:path");
const directory = ${JSON.stringify(directory)}, args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(log)}, ${JSON.stringify(name)} + " " + args.join(" ") + "\\n");
${code}
`,
      { mode: 0o700 },
    );
  // 高频的简单命令使用 Shell 内建操作，避免每次检查都冷启动 Node.js。
  const shellMock = (name, code, folder = bin) =>
    writeFile(
      path.join(folder, name),
      `#!/bin/sh
set -eu
fixture_dir=${shellQuote(directory)}
printf '%s %s\\n' ${shellQuote(name)} "$*" >> ${shellQuote(log)}
${code}
`,
      { mode: 0o700 },
    );
  await shellMock("id", "printf '0\\n'");
  await shellMock("uname", "printf 'Linux\\n'");
  await shellMock("flock", '[ ! -f "$fixture_dir/locked" ]');
  await mock(
    "stat",
    'console.log(args[1] === "%u" ? 0 : (fs.statSync(args.at(-1)).mode & 0o777).toString(8));',
  );
  await mock(
    "sed",
    `const file=args.at(-1); let value=fs.readFileSync(file,"utf8");
for (const replacement of args[1].split("; ")) { const [,from,to]=replacement.split("|"); value=value.replaceAll(from,to); }
fs.writeFileSync(file,value);`,
  );
  await shellMock(
    "nginx",
    `config="$fixture_dir/conf/fenbeiceshi.conf"
if [ -f "$fixture_dir/bad-main" ] || { [ -f "$config" ] && grep -q 'invalid_directive' "$config"; }; then exit 1; fi
if [ "$1" = -s ] && [ -f "$fixture_dir/fail-reload" ]; then exit 1; fi
if [ "$1" = -T ]; then
  printf 'pid %s/nginx.pid;\\ninclude %s/conf/*.conf;\\n' "$fixture_dir" "$fixture_dir"
  if [ -f "$config" ]; then printf '# configuration file %s:\\n' "$config"; fi
fi
exit 0`,
    tools,
  );
  await shellMock(
    "systemctl",
    `case "$1" in
  cat)
    service=cron.service
    if [ -f "$fixture_dir/use-crond" ]; then service=crond.service; fi
    [ ! -f "$fixture_dir/no-cron-service" ] && [ "$2" = "$service" ] ;;
  is-active)
    shift
    if [ "$1" = --quiet ]; then shift; fi
    [ -f "$fixture_dir/$1.active" ] || exit 3 ;;
  start) : > "$fixture_dir/$2.active" ;;
esac`,
  );
  await shellMock(
    "crontab",
    `if [ "$1" != -l ]; then
  if [ -f "$fixture_dir/fail-cron-install" ]; then echo 'permission denied' >&2; exit 1; fi
  cp "$1" "$fixture_dir/cron"
  exit 0
fi
if [ ! -f "$fixture_dir/cron" ]; then echo 'no crontab for root' >&2; exit 1; fi
if [ -f "$fixture_dir/fail-cron" ]; then echo 'permission denied' >&2; exit 1; fi
cat "$fixture_dir/cron"`,
  );
  const sourceCert = path.join(directory, "fixture.cer");
  const sourceKey = path.join(directory, "fixture.key");
  const certificate = spawnSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      sourceKey,
      "-out",
      sourceCert,
      "-days",
      "90",
      "-subj",
      "/CN=fenbeiceshi.com",
      "-addext",
      "subjectAltName=DNS:fenbeiceshi.com,DNS:*.fenbeiceshi.com",
    ],
    { encoding: "utf8", timeout: 10000 },
  );
  assert.equal(certificate.status, 0, certificate.stderr);
  const acmeMock = path.join(directory, "acme-mock.cjs");
  await writeFile(
    acmeMock,
    `const fs=require("node:fs"), path=require("node:path"), cp=require("node:child_process");
const directory=${JSON.stringify(directory)}, args=process.argv.slice(2);
const value=flag=>args[args.indexOf(flag)+1], home=value("--home");
fs.appendFileSync(${JSON.stringify(log)},"acme " + args.join(" ") + "\\n");
if (args.includes("--force")) process.exit(90);
if (args.includes("--install")) {
 fs.mkdirSync(home,{recursive:true});
 fs.copyFileSync(${JSON.stringify(path.join(tools, "acme.sh"))},path.join(home,"acme.sh"));
 fs.chmodSync(path.join(home,"acme.sh"),0o700); process.exit(0);
}
const folder=path.join(home,"fenbeiceshi.com_ecc");
if (args.includes("--register-account")) fs.writeFileSync(path.join(home,"account.conf"),"ACCOUNT_EMAIL='test@example.com'\\n");
if (args.includes("--issue")) {
 if (!process.env.CF_Token || !process.env.CF_Zone_ID) process.exit(1);
 if (fs.existsSync(path.join(folder,"fullchain.cer"))) process.exit(2);
 fs.mkdirSync(folder,{recursive:true});
 const conf=path.join(folder,"fenbeiceshi.com.conf"), key=path.join(folder,"fenbeiceshi.com.key");
 if (fs.existsSync(key) && !fs.existsSync(conf)) process.exit(91);
 if (!fs.existsSync(conf)) fs.writeFileSync(conf,"Le_Domain='fenbeiceshi.com'\\nLe_Keylength='ec-256'\\n");
 if (!fs.existsSync(key)) fs.copyFileSync(${JSON.stringify(sourceKey)},key);
 fs.appendFileSync(conf,"CF_Token='"+process.env.CF_Token+"'\\nCF_Zone_ID='"+process.env.CF_Zone_ID+"'\\n");
 if (fs.existsSync(path.join(directory,"fail-issue"))) process.exit(1);
 fs.copyFileSync(${JSON.stringify(sourceCert)},path.join(folder,"fullchain.cer"));
 fs.appendFileSync(path.join(directory,"issued"),"issued\\n");
}
if (args.includes("--install-cert")) {
 fs.copyFileSync(path.join(folder,"fullchain.cer"),value("--fullchain-file"));
 fs.copyFileSync(path.join(folder,"fenbeiceshi.com.key"),value("--key-file"));
 fs.appendFileSync(path.join(folder,"fenbeiceshi.com.conf"),"Le_RealFullChainPath='"+value("--fullchain-file")+"'\\n");
 fs.appendFileSync(path.join(folder,"fenbeiceshi.com.conf"),"Le_RealKeyPath='"+value("--key-file")+"'\\nLe_ReloadCmd='__ACME_BASE64__START_"+Buffer.from(value("--reloadcmd")).toString("base64")+"__ACME_BASE64__END_'\\n");
 const result=cp.spawnSync("bash",["-c",value("--reloadcmd")]);
 process.exit(result.status);
}
if (args.includes("--installcronjob")) {
 const file=path.join(directory,"cron"), old=fs.existsSync(file)?fs.readFileSync(file,"utf8"):"";
 // 上游安装器按命令名检测已有任务，不区分多个独立 ACME_HOME。
 if (!old.includes("acme.sh --cron")) fs.writeFileSync(file,old+'0 2 * * * "'+home+'"/acme.sh --cron --home "'+home+'"\\n');
}
`,
  );
  await writeFile(
    path.join(tools, "acme.sh"),
    `#!/bin/sh\nexec '${process.execPath}' '${acmeMock}' "$@"\n`,
    { mode: 0o700 },
  );
  const archive = path.join(directory, "acme.tar.gz");
  assert.equal(spawnSync("tar", ["-czf", archive, "-C", directory, "tools/acme.sh"]).status, 0);
  await mock(
    "curl",
    `if (args.includes("--config")) {
 const rejected=fs.existsSync(path.join(directory,"reject-cloudflare"));
 const name=fs.existsSync(path.join(directory,"wrong-zone")) ? "other.example.com" : "fenbeiceshi.com";
 fs.writeFileSync(args[args.indexOf("-o")+1],JSON.stringify(rejected ? {success:false,errors:[{code:10000}]} : {success:true,result:{name}}));
 process.stdout.write(rejected ? "403" : "200"); process.exit(0);
}
if (fs.existsSync(path.join(directory,"fail-download"))) process.exit(1);
fs.copyFileSync(${JSON.stringify(archive)},args[args.indexOf("-o")+1]);`,
  );
  await mock(
    "apt-get",
    `if (args[0] === "install") {
 if (args.includes("nginx")) fs.copyFileSync(path.join(directory,"tools/nginx"),path.join(directory,"bin/nginx"));
 if (args.includes("gzip")) fs.symlinkSync(${JSON.stringify(await realpath(path.join(bin, "gzip")))},path.join(directory,"bin/gzip"));
}`,
  );
  const template = await readFile(
    path.join(projectRoot, "deploy/nginx/fenbeiceshi.conf.template"),
    "utf8",
  );
  const setupScript = await readFile(path.join(projectRoot, "deploy/setup-server.sh"), "utf8");
  const bootstrapScript = await readFile(
    path.join(projectRoot, "deploy/bootstrap-server.sh"),
    "utf8",
  );
  const run = (input = credentials + template, bootstrap = true) =>
    execute(
      "bash",
      [
        "-c",
        `${bootstrap ? bootstrapScript : ""}\n${setupScript}`,
        "--",
        base,
        "fenbeiceshi.com",
        nginxPath,
        certRoot,
        dnsEnv,
        "test@example.com",
        acmeHome,
        bootstrap ? "bootstrap" : "server",
      ],
      {
        env: { ...process.env, PATH: bin },
        input,
        timeout: 30000,
        label: bootstrap ? "部署初始化（自动准备）" : "部署初始化（已有环境）",
      },
    );
  return { directory, bin, tools, base, acmeHome, dnsEnv, template, log, run };
}

test("全新服务器自动准备，重复执行保留版本、证书、其他任务且不重载", async () => {
  const server = await serverFixture();
  const { directory, base, acmeHome, dnsEnv, log, run } = server;
  try {
    // BSD tar 可直接解压；显式移除 gzip，确保本机也能验证 GNU tar 所需依赖的补齐。
    await rm(path.join(server.bin, "gzip"));
    await writeFile(path.join(directory, "cron"), "0 1 * * * /usr/local/bin/other-job\n");
    const first = await run();
    assert.equal(first.code, 0, first.stderr);
    assert.doesNotMatch(first.stdout + first.stderr, new RegExp(token));
    assert.equal(await readFile(dnsEnv, "utf8"), credentials);
    assert.equal((await stat(dnsEnv)).mode & 0o777, 0o600);
    await mkdir(path.join(base, "releases/v1"));
    await symlink("releases/v1", path.join(base, "current"));
    await writeFile(path.join(base, "releases/v1/index.html"), "existing website");
    const before = await readFile(log, "utf8");
    assert.match(before, /apt-get install -y nginx gzip/);
    const cert = path.join(directory, "ssl/fenbeiceshi.com/fullchain.cer");
    const certBefore = await stat(cert);
    const second = await run();
    assert.equal(second.code, 0, second.stderr);
    assert.match(second.stdout, /复用已有证书/);
    const after = (await readFile(log, "utf8")).slice(before.length);
    assert.doesNotMatch(
      after,
      /apt-get|curl --proto|--install-cert|--installcronjob|--register-account|nginx -s reload|start nginx/,
    );
    assert.equal((await stat(cert)).mtimeMs, certBefore.mtimeMs);
    assert.equal(await readFile(path.join(base, "current/index.html"), "utf8"), "existing website");
    assert.equal((await readFile(path.join(directory, "issued"), "utf8")).trim(), "issued");
    assert.equal((await readFile(path.join(directory, "cron"), "utf8")).split("--cron").length, 2);
    assert.match(await readFile(path.join(directory, "cron"), "utf8"), /other-job/);
    const updated = `CF_Token=${token}-rotated\nCF_Zone_ID=${zone}\n`;
    assert.equal((await run(updated + server.template)).code, 0);
    assert.equal(await readFile(dnsEnv, "utf8"), updated);
    assert.match(
      await readFile(path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.conf"), "utf8"),
      new RegExp(`${token}-rotated`),
    );
    assert.equal(
      (await stat(path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.conf"))).mode & 0o777,
      0o600,
    );
    const domainConf = path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.conf");
    await writeFile(
      domainConf,
      (await readFile(domainConf, "utf8")).replace(/^Le_ReloadCmd=.*\n/gm, ""),
    );
    const repaired = await run(updated + server.template);
    assert.equal(repaired.code, 0, repaired.stderr);
    assert.match(await readFile(domainConf, "utf8"), /^Le_ReloadCmd=/m);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("已有其他 ACME 续期任务时补充本站任务，重复执行及写入失败保留原任务", async () => {
  const server = await serverFixture();
  const { directory, acmeHome, dnsEnv, log, run } = server;
  const cronFile = path.join(directory, "cron");
  const existing =
    '# 已有站点的续期任务\n0 0 23 * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null\n0 1 * * * /usr/local/bin/other-job\n';
  try {
    await writeFile(cronFile, existing);
    const first = await run();
    assert.equal(first.code, 0, first.stderr);
    const installed = await readFile(cronFile, "utf8");
    assert.ok(installed.startsWith(existing));
    assert.ok(installed.includes(`"${acmeHome}/acme.sh" --cron --home "${acmeHome}"`));
    assert.equal(installed.split("--cron").length, 3);
    assert.doesNotMatch(await readFile(log, "utf8"), /--installcronjob/);
    assert.equal((await run()).code, 0);
    assert.equal(await readFile(cronFile, "utf8"), installed);

    const configFile = path.join(directory, "conf/fenbeiceshi.conf");
    const certFile = path.join(directory, "ssl/fenbeiceshi.com/fullchain.cer");
    const configBefore = await readFile(configFile);
    const certBefore = await readFile(certFile);
    await writeFile(cronFile, existing);
    await writeFile(path.join(directory, "fail-cron-install"), "");
    const failed = await run();
    assert.equal(failed.code, 1);
    assert.match(failed.stderr, /写入本站自动续期任务失败/);
    assert.equal(await readFile(cronFile, "utf8"), existing);
    assert.deepEqual(await readFile(configFile), configBefore);
    assert.deepEqual(await readFile(certFile), certBefore);
    assert.equal(await readFile(dnsEnv, "utf8"), credentials);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("已有 Linux 工具无需 apt-get，识别 crond，缺少工具或服务时明确停止", async () => {
  const server = await serverFixture();
  const { directory, bin, tools, acmeHome, dnsEnv, log, run } = server;
  try {
    await rm(path.join(bin, "apt-get"));
    const missing = await run();
    assert.equal(missing.code, 1, missing.stderr);
    assert.match(missing.stderr, /缺少部署工具（nginx）.*自动安装仅支持/);
    await assert.rejects(readFile(dnsEnv), { code: "ENOENT" });

    await writeFile(path.join(bin, "nginx"), await readFile(path.join(tools, "nginx")), {
      mode: 0o700,
    });
    await mkdir(acmeHome);
    await writeFile(path.join(acmeHome, "acme.sh"), await readFile(path.join(tools, "acme.sh")), {
      mode: 0o700,
    });
    await writeFile(path.join(directory, "use-crond"), "");
    await writeFile(path.join(directory, "crond.active"), "");
    const ready = await run();
    assert.equal(ready.code, 0, ready.stderr);
    assert.match(ready.stdout, /部署工具已齐全，跳过安装/);
    assert.match(ready.stdout, /acme.sh 已安装，跳过下载/);
    const before = await readFile(log, "utf8");
    assert.match(before, /systemctl enable nginx crond\n/);
    assert.doesNotMatch(
      before,
      /apt-get|curl --proto|systemctl start crond|systemctl enable nginx cron\n/,
    );

    await writeFile(path.join(directory, "no-cron-service"), "");
    const noService = await run();
    assert.equal(noService.code, 1, noService.stderr);
    assert.match(noService.stderr, /没有可用的 cron 或 crond 服务/);
    assert.doesNotMatch((await readFile(log, "utf8")).slice(before.length), /acme|reload/);
    assert.equal(await readFile(dnsEnv, "utf8"), credentials);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Cloudflare 授权失败或区域不匹配时提前停止，不打印凭据", async () => {
  const server = await serverFixture();
  try {
    for (const [marker, message] of [
      ["reject-cloudflare", /HTTP 403，错误码 10000/],
      ["wrong-zone", /区域不是 fenbeiceshi.com/],
    ]) {
      await writeFile(path.join(server.directory, marker), "");
      const result = await server.run();
      assert.equal(result.code, 1, result.stderr);
      assert.match(result.stderr, message);
      assert.doesNotMatch(result.stdout + result.stderr, new RegExp(token));
      await assert.rejects(readFile(server.dnsEnv), { code: "ENOENT" });
      await assert.rejects(readFile(path.join(server.directory, "conf/fenbeiceshi.conf")), {
        code: "ENOENT",
      });
      await rm(path.join(server.directory, marker));
    }
    assert.doesNotMatch(await readFile(server.log, "utf8"), /acme |curl --proto|test-token/);
  } finally {
    await rm(server.directory, { recursive: true, force: true });
  }
});

test("下载或申请失败不留下本站配置与凭据，修复后复用私钥重试", async () => {
  const server = await serverFixture();
  const { directory, acmeHome, dnsEnv, run } = server;
  let keyTime;
  try {
    for (const failure of ["fail-download", "fail-issue"]) {
      await writeFile(path.join(directory, failure), "");
      const result = await run();
      assert.equal(result.code, 1, result.stderr);
      assert.doesNotMatch(result.stdout + result.stderr, new RegExp(token));
      await assert.rejects(readFile(dnsEnv), { code: "ENOENT" });
      await assert.rejects(readFile(path.join(directory, "conf/fenbeiceshi.conf")), {
        code: "ENOENT",
      });
      if (failure === "fail-issue") {
        const conf = path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.conf");
        assert.match(await readFile(conf, "utf8"), /Le_Keylength='ec-256'/);
        assert.doesNotMatch(await readFile(conf, "utf8"), /CF_|test-token/);
        assert.equal((await stat(conf)).mode & 0o777, 0o600);
        keyTime = (await stat(path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.key")))
          .mtimeMs;
      }
      await rm(path.join(directory, failure));
    }
    const result = await run();
    assert.equal(result.code, 0, result.stderr);
    assert.equal(
      (await stat(path.join(acmeHome, "fenbeiceshi.com_ecc/fenbeiceshi.com.key"))).mtimeMs,
      keyTime,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("错误模板、重载与 cron 失败恢复本站文件，拒绝注入与软链接", async () => {
  const server = await serverFixture();
  const { directory, base, dnsEnv, run, template } = server;
  try {
    const invalid = await run(
      `CF_Token=$(touch ${directory}/escaped)\nCF_Zone_ID=${zone}\n${template}`,
    );
    assert.equal(invalid.code, 1);
    await assert.rejects(readFile(path.join(directory, "escaped")), { code: "ENOENT" });
    assert.equal((await run()).code, 0);
    const config = path.join(directory, "conf/fenbeiceshi.conf");
    const original = await readFile(config);
    const certFile = path.join(directory, "ssl/fenbeiceshi.com/fullchain.cer");
    const cert = await readFile(certFile);
    const bad = await run(
      `CF_Token=${token}-new\nCF_Zone_ID=${zone}\nserver { invalid_directive on; }\n`,
    );
    assert.equal(bad.code, 1);
    assert.deepEqual(await readFile(config), original);
    assert.deepEqual(await readFile(certFile), cert);
    assert.equal(await readFile(dnsEnv, "utf8"), credentials);
    await writeFile(path.join(directory, "fail-cron"), "");
    assert.equal((await run()).code, 1);
    assert.equal(
      await readFile(path.join(directory, "cron"), "utf8").then((x) => x.split("--cron").length),
      2,
    );
    await rm(path.join(directory, "fail-cron"));
    await writeFile(path.join(directory, "fail-reload"), "");
    const changed = await run(credentials + template + "\n# 修改站点配置\n");
    assert.equal(changed.code, 1);
    assert.deepEqual(await readFile(config), original);
    assert.match(changed.stderr, /恢复文件已保留/);
    await rm(path.join(directory, "fail-reload"));
    await rm(dnsEnv);
    await symlink(path.join(base, "outside"), dnsEnv);
    assert.equal((await run()).code, 1);
    await assert.rejects(readFile(path.join(base, "outside")), { code: "ENOENT" });
    await rm(dnsEnv);
    await writeFile(dnsEnv, credentials, { mode: 0o644 });
    assert.match((await run(template, false)).stderr, /权限必须为 600 或 400/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
