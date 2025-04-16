'use strict';

module.exports = (sequelize, DataTypes) => {
  const Denuncia = sequelize.define('Denuncia', {
    id_denuncia: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 'denuncias',
    timestamps: false
  });

  Denuncia.associate = function(models) {
    Denuncia.belongsTo(models.Interaccion, { foreignKey: 'id_denuncia' });
    Denuncia.belongsTo(models.Motivos_denuncia, { foreignKey: 'id_motivo' });
  };

  return Denuncia;
};