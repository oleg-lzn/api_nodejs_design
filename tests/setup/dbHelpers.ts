import db from "../../src/db/connection.ts";
import {
  users,
  habits,
  entries,
  tags,
  habitTags,
  type NewUser,
  type NewHabit,
} from "../../src/db/schema.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { hashPassword } from "../../src/utils/password.ts";

export const createTestUser = async (userData: Partial<NewUser> = {}) => {
  const defaultData = {
    email: `test - ${Date.now()}-${Math.random()}@example.com`,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: "adminpassword1234",
    firstName: "Test",
    lastName: "User",
  };

  const hashedPassword = await hashPassword(defaultData.password);
  const [user] = await db
    .insert(users)
    .values({
      ...defaultData,
      password: hashedPassword,
    })
    .returning();

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { token, user, rawPassword: defaultData.password };
};

export const createTestHabit = async (
  userId: string,
  habitData: Partial<NewHabit> = {}
) => {
  const defaultData = {
    name: `testHabit-${Date.now()}`,
    description: `testhabit-${Date.now()}-${Math.random()}`,
    frequency: "daily",
    targetCount: 15,
    ...habitData,
  };

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning();

  return habit;
};

export const cleanUpDatabase = async () => {
  await db.delete(habitTags);
  await db.delete(entries);
  await db.delete(habits);
  await db.delete(tags);
  await db.delete(users);
};
