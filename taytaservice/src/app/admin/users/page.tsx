// app/admin/users/page.tsx
import { Button, Table, TextInput } from '@mantine/core';
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Vendedor', status: 'Activo' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'Cliente', status: 'Activo' },
  // ... más usuarios
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Button color="blue">
          <span className="flex items-center space-x-2">
            <FiPlus />
            <span>Nuevo Usuario</span>
          </span>
        </Button>
      </div>

      <div className="bg-white p-6 text-gray-900 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <TextInput
            placeholder="Buscar usuarios..."
            icon={<FiSearch />}
            className="w-64"
          />
          <div className="flex space-x-2">
            <Button variant="outline">Filtrar</Button>
            <Button variant="outline">Exportar</Button>
          </div>
        </div>

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FiEdit2 />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}