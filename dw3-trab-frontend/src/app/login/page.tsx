'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';
import { IoCubeOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(username, password);
    if (!result.success) setError(result.message || 'Ocorreu um erro.');
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <IoCubeOutline size={32} color="#238636" />
          <span>MeuSistema</span>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="username" className={styles.label}>Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <div className={styles.passwordWrapper}>
              <input type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
              <button type="button" className={styles.togglePassword} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>
          <div className={styles.optionsRow}>
            <a href="#" className={styles.forgotPassword}>Esqueceu sua senha?</a>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className={styles.signupLink}>
          Não tem uma conta? <a href="#">Crie uma agora</a>
        </div>
      </div>
    </div>
  );
}