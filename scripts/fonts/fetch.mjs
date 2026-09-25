#!/usr/bin/env node
// Downloads the handwriting font families listed in scripts/fonts/families.json
// from the google/fonts repository into assets/fonts/<dir>/, together with the
// licence text. Every family we ship is OFL or Apache-2.0 licensed.
//
// Usage: node scripts/fonts/fetch.mjs [dir ...]

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outRoot = join(root, "assets", "fonts");
const RAW = "https://raw.githubusercontent.com/google/fonts/main";
const LICENSE_DIRS = ["ofl", "apache", "ufl"];

const families = JSON.parse(await readFile(join(root, "scripts/fonts/families.json"), "utf8"));
const only = process.argv.slice(2);

async function get(url, binary = false) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (res.ok) return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  throw new Error(`Failed: ${url}`);
}

function parseMetadata(pb) {
  const fonts = [];
  const blocks = pb.split(/\nfonts \{/).slice(1);
  for (const block of blocks) {
    const field = (name) => block.match(new RegExp(`\\b${name}: "?([^"\\n]+)"?`))?.[1];
    fonts.push({
      style: field("style"),
      weight: Number(field("weight")),
      filename: field("filename"),
    });
  }
  return {
    name: pb.match(/^name: "([^"]+)"/m)?.[1],
    license: pb.match(/^license: "([^"]+)"/m)?.[1],
    designer: pb.match(/^designer: "([^"]+)"/m)?.[1],
    subsets: [...pb.matchAll(/^subsets: "([^"]+)"/gm)].map((m) => m[1]),
    fonts,
  };
}

const exists = (p) => access(p).then(() => true, () => false);

const manifest = [];
for (const dir of families) {
  if (only.length && !only.includes(dir)) continue;
  let meta = null;
  let licenseDir = null;
  for (const ld of LICENSE_DIRS) {
    const pb = await get(`${RAW}/${ld}/${dir}/METADATA.pb`);
    if (pb) {
      meta = parseMetadata(pb);
      licenseDir = ld;
      break;
    }
  }
  if (!meta) {
    console.warn(`!! ${dir}: not found`);
    continue;
  }
  const regular =
    meta.fonts.find((f) => f.style === "normal" && f.weight === 400) ??
    meta.fonts.find((f) => f.style === "normal") ??
    meta.fonts[0];
  const outDir = join(outRoot, dir);
  await mkdir(outDir, { recursive: true });
  const fontPath = join(outDir, regular.filename);
  if (!(await exists(fontPath))) {
    const data = await get(`${RAW}/${licenseDir}/${dir}/${encodeURIComponent(regular.filename)}`, true);
    if (!data) {
      console.warn(`!! ${dir}: missing ${regular.filename}`);
      continue;
    }
    await writeFile(fontPath, data);
  }
  const licenseFile = licenseDir === "apache" ? "LICENSE.txt" : licenseDir === "ufl" ? "UFL.txt" : "OFL.txt";
  const licensePath = join(outDir, licenseFile);
  if (!(await exists(licensePath))) {
    const text = await get(`${RAW}/${licenseDir}/${dir}/${licenseFile}`);
    if (text) await writeFile(licensePath, text);
  }
  manifest.push({
    dir,
    family: meta.name,
    designer: meta.designer,
    license: meta.license,
    subsets: meta.subsets,
    file: regular.filename,
  });
  console.log(`ok ${dir.padEnd(28)} ${meta.license} ${meta.subsets.join(",")}`);
}

if (!only.length) {
  await writeFile(join(outRoot, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}
