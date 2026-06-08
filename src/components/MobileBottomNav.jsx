import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação móvel inferior">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>
        <span>🌎</span>
        <span>Seleções</span>
      </NavLink>
      <NavLink to="/grupos" className={({ isActive }) => isActive ? "active" : ""}>
        <span>🏆</span>
        <span>Grupos</span>
      </NavLink>
      <NavLink to="/confrontos" className={({ isActive }) => isActive ? "active" : ""}>
        <span>⚽</span>
        <span>Jogos</span>
      </NavLink>
      <NavLink to="/palpites" className={({ isActive }) => isActive ? "active" : ""}>
        <span>🎯</span>
        <span>Palpites</span>
      </NavLink>
      <NavLink to="/minha-copa" className={({ isActive }) => isActive ? "active" : ""}>
        <span>🏆</span>
        <span>Minha Copa</span>
      </NavLink>
    </nav>
  );
}
