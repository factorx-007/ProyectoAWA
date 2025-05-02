'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'dni', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 8]
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'dni');
  }
};
