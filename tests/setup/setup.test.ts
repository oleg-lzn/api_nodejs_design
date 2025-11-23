import {
  createTestUser,
  createTestHabit,
  cleanUpDatabase,
} from "./dbHelpers.ts";

describe("Test setup", () => {
  test("Should connect to test db", async () => {
    const { user, token } = await createTestUser();

    expect(user).toBeDefined();
    await cleanUpDatabase();
  });
});
