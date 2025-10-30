import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../servicos/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenSalvo}`;
    }
    setCarregando(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/usuarios/login', { email, senha });
      const { token: novoToken, usuario: novoUsuario } = response.data;
      
      setToken(novoToken);
      setUsuario(novoUsuario);
      
      localStorage.setItem('token', novoToken);
      localStorage.setItem('usuario', JSON.stringify(novoUsuario));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${novoToken}`;
      
      return { sucesso: true };
    } catch (error) {
      return { 
        sucesso: false, 
        erro: error.response?.data?.erro || 'Erro ao fazer login' 
      };
    }
  };

  const registrar = async (dadosUsuario) => {
    try {
      await api.post('/usuarios/registrar', dadosUsuario);
      return { sucesso: true };
    } catch (error) {
      return { 
        sucesso: false, 
        erro: error.response?.data?.erro || 'Erro ao registrar usuário' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete api.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    return usuario?.tipo === 'admin';
  };

  const isAuthenticated = () => {
    return !!token && !!usuario;
  };

  const value = {
    usuario,
    token,
    carregando,
    login,
    registrar,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};