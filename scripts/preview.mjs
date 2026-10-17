import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve("out");
const port = Number(process.env.FENBEI_PREVIEW_PORT || 3100);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("预览端口必须在 1024–65535 范围内。");
await stat(resolve(root, "index.html")).catch(() => {
  throw new Error("缺少静态产物，请先运行 npm run build。");
});
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || "/", `http://127.0.0.1:${port}`).pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }
  let path = resolve(root, `.${pathname}`);
  if (path !== root && !path.startsWith(root + sep)) {
    response.writeHead(403);
    response.end();
    return;
  }
  try {
    const info = await stat(path);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, { Location: pathname + "/" });
        response.end();
        return;
      }
      path = resolve(path, "index.html");
    }
    const body = await readFile(path);
    response.writeHead(200, {
      "Content-Type": `${mime[extname(path)] || "application/octet-stream"}; charset=utf-8`,
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      const body = await readFile(resolve(root, "404.html"));
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : body);
    } else {
      console.error("读取静态预览文件失败。", error);
      response.writeHead(500);
      response.end("Unable to read preview file");
    }
  }
});
server.on("error", (error) => {
  console.error("预览服务启动失败。", error);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
