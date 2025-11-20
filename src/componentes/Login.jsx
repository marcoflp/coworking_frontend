import React, { useState } from 'react';
import { useAuth } from '../contextos/AuthContext';

export default function Login({ alternarModo }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const resultado = await login(email, senha);
    
    if (!resultado.sucesso) {
      setErro(resultado.erro);
    }
    
    setCarregando(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        
        {erro && <div className="erro">{erro}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        
        <p>
          Não tem conta? 
          <button type="button" onClick={alternarModo} className="link-button">
            Registrar-se
          </button>
        </p>
      </form>
    </div>
  );
}