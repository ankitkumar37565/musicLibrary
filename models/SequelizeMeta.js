const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SequelizeMeta', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'SequelizeMeta',
    schema: 'public',
    timestamps: false,
    caseModel: 'c',
    noAlias: false,
    caseFile: 'c',
    indexes: [
      {
        name: "SequelizeMeta_pkey",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
