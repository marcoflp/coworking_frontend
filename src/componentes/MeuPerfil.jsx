import React, { useState } from 'react';
import { useAuth } from '../contextos/AuthContext';
import { api } from '../servicos/api';

export default function MeuPerfil() {
  const { usuario, logout } = useAuth();
  const [formulario, setFormulario] = useState({
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone || ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [editando, setEditando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const response = await api.patch(`/usuarios/${usuario.id}`, formulario);
      
      // Atualizar localStorage
      const usuarioAtualizado = { ...usuario, ...formulario };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      
      setSucesso('Dados atualizados com sucesso!');
      setEditando(false);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao atualizar dados');
    }
  };

  const cancelar = () => {
    setFormulario({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || ''
    });
    setEditando(false);
    setErro('');
    setSucesso('');
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>
      
      <div className="perfil-card">
        <div className="perfil-info">
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Tipo:</strong> {usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}</p>
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
              disabled={!editando}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formulario.email}
              onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              disabled={!editando}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone:</label>
            <input
              type="text"
              value={formulario.telefone}
              onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })}
              disabled={!editando}
            />
          </div>

          <div className="perfil-actions">
            {!editando ? (
              <button type="button" onClick={() => setEditando(true)} className="btn-editar">
                Editar Perfil
              </button>
            ) : (
              <>
                <button type="submit" className="btn-salvar">Salvar</button>
                <button type="button" onClick={cancelar} className="btn-cancelar">Cancelar</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
