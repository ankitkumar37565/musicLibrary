'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User',{

      user_id:{
        type:Sequelize.UUID,
        allowNull:false,    
        primaryKey: true,    
      },
      email:{
        type:Sequelize.STRING(50),
        allowNull:false,        
      },
      password:{
        type:Sequelize.STRING(1000),
        allowNull:false,        
      },
      role:{
        type:Sequelize.ENUM('Admin','Editor','Viewer'),
        allowNull:false,        
      },
    });
    await queryInterface.createTable('Artist',{
      artist_id:{
        type:Sequelize.UUID,
        allowNull:false,       
        primaryKey: true,       
      },
      name:{
        type:Sequelize.STRING(50),
        allowNull:false,        
      },
      grammy:{
        type:Sequelize.BOOLEAN,
      },
      hidden:{
        type:Sequelize.BOOLEAN,       
      },
    });
    await queryInterface.createTable('Album',{
      album_id:{
        type:Sequelize.UUID,
        allowNull:false,      
        primaryKey: true,        
      },
      name:{
        type:Sequelize.STRING(50),       
      },
      year:{
        type:Sequelize.INTEGER,       
      },
      hidden:{
        type:Sequelize.BOOLEAN,       
      },
    });
    await queryInterface.createTable('Track',{
      track_id:{
        type:Sequelize.UUID,
        allowNull:false,       
        primaryKey: true,       
      },
      name:{
        type:Sequelize.STRING(50),       
      },
      duration:{
        type:Sequelize.INTEGER,       
      },
      hidden:{
        type:Sequelize.BOOLEAN,       
      },
    });
    await queryInterface.createTable('Favorites',{
      favorite_id:{
        type:Sequelize.UUID,
        allowNull:false,       
        primaryKey: true,       
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
    await queryInterface.dropTable('Artist');
    await queryInterface.dropTable('Album');
    await queryInterface.dropTable('Track');
    await queryInterface.dropTable('Favorites');
  }
};
