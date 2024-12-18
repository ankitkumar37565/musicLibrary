const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const db = require('./models')
const sequelize = db.sequelize;

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: 'migrations/*.js', 
    },
    storage: new SequelizeStorage({ sequelize }), 
    context: sequelize.getQueryInterface(), 
    logger: console, 
  });

  try {
    
    await umzug.up();
    console.log('Migrations ran successfully!');
  } catch (err) {
    console.error('Error running migrations:', err);
  }
};


(async () => {
    await runMigrations();
})();
