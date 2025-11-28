import React, { useEffect, useState } from 'react';
import { api } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';
import Modal from './Modal';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', email: '', telefone: '' });
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const { isAdmin, usuario } = useAuth();

  async function carregar() {
    try {
      setCarregando(true);
      if (isAdmin()) {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } else {
        setUsuarios([usuario]);
      }
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar usuários: ' + (error.response?.data?.erro || error.message));
      if (!isAdmin() && usuario) {
        setUsuarios([usuario]);
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (usuario) {
      carregar();
    }
  }, [usuario, isAdmin]);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    try {
      if (formulario.id) {
        await api.patch(`/usuarios/${formulario.id}`, formulario);
      } else {
        await api.post('/usuarios', formulario);
      }
      setFormulario({ nome: '', email: '', telefone: '' });
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || err.message);
    }
  }

  function abrirModal(usuario = null) {
    setFormulario(usuario || { nome: '', email: '', telefone: '' });
    setErro(null);
    setModalAberto(true);
  }

  async function remover(id) {
    if (!confirm('Deletar usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregar();
    } catch (error) {
      setErro('Erro ao deletar usuário');
    }
  }

  if (carregando) {
    return (
      <div>
        <h2>Usuários</h2>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div>
        <h2>Usuários</h2>
        <p>Erro: Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Usuários</h2>
      
      {erro && <div className="erro">{erro}</div>}
      
      <button className="btn-criar" onClick={() => abrirModal()}>+ Novo Usuário</button>
      
      {!isAdmin() && (
        <p><strong>Seus dados:</strong></p>
      )}
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="5">Nenhum usuário encontrado</td>
            </tr>
          ) : (
            usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.telefone}</td>
                <td>
                  <button onClick={() => abrirModal(u)}>Editar</button>
                  {isAdmin() && (
                    <button onClick={() => remover(u.id)}>Deletar</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal 
        aberto={modalAberto} 
        fechar={() => setModalAberto(false)}
        titulo={formulario.id ? 'Editar Usuário' : 'Novo Usuário'}
      >
        {erro && <div className="erro">{erro}</div>}
        <form onSubmit={salvar}>
          <input
            placeholder="Nome"
            value={formulario.nome}
            onChange={e => setFormulario({ ...formulario, nome: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={formulario.email}
            onChange={e => setFormulario({ ...formulario, email: e.target.value })}
            required
          />
          <input
            placeholder="Telefone"
            value={formulario.telefone}
            onChange={e => setFormulario({ ...formulario, telefone: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit" className="btn-submit">{formulario.id ? 'Atualizar' : 'Criar'}</button>
            <button type="button" className="btn-cancel" onClick={() => setModalAberto(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
