import assert from "node:assert/strict";
import test from "node:test";
import { chmod, mkdir, mkdtemp, readFile, readlink, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { projectRoot } from "../lib.mjs";
import { renderNginxTemplate } from "../nginx-template.mjs";
import { artifact, certificate } from "./site-fixtures.mjs";
import { execute, mustRun } from "./process.mjs";

test(
  "英文域名独立 TLS 发布，拒绝中文包且不暴露旧语言目录",
  {
    skip: process.env.FENBEI_INTEGRATION !== "1",
    timeout: 60000,
  },
  async (t) => {
    const directory = await mkdtemp(path.join(tmpdir(), "soundmetergo-linux-"));
    const domain = "soundmetergo.com";
    const base = path.join(directory, "soundmetergo");
    const config = path.join(directory, "nginx.conf");
    let running = false;
    t.after(async () => {
      try {
        if (running) await mustRun("nginx", ["-s", "quit", "-c", config], { stdio: "ignore" });
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    });
    const tls = await certificate(directory, domain);
    const certRoot = path.join(directory, "ssl");
    await mkdir(path.join(certRoot, domain), { recursive: true });
    await writeFile(path.join(certRoot, domain, "fullchain.cer"), await readFile(tls.cert));
    await writeFile(path.join(certRoot, domain, domain + ".key"), await readFile(tls.key));
    await chmod(directory, 0o755);
    const template = renderNginxTemplate(
      await readFile(path.join(projectRoot, "deploy/nginx/fenbeiceshi.conf.template"), "utf8"),
      domain,
    )
      .replaceAll("__DOMAIN__", domain)
      .replaceAll("__DEPLOY_PATH__", base)
      .replaceAll("__CERT_ROOT__", certRoot);
    await writeFile(
      config,
      `pid ${directory}/nginx.pid;\nerror_log ${directory}/error.log;\nevents {}\nhttp { include /etc/nginx/mime.types;\n${template}\n}\n`,
    );
    await mustRun("nginx", ["-t", "-c", config]);
    await mustRun("nginx", ["-c", config], { stdio: "ignore" });
    running = true;
    const env = { ...process.env, CURL_CA_BUNDLE: tls.cert };
    const script = path.join(projectRoot, "deploy/remote-release.sh");
    const build = await artifact(directory, "english-v1", domain);
    const deployed = await execute(
      "bash",
      [script, base, "english-v1", build.digest, domain, "deploy"],
      { input: build.input, env },
    );
    assert.equal(deployed.code, 0, deployed.stderr);
    const wrong = await artifact(directory, "wrong-domain", "fenbeiceshi.com");
    const rejected = await execute(
      "bash",
      [script, base, "wrong-domain", wrong.digest, domain, "deploy"],
      { input: wrong.input, env },
    );
    assert.notEqual(rejected.code, 0);
    assert.match(rejected.stderr, /构建域名与发布目标不一致/);
    assert.equal(path.basename(await readlink(path.join(base, "current"))), "english-v1");
    for (const route of ["/en/", "/zh-tw/", "/missing/"]) {
      const result = await mustRun("curl", [
        "--silent",
        "--show-error",
        "--noproxy",
        "*",
        "--cacert",
        tls.cert,
        "--output",
        "/dev/null",
        "--write-out",
        "%{http_code}",
        "https://soundmetergo.com" + route,
      ]);
      assert.equal(result.stdout, "404", route);
    }
  },
);
