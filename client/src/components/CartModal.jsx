import React, { useEffect } from 'react';
import { IconClose } from './Icons';

export default function CartModal({ cart, onClose, onRemove }) {
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Mon panier</h2>
                    <button className="btn-icon" onClick={onClose}><IconClose /></button>
                </div>
                {cart.length === 0 ? (
                    <div className="cart-empty"><p>Votre panier est vide.</p></div>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cart.map(item => (
                                <li key={item.id} className="cart-item">
                                    <div className="cart-item-info">
                                        <span className="cart-item-title">{item.title}</span>
                                        <span className="cart-item-seller">Vendu par {item.seller || 'Particulier'}</span>
                                    </div>
                                    <div className="cart-item-right">
                                        <span className="cart-item-price">{parseFloat(item.price).toLocaleString('fr-FR')} €</span>
                                        <button className="btn-remove" onClick={() => onRemove(item.id)}>Retirer</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total</span>
                                <strong>{total.toLocaleString('fr-FR')} €</strong>
                            </div>
                            <button className="btn-primary">Passer commande</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
