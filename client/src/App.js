import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import LoginPage from './components/LoginPage';
import CartModal from './components/CartModal';
import ArticleCard from './components/ArticleCard';
import Header from './components/Header';
import Hero from './components/Hero';
import AddArticleForm from './components/AddArticleForm';
import OwnArticles from './components/OwnArticles';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || '');
  const [articles, setArticles] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });

  const isLoggedIn = !!token;

  useEffect(() => {
    axios.get('/articles').then(res => setArticles(res.data)).catch(console.error);
  }, []);

  const handleLogin = (newToken, username) => {
    setToken(newToken);
    setCurrentUser(username);
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setToken('');
    setCurrentUser('');
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const handleAddToCart = (article) => {
    if (cart.find(i => i.id === article.id)) return;
    setCart([...cart, article]);
    setShowCart(true);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/articles',
        { ...form, price: parseFloat(form.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArticles([res.data.article, ...articles]);
      setMessage('Article publié avec succès !');
      setForm({ title: '', description: '', price: '', category: '' });
      setShowAddForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Erreur lors de la publication.');
    }
  };

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];
  const ownArticles = articles.filter(a => a.seller === currentUser);
  const otherArticles = articles.filter(a => a.seller !== currentUser);
  const filtered = filterCategory
    ? otherArticles.filter(a => a.category === filterCategory)
    : otherArticles;

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        cartCount={cart.length}
        onCartOpen={() => setShowCart(true)}
        onLogout={handleLogout}
      />

      <Hero showAddForm={showAddForm} onToggleForm={() => setShowAddForm(!showAddForm)} />

      <main className="main">
        {showAddForm && (
          <AddArticleForm form={form} onChange={setForm} onSubmit={handleAddArticle} />
        )}

        {message && <div className="toast">{message}</div>}

        <div className="filters">
          <button className={`filter-chip ${!filterCategory ? 'filter-chip--active' : ''}`}
            onClick={() => setFilterCategory('')}>Tout</button>
          {categories.map(cat => (
            <button key={cat}
              className={`filter-chip ${filterCategory === cat ? 'filter-chip--active' : ''}`}
              onClick={() => setFilterCategory(cat)}>{cat}</button>
          ))}
        </div>

        <div className="grid">
          {filtered.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              inCart={!!cart.find(i => i.id === article.id)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <OwnArticles articles={ownArticles} />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="logo-text small">collector<span className="logo-dot">.shop</span></span>
          <p>POC — CESI Bloc de compétences "Mettre en production" · 2026</p>
          <div className="footer-links">
            <span>Mentions légales</span>
            <span>CGU</span>
            <span>Confidentialité</span>
          </div>
        </div>
      </footer>

      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={handleRemoveFromCart}
        />
      )}
    </div>
  );
}
