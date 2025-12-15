import React from 'react';

interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<Props> = ({ theme, onToggle }) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      title={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
