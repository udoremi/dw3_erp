'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './MainLayout.module.css';
import { IoGridOutline, IoPeopleOutline, IoReceiptOutline, IoLogOutOutline, IoCubeOutline } from 'react-icons/io5';
import Link from 'next/link';

const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link href={href} className={styles.navItem}>
    {icon}
    <span>{label}</span>
  </Link>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <IoCubeOutline size={30} />
          <h1 className={styles.sidebarTitle}>MeuSistema</h1>
        </div>
        <nav className={styles.navigation}>
          <NavItem href="/dashboard" icon={<IoGridOutline size={20} />} label="Dashboard" />
          <NavItem href="/clientes" icon={<IoPeopleOutline size={20} />} label="Clientes" />
          <NavItem href="/faturas" icon={<IoReceiptOutline size={20} />} label="Faturas" />
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={logout} className={styles.logoutButton}>
            <IoLogOutOutline size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}