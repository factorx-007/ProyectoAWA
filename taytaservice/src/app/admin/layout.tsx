// app/admin/layout.tsx
import { Sidebar } from '../../components/admin/Sidebar';
import { AuthProvider } from '../../providers/AuthProvider';
import '@mantine/core/styles.css'; // Asegúrate de importar los  de Mantine
import {Header} from '../../components/admin/Hearder'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-rose-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-teal-200">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}