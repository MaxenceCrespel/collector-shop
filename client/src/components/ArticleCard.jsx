import React from 'react';
import { IconTag } from './Icons';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function ArticleCard({ article, inCart, onAddToCart }) {
  return (
    <div className="card">
      <div className="card-image-placeholder">
        <span className="card-category-icon">{getCategoryEmoji(article.category)}</span>
      </div>
      <div className="card-body">
        <span className="category-badge">
          <IconTag /> {article.category || 'Divers'}
        </span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">{article.description}</p>
        <div className="card-footer">
          <div>
            <span className="card-price">{parseFloat(article.price).toLocaleString('fr-FR')} €</span>
            <span className="card-seller">par {article.seller || 'Particulier'}</span>
          </div>
          <button
            className={`btn-cart ${inCart ? 'btn-cart--added' : ''}`}
            onClick={() => onAddToCart(article)}
            disabled={inCart}
          >
            {inCart ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}