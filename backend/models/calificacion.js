'use strict';

module.exports = (sequelize, DataTypes) => {
  const Calificacion = sequelize.define('Calificacion', {
    id_calificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'calificaciones',
    timestamps: false
  });

  Calificacion.associate = function(models) {
    Calificacion.belongsTo(models.Interaccion, { foreignKey: 'id_calificacion' });
  };

  return Calificacion;
};
