'use client';

import MainLayout from "@/app/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return <div>Carregando...</div>;
    }

    return (
        <MainLayout>
            <h1>Dashboard Principal</h1>
            <p>Bem-vindo ao sistema!</p>
        </MainLayout>
    );
}