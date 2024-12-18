const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Artist', {
    artist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    grammy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Artist',
    schema: 'public',
    timestamps: false,
    caseModel: 'c',
    noAlias: false,
    caseFile: 'c',
    indexes: [
      {
        name: "Artist_pkey",
        unique: true,
        fields: [
          { name: "artist_id" },
        ]
      },
    ]
  });
};
