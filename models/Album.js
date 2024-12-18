const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Album', {
    album_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    year: {
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
    },
    artist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Artist',
        key: 'artist_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Album',
    schema: 'public',
    timestamps: false,
    caseModel: 'c',
    noAlias: false,
    caseFile: 'c',
    indexes: [
      {
        name: "Album_pkey",
        unique: true,
        fields: [
          { name: "album_id" },
        ]
      },
    ]
  });
};
