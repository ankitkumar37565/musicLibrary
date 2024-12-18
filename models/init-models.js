var DataTypes = require("sequelize").DataTypes;
var _Album = require("./Album");
var _Artist = require("./Artist");
var _Favorites = require("./Favorites");
var _SequelizeMeta = require("./SequelizeMeta");
var _Track = require("./Track");
var _User = require("./User");

function initModels(sequelize) {
  var Album = _Album(sequelize, DataTypes);
  var Artist = _Artist(sequelize, DataTypes);
  var Favorites = _Favorites(sequelize, DataTypes);
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var Track = _Track(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Track.belongsTo(Album, { as: "album", foreignKey: "album_id"});
  Album.hasMany(Track, { as: "Tracks", foreignKey: "album_id"});
  Album.belongsTo(Artist, { as: "artist", foreignKey: "artist_id"});
  Artist.hasMany(Album, { as: "Albums", foreignKey: "artist_id"});
  Track.belongsTo(Artist, { as: "artist", foreignKey: "artist_id"});
  Artist.hasMany(Track, { as: "Tracks", foreignKey: "artist_id"});
  Favorites.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Favorites, { as: "Favorites", foreignKey: "user_id"});
  User.belongsTo(User, { as: "admin", foreignKey: "admin_id"});
  User.hasMany(User, { as: "Users", foreignKey: "admin_id"});

  return {
    Album,
    Artist,
    Favorites,
    SequelizeMeta,
    Track,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
