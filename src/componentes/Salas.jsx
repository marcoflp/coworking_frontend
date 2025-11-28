import React, { useEffect, useState } from 'react';
import { api } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';
import Modal from './Modal';

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', capacidade: 1, localizacao: '', recursos: '' });
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const { isAdmin } = useAuth();

  async function carregar() {
    try {
      const response = await api.get('/salas');
      setSalas(response.data);
    } catch (err) {
      setErro('Erro ao carregar salas');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    try {
      if (formulario.id) {
        await api.patch(`/salas/${formulario.id}`, formulario);
      } else {
        await api.post('/salas', formulario);
      }
      setFormulario({ nome: '', capacidade: 1, localizacao: '', recursos: '' });
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Erro ao salvar sala');
    }
  }

  function abrirModal(sala = null) {
    setFormulario(sala || { nome: '', capacidade: 1, localizacao: '', recursos: '' });
    setErro(null);
    setModalAberto(true);
  }

  async function remover(id) {
    if (!confirm('Deletar sala?')) return;
    try {
      await api.delete(`/salas/${id}`);
      carregar();
    } catch (error) {
      setErro('Erro ao deletar sala');
    }
  }

  return (
    <div>
      <h2>Salas</h2>
      <button className="btn-criar" onClick={() => abrirModal()}>+ Nova Sala</button>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Capacidade</th>
            <th>Localização</th>
            <th>Recursos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nome}</td>
              <td>{s.capacidade}</td>
              <td>{s.localizacao}</td>
              <td>{s.recursos}</td>
              <td>
                <button onClick={() => abrirModal(s)}>Editar</button>
                {isAdmin() && (
                  <button onClick={() => remover(s.id)}>Deletar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        aberto={modalAberto} 
        fechar={() => setModalAberto(false)}
        titulo={formulario.id ? 'Editar Sala' : 'Nova Sala'}
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
            type="number"
            placeholder="Capacidade"
            value={formulario.capacidade}
            onChange={e => setFormulario({ ...formulario, capacidade: parseInt(e.target.value || 1) })}
            required
          />
          <input
            placeholder="Localização"
            value={formulario.localizacao}
            onChange={e => setFormulario({ ...formulario, localizacao: e.target.value })}
          />
          <input
            placeholder="Recursos (separados por vírgula)"
            value={formulario.recursos}
            onChange={e => setFormulario({ ...formulario, recursos: e.target.value })}
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
