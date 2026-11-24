import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { notificationPlan, notify } from "../indexnow.mjs";
import {
  createManifest,
  changedUrls,
  fingerprint,
  validateManifest,
  validateUrl,
} from "../indexnow/manifest.mjs";
import { publishedManifest, submitUrls, verifyPublished } from "../indexnow/http.mjs";
import { projectRoot } from "../lib.mjs";

const domain = "fenbeiceshi.com";
const origin = "https://" + domain;
const key = "a".repeat(32);
const manifest = (pages) => ({ version: 1, domain, pages });
const html = (url, text = "正文", asset = "first") =>
  '<html><head><title>标题</title><meta name="description" content="说明">' +
  '<meta name="robots" content="index, follow"><link rel="canonical" href="' +
  url +
  '">' +
  '<script src="/_next/' +
  asset +
  '.js"></script></head><body><header>导航 ' +
  asset +
  '</header><main class="' +
  asset +
  '"><h1>标题</h1><p>' +
  text +
  '</p><a href="/guide/">使用指南</a><script>build="' +
  asset +
  '"</script></main></body></html>';

test("IndexNow 指纹忽略构建哈希、RSC 和页头，保留正文、SEO 和正文链接变化", () => {
  const url = origin + "/";
  const first = html(url);
  assert.equal(fingerprint(first, url), fingerprint(html(url, "正文", "second"), url));
  for (const changed of [
    html(url, "新正文"),
    first.replace('content="说明"', 'content="新说明"'),
    first.replace('href="/guide/"', 'href="/calibration/"'),
    first.replace("<title>标题", "<title>新标题"),
  ])
    assert.notEqual(fingerprint(first, url), fingerprint(changed, url));
  assert.throws(
    () => fingerprint(first.replace("index, follow", "noindex, follow"), url),
    /可索引/,
  );
  assert.throws(() => fingerprint(first, origin + "/other/"), /canonical/);
});

test("IndexNow 清单只从 sitemap 读取真实可索引页面，并拒绝越域、参数和损坏数据", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "indexnow-manifest-"));
  try {
    await mkdir(path.join(directory, "guide"));
    await writeFile(path.join(directory, "index.html"), html(origin + "/"));
    await writeFile(path.join(directory, "guide/index.html"), html(origin + "/guide/"));
    const sitemap = (urls) =>
      "<urlset>" + urls.map((url) => "<url><loc>" + url + "</loc></url>").join("") + "</urlset>";
    await writeFile(
      path.join(directory, "sitemap.xml"),
      sitemap([origin + "/", origin + "/guide/"]),
    );
    const result = await createManifest(directory, domain);
    assert.deepEqual(Object.keys(result.pages), [origin + "/", origin + "/guide/"]);
    for (const urls of [
      [origin + "/", origin + "/"],
      ["https://example.com/"],
      [origin + "/?a=1"],
    ]) {
      await writeFile(path.join(directory, "sitemap.xml"), sitemap(urls));
      await assert.rejects(createManifest(directory, domain));
    }
    for (const url of [
      origin + "/../",
      origin + "/records/?private=1",
      "http://fenbeiceshi.com/",
      "https://fenbeiceshi.com.evil/",
    ])
      assert.throws(() => validateUrl(url, domain));
    assert.throws(() => validateManifest({ version: 2, domain, pages: {} }, domain));
    assert.throws(() => validateManifest(manifest({ [origin + "/"]: "bad" }), domain));
    assert.throws(() => validateManifest({ ...result, domain: "soundmetergo.com" }, domain));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("首次接入不重提历史页；新增、修改、删除及改为 noindex 的 URL 均按指纹识别", () => {
  const previous = manifest({
    [origin + "/"]: "1".repeat(64),
    [origin + "/gone/"]: "2".repeat(64),
  });
  const current = manifest({ [origin + "/"]: "3".repeat(64), [origin + "/new/"]: "4".repeat(64) });
  assert.deepEqual(changedUrls(null, current), []);
  assert.deepEqual(changedUrls(previous, current), [
    origin + "/",
    origin + "/gone/",
    origin + "/new/",
  ]);
  assert.deepEqual(changedUrls(current, structuredClone(current)), []);
});

test("手动补提只推进选定 URL，保留其他尚未通知的变化", () => {
  const previous = manifest({
    [origin + "/"]: "1".repeat(64),
    [origin + "/guide/"]: "2".repeat(64),
  });
  const current = manifest({
    [origin + "/"]: "3".repeat(64),
    [origin + "/guide/"]: "4".repeat(64),
  });
  const prepared = { manifest: current, previous: { manifest: previous } };
  const plan = notificationPlan(prepared, [origin + "/guide/"]);
  assert.deepEqual(plan.urls, [origin + "/guide/"]);
  assert.equal(plan.next.pages[origin + "/"], previous.pages[origin + "/"]);
  assert.equal(plan.next.pages[origin + "/guide/"], current.pages[origin + "/guide/"]);
  assert.throws(() => notificationPlan(prepared, [origin + "/records/"]), /可索引/);
  assert.throws(() => notificationPlan({ ...prepared, previous: null }, [origin + "/"]), /基线/);
});

test("IndexNow 通知先确认生产版本和密钥；失败不推进状态，预演不访问外部", async () => {
  const current = manifest({ [origin + "/"]: "3".repeat(64) });
  const prepared = {
    domain,
    release: "new",
    manifest: current,
    key,
    previous: { manifest: manifest({ [origin + "/"]: "1".repeat(64) }) },
  };
  const events = [];
  const verify = async () => events.push("verify");
  const submit = async () => {
    events.push("submit");
    return [{ status: 202, state: "key-validation-pending", count: 1, attempts: 1 }];
  };
  const save = async () => events.push("save");
  const result = await notify({ domain }, prepared, undefined, { verify, submit, save });
  assert.deepEqual(events, ["verify", "submit", "save"]);
  assert.equal(result.batches[0].status, 202);
  events.length = 0;
  await assert.rejects(
    notify({ domain }, prepared, undefined, {
      verify,
      submit: async () => {
        throw new Error("HTTP 429");
      },
      save,
    }),
    /429/,
  );
  assert.deepEqual(events, ["verify"]);
  events.length = 0;
  await assert.rejects(
    notify({ domain }, prepared, undefined, {
      verify: async () => {
        throw new Error("wrong release");
      },
      submit,
      save,
    }),
    /wrong release/,
  );
  assert.deepEqual(events, []);
  assert.equal(
    (await notify({ domain }, prepared, undefined, { dryRun: true, verify, submit, save })).dryRun,
    true,
  );
  assert.deepEqual(events, []);
});

test("生产验证拒绝错误版本、域名、清单、密钥和跳转", async () => {
  const current = manifest({ [origin + "/"]: "3".repeat(64) });
  const responses = {
    "/_release.txt": "new\n",
    "/_site.txt": domain + "\n",
    "/_indexnow-manifest.json": JSON.stringify(current),
    ["/" + key + ".txt"]: key + "\n",
  };
  const fetcher = async (url) => new Response(responses[new URL(url).pathname]);
  await verifyPublished(domain, "new", current, key, fetcher);
  assert.deepEqual(await publishedManifest(domain, fetcher), current);
  await assert.rejects(publishedManifest("example.com", async () => assert.fail("越域读取")));
  await assert.rejects(
    publishedManifest(domain, async () => new Response("invalid JSON")),
    /JSON/,
  );
  for (const [pathname, value] of [
    ["/_release.txt", "old"],
    ["/_site.txt", "other.com"],
    ["/_indexnow-manifest.json", "{}"],
    ["/" + key + ".txt", "bad"],
  ]) {
    await assert.rejects(
      verifyPublished(
        domain,
        "new",
        current,
        key,
        async (url) =>
          new Response(
            new URL(url).pathname === pathname ? value : responses[new URL(url).pathname],
          ),
      ),
    );
  }
  await assert.rejects(
    verifyPublished(
      domain,
      "new",
      current,
      key,
      async () =>
        new Response(null, { status: 301, headers: { location: "https://example.com/" } }),
    ),
  );
});

test("IndexNow 使用固定 HTTPS POST，分清 200 与 202，并限制重试", async () => {
  const urls = [origin + "/", origin + "/guide/"];
  for (const status of [200, 202]) {
    let called = 0;
    const result = await submitUrls(domain, urls, key, {
      fetcher: async (endpoint, options) => {
        called++;
        assert.equal(endpoint, "https://api.indexnow.org/indexnow");
        assert.equal(options.method, "POST");
        assert.equal(options.redirect, "manual");
        assert.deepEqual(JSON.parse(options.body), {
          host: domain,
          key,
          keyLocation: origin + "/" + key + ".txt",
          urlList: urls,
        });
        return new Response(null, { status });
      },
    });
    assert.equal(called, 1);
    assert.equal(result[0].state, status === 200 ? "received" : "key-validation-pending");
    assert.ok(!JSON.stringify(result).includes(key));
  }
  for (const statuses of [[429, 503, 200], [503, 503, 503], [400], [403], [422], [301]]) {
    let called = 0;
    const delays = [];
    const promise = submitUrls(domain, urls, key, {
      fetcher: async () =>
        new Response(null, { status: statuses[called++], headers: { "retry-after": "1000" } }),
      pause: async (delay) => delays.push(delay),
    });
    if (statuses.at(-1) === 200) await promise;
    else await assert.rejects(promise, /HTTP/);
    assert.equal(called, statuses.length);
    assert.ok(delays.every((delay) => delay <= 10000));
  }
  let called = 0;
  await assert.rejects(
    submitUrls(domain, urls, key, {
      fetcher: async () => {
        called++;
        throw new Error("timeout");
      },
      pause: async () => {},
    }),
    /连接失败/,
  );
  assert.equal(called, 3);
  await assert.rejects(submitUrls(domain, ["https://example.com/"], key), /本站/);
  await assert.rejects(submitUrls(domain, urls, "bad"), /密钥/);
  assert.deepEqual(
    await submitUrls(domain, [], key, { fetcher: async () => assert.fail("不应发送") }),
    [],
  );
});

test("生产工作流在双站健康检查后通知，准备所有权文件早于打包", async () => {
  const workflow = await readFile(path.join(projectRoot, ".github/workflows/deploy.yml"), "utf8");
  const prepare = workflow.indexOf("run: node deploy/indexnow.mjs prepare");
  const pack = workflow.indexOf('run: npm run deploy:pack -- --release "$RELEASE_ID"');
  const chinese = workflow.indexOf(
    'run: npm run deploy:static -- --artifact "artifacts/fenbeiceshi-',
  );
  const english = workflow.indexOf("run: npm run deploy:static -- --domain soundmetergo.com");
  const notify = workflow.indexOf("run: node deploy/indexnow.mjs notify");
  assert.ok(
    prepare > 0 && prepare < pack && pack < english && english < chinese && chinese < notify,
  );
  assert.doesNotMatch(workflow.slice(chinese, notify), /always\(\)|continue-on-error/);
  const syntax = spawnSync(
    "bash",
    ["-n", path.join(projectRoot, "deploy/indexnow/remote-state.sh")],
    { encoding: "utf8" },
  );
  assert.equal(syntax.status, 0, syntax.stderr);
});
