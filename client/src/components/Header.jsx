import React from 'react';
import { IconUser, IconCart } from './Icons';

export default function Header({ currentUser, cartCount, onCartOpen, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo-text">collector<span className="logo-dot">.shop</span></span>
        <nav className="header-nav">
          <span className="header-user"><IconUser /> {currentUser}</span>
          <button className="btn-cart-trigger" onClick={onCartOpen}>
            <IconCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn-outline" onClick={onLogout}>Déconnexion</button>
        </nav>
      </div>
    </header>
  );
}