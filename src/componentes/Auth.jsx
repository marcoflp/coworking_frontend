import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';

export default function Auth() {
  const [modoLogin, setModoLogin] = useState(true);

  const alternarModo = () => {
    setModoLogin(!modoLogin);
  };

  return (
    <div className="auth-page">
      {modoLogin ? (
        <Login alternarModo={alternarModo} />
      ) : (
        <Registro alternarModo={alternarModo} />
      )}
    </div>
  );
}