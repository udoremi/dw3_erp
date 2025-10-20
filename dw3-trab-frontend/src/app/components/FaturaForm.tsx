'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from '../../app/clientes/clientes.module.css';

interface FaturaData {
    id?: number;
    id_fatura?: number;
    id_cliente: number | string;
    data_emissao: string;
    data_vencimento: string;
    valor_total: number | string;
    status: string;
}

interface ClientForSelect {
    id_cliente: number;
    nome: string;
}

interface FaturaFormProps {
    onSave: (faturaData: Partial<FaturaData>) => void;
    onCancel: () => void;
    initialData?: Partial<FaturaData> | null;
    errorMessage?: string | null;
}

export default function FaturaForm({ onSave, onCancel, initialData, errorMessage }: FaturaFormProps) {
    const [id_cliente, setClienteId] = useState<number | string>('');
    const [data_emissao, setDataEmissao] = useState('');
    const [data_vencimento, setDataVencimento] = useState('');
    const [valor_total, setValorTotal] = useState<number | string>('');
    const [status, setStatus] = useState('Pendente');

    const [clients, setClients] = useState<ClientForSelect[]>([]);

    useEffect(() => {
        const fetchClientsForSelect = async () => {
            try {
                const response = await api.get('/getAllClientes');
                if (response.data && response.data.registro) {
                    setClients(response.data.registro);
                }
            } catch (error) {
                console.error("Erro ao buscar clientes para o formulário:", error);
            }
        };
        fetchClientsForSelect();
    }, []);

    useEffect(() => {
        if (initialData) {
            setClienteId(initialData.id_cliente || '');
            setDataEmissao(initialData.data_emissao ? new Date(initialData.data_emissao).toISOString().split('T')[0] : '');
            setDataVencimento(initialData.data_vencimento ? new Date(initialData.data_vencimento).toISOString().split('T')[0] : '');
            setValorTotal(initialData.valor_total || '');
            setStatus(initialData.status || 'Pendente');
        } else {
            setClienteId(''); setDataEmissao(''); setDataVencimento('');
            setValorTotal(''); setStatus('Pendente');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const faturaData = { id_cliente, data_emissao, data_vencimento, valor_total, status };
        onSave(faturaData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="cliente">Cliente *</label>
                <select id="cliente" value={id_cliente} onChange={(e) => setClienteId(e.target.value)} className={styles.input} required>
                    <option value="" disabled>Selecione um cliente</option>
                    {clients.map(client => (
                        <option key={client.id_cliente} value={client.id_cliente}>{client.nome}</option>
                    ))}
                </select>
            </div>
             <div className={styles.formGroup}>
                <label htmlFor="valorTotal">Valor Total (R$) *</label>
                <input type="number" step="0.01" id="valorTotal" value={valor_total} onChange={(e) => setValorTotal(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="data_emissao">Data de Emissão *</label>
                <input type="date" id="data_emissao" value={data_emissao} onChange={(e) => setDataEmissao(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="data_vencimento">Data de Vencimento *</label>
                <input type="date" id="data_vencimento" value={data_vencimento} onChange={(e) => setDataVencimento(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="status">Status *</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={styles.input} required>
                    <option value="Pendente">Pendente</option>
                    <option value="Paga">Paga</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>Cancelar</button>
                <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Salvar Fatura</button>
            </div>
            {errorMessage && (<div className={styles.formError}>{errorMessage}</div>)}
        </form>
    );
}