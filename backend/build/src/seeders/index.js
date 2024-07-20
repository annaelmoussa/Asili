"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeders = runSeeders;
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runSeeders(sequelize) {
    const seedersPath = path_1.default.join(__dirname);
    console.log("Seeders path:", seedersPath);
    const orderedSeeders = [
        "20240716210945-brand.js",
        "20240716210950-category.js",
        "20240603212849-product.js",
        "20240615143631-demo-user.js",
    ];
    const seederFiles = fs_1.default
        .readdirSync(seedersPath)
        .filter((file) => file.endsWith(".js") && file !== "index.js");
    async function executeSeeder(file) {
        const seederName = path_1.default.basename(file, ".js");
        try {
            const [seederControl] = await sequelize.query(`SELECT * FROM "SeederControl" WHERE name = :seederName`, {
                replacements: { seederName },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (!seederControl || !seederControl.executed) {
                console.log(`Executing seeder: ${file}`);
                const seeder = require(path_1.default.join(seedersPath, file));
                if (typeof seeder.up === "function") {
                    await seeder.up(sequelize.getQueryInterface(), sequelize);
                    await sequelize.query(`INSERT INTO "SeederControl" (name, executed, "executedAt") 
             VALUES (:seederName, true, NOW())
             ON CONFLICT (name) 
             DO UPDATE SET executed = true, "executedAt" = NOW()`, {
                        replacements: { seederName },
                        type: sequelize_1.QueryTypes.UPSERT,
                    });
                    console.log(`Seeder ${file} executed successfully`);
                }
            }
            else {
                console.log(`Seeder ${file} already executed`);
            }
        }
        catch (error) {
            if (error instanceof Error &&
                "name" in error &&
                error.name === "SequelizeDatabaseError" &&
                "parent" in error &&
                error.parent &&
                typeof error.parent === "object" &&
                "code" in error.parent &&
                error.parent.code === "42P01") {
                console.log("SeederControl table does not exist yet. Creating it...");
                await sequelize.query(`
          CREATE TABLE IF NOT EXISTS "SeederControl" (
            name VARCHAR(255) PRIMARY KEY,
            executed BOOLEAN DEFAULT false,
            "executedAt" TIMESTAMP WITH TIME ZONE
          );
        `);
                console.log("SeederControl table created. Retrying seeder execution...");
                await executeSeeder(file);
            }
            else {
                throw error;
            }
        }
    }
    // Execute ordered seeders
    for (const orderedSeeder of orderedSeeders) {
        if (seederFiles.includes(orderedSeeder)) {
            await executeSeeder(orderedSeeder);
        }
        else {
            console.warn(`Ordered seeder ${orderedSeeder} not found in seeders directory`);
        }
    }
    // Execute any remaining seeders that weren't in the orderedSeeders list
    for (const file of seederFiles) {
        if (!orderedSeeders.includes(file)) {
            await executeSeeder(file);
        }
    }
}
