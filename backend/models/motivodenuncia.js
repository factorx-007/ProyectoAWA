'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class motivos_denuncia extends Model {
    static associate(models) {
    }
  }
  motivos_denuncia.init({
    id_motivo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(55)
    }
  }, {
    sequelize,
    modelName: 'Motivos_denuncia',
    tableName: 'motivos_denuncia',
    timestamps: false
  });
  return motivos_denuncia;
};