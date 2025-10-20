'use client';

import styles from './ConfirmationModal.module.css';
import Modal from './Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className={styles.container}>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className={`${styles.button} ${styles.confirmButton}`}>
                        Confirmar Exclusão
                    </button>
                </div>
            </div>
        </Modal>
    );
}