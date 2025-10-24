import React, { useEffect, useState } from 'react';
import { buscarJSON } from '../servicos/api';
import Modal from './Modal';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', email: '', telefone: '' });
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregar() {
    const dados = await buscarJSON('/usuarios');
    setUsuarios(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    try {
      if (formulario.id) {
        await buscarJSON('/usuarios/' + formulario.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
      } else {
        await buscarJSON('/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
      }
      setFormulario({ nome: '', email: '', telefone: '' });
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err.erro || err.message);
    }
  }

  function abrirModal(usuario = null) {
    setFormulario(usuario || { nome: '', email: '', telefone: '' });
    setErro(null);
    setModalAberto(true);
  }

  async function remover(id) {
    if (!confirm('Deletar usuário?')) return;
    await buscarJSON('/usuarios/' + id, { method: 'DELETE' });
    carregar();
  }

  return (
    <div>
      <h2>Usuários</h2>
      <button className="btn-criar" onClick={() => abrirModal()}>+ Novo Usuário</button>
      
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
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.telefone}</td>
              <td>
                <button onClick={() => abrirModal(u)}>Editar</button>
                <button onClick={() => remover(u.id)}>Deletar</button>
              </td>
            </tr>
          ))}
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
