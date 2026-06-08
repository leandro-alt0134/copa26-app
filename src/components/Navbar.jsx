import React from 'react';
import { NavLink } from 'react-router-dom';
import InstallPwaButton from './InstallPwaButton';

export default function Navbar() {
  return (
    <nav className="navbar py-3 mb-4">
      <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <img src="/assets/copa-2026-logo-white.svg" className="brand-logo" alt="Ícone da Copa do Mundo FIFA 2026" />
          <span className="navbar-brand text-white titulo mb-0">Copa do Mundo 2026</span>
        </div>
        <div className="nav-actions d-flex align-items-center gap-2 flex-wrap">
          <NavLink to="/" className={({ isActive }) => "nav-link-custom" + (isActive ? " active" : "")} end>
            Seleções
          </NavLink>
          <NavLink to="/grupos" className={({ isActive }) => "nav-link-custom" + (isActive ? " active" : "")}>
            Grupos e chaveamento
          </NavLink>
          <NavLink to="/confrontos" className={({ isActive }) => "nav-link-custom" + (isActive ? " active" : "")}>
            Confrontos
          </NavLink>
          <NavLink to="/palpites" className={({ isActive }) => "nav-link-custom" + (isActive ? " active" : "")}>
            Palpites
          </NavLink>
          <NavLink to="/minha-copa" className={({ isActive }) => "nav-link-custom" + (isActive ? " active" : "")}>
            🏆 Minha Copa
          </NavLink>
          <InstallPwaButton />
        </div>
      </div>
    </nav>
  );
}
