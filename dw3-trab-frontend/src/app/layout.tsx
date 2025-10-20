import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'] 
});

export const metadata: Metadata = {
  title: 'DW3 Frontend - Clientes e Faturas',
  description: 'Sistema de gerenciamento de clientes e faturas para DW3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}> 
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}