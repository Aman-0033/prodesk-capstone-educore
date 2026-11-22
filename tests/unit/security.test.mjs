import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

test("Security check: No service-role key or JWT secrets in source code", () => {
  const srcFiles = getAllFiles(path.resolve("src"));

  const forbiddenPatterns = [
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /service_role/i,
    /eyJhbGciOi/i, // common JWT prefix
    /sbp_[a-zA-Z0-9]{20,}/, // Supabase personal access token pattern
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const pattern of forbiddenPatterns) {
      assert.equal(
        pattern.test(content),
        false,
        `Forbidden credential pattern ${pattern} found in ${file}`
      );
    }
  }
});

test("Security check: .env.example contains only placeholders", () => {
  const envExample = fs.readFileSync(path.resolve(".env.example"), "utf8");
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL=https:\/\/your-project\.supabase\.co/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key/);
  // Ensure no real keys or JWTs
  assert.equal(/ey[a-zA-Z0-9_-]{20,}/.test(envExample), false);
});
