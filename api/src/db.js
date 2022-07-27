require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;


const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/proyecto`, {
  logging: false,
  native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const {Owner, Pet, Provider, Chat, Event, Review, Sold} = sequelize.models;

Owner.hasMany(Sold);
Sold.belongsTo(Owner);

Owner.hasMany(Pet);
Pet.belongsTo(Owner);

Owner.hasMany(Chat);
Chat.belongsTo(Owner);

Owner.hasMany(Review);
Review.belongsTo(Owner);

Provider.belongsToMany(Pet, {
  through: 'Provider-Pet'
});

Pet.belongsToMany(Provider, {
  through: 'Provider-Pet'
});

Owner.hasMany(Event);
Event.belongsTo(Owner);

Provider.hasMany(Event);
Event.belongsTo(Provider);

Provider.hasMany(Chat);
Chat.belongsTo(Provider);

Provider.hasMany(Review);
Review.belongsTo(Provider);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};