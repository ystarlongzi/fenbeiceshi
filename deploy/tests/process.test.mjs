import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { execute, mustRun } from "./process.mjs";

test("集成命令保留输出与退出码，启动错误保留上下文", async () => {
  const result = await execute(process.execPath, [
    "-e",
    'console.log("out"); console.error("err"); process.exitCode = 7;',
  ]);
  assert.deepEqual(result, { code: 7, stdout: "out\n", stderr: "err\n" });
  await assert.rejects(
    mustRun(process.execPath, ["-e", 'console.error("失败原因"); process.exit(1);']),
    /失败原因/,
  );
  await assert.rejects(execute("fenbeiceshi-missing-command", []), /无法启动.*ENOENT/);
  await assert.rejects(
    execute(process.execPath, ["-e", 'process.kill(process.pid, "SIGTERM")']),
    /被信号 SIGTERM 终止/,
  );
});

test("取消会终止仍持有输出管道的后代进程", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-process-tree-"));
  const marker = path.join(directory, "pid");
  const heartbeat = path.join(directory, "heartbeat");
  const controller = new AbortController();
  t.after(async () => {
    controller.abort();
    try {
      const pid = Number(await readFile(marker, "utf8"));
      try {
        process.kill(pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
  const childScript = `const fs=require("node:fs"); let count=0;
fs.writeFileSync(${JSON.stringify(heartbeat)},String(count));
setInterval(()=>fs.writeFileSync(${JSON.stringify(heartbeat)},String(++count)),20);`;
  const pending = execute(
    process.execPath,
    [
      "-e",
      `const {spawn}=require("node:child_process"),fs=require("node:fs");
const child=spawn(process.execPath,["-e",${JSON.stringify(childScript)}],{stdio:"inherit"});
fs.writeFileSync(${JSON.stringify(marker)},String(child.pid)); child.unref();`,
    ],
    { signal: controller.signal, timeout: 10000 },
  );
  const cancelled = assert.rejects(pending, /已取消/);
  const deadline = Date.now() + 5000;
  let ready = false;
  while (Date.now() < deadline && !ready) {
    try {
      await readFile(heartbeat);
      ready = true;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await delay(20);
    }
  }
  controller.abort();
  await cancelled;
  assert.ok(ready, "后代进程未在截止时间内启动");
  // 等待已发出的写入结束，再确认后代不再执行，而不只检查父进程的 Promise。
  await delay(75);
  const stopped = await readFile(heartbeat, "utf8");
  await delay(150);
  assert.equal(await readFile(heartbeat, "utf8"), stopped);
});

test("集成命令超时和取消会结束等待，后台进程持有管道也有截止时间", async (t) => {
  await assert.rejects(
    execute(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { timeout: 300 }),
    /超过 300ms/,
  );
  const controller = new AbortController();
  const pending = execute(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
    signal: controller.signal,
  });
  controller.abort();
  await assert.rejects(pending, /已取消/);

  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-process-"));
  const marker = path.join(directory, "pid");
  t.after(async () => {
    try {
      const pid = Number(await readFile(marker, "utf8"));
      try {
        process.kill(pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
  await assert.rejects(
    execute(
      process.execPath,
      [
        "-e",
        `const {spawn}=require("node:child_process"); const fs=require("node:fs");
const child=spawn(process.execPath,["-e","setTimeout(() => {}, 5000)"],{stdio:"inherit"});
fs.writeFileSync(${JSON.stringify(marker)},String(child.pid)); child.unref();`,
      ],
      { timeout: 1000 },
    ),
    /超过 1000ms/,
  );
});

test("超时不会等待 Bash 的退出清理完成", { timeout: 5000 }, async () => {
  await assert.rejects(
    execute("bash", ["-c", "trap 'sleep 60' EXIT; sleep 60"], {
      timeout: 300,
      label: "带退出清理的测试命令",
    }),
    /带退出清理的测试命令 超过 300ms/,
  );
});
