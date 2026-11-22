import test from "node:test";
import assert from "node:assert/strict";
import { useAuthStore } from "../../src/stores/auth-store.ts";

test("useAuthStore initializes in loading state with null user", () => {
  const state = useAuthStore.getState();
  assert.equal(state.user, null);
  assert.equal(state.status, "loading");
});

test("useAuthStore.setUser sets safe user and updates status to authenticated", () => {
  const testUser = {
    id: "usr_1234567890",
    name: "John Learner",
    email: "john@example.com",
  };

  useAuthStore.getState().setUser(testUser);

  const state = useAuthStore.getState();
  assert.deepEqual(state.user, testUser);
  assert.equal(state.status, "authenticated");

  // Verify no sensitive tokens exist on user object
  assert.equal("accessToken" in state.user, false);
  assert.equal("token" in state.user, false);
  assert.equal("password" in state.user, false);
  assert.equal("refreshToken" in state.user, false);
});

test("useAuthStore.clearUser resets state on logout", () => {
  useAuthStore.getState().clearUser();

  const state = useAuthStore.getState();
  assert.equal(state.user, null);
  assert.equal(state.status, "unauthenticated");
});
