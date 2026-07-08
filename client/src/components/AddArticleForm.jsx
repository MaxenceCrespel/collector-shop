import React from 'react';

export default function AddArticleForm({ form, onChange, onSubmit }) {
    return (
        <div className="add-form-section">
            <h2>Déposer une annonce</h2>
            <form onSubmit={onSubmit} className="add-form">
                <div className="form-row">
                    <div className="field-group">
                        <label>Titre</label>
                        <input type="text" placeholder="Ex: Jordan 1 Retro 1985"
                            value={form.title} onChange={e => onChange({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="field-group">
                        <label>Catégorie</label>
                        <input type="text" placeholder="Ex: Baskets"
                            value={form.category} onChange={e => onChange({ ...form, category: e.target.value })} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="field-group">
                        <label htmlFor="article-condition">État de l'objet</label>
                        <select
                            value={form.condition || ''}
                            onChange={e => onChange({ ...form, condition: e.target.value })}
                            required
                        >
                            <option value="" disabled>Sélectionnez l'état...</option>
                            <option value="Neuf">Neuf</option>
                            <option value="Très bon état">Très bon état</option>
                            <option value="Usé">Usé</option>
                        </select>
                    </div>
                    <div className="field-group">
                        <label>Prix (€)</label>
                        <input type="number" step="0.01" placeholder="0.00"
                            value={form.price} onChange={e => onChange({ ...form, price: e.target.value })} required />
                    </div>
                </div>
                <div className="field-group">
                    <label>Description</label>
                    <textarea placeholder="Décrivez votre objet, son état, sa rareté..."
                        value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} required />
                </div>
                <div className="form-row">
                    <div className="field-group field-group--action">
                        <button type="submit" className="btn-primary">Publier l'annonce</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
