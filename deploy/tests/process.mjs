import assert from "node:assert/strict";
import { spawn } from "node:child_process";

export async function execute(command, args, options = {}) {
  options.signal?.throwIfAborted();
  const label = options.label ?? command;
  const timeout = options.timeout ?? 15000;
  const started = Date.now();
  console.log(`[集成测试] 开始：${label}`);
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: options.env ?? process.env,
      stdio: options.stdio ?? ["pipe", "pipe", "pipe"],
      detached: process.platform !== "win32",
    });
    let stdout = "",
      stderr = "",
      settled = false;
    const finish = (error, code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
      if (error) {
        try {
          // Bash 的退出清理和后代可能继续持有管道，超时或取消时终止整个测试进程组。
          if (process.platform !== "win32" && child.pid) process.kill(-child.pid, "SIGKILL");
          else child.kill("SIGKILL");
        } catch (cause) {
          if (cause.code !== "ESRCH")
            error = new AggregateError([error, cause], `${label} 终止进程失败`);
        }
        child.stdin?.destroy();
        child.stdout?.destroy();
        child.stderr?.destroy();
        console.error(
          `[集成测试] 结束：${label}，${error.message}，耗时 ${Date.now() - started}ms`,
        );
        reject(error);
      } else {
        console.log(`[集成测试] 结束：${label}，退出码 ${code}，耗时 ${Date.now() - started}ms`);
        resolve({ code, stdout, stderr });
      }
    };
    const abort = () => finish(new Error(`${label} 已取消`, { cause: options.signal.reason }));
    const timer = setTimeout(() => finish(new Error(`${label} 超过 ${timeout}ms 未结束`)), timeout);
    options.signal?.addEventListener("abort", abort, { once: true });
    child.stdout?.on("data", (value) => {
      stdout += value;
    });
    child.stderr?.on("data", (value) => {
      stderr += value;
    });
    child.on("error", (error) =>
      finish(new Error(`${label} 无法启动：${error.message}`, { cause: error })),
    );
    child.on("close", (code, signal) =>
      finish(signal ? new Error(`${label} 被信号 ${signal} 终止`) : null, code),
    );
    child.stdin?.on("error", (error) => {
      if (error.code !== "EPIPE") finish(error);
    });
    child.stdin?.end(options.input);
  });
}

export async function mustRun(command, args, options) {
  const result = await execute(command, args, options);
  assert.equal(result.code, 0, `${command} 失败：${result.stderr}`);
  return result;
}
