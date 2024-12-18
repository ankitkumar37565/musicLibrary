'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Album','artist_id',{
      type:Sequelize.UUID,
      allowNull:false,
      references: {
        model:'Artist',
        key:'artist_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
  });
    await queryInterface.addColumn('Track','artist_id',{
      type:Sequelize.UUID,
      allowNull:false,
      references: {
        model:'Artist',
        key:'artist_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
  });
    await queryInterface.addColumn('Track','album_id',{
      type:Sequelize.UUID,
      allowNull:false,
      references: {
        model:'Album',
        key:'album_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
  });
    await queryInterface.addColumn('Favorites','item_id',{
      type:Sequelize.UUID,
      allowNull:false,
  });
    await queryInterface.addColumn('Favorites','category',{
      type:Sequelize.STRING(20),
      allowNull:false,
  });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Album','artist_id');
    await queryInterface.removeColumn('Track','artist_id');
    await queryInterface.removeColumn('Track','album_id');
    await queryInterface.removeColumn('Favorites','item_id');
    await queryInterface.removeColumn('Favorites','category');
  }
};
