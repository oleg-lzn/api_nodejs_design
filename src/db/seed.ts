import { db } from "./connection.ts";
import { users, habits, tags, habitTags, entries } from "./schema.ts";

const seedDb = async () => {
  console.log("🌱 Starting to seed the database..");

  try {
    console.log("Clearing exising data...");
    await Promise.all([
      db.delete(entries),
      db.delete(users),
      db.delete(tags),
      db.delete(habitTags),
      db.delete(habits),
    ]);
    console.log("All data cleared successfully ✅");
    console.log("creating new users ... ");
    const [demoUser] = await db
      .insert(users)
      .values({
        email: "demo@app.com",
        username: "demo",
        password: "password",
        firstName: "Peter",
        lastName: "Pearson",
      })
      .returning();

    console.log("Creating tags");
    const [healthTag] = await db
      .insert(tags)
      .values({ name: "Health", color: "#e0e0e0" })
      .returning();

    console.log("Creating habit...");

    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: "Exercise",
        description: "Daily Workout",
        frequency: "Daily",
        targetCount: 1,
      })
      .returning();

    console.log("Creating joining habit with tag...");

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    });

    console.log("Adding completion entries");

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      });
    }

    console.log("Database seeded");
    console.log(
      `Demo User - ${demoUser.email}, ${demoUser.username}, ${demoUser.password}`
    );
  } catch (e) {
    console.error("Error clearing data:", e);
    process.exit[1];
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  // to check this node ... <= this is the argv[1]
  seedDb()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
