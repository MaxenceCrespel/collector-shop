import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('Collector.shop - Test d\'Intégration Frontend', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.get.mockClear();
    axios.post.mockClear();
  });

  it('devrait permettre de se connecter, voir le catalogue et ajouter au panier', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Super Nintendo', price: '120.00', category: 'Jeux Vidéo', seller: 'retro_passion', description: 'En boîte' },
        { id: 2, title: 'Figurine Batman', price: '45.00', category: 'Figurines', seller: 'sneakerhead75', description: 'Neuve' }
      ]
    });

    axios.post.mockResolvedValueOnce({
      data: { token: 'mock-jwt-token', username: 'sneakerhead75' }
    });

    render(<App />);

    expect(screen.getByText(/La marketplace des objets qui ont une histoire/i)).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText('Votre identifiant'), { target: { value: 'sneakerhead75' } });
    fireEvent.change(screen.getByPlaceholderText('Votre mot de passe'), { target: { value: 'collector2026' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Achetez et vendez des objets de collection')).toBeInTheDocument();
    });

    expect(screen.getByText('Super Nintendo')).toBeInTheDocument();
    const btnAddCart = screen.getByRole('button', { name: 'Ajouter' });
    expect(btnAddCart).toBeInTheDocument();

    expect(screen.getByText('Mes annonces en ligne')).toBeInTheDocument();
    expect(screen.getByText('Figurine Batman')).toBeInTheDocument();

    fireEvent.click(btnAddCart);

    const cartBadge = screen.getByText('1', { selector: '.cart-badge' });
    expect(cartBadge).toBeInTheDocument();

    const cartButton = cartBadge.closest('button');
    fireEvent.click(cartButton);

    expect(screen.getByText('Mon panier')).toBeInTheDocument();
    expect(screen.getByText(/120.*€/)).toBeInTheDocument();
  });
});