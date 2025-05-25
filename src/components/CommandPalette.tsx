
import React, { useState, useEffect, useRef } from 'react';
import { Command } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            Math.min(prev + 1, filteredCommands.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-lg mx-4 bg-horizon-dark border border-white/20 rounded-lg shadow-2xl animate-scale-in">
        {/* Search Input */}
        <div className="p-4 border-b border-white/10">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar ação..."
            className="w-full bg-transparent text-white placeholder-horizon-text-secondary outline-none text-lg"
          />
        </div>

        {/* Commands */}
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-4 text-center text-horizon-text-secondary">
              Nenhum comando encontrado
            </div>
          ) : (
            Object.entries(groupedCommands).map(([group, groupCommands]) => (
              <div key={group}>
                <div className="px-4 py-2 metadata text-horizon-text-secondary">
                  {group}
                </div>
                {groupCommands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors duration-150 ${
                        globalIndex === selectedIndex ? 'bg-horizon-accent/20 text-horizon-accent' : 'text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{command.title}</div>
                          <div className="text-sm text-horizon-text-secondary">
                            {command.description}
                          </div>
                        </div>
                        {command.shortcut && (
                          <div className="text-xs bg-white/10 px-2 py-1 rounded">
                            {command.shortcut}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
