import React, { useEffect, useState } from 'react';
import { buscarJSON } from '../servicos/api';

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', capacidade: 1, localizacao: '', recursos: '' });
  const [erro, setErro] = useState(null);

  async function carregar() {
    try {
      const dados = await buscarJSON('/salas');
      console.log('Salas carregadas:', dados);
      setSalas(dados);
    } catch (err) {
      console.error('Erro ao carregar salas:', err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();
    setErro(null);
    try {
      const dados = {
        ...formulario,
        horario_inicio: new Date().toISOString(),
        horario_fim: new Date().toISOString()
      };
      await buscarJSON('/salas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      setFormulario({ nome: '', capacidade: 1, localizacao: '', recursos: '' });
      carregar();
    } catch (err) {
      console.error('Erro completo:', err);
      setErro(err.erro || err.message || 'Erro ao criar sala');
    }
  }

  async function atualizar(e) {
    e.preventDefault();
    setErro(null);
    try {
      await buscarJSON('/salas/' + formulario.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      setFormulario({ nome: '', capacidade: 1, localizacao: '', recursos: '' });
      carregar();
    } catch (err) {
      setErro(err.erro || err.message);
    }
  }

  function editar(sala) {
    setFormulario(sala);
  }

  async function remover(id) {
    if (!confirm('Deletar sala?')) return;
    await buscarJSON('/salas/' + id, { method: 'DELETE' });
    carregar();
  }

  return (
    <div>
      <h2>Salas</h2>
      {erro && <div className="erro">{erro}</div>}
      <form onSubmit={formulario.id ? atualizar : criar}>
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
        <button type="submit">{formulario.id ? 'Atualizar' : 'Criar'}</button>
        {formulario.id && (
          <button type="button" onClick={() => setFormulario({ nome: '', capacidade: 1, localizacao: '', recursos: '' })}>
            Cancelar
          </button>
        )}
      </form>
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
                <button onClick={() => editar(s)}>Editar</button>
                <button onClick={() => remover(s.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
