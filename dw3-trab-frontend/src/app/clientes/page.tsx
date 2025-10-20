'use client';

import { useState, useEffect } from "react";
import MainLayout from "@/app/components/MainLayout";
import Modal from "@/app/components/Modal";
import ClientForm from "@/app/components/ClientForm";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from './clientes.module.css';
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import api from "../../../services/api";

const formatCpfCnpj = (value: string) => {
    if (!value) return '';
    const cnpjCpf = value.replace(/\D/g, '');
  
    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } 
  
    return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const translateBackendError = (errorMessage: string): string => {
    if (errorMessage.includes('Chave (cpf_cnpj)')) {
        return 'O CPF/CNPJ informado já está cadastrado no sistema.';
    }
    if (errorMessage.includes('Chave (email)')) {
        return 'O Email informado já está cadastrado no sistema.';
    }

    return 'Ocorreu um erro ao salvar. Verifique os dados e tente novamente.';
};


interface ClientData {
    id: number;
    nome: string;
    cpf_cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    ativo: boolean;
}

export default function ClientesPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [clients, setClients] = useState<ClientData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Partial<ClientData> | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/getAllClientes');
            if (response.data && Array.isArray(response.data.registro)) {
                const clientsData = response.data.registro.map((c: any) => ({
                    ...c,
                    id: c.id_cliente,
                }));
                setClients(clientsData);
            } else {
                setClients([]);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
        if (isAuthenticated) {
            fetchClients();
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSaveClient = async (clientData: Partial<ClientData>) => {
        setFormError(null);
        try {
            const payload = {
                nome: clientData.nome,
                cpf_cnpj: clientData.cpf_cnpj,
                endereco: clientData.endereco,
                telefone: clientData.telefone,
                email: clientData.email,
                ativo: clientData.ativo,
            };

            let response;
            if (editingClient?.id) {
                response = await api.post('/updateClientes', { ...payload, id_cliente: editingClient.id });
            } else {
                response = await api.post('/insertClientes', payload);
            }

            if (response.data && response.data.linhasAfetadas === -1) {
                throw new Error(response.data.status);
            }
            
            alert(editingClient?.id ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
            setIsFormModalOpen(false);
            setEditingClient(null);
            await fetchClients();

        } catch (error: any) {
            const friendlyErrorMessage = translateBackendError(error.message);
            setFormError(friendlyErrorMessage);
        }
    };

    const handleDeleteClick = (id: number) => {
        setClientToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.post('/deleteClientes', { id_cliente: clientToDelete });
            alert(`Cliente foi excluído com sucesso!`);
            setIsConfirmModalOpen(false);
            setClientToDelete(null);
            await fetchClients();
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            alert("Não foi possível excluir o cliente.");
        }
    };

    const handleEdit = (client: ClientData) => {
        setFormError(null);
        setEditingClient(client);
        setIsFormModalOpen(true);
    };

    const handleAddNew = () => {
        setFormError(null);
        setEditingClient(null);
        setIsFormModalOpen(true);
    };
    
    const handleCloseFormModal = () => {
        setFormError(null);
        setIsFormModalOpen(false);
        setEditingClient(null);
    }
    
    if (authLoading) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>Verificando autenticação...</div>;

    return (
        <MainLayout>
            <div className={styles.header}>
                <h1>Gestão de Clientes</h1>
                <button onClick={handleAddNew} className={styles.addButton}><IoAdd size={20} /><span>Novo Cliente</span></button>
            </div>

            {isLoading ? (
                <div style={{ color: 'white', textAlign: 'center' }}>Carregando clientes...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF/CNPJ</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length > 0 ? clients.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nome}</td>
                                    <td>{formatCpfCnpj(cliente.cpf_cnpj)}</td>
                                    <td>{cliente.email}</td>
                                    <td>
                                        <span className={cliente.ativo ? styles.statusAtivo : styles.statusInativo}>
                                            {cliente.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleEdit(cliente)} className={`${styles.actionButton} ${styles.editButton}`}><IoPencil /></button>
                                        <button onClick={() => handleDeleteClick(cliente.id!)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>Nenhum cliente encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
                <ClientForm 
                    onSave={handleSaveClient}
                    onCancel={handleCloseFormModal}
                    initialData={editingClient as ClientData | null}
                    errorMessage={formError}
                />
            </Modal>

            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message="Você tem certeza que deseja excluir este cliente?"/>
        </MainLayout>
    );
}