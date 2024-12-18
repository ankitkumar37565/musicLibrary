'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('User','created_at',{
      type:Sequelize.DATE,
      allowNull:true,
    });
    await queryInterface.addColumn('Artist','created_at',{
      type:Sequelize.DATE,
      allowNull:true,
    });
    await queryInterface.addColumn('Album','created_at',{
      type:Sequelize.DATE,
      allowNull:true,
    });
    await queryInterface.addColumn('Track','created_at',{
      type:Sequelize.DATE,
      allowNull:true,
    });
    await queryInterface.addColumn('Favorites','created_at',{
      type:Sequelize.DATE,
      allowNull:true,
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('User','created_at');
   await queryInterface.removeColumn('Artist','created_at');
   await queryInterface.removeColumn('Album','created_at');
   await queryInterface.removeColumn('Track','created_at');
   await queryInterface.removeColumn('Favorites','created_at');
  }
};
