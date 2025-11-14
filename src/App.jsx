import React from 'react';
import { AuthProvider, useAuth } from './contextos/AuthContext';
import Usuarios from './componentes/Usuarios';
import Salas from './componentes/Salas';
import Reservas from './componentes/Reservas';
import MeuPerfil from './componentes/MeuPerfil';
import Auth from './componentes/Auth';

function AppContent() {
  const [pagina, setPagina] = React.useState('salas');
  const { usuario, logout, isAuthenticated, carregando, isAdmin } = useAuth();

  if (carregando) {
    return <div className="loading">Carregando...</div>;
  }

  if (!isAuthenticated()) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header>
        <h1>Sistema de Reservas Coworking</h1>
        <div className="user-info">
          <span>Olá, {usuario.nome} {isAdmin() && '(Admin)'}</span>
          <button onClick={logout} className="logout-btn">Sair</button>
        </div>
        <nav>
          <button onClick={() => setPagina('salas')}>Salas</button>
          <button onClick={() => setPagina('usuarios')}>Usuários</button>
          <button onClick={() => setPagina('reservas')}>Reservas</button>
          <button onClick={() => setPagina('perfil')}>Meu Perfil</button>
        </nav>
      </header>
      <main>
        {pagina === 'salas' && <Salas />}
        {pagina === 'usuarios' && <Usuarios />}
        {pagina === 'reservas' && <Reservas />}
        {pagina === 'perfil' && <MeuPerfil />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
