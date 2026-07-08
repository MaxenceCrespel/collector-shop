import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (mode === 'register') {
            if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
            if (password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères.');
        }
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/login' : '/register';
            const res = await axios.post(endpoint, { username, password });
            onLogin(res.data.token, res.data.username);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
        setUsername('');
        setPassword('');
        setConfirm('');
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <span className="logo-text">collector<span className="logo-dot">.shop</span></span>
                </div>
                <p className="login-subtitle">La marketplace des objets qui ont une histoire</p>
                <div className="login-tabs">
                    <button className={`login-tab ${mode === 'login' ? 'login-tab--active' : ''}`} onClick={() => switchMode('login')}>Connexion</button>
                    <button className={`login-tab ${mode === 'register' ? 'login-tab--active' : ''}`} onClick={() => switchMode('register')}>Inscription</button>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field-group">
                        <label>Identifiant</label>
                        <input type="text" placeholder="Votre identifiant" value={username}
                            onChange={e => setUsername(e.target.value)} required autoFocus />
                    </div>
                    <div className="field-group">
                        <label>Mot de passe</label>
                        <input type="password" placeholder={mode === 'register' ? 'Minimum 6 caractères' : 'Votre mot de passe'}
                            value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {mode === 'register' && (
                        <div className="field-group">
                            <label>Confirmer le mot de passe</label>
                            <input type="password" placeholder="Répétez votre mot de passe"
                                value={confirm} onChange={e => setConfirm(e.target.value)} required />
                        </div>
                    )}
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading
                            ? (mode === 'login' ? 'Connexion...' : 'Inscription...')
                            : (mode === 'login' ? 'Se connecter' : 'Créer mon compte')}
                    </button>
                </form>
                {mode === 'login' && <p className="login-hint">Démo : sneakerhead75 / collector2026</p>}
            </div>
        </div>
    );
}
