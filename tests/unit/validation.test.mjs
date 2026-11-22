import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../../src/lib/validation/auth.ts";

test("loginSchema validates correct credentials", () => {
  const valid = loginSchema.safeParse({
    email: "learner@educore.edu",
    password: "Password123!",
  });
  assert.equal(valid.success, true);
});

test("loginSchema rejects invalid email and short password", () => {
  const invalidEmail = loginSchema.safeParse({
    email: "not-an-email",
    password: "Password123!",
  });
  assert.equal(invalidEmail.success, false);
  assert.match(invalidEmail.error.issues[0].message, /valid email/i);

  const shortPassword = loginSchema.safeParse({
    email: "learner@educore.edu",
    password: "short",
  });
  assert.equal(shortPassword.success, false);
  assert.match(shortPassword.error.issues[0].message, /at least 8 characters/i);
});

test("registerSchema validates matching passwords and full name", () => {
  const valid = registerSchema.safeParse({
    fullName: "Ada Lovelace",
    email: "ada@educore.edu",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
  });
  assert.equal(valid.success, true);
});

test("registerSchema rejects mismatched confirm password", () => {
  const mismatch = registerSchema.safeParse({
    fullName: "Ada Lovelace",
    email: "ada@educore.edu",
    password: "SecurePassword123!",
    confirmPassword: "DifferentPassword123!",
  });
  assert.equal(mismatch.success, false);
  const confirmIssue = mismatch.error.issues.find((issue) =>
    issue.path.includes("confirmPassword")
  );
  assert.ok(confirmIssue);
  assert.match(confirmIssue.message, /passwords do not match/i);
});

test("registerSchema rejects short full name", () => {
  const shortName = registerSchema.safeParse({
    fullName: "A",
    email: "ada@educore.edu",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
  });
  assert.equal(shortName.success, false);
  assert.match(shortName.error.issues[0].message, /at least 2 characters/i);
});
