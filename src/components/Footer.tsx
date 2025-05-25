
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 border-t border-white/10 text-center">
      <div className="text-xs text-horizon-text-secondary">
        <span className="metadata">Atalhos:</span>
        <span className="mx-2">/ comando rápido</span>
        <span className="mx-2">• ⌘K abre palette</span>
        <span className="mx-2">• Tab navega</span>
        <span className="mx-2">• Esc cancela</span>
      </div>
    </footer>
  );
};
