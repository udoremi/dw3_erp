'use client';

import { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import styles from '../../app/clientes/clientes.module.css';

interface ClientData {
    id?: number;
    id_cliente?: number;
    nome: string;
    cpf_cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    ativo: boolean;
}

interface ClientFormProps {
    onSave: (clientData: Partial<ClientData>) => void;
    onCancel: () => void;
    initialData?: Partial<ClientData> | null;
    errorMessage?: string | null;
}

export default function ClientForm({ onSave, onCancel, initialData, errorMessage }: ClientFormProps) {
    const [nome, setNome] = useState('');
    const [cpf_cnpj, setCpfCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (initialData) {
            setNome(initialData.nome || '');
            setCpfCnpj(initialData.cpf_cnpj || '');
            setEndereco(initialData.endereco || '');
            setTelefone(initialData.telefone || '');
            setEmail(initialData.email || '');
            setAtivo(initialData.ativo !== undefined ? initialData.ativo : true);
        } else {
            setNome(''); setCpfCnpj(''); setEndereco('');
            setTelefone(''); setEmail(''); setAtivo(true);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const unmaskedCpfCnpj = cpf_cnpj.replace(/[^\d]/g, '');
        const unmaskedTelefone = telefone.replace(/[^\d]/g, '');
        const clientData = { nome, cpf_cnpj: unmaskedCpfCnpj, endereco, telefone: unmaskedTelefone, email, ativo };
        onSave(clientData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="nome">Nome Completo *</label>
                <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className={styles.input} required maxLength={100} />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="cpf_cnpj">CPF/CNPJ *</label>
                <IMaskInput
                    mask="000.000.000-00"
                    id="cpf_cnpj"
                    value={cpf_cnpj}
                    onAccept={(value: any) => setCpfCnpj(value)}
                    className={styles.input}
                    placeholder="___.___.___-__"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} maxLength={100} />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone</label>
                <IMaskInput
                    mask="(00) 00000-0000"
                    id="telefone"
                    value={telefone}
                    onAccept={(value: any) => setTelefone(value)}
                    className={styles.input}
                    placeholder="(__) _____-____"
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="endereco">Endereço</label>
                <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className={styles.input} maxLength={255}/>
            </div>
            {/* <div className={styles.formGroup}>
                <label>Status</label>
                <div className={styles.toggleSwitch}>
                    <input type="checkbox" id="status" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                    <label htmlFor="status">Toggle Status</label>
                    <span>{ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
            </div> */}
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>Cancelar</button>
                <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Salvar</button>
            </div>

            {errorMessage && (
                <div className={styles.formError}>
                    {errorMessage}
                </div>
            )}
        </form>
    );
}