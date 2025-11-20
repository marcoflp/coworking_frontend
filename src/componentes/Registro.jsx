import React, { useState } from 'react';
import { useAuth } from '../contextos/AuthContext';

export default function Registro({ alternarModo }) {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  const { registrar } = useAuth();

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso(false);

    if (dados.senha !== dados.confirmarSenha) {
      setErro('Senhas não coincidem');
      setCarregando(false);
      return;
    }

    const { confirmarSenha, ...dadosRegistro } = dados;
    const resultado = await registrar(dadosRegistro);
    
    if (resultado.sucesso) {
      setSucesso(true);
      setTimeout(() => alternarModo(), 2000);
    } else {
      setErro(resultado.erro);
    }
    
    setCarregando(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Registrar</h2>
        
        {erro && <div className="erro">{erro}</div>}
        {sucesso && <div className="sucesso">Usuário registrado! Redirecionando...</div>}
        
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={dados.nome}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={dados.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={dados.senha}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar senha"
          value={dados.confirmarSenha}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={carregando}>
          {carregando ? 'Registrando...' : 'Registrar'}
        </button>
        
        <p>
          Já tem conta? 
          <button type="button" onClick={alternarModo} className="link-button">
            Fazer login
          </button>
        </p>
      </form>
    </div>
  );
}