import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot } from "../lib.mjs";
import { execute } from "./process.mjs";

test(
  "Linux IndexNow 状态隔离、稳定密钥、版本与并发校验及失败保留",
  {
    skip: process.env.FENBEI_INTEGRATION !== "1",
    timeout: 15000,
  },
  async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-indexnow-"));
    const script = path.join(projectRoot, "deploy/indexnow/remote-state.sh");
    const key = "a".repeat(32);
    try {
      const base = path.join(directory, "fenbeiceshi");
      const run = (action, release = "v1", expected = "-", input = key + "\n") =>
        execute("bash", [script, base, "fenbeiceshi.com", action, release, expected], { input });
      const first = await run("prepare");
      assert.equal(first.code, 0, first.stderr);
      assert.equal(first.stdout, key + "\n-\n-\nnull\n");
      assert.equal((await stat(path.join(base, "shared"))).mode & 0o777, 0o755);
      assert.equal((await stat(path.join(base, "shared/indexnow/key"))).mode & 0o777, 0o600);
      const next = await run("prepare", "v1", "-", "b".repeat(32) + "\n");
      assert.equal(next.stdout, first.stdout);
      assert.equal((await run("save", "v1", "-", key + "\n{}\n")).code, 1);
      const target = path.join(base, "releases/v1");
      await mkdir(target, { recursive: true });
      await writeFile(path.join(target, "_release.txt"), "v1\n");
      await writeFile(path.join(target, "_site.txt"), "fenbeiceshi.com\n");
      await symlink(target, path.join(base, "current"));
      const payload = '{"version":1,"example":"state-only fixture"}\n';
      assert.equal((await run("save", "v1", "-", key + "\n" + payload)).code, 0);
      const saved = path.join(base, "shared/indexnow/accepted.json");
      assert.equal(await readFile(saved, "utf8"), payload);
      const hash = createHash("sha256").update(payload).digest("hex");
      const snapshot = await run("prepare");
      assert.equal(snapshot.stdout, key + "\n" + hash + "\nv1\n" + payload);
      for (const [release, expected, candidate] of [
        ["v2", hash, key],
        ["v1", "-", key],
        ["v1", hash, "b".repeat(32)],
      ]) {
        const rejected = await run("save", release, expected, candidate + "\n{}\n");
        assert.equal(rejected.code, 1);
        assert.equal(await readFile(saved, "utf8"), payload);
      }
      const wrong = await execute("bash", [script, base, "soundmetergo.com", "prepare", "v1"], {
        input: key + "\n",
      });
      assert.equal(wrong.code, 1);
      await rm(saved);
      await symlink(path.join(directory, "outside.json"), saved);
      assert.equal((await run("prepare")).code, 1);
      assert.equal(
        (
          await execute("bash", [script, "/", "fenbeiceshi.com", "prepare", "v1"], {
            input: key + "\n",
          })
        ).code,
        1,
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
