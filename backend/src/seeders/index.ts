import { Sequelize, QueryTypes } from "sequelize";
import fs from "fs";
import path from "path";

interface SeederControl {
  name: string;
  executed: boolean;
  executedAt: Date;
}

export async function runSeeders(sequelize: Sequelize) {
  const seedersPath = path.join(__dirname);
  console.log("Seeders path:", seedersPath);

  const orderedSeeders = [
    "20240716210945-brand.js",
    "20240716210950-category.js",
    "20240603212849-product.js",
    "20240615143631-demo-user.js",
  ];

  const seederFiles = fs
    .readdirSync(seedersPath)
    .filter((file) => file.endsWith(".js") && file !== "index.js");

  async function executeSeeder(file: string) {
    const seederName = path.basename(file, ".js");
    try {
      const [seederControl] = await sequelize.query<SeederControl>(
        `SELECT * FROM "SeederControl" WHERE name = :seederName`,
        {
          replacements: { seederName },
          type: QueryTypes.SELECT,
        }
      );

      if (!seederControl || !seederControl.executed) {
        console.log(`Executing seeder: ${file}`);
        const seeder = require(path.join(seedersPath, file));
        if (typeof seeder.up === "function") {
          await seeder.up(sequelize.getQueryInterface(), sequelize);
          await sequelize.query(
            `INSERT INTO "SeederControl" (name, executed, "executedAt") 
             VALUES (:seederName, true, NOW())
             ON CONFLICT (name) 
             DO UPDATE SET executed = true, "executedAt" = NOW()`,
            {
              replacements: { seederName },
              type: QueryTypes.UPSERT,
            }
          );
          console.log(`Seeder ${file} executed successfully`);
        }
      } else {
        console.log(`Seeder ${file} already executed`);
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "name" in error &&
        error.name === "SequelizeDatabaseError" &&
        "parent" in error &&
        error.parent &&
        typeof error.parent === "object" &&
        "code" in error.parent &&
        error.parent.code === "42P01"
      ) {
        console.log("SeederControl table does not exist yet. Creating it...");
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS "SeederControl" (
            name VARCHAR(255) PRIMARY KEY,
            executed BOOLEAN DEFAULT false,
            "executedAt" TIMESTAMP WITH TIME ZONE
          );
        `);
        console.log(
          "SeederControl table created. Retrying seeder execution..."
        );
        await executeSeeder(file);
      } else {
        throw error;
      }
    }
  }

  for (const orderedSeeder of orderedSeeders) {
    if (seederFiles.includes(orderedSeeder)) {
      await executeSeeder(orderedSeeder);
    } else {
      console.warn(
        `Ordered seeder ${orderedSeeder} not found in seeders directory`
      );
    }
  }

  for (const file of seederFiles) {
    if (!orderedSeeders.includes(file)) {
      await executeSeeder(file);
    }
  }
}
