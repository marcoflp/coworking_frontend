import React from 'react';

export default function Modal({ aberto, fechar, titulo, children }) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titulo}</h3>
          <button className="modal-close" onClick={fechar}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
