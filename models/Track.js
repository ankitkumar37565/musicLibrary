const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Track', {
    track_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    duration: {
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
    },
    album_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Album',
        key: 'album_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Track',
    schema: 'public',
    timestamps: false,
    caseModel: 'c',
    noAlias: false,
    caseFile: 'c',
    indexes: [
      {
        name: "Track_pkey",
        unique: true,
        fields: [
          { name: "track_id" },
        ]
      },
    ]
  });
};
