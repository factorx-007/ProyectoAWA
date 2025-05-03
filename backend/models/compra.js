'use strict';

module.exports = (sequelize, DataTypes) => {
  const Compra = sequelize.define('Compra', {
    id_compra: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    precio_establecido: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    porcentaje: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'compras',
    timestamps: false
  });

  Compra.associate = function(models) {
    Compra.belongsTo(models.Interaccion, { foreignKey: 'id_compra' });
  };

  return Compra;
};
