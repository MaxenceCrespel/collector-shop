import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Utilisation d'un chemin relatif pour que Docker serve correctement le front et le back sur le même port
    axios.get('/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error("Erreur de récupération", err));
  }, []);

  return (
    <div className="App">
      <h1>Collector.shop — Catalogue des Collectionneurs</h1>
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