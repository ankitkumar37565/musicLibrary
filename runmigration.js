const { exec } = require('child_process');

const runSequelizeMigrations = async () => {
  exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing migration: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

runSequelizeMigrations();
