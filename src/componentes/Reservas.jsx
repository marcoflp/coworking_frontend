import React, { useEffect, useState } from 'react';
import { api } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';
import Modal from './Modal';

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [salas, setSalas] = useState([]);
  const [formulario, setFormulario] = useState({
    usuario_id: '',
    sala_id: '',
    horario_inicio: '',
    horario_fim: '',
    proposito: ''
  });
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const { isAdmin, usuario } = useAuth();

  async function carregar() {
    try {
      const [reservasRes, usuariosRes, salasRes] = await Promise.all([
        api.get('/reservas'),
        api.get('/usuarios'),
        api.get('/salas')
      ]);
      setReservas(reservasRes.data);
      setUsuarios(usuariosRes.data);
      setSalas(salasRes.data);
    } catch (error) {
      setErro('Erro ao carregar dados');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    try {
      const dados = {
        usuario_id: parseInt(formulario.usuario_id),
        sala_id: parseInt(formulario.sala_id),
        horario_inicio: new Date(formulario.horario_inicio).toISOString(),
        horario_fim: new Date(formulario.horario_fim).toISOString(),
        proposito: formulario.proposito
      };
      
      if (formulario.id) {
        await api.patch(`/reservas/${formulario.id}`, dados);
      } else {
        await api.post('/reservas', dados);
      }
      setFormulario({ usuario_id: '', sala_id: '', horario_inicio: '', horario_fim: '', proposito: '' });
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || err.message);
    }
  }

  function abrirModal(reserva = null) {
    if (reserva) {
      setFormulario({
        id: reserva.id,
        usuario_id: reserva.usuario_id,
        sala_id: reserva.sala_id,
        horario_inicio: reserva.horario_inicio.slice(0, 16),
        horario_fim: reserva.horario_fim.slice(0, 16),
        proposito: reserva.proposito || ''
      });
    } else {
      setFormulario({ usuario_id: '', sala_id: '', horario_inicio: '', horario_fim: '', proposito: '' });
    }
    setErro(null);
    setModalAberto(true);
  }

  async function remover(id) {
    if (!confirm('Deletar reserva?')) return;
    try {
      await api.delete(`/reservas/${id}`);
      carregar();
    } catch (error) {
      setErro('Erro ao deletar reserva');
    }
  }

  return (
    <div>
      <h2>Reservas</h2>
      <button className="btn-criar" onClick={() => abrirModal()}>+ Nova Reserva</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Sala</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Propósito</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuario ? r.usuario.nome : r.usuario_id}</td>
              <td>{r.sala ? r.sala.nome : r.sala_id}</td>
              <td>{new Date(r.horario_inicio).toLocaleString()}</td>
              <td>{new Date(r.horario_fim).toLocaleString()}</td>
              <td>{r.proposito}</td>
              <td>
                {(isAdmin() || r.usuario_id === usuario.id) && (
                  <button onClick={() => abrirModal(r)}>Editar</button>
                )}
                {isAdmin() && (
                  <button onClick={() => remover(r.id)}>Deletar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        aberto={modalAberto} 
        fechar={() => setModalAberto(false)}
        titulo={formulario.id ? 'Editar Reserva' : 'Nova Reserva'}
      >
        {erro && <div className="erro">{erro}</div>}
        <form onSubmit={salvar}>
          <select
            value={formulario.usuario_id}
            onChange={e => setFormulario({ ...formulario, usuario_id: e.target.value })}
            required
          >
            <option value="">Selecione o usuário</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
          <select
            value={formulario.sala_id}
            onChange={e => setFormulario({ ...formulario, sala_id: e.target.value })}
            required
          >
            <option value="">Selecione a sala</option>
            {salas.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={formulario.horario_inicio}
            onChange={e => setFormulario({ ...formulario, horario_inicio: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={formulario.horario_fim}
            onChange={e => setFormulario({ ...formulario, horario_fim: e.target.value })}
            required
          />
          <input
            placeholder="Propósito"
            value={formulario.proposito}
            onChange={e => setFormulario({ ...formulario, proposito: e.target.value })}
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
