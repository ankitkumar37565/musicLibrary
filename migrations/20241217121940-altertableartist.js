'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Artist"
      ALTER COLUMN "grammy" TYPE INTEGER
      USING "grammy"::INTEGER
      `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE Artist
      ALTER COLUMN "grammy" TYPE BOOLEAN
      USING "grammy"::INTEGER
      `)
  }
};
