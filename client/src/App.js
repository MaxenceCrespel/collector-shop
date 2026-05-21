import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const fetchArticles = () => {
    axios.get('/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error("Erreur de récupération", err));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('/login', { username, password })
      .then(res => {
        const receivedToken = res.data.token;
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
        setShowLoginForm(false);
        setUsername('');
        setPassword('');
        setMessage("🔒 Connecté avec succès en Admin !");
      })
      .catch(err => {
        console.error(err);
        setMessage("❌ Identifiants incorrects.");
      });
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setMessage("👋 Déconnexion réussie.");
  };

  const handleAddArticle = (e) => {
    e.preventDefault();
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const newArticle = { title, description, price: parseFloat(price), category };

    axios.post('/articles', newArticle, config)
      .then(res => {
        setMessage("✅ Objet ajouté avec succès au catalogue !");
        fetchArticles();
        setTitle(''); setDescription(''); setPrice(''); setCategory('');
      })
      .catch(err => {
        console.error(err);
        setMessage("❌ Session expirée ou droits insuffisants.");
      });
  };

  return (
    <div className="App">
      <div className="role-banner">
        <span>Rôle actuel : <strong>{token ? "🔒 GESTIONNAIRE / ADMIN (JWT)" : "🌐 VISITEUR PUBLIC"}</strong></span>
        <div>
          {token ? (
            <button className="logout-btn" onClick={handleLogout}>Se déconnecter</button>
          ) : (
            <button className="login-btn" onClick={() => setShowLoginForm(!showLoginForm)}>
              {showLoginForm ? "Fermer" : "Espace Admin"}
            </button>
          )}
        </div>
      </div>

      {showLoginForm && !token && (
        <div className="login-section">
          <h2>Connexion Sécurisée</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Identifiant (admin)" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">S'authentifier</button>
          </form>
        </div>
      )}

      {message && <p className="form-message">{message}</p>}

      <h1>Collector.shop — Catalogue des Collectionneurs</h1>

      {token && (
        <div className="admin-section">
          <h2>Ajouter une nouvelle pépite au catalogue (Protégé par cryptographie)</h2>
          <form onSubmit={handleAddArticle}>
            <input type="text" placeholder="Nom de l'objet (ex: Vinyl Prince)" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="text" placeholder="Description de sa rareté" value={description} onChange={e => setDescription(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Prix en €" value={price} onChange={e => setPrice(e.target.value)} required />
            <input type="text" placeholder="Catégorie (ex: Musique)" value={category} onChange={e => setCategory(e.target.value)} required />
            <button type="submit">Publier sur le catalogue sécurisé</button>
          </form>
        </div>
      )}

      <div className="catalogue">
        {articles.length > 0 ? (
          articles.map(art => (
            <div key={art.id} className="card">
              <div>
                <span className="category-badge">{art.category || 'Collection'}</span>
                <h2>{art.title}</h2>
                <p>{art.description}</p>
              </div>
              <div className="price-tag">
                {art.price} €
              </div>
            </div>
          ))
        ) : (
          <p>Chargement des trésors en cours...</p>
        )}
      </div>
    </div>
  );
}

export default App;