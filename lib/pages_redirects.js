// Generates static redirect pages for URLs that relied on Netlify's
// redirects and "pretty URLs" feature. GitHub Pages serves static files only,
// so /en/latest and /en/v1.1.0 need real directory indexes to work.

const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.join(__dirname, "..");
const SPEC_DIR = path.join(ROOT_DIR, "specs");
const PUBLISH_DIR = path.join(ROOT_DIR, "publish");

function redirectPage(target) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content="0;url=${target}" />
</head>
<body>
  <p>Redirecting to <a href="${target}">${target}</a>…</p>
</body>
</html>
`;
}

function writeRedirect(filePath, target) {
  if (fs.existsSync(filePath)) return;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, redirectPage(target));
  console.info(`Created redirect ${path.relative(ROOT_DIR, filePath)} -> ${target}`);
}

function latestVersion(locale) {
  const latestPath = path.join(PUBLISH_DIR, locale, "latest.html");
  const match = fs.readFileSync(latestPath, "utf8").match(/url=([^"\s;]+)/);
  return match && match[1];
}

function writeRedirectsForLocale(locale) {
  const outputDir = path.join(PUBLISH_DIR, locale);
  if (!fs.existsSync(outputDir)) return;

  const version = latestVersion(locale);
  if (version) {
    writeRedirect(path.join(outputDir, "latest", "index.html"), `../${version}.html`);
  }

  fs.readdirSync(outputDir)
    .filter(filename => filename.endsWith(".html"))
    .filter(filename => filename !== "index.html" && filename !== "latest.html")
    .forEach(filename => {
      const name = filename.replace(/\.html$/, "");
      writeRedirect(path.join(outputDir, name, "index.html"), `../${filename}`);
    });
}

function generate() {
  writeRedirect(path.join(PUBLISH_DIR, "index.html"), "en/");

  fs.readdirSync(SPEC_DIR)
    .filter(locale => !locale.startsWith("."))
    .filter(locale => fs.statSync(path.join(SPEC_DIR, locale)).isDirectory())
    .forEach(writeRedirectsForLocale);
}

generate();
