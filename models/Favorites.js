const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favorites', {
    favorite_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    item_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: "d18c3d2a-86d4-4902-b3d2-fb97e56b556b",
      references: {
        model: 'User',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Favorites',
    schema: 'public',
    timestamps: false,
    caseModel: 'c',
    noAlias: false,
    caseFile: 'c',
    indexes: [
      {
        name: "Favorites_pkey",
        unique: true,
        fields: [
          { name: "favorite_id" },
        ]
      },
    ]
  });
};
