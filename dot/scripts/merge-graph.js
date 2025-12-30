const fs = require("fs");
const path = require("path");

// -------------------------
// 경로 설정
// -------------------------
const dotRoot = path.resolve("dot");
const baseStylePath = path.join(dotRoot, "base_style.dot");
const rawDir = path.join(dotRoot, "raw");
const finalDir = path.join(dotRoot, "final");
const packageJsonPath = path.resolve("package.json");

// final 폴더 생성
fs.mkdirSync(finalDir, { recursive: true });

// -------------------------
// base 스타일 읽기
// -------------------------
const baseStyle = fs.existsSync(baseStylePath)
  ? fs.readFileSync(baseStylePath, "utf8")
  : "";

// -------------------------
// 루트 라벨용 이름 읽기
// -------------------------
let rootLabel = "Root";
try {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  if (pkg.name) rootLabel = pkg.name;
} catch {
  console.warn("⚠️ package.json name을 읽지 못했습니다. 기본 Root 사용");
}

// -------------------------
// packages 탐색 (재귀)
// -------------------------
function getAllPackages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, "package.json"))) {
        result.push(entry.name);
      }
      result.push(...getAllPackages(fullPath));
    }
  }
  return result;
}

// -------------------------
// raw 폴더 최신 파일 선택
// -------------------------
const rawFiles = fs
  .readdirSync(rawDir)
  .filter((f) => f.endsWith(".dot"))
  .map((f) => ({
    name: f,
    time: fs.statSync(path.join(rawDir, f)).mtime.getTime(),
  }))
  .sort((a, b) => b.time - a.time);

if (rawFiles.length === 0) {
  console.error("❌ raw DOT 파일이 없습니다.");
  process.exit(1);
}

const latestRaw = rawFiles[0];
const turboGraphPath = path.join(rawDir, latestRaw.name);
let turboGraph = fs.readFileSync(turboGraphPath, "utf8").trim();

// 중첩 digraph 제거 (터보레포 출력 안쪽 내용만 사용)
turboGraph = turboGraph
  .replace(/^digraph\s*{/, "")
  .replace(/}$/, "")
  .trim();

// -------------------------
// apps / packages 읽기
// -------------------------
const appsDir = path.resolve("apps");
const packagesDir = path.resolve("packages");

const apps = fs.existsSync(appsDir)
  ? fs
    .readdirSync(appsDir)
    .filter((f) => fs.statSync(path.join(appsDir, f)).isDirectory())
  : [];

const packages = fs.existsSync(packagesDir) ? getAllPackages(packagesDir) : [];

// -------------------------
// 노드별 스타일 적용
// -------------------------
const nodeSet = new Set();
turboGraph.replace(/"([^"]+)"/g, (_, node) => {
  if (node !== "true" && node !== "root") nodeSet.add(node);
});

let rootNodes = "";
let packageNodes = "";
let appNodes = "";

// @repo는 workspace 명명에 따라 수동으로 바꿔줘야함... ㅎ , 문자열 분기 처리까지 넣으면 너무 오버엔지니어링 같음
for (const n of nodeSet) {
  if (n === "true" || n === "root") continue;

  if (n.endsWith("___ROOT___")) {
    rootNodes += `"${n}" [fillcolor="#007acc", fontcolor="white", style="filled,rounded", penwidth=3];\n`;
  } else if (n.startsWith("[root] @repo/")) {
    packageNodes += `"${n}" [fillcolor="#33383e", fontcolor="white", style="filled,rounded", penwidth=1.5];\n`;
  } else if (apps.some((a) => n.startsWith(`[root] ${a}#build`))) {
    appNodes += `"${n}" [fillcolor="#004e8c", fontcolor="white", style="filled,rounded", penwidth=2];\n`;
  } else {
    rootNodes += `"${n}" [fillcolor="#005f9e", fontcolor="white", style="filled,rounded", penwidth=2];\n`;
  }
}

// -------------------------
// 최종 DOT 구성 (클러스터 래핑)
// -------------------------
const finalGraph = `
digraph {
    compound="true"
    newrank="true"

${baseStyle}

// -------------------------
// Root 클러스터
subgraph cluster_root {
    label="${rootLabel}";
    labelloc=t;      
    labeljust=l; 
${rootNodes}

// -------------------------
// Packages 클러스터
subgraph cluster_packages {
    label="Packages";
${packageNodes}
}

// -------------------------
// Apps 클러스터
subgraph cluster_apps {
    label="Apps";
${appNodes}
}

${turboGraph}
}
}
`;

// -------------------------
// final 파일명
// -------------------------
const nameParts = latestRaw.name.split("_");
nameParts.pop(); // timestamp 제거
const finalName = nameParts.join("_") + ".dot";
const finalDotPath = path.join(finalDir, finalName);

// -------------------------
// 파일 쓰기
// -------------------------
fs.writeFileSync(finalDotPath, finalGraph);

console.log("✅ final DOT 생성 완료:", finalDotPath);
console.log("사용된 raw 파일:", turboGraphPath);
