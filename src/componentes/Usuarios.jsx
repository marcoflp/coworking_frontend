import React, { useEffect, useState } from 'react';
import { api } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';
import Modal from './Modal';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', email: '', telefone: '', senha: '' });
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const { isAdmin, usuario } = useAuth();

  async function carregar() {
    try {
      console.log('🔄 Recarregando lista de usuários...');
      setCarregando(true);
      if (isAdmin()) {
        console.log('👑 Admin: buscando todos os usuários');
        const response = await api.get('/usuarios');
        console.log('📊 Dados recebidos:', response.data);
        setUsuarios(response.data);
      } else {
        console.log('👤 Usuário comum: usando dados do contexto');
        setUsuarios([usuario]);
      }
      setErro(null);
      console.log('✅ Lista atualizada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
      setErro('Erro ao carregar usuários: ' + (error.response?.data?.erro || error.message));
      if (!isAdmin() && usuario && usuario.id) {
        console.log('🔄 Fallback: mostrando dados do contexto');
        setUsuarios([usuario]);
      } else {
        setUsuarios([]);
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
      const dados = {
        nome: formulario.nome,
        email: formulario.email,
        telefone: formulario.telefone
      };
      
      if (!formulario.id) {
        dados.senha = formulario.senha;
      } else if (formulario.senha) {
        dados.senha = formulario.senha;
      }
      
      console.log('🔄 Enviando dados:', dados);
      console.log('📍 URL:', formulario.id ? `/usuarios/${formulario.id}` : '/usuarios');
      console.log('🔧 Método:', formulario.id ? 'PATCH' : 'POST');
      
      let response;
      if (formulario.id) {
        response = await api.patch(`/usuarios/${formulario.id}`, dados);
      } else {
        response = await api.post('/usuarios', dados);
      }
      
      console.log('✅ Resposta da API:', response.status, response.data);
      
      setFormulario({ nome: '', email: '', telefone: '', senha: '' });
      setModalAberto(false);
      carregar();
    } catch (err) {
      console.error('❌ Erro na requisição:', err);
      console.error('📊 Status:', err.response?.status);
      console.error('📝 Dados do erro:', err.response?.data);
      setErro(err.response?.data?.erro || err.message);
    }
  }

  function abrirModal(usuarioParam = null) {
    if (usuarioParam) {
      setFormulario({
        id: usuarioParam.id,
        nome: usuarioParam.nome || '',
        email: usuarioParam.email || '',
        telefone: usuarioParam.telefone || '',
        senha: ''
      });
    } else {
      setFormulario({ nome: '', email: '', telefone: '', senha: '' });
    }
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
      
      {isAdmin() && (
        <button className="btn-criar" onClick={() => abrirModal()}>+ Novo Usuário</button>
      )}
      
      {!isAdmin() && (
        <>
          <p><strong>Seus dados:</strong></p>
          <button className="btn-criar" onClick={() => abrirModal(usuario)}>Editar Perfil</button>
        </>
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
            usuarios
              .filter(u => u && u.id)
              .map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone}</td>
                  <td>
                    {isAdmin() && (
                      <>
                        <button onClick={() => abrirModal(u)}>Editar</button>
                        <button onClick={() => remover(u.id)}>Deletar</button>
                      </>
                    )}
                    {!isAdmin() && <button onClick={() => abrirModal(u)}>Editar</button>}
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
          <input
            type="password"
            placeholder={formulario.id ? "Nova Senha (deixe vazio para não alterar)" : "Senha"}
            value={formulario.senha}
            onChange={e => setFormulario({ ...formulario, senha: e.target.value })}
            required={!formulario.id}
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
