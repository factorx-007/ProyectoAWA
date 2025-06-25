const bcrypt = require('bcryptjs');
const BaseService = require('./BaseService');
const { Usuario } = require('../models');
const { sequelize } = require('../models');

class UsuarioService extends BaseService {
  constructor() {
    super(Usuario);
  }

  async create(data) {
    if (!data.contrasena) {
      throw new Error("La contraseña es requerida");
    }

    const salt = await bcrypt.genSalt(10);
    data.contrasena = await bcrypt.hash(data.contrasena, salt);

    return await super.create(data);
  }

  async validatePassword(email, plainPassword) {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return null;

    const match = await bcrypt.compare(plainPassword, usuario.contrasena);
    if (!match) return null;

    return usuario;
  }

  async getVentas(id_vendedor) {
    const { CarritoProducto, Carrito, Item, Usuario } = sequelize.models;

    const ventas = await CarritoProducto.findAll({
      include: [
        {
          model: Item,
          where: { id_vendedor },
          attributes: ['id_item', 'nombre', 'precio']
        },
        {
          model: Carrito,
          where: { estado: 'V' },
          attributes: ['id_carrito'],
          include: [
            {
              model: Usuario,
              attributes: ['nombres', 'apellidos']
            }
          ]
        }
      ],
      attributes: ['cantidad'],
      order: [
        [sequelize.models.Carrito, 'id_carrito', 'DESC'],
        [Item, 'id_item', 'ASC']
      ]
    });

    return ventas.map(venta => {
      return {
        id_producto: venta.Item.id_item,
        nombre_producto: venta.Item.nombre,
        cantidad: venta.cantidad,
        comprador: `${venta.Carrito.Usuario.nombres} ${venta.Carrito.Usuario.apellidos}`,
        nro_venta: venta.Carrito.id_carrito,
        total_pagado: venta.Item.precio * venta.cantidad
      };
    });
  }


}

module.exports = new UsuarioService();
