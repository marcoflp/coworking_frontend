import React from 'react';
import Usuarios from './componentes/Usuarios';
import Salas from './componentes/Salas';
import Reservas from './componentes/Reservas';

export default function App() {
  const [pagina, setPagina] = React.useState('salas');

  return (
    <div className="app">
      <header>
        <h1>Sistema de Reservas Coworking</h1>
        <nav>
          <button onClick={() => setPagina('salas')}>Salas</button>
          <button onClick={() => setPagina('usuarios')}>Usuários</button>
          <button onClick={() => setPagina('reservas')}>Reservas</button>
        </nav>
      </header>
      <main>
        {pagina === 'salas' && <Salas />}
        {pagina === 'usuarios' && <Usuarios />}
        {pagina === 'reservas' && <Reservas />}
      </main>
    </div>
  );
}
