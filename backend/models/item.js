'use strict';

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_vendedor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fecha_y_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    es_servicio: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 'items',
    timestamps: false
  });

  Item.associate = function(models) {
    Item.belongsTo(models.Categoria, { foreignKey: 'id_categoria' });//con "c" minuscúla sí funciona
    Item.belongsTo(models.Usuario, { foreignKey: 'id_vendedor' });
  };

  return Item;
};