const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('owner', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName:{
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profilePicture:{
      type:DataTypes.ARRAY(DataTypes.STRING),
    },
    address:{
      type: DataTypes.JSON(DataTypes.STRING),
    },
    favorites:{
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue:[]
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      defaultValue: true,
    }
  })
};
