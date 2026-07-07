import React from 'react';

export default function Hero({ showAddForm, onToggleForm }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>Achetez et vendez des objets de collection</h1>
        <p>Rejoignez la communauté des collectionneurs passionnés</p>
        <button className="btn-primary hero-btn" onClick={onToggleForm}>
          {showAddForm ? 'Annuler' : '+ Déposer une annonce'}
        </button>
      </div>
    </section>
  );
}