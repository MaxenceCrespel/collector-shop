import React from 'react';
import { IconTag } from './Icons';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function OwnArticles({ articles }) {
    if (articles.length === 0) return null;

    return (
        <div className="own-articles-section">
            <h2 className="section-title">Mes annonces en ligne</h2>
            <div className="grid">
                {articles.map(article => (
                    <div key={article.id} className="card card--own">
                        <div className="card-image-placeholder">
                            <span className="card-category-icon">{getCategoryEmoji(article.category)}</span>
                        </div>
                        <div className="card-body">
                            <span className="category-badge"><IconTag /> {article.category || 'Divers'}</span>
                            <h3 className="card-title">{article.title}</h3>
                            <p className="card-description">{article.description}</p>
                            <div className="card-footer">
                                <div>
                                    <span className="card-price">{parseFloat(article.price).toLocaleString('fr-FR')} €</span>
                                    <span className="card-seller">Votre annonce</span>
                                </div>
                                <span className="badge-own">En ligne</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
