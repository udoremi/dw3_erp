'use client';

import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/MainLayout";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import FaturaForm from "../components/FaturaForm";
import FaturaFilter from "../components/FaturaFilter";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from '../faturas/faturas.module.css';
import { IoAdd, IoPencil, IoTrash, IoFilter } from "react-icons/io5";
import api from "../../../services/api";

const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
};
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const statusStyles: { [key: string]: string } = {
    Pendente: styles.statusPendente,
    Paga: styles.statusPaga,
    Cancelada: styles.statusCancelada,
};

interface FaturaData {
    id: number;
    id_fatura: number;
    id_cliente: number;
    nome_cliente: string; 
    data_emissao: string;
    data_vencimento: string;
    valor_total: number;
    status: string;
}

interface ClientForSelect {
    id_cliente: number;
    nome: string;
}

export default function FaturasPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [allFaturas, setAllFaturas] = useState<FaturaData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingFatura, setEditingFatura] = useState<Partial<FaturaData> | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [faturaToDelete, setFaturaToDelete] = useState<number | null>(null);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterClientList, setFilterClientList] = useState<ClientForSelect[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    const fetchFaturas = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/getAllFaturas');
            if (response.data && Array.isArray(response.data.registro)) {
                const faturasData = response.data.registro.map((f: any) => ({ ...f, id: f.id_fatura }));
                setAllFaturas(faturasData);
            } else {
                setAllFaturas([]);
            }
        } catch (error) { console.error("Erro ao buscar faturas:", error); setAllFaturas([]); } 
        finally { setIsLoading(false); }
    };

    const fetchClientsForFilter = async () => {
        try {
            const response = await api.get('/getAllClientesFilter');
            if (response.data && Array.isArray(response.data.registro)) {
                setFilterClientList(response.data.registro);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
        if (isAuthenticated) fetchFaturas();
    }, [isAuthenticated, authLoading, router]);

    const filteredFaturas = useMemo(() => {
        if (!selectedClientId) {
            return allFaturas;
        }
        return allFaturas.filter(fatura => fatura.id_cliente === selectedClientId);
    }, [allFaturas, selectedClientId]);

    const handleOpenFilterModal = () => {
        fetchClientsForFilter();
        setIsFilterModalOpen(true);
    };

    const handleApplyFilter = (clientId: number | null) => {
        setSelectedClientId(clientId);
        setIsFilterModalOpen(false);
    };

    const handleClearFilter = () => {
        setSelectedClientId(null);
        setIsFilterModalOpen(false);
    };

    const handleSaveFatura = async (faturaData: Partial<FaturaData>) => {
        setFormError(null);
        try {
            const payload = {
                id_cliente: parseInt(String(faturaData.id_cliente || '0'), 10),
                data_emissao: faturaData.data_emissao,
                data_vencimento: faturaData.data_vencimento,
                valor_total: parseFloat(String(faturaData.valor_total || '0')),
                status: faturaData.status,
            };

            if (payload.id_cliente === 0) throw new Error("Por favor, selecione um cliente.");

            let response;
            if (editingFatura?.id) {
                response = await api.post('/updateFaturas', { ...payload, id_fatura: editingFatura.id });
            } else {
                response = await api.post('/insertFaturas', payload);
            }
            if (response.data && response.data.linhasAfetadas === -1) {
                throw new Error(response.data.msg);
            }
            alert(editingFatura?.id ? 'Fatura atualizada com sucesso!' : 'Fatura criada com sucesso!');
            setIsFormModalOpen(false);
            setEditingFatura(null);
            await fetchFaturas();
        } catch (error: any) {
            setFormError(error.message || "Ocorreu um erro ao salvar a fatura.");
        }
    };

    const handleDeleteClick = (id: number) => { setFaturaToDelete(id); setIsConfirmModalOpen(true); };
    const handleConfirmDelete = async () => {
        try {
            await api.post('/deleteFaturas', { id_fatura: faturaToDelete });
            alert(`Fatura foi excluída com sucesso!`);
            setIsConfirmModalOpen(false);
            setFaturaToDelete(null);
            await fetchFaturas();
        } catch (error) {
            console.error("Erro ao excluir fatura:", error);
            alert("Não foi possível excluir a fatura.");
        }
    };
    const handleEdit = (fatura: FaturaData) => { setFormError(null); setEditingFatura(fatura); setIsFormModalOpen(true); };
    const handleAddNew = () => { setFormError(null); setEditingFatura(null); setIsFormModalOpen(true); };
    const handleCloseFormModal = () => { setFormError(null); setIsFormModalOpen(false); setEditingFatura(null); }
    
    if (authLoading) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>Verificando autenticação...</div>;

return (
        <MainLayout>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>Gestão de Faturas</h1>
                </div>
                <div className={styles.headerRight}>
                    <button onClick={handleOpenFilterModal} className={styles.filterButton}>
                        <IoFilter size={20} />
                        <span>Filtros</span>
                    </button>
                    <button onClick={handleAddNew} className={styles.addButton}>
                        <IoAdd size={20} />
                        <span>Nova Fatura</span>
                    </button>
                </div>
            </div>
            {isLoading ? (<div style={{ color: 'white', textAlign: 'center' }}>Carregando faturas...</div>) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Valor Total</th>
                                <th>Emissão</th>
                                <th>Vencimento</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaturas.length > 0 ? filteredFaturas.map((fatura) => (
                                <tr key={fatura.id} className={fatura.status === 'Cancelada' ? styles.inactiveRow : ''}>
                                    <td>{fatura.nome_cliente || 'Cliente não informado'}</td>
                                    <td>{formatCurrency(fatura.valor_total)}</td>
                                    <td>{formatDate(fatura.data_emissao)}</td>
                                    <td>{formatDate(fatura.data_vencimento)}</td>
                                    <td><span className={`${styles.statusBadge} ${statusStyles[fatura.status] || styles.statusPendente}`}>{fatura.status}</span></td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleEdit(fatura)} className={`${styles.actionButton} ${styles.editButton}`}><IoPencil /></button>
                                        <button onClick={() => handleDeleteClick(fatura.id!)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>
                                        {selectedClientId ? 'Nenhuma fatura encontrada para este cliente.' : 'Nenhuma fatura encontrada.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingFatura ? "Editar Fatura" : "Nova Fatura"}>
                <FaturaForm onSave={handleSaveFatura} onCancel={handleCloseFormModal} initialData={editingFatura} errorMessage={formError}/>
            </Modal>
            
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message="Você tem certeza que deseja excluir esta fatura?"/>

            <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filtrar Faturas">
                <FaturaFilter
                    clients={filterClientList}
                    onApply={handleApplyFilter}
                    onClear={handleClearFilter}
                />
            </Modal>
        </MainLayout>
    );
}