'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

function validarTarjeta(numero: string) {
  const limpio = numero.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(limpio)) {
    return false;
  }

  let suma = 0;
  let alternar = false;

  for (let i = limpio.length - 1; i >= 0; i--) {
    let digito = parseInt(limpio.charAt(i), 10);

    if (alternar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    suma += digito;
    alternar = !alternar;
  }

  return suma % 10 === 0;
}

export default function PaymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const [carritoId, setCarritoId] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';



  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCardNumber('');
    setExpiration('');
    setCvc('');
    setName('');
    setError('');
  };

  // Formatear número de tarjeta (12 dígitos con espacios cada 4)
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const truncated = cleanValue.slice(0, 16);
    return truncated.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Formatear fecha de expiración (MM/AA)
  const formatExpiration = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const truncated = cleanValue.slice(0, 4);
    if (truncated.length > 2) {
      return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
    }
    return truncated;
  };

  const handleCardNumberChange = (e: { target: { value: string; }; }) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpirationChange = (e: { target: { value: any; }; }) => {
    const formatted = formatExpiration(e.target.value);
    setExpiration(formatted);
  };

  const handleCvcChange = (e: { target: { value: string; }; }) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    const error = validarCampos(name, cardNumber, expiration, cvc, setError);
    if (error) return;

    if (!carritoId) {
      setError('No se encontró el carrito actual');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const pagoExitoso = await ejecutarPago(cleanCardNumber, expiration, cvc, total);

    if (pagoExitoso) {
      try {
        const token = localStorage.getItem('auth-token');
        await fetch(`${API_BASE_URL}/api/carritos/${carritoId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            campo: 'estado',
            valor: 'V'
          })
        });

        // Cambiar fecha_compra
        await fetch(`${API_BASE_URL}/api/carritos/${carritoId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            campo: 'fecha_compra',
            valor: new Date().toISOString()
          })
        });
        alert('¡Pago realizado y carrito actualizado!');
        closeModal();
      } catch (err) {
        console.log(err);
        alert('Pago realizado, pero hubo un error al actualizar el carrito.');
      }
    }
  };

  const validarCampos = (
    name: string,
    cardNumber: string,
    expiration: string,
    cvc: string,
    setError: (msg: string) => void
  ): string | null => {
    if (!name.trim()) {
      setError('Por favor ingresa el nombre en la tarjeta');
      return 'error';
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      setError('El número de tarjeta debe tener 16 dígitos');
      return 'error';
    }

    if (!validarTarjeta(cleanCardNumber)) {
      setError('El número de tarjeta no es válido');
      return 'error';
    }

    if (expiration.length !== 5) {
      setError('La fecha de expiración debe estar en formato MM/AA');
      return 'error';
    }

    if (cvc.length !== 3) {
      setError('El CVC debe tener 3 dígitos');
      return 'error';
    }

    return null;
  };


  const ejecutarPago = async (
    numero: string,
    fecha_vencimiento: string,
    CVC: string,
    precio: number
  ): Promise<boolean> => {
    try {
      const response = await fetch('https://api-cards-jod9.onrender.com/api/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numero,
          fecha_vencimiento,
          CVC,
          precio
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}. Saldo restante: $${data.saldo_restante}`);
        closeModal();
        return true;
      } else {
        alert(`❌ Error: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('❌ Ocurrió un error al procesar el pago. Inténtalo de nuevo.');
      return false;
    }
  };


  useEffect(() => {
    const fetchCarritoYTotal = async () => {
      if (!user?.id) return;
      try {
        const token = localStorage.getItem('auth-token');
        // 1. Buscar carrito abierto
        const carritoRes = await fetch(`${API_BASE_URL}/api/carritos/buscar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            campo: 'id_usuario',
            valor: user.id.toString()
          })
        });
        const carritos = await carritoRes.json();
        const carrito = Array.isArray(carritos)
          ? carritos.find((c: any) => c.estado === 'E')
          : null;

        if (!carrito) return;

        setCarritoId(carrito.id_carrito);

        // 2. Buscar productos del carrito
        const productosRes = await fetch(`${API_BASE_URL}/api/carritos-productos/buscar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            campo: 'id_carrito',
            valor: carrito.id_carrito.toString()
          })
        });
        const productos = await productosRes.json();

        // 3. Calcular el total sumando precio * cantidad de cada producto
        let totalCarrito = 0;
        for (const prod of productos) {
          // Obtener detalles del item
          const itemRes = await fetch(`${API_BASE_URL}/api/items/buscar`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              campo: 'id_item',
              valor: prod.id_item.toString()
            })
          });
          const [item] = await itemRes.json();
          totalCarrito += (item.precio || 0) * (prod.cantidad || 1);
        }
        setTotal(totalCarrito);
      } catch (err) {
        setTotal(0);
      }
    };

    fetchCarritoYTotal();
  }, [user?.id, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: { target: any; }) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02]"
      >
        Proceder al pago
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Detalles de pago</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="1234 5678 9012 1246"
                />
                <p className="mt-1 text-xs text-gray-500">12 dígitos separados por espacios</p>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiración</label>
                  <input
                    type="text"
                    value={expiration}
                    onChange={handleExpirationChange}
                    required
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="MM/AA"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    required
                    maxLength={3}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="123"
                  />
                </div>

                <div className="text-right text-lg font-semibold text-gray-700 mb-2">
                  Total a pagar: ${total.toFixed(2)}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all transform hover:scale-[1.03]"
                >
                  Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}