import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('Collector.shop - Application React', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.get.mockClear();
    axios.post.mockClear();
  });

  it('devrait rediriger vers le login puis afficher le catalogue après connexion', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Walkman Sony', price: '50.00', category: 'Audio', seller: 'autre_vendeur' },
        { id: 2, title: 'Carte Dracaufeu', price: '200.00', category: 'Cartes', seller: 'moi_meme' }
      ]
    });

    axios.post.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token', username: 'moi_meme' }
    });

    render(<App />);

    const loginInput = screen.getByRole('textbox'); 
    fireEvent.change(loginInput, { target: { value: 'moi_meme' } });
    
    const loginButton = screen.getByRole('button', { name: /connecter|valider/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('👤 moi_meme')).toBeInTheDocument();
    });

    expect(screen.getByText('Walkman Sony')).toBeInTheDocument();

    expect(screen.getByText('Carte Dracaufeu')).toBeInTheDocument();
  });
});