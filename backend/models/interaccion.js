'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interaccion = sequelize.define('Interaccion', {
    id_interaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_item: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fecha_y_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'interacciones',
    timestamps: false
  });

  Interaccion.associate = function(models) {
    Interaccion.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    Interaccion.belongsTo(models.Item, { foreignKey: 'id_item' });
  };

  return Interaccion;
};