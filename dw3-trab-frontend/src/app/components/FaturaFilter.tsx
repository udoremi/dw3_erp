'use client';

import { useState } from 'react';
import styles from '../faturas/faturas.module.css';

interface ClientForSelect {
    id_cliente: number;
    nome: string;
}

interface FaturaFilterProps {
    clients: ClientForSelect[];
    onApply: (clientId: number | null) => void;
    onClear: () => void;
}

export default function FaturaFilter({ clients, onApply, onClear }: FaturaFilterProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleApply = () => {
        onApply(selectedId);
    };

    const handleClear = () => {
        setSelectedId(null);
        onClear();
    };

    return (
        <div className={styles.filterForm}>
            <div className={styles.formGroup}>
                <label htmlFor="clienteFilter">Filtrar por Cliente</label>
                <select 
                    id="clienteFilter" 
                    value={selectedId || ''} 
                    onChange={(e) => setSelectedId(Number(e.target.value))} 
                    className={styles.input}
                >
                    <option value="" disabled>Selecione um cliente</option>
                    {clients.map(client => (
                        <option key={client.id_cliente} value={client.id_cliente}>
                            {client.nome}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={handleClear} className={`${styles.button} ${styles.cancelButton}`}>
                    Limpar Filtro
                </button>
                <button type="button" onClick={handleApply} className={`${styles.button} ${styles.saveButton}`}>
                    Aplicar Filtro
                </button>
            </div>
        </div>
    );
}