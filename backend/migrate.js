require("dotenv").config();

const { exec } = require("child_process");

const migrate = () => {
  const command = "npx sequelize-cli db:migrate";

  const migrateProcess = exec(command, {
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  migrateProcess.stdout.on("data", (data) => {
    console.log(data);
  });

  migrateProcess.stderr.on("data", (data) => {
    console.error(data);
  });

  migrateProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Migration process exited with code ${code}`);
      process.exit(code);
    } else {
      console.log("Migrations executed successfully");
      process.exit(0);
    }
  });
};

migrate();
