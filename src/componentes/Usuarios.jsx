import React, { useEffect, useState } from 'react';
import { buscarJSON } from '../servicos/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', email: '', telefone: '' });
  const [erro, setErro] = useState(null);

  async function carregar() {
    const dados = await buscarJSON('/usuarios');
    setUsuarios(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();
    setErro(null);
    try {
      await buscarJSON('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      setFormulario({ nome: '', email: '', telefone: '' });
      carregar();
    } catch (err) {
      setErro(err.erro || err.message);
    }
  }

  async function atualizar(e) {
    e.preventDefault();
    setErro(null);
    try {
      await buscarJSON('/usuarios/' + formulario.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      setFormulario({ nome: '', email: '', telefone: '' });
      carregar();
    } catch (err) {
      setErro(err.erro || err.message);
    }
  }

  function editar(usuario) {
    setFormulario(usuario);
  }

  async function remover(id) {
    if (!confirm('Deletar usuário?')) return;
    await buscarJSON('/usuarios/' + id, { method: 'DELETE' });
    carregar();
  }

  return (
    <div>
      <h2>Usuários</h2>
      {erro && <div className="erro">{erro}</div>}
      <form onSubmit={formulario.id ? atualizar : criar}>
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
        <button type="submit">{formulario.id ? 'Atualizar' : 'Criar'}</button>
        {formulario.id && (
          <button type="button" onClick={() => setFormulario({ nome: '', email: '', telefone: '' })}>
            Cancelar
          </button>
        )}
      </form>
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
                <button onClick={() => editar(u)}>Editar</button>
                <button onClick={() => remover(u.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
