
import React from 'react';
import { Command, Palette, Navigation, X } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 border-t border-white/10 text-center">
      <div className="text-xs text-horizon-text-secondary flex items-center justify-center gap-4">
        <span className="metadata">Atalhos:</span>
        <span className="flex items-center gap-1">
          <Command className="w-3 h-3" />
          / comando rápido
        </span>
        <span className="flex items-center gap-1">
          <Palette className="w-3 h-3" />
          ⌘K abre palette
        </span>
        <span className="flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          Tab navega
        </span>
        <span className="flex items-center gap-1">
          <X className="w-3 h-3" />
          Esc cancela
        </span>
      </div>
    </footer>
  );
};
