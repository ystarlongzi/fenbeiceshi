import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { sha256 } from "../lib.mjs";
import { requiredSiteFiles } from "../sites.mjs";
import { mustRun } from "./process.mjs";

export async function certificate(directory, domain = "fenbeiceshi.com") {
  const cert = path.join(directory, "fullchain.cer"),
    key = path.join(directory, domain + ".key");
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
    "/CN=" + domain,
    "-addext",
    "subjectAltName=DNS:" + domain + ",DNS:*." + domain,
  ]);
  return { cert, key };
}

export async function artifact(directory, release, domain = "fenbeiceshi.com") {
  const source = path.join(directory, `source-${release}`);
  await mkdir(source);
  const assets = [
    `/_next/static/chunks/app/%5B...slug%5D/${release}.js`,
    `/_next/static/css/${release}.css`,
  ];
  for (const file of requiredSiteFiles(domain)) {
    await mkdir(path.dirname(path.join(source, file)), { recursive: true });
    await writeFile(path.join(source, file), `<!doctype html><p>${release}</p>`);
  }
  for (const asset of assets) {
    const file = path.join(source, decodeURIComponent(asset));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `/* ${release} */`);
  }
  await writeFile(path.join(source, "_site.txt"), domain + "\n");
  await writeFile(path.join(source, "_release.txt"), `${release}\n`);
  await writeFile(path.join(source, "_release-assets.txt"), `${assets.join("\n")}\n`);
  const file = path.join(directory, `${release}.tar.gz`);
  await mustRun("tar", ["-czf", file, "-C", source, "."]);
  return { source, input: await readFile(file), digest: await sha256(file) };
}
