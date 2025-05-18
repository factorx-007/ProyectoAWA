// src/app/providers.tsx
'use client';

import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '../providers/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={{}}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </MantineProvider>
  );
}
