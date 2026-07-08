import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('Collector.shop - Tests d\'Intégration Globaux (App.js)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  it('Scénario 1 : Connexion, consultation du catalogue et ajout au panier', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'mock-jwt-token', username: 'sneakerhead75' } });
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Super Nintendo', price: '120.00', category: 'Jeux Vidéo', seller: 'retro_passion', description: 'En boîte' },
        { id: 2, title: 'Figurine Batman', price: '45.00', category: 'Figurines', seller: 'sneakerhead75', description: 'Neuve' }
      ]
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Votre identifiant'), { target: { value: 'sneakerhead75' } });
    fireEvent.change(screen.getByPlaceholderText('Votre mot de passe'), { target: { value: 'collector2026' } });
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Super Nintendo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(screen.getByText('1', { selector: '.cart-badge' })).toBeInTheDocument();
  });

  it('Scénario 2 : Publication d\'une nouvelle annonce', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('username', 'sneakerhead75');

    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Article ajouté',
        article: {
          id: 99,
          title: 'Nouvel Objet',
          category: 'Divers',
          price: '10.00',
          seller: 'sneakerhead75',
          description: 'Test'
        }
      }
    });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Achetez et vendez des objets de collection')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+ Déposer une annonce' }));

    fireEvent.change(screen.getByPlaceholderText('Ex: Jordan 1 Retro 1985'), { target: { value: 'Nouvel Objet' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: Baskets'), { target: { value: 'Divers' } });
    fireEvent.change(screen.getByPlaceholderText('Décrivez votre objet, son état, sa rareté...'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: "Publier l'annonce" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/articles',
        expect.objectContaining({ title: 'Nouvel Objet' }),
        expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
      );
    });
  });

  it('Scénario 3 : Déconnexion de l\'utilisateur', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('username', 'sneakerhead75');
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Déconnexion' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Déconnexion' }));

    expect(screen.getByPlaceholderText('Votre identifiant')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
