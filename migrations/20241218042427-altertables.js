'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('User','admin_id',{
      type:Sequelize.UUID,
      allowNull:true,
      references: {
        model:'User',
        key:'user_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
  });
  let [user]= await queryInterface.sequelize.query(`SELECT user_id FROM "User" LIMIT 1;`);
  if(user[0]?.user_id) {

    await queryInterface.addColumn('Favorites','user_id',{
      type:Sequelize.UUID,
      allowNull:false,
      defaultValue:user[0].user_id,
      references: {
        model:'User',
        key:'user_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
    });
  }else {
    await queryInterface.addColumn('Favorites','user_id',{
      type:Sequelize.UUID,
      allowNull:false,
      references: {
        model:'User',
        key:'user_id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE',
    });
  }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('User','admin_id');
    await queryInterface.removeColumn('Favorites','user_id');
  }
};
