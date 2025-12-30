#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// -------------------------
// 경로 설정
// -------------------------
const rootDir = process.cwd();
const dotRoot = path.join(rootDir, "dot");
const rawDir = path.join(dotRoot, "raw");

// 디렉토리 보장
fs.mkdirSync(rawDir, { recursive: true });

// -------------------------
// package.json name
// -------------------------
const pkgPath = path.join(rootDir, "package.json");
if (!fs.existsSync(pkgPath)) {
  throw new Error("package.json을 찾을 수 없습니다");
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (!pkg.name) {
  throw new Error("package.json에 name이 없습니다");
}

const safeName = pkg.name.replace(/[@\/]/g, "_");

// -------------------------
// 파일명 생성
// -------------------------
const ts = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");

const outPath = path.join(rawDir, `${safeName}_${ts}.dot`);

// -------------------------
// Turbo 실행 (파일로 직접 생성)
// -------------------------
console.log("▶ turbo graph 생성 중...");
console.log("output:", outPath);

execSync(`npx turbo run build --graph=${outPath}`, {
  stdio: "inherit",
  cwd: rootDir,
});

// -------------------------
// 결과 확인
// -------------------------
if (!fs.existsSync(outPath)) {
  throw new Error("❌ turbo graph 파일이 생성되지 않았습니다");
}

console.log("✅ turbo graph 생성 완료");
