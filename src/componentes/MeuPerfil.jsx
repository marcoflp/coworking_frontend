import React, { useState, useEffect } from 'react';
import { useAuth } from '../contextos/AuthContext';
import { api } from '../servicos/api';

export default function MeuPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormulario({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || ''
      });
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await api.patch(`/usuarios/${usuario.id}`, formulario);
      
      // Atualizar contexto e localStorage
      atualizarUsuario(formulario);
      
      setSucesso('Dados atualizados com sucesso!');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao atualizar dados');
    }
  };

  const cancelar = () => {
    setFormulario({
      nome: usuario.nome || '',
      email: usuario.email || '',
      telefone: usuario.telefone || ''
    });

    setErro('');
    setSucesso('');
  };

  if (!usuario) return <div>Carregando...</div>;

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>
      
      <div className="perfil-card">
        <div className="perfil-info">
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Tipo:</strong> {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
        </div>

        {erro && <div className="erro">{erro}</div>}
        {sucesso && <div className="sucesso">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={formulario.nome}
              onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formulario.email}
              onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone:</label>
            <input
              type="text"
              value={formulario.telefone}
              onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="perfil-actions">
            <button type="submit" className="btn-salvar">💾 Salvar Alterações</button>
            <button type="button" onClick={cancelar} className="btn-cancelar">🔄 Resetar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
