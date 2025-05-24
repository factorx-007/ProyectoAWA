// app/client/layout.tsx
import { ClientHeader } from '@/components/client/ClientHeader';
import { ClientFooter } from '@/components/client/ClientFooter';
import { AuthProvider } from '@/providers/AuthProvider';
import AuthGuard from '@/components/auth/AuthGuard';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex flex-col min-h-screen">
          <ClientHeader />
          <main className="flex-grow bg-gray-80">
            {children}
          </main>
          <ClientFooter />
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}