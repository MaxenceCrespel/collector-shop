import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import axios from 'axios';

jest.mock('axios');

describe('LoginPage Component', () => {
    const mockOnLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('affiche des erreurs de validation en mode inscription', async () => {
        render(<LoginPage onLogin={mockOnLogin} />);

        fireEvent.click(screen.getByRole('button', { name: 'Inscription' }));

        fireEvent.change(screen.getByPlaceholderText('Votre identifiant'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Minimum 6 caractères'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Répétez votre mot de passe'), { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

        expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument();
    });

    it('affiche une erreur API (ex: 401 Unauthorized)', async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { error: 'Identifiants invalides' } }
        });

        render(<LoginPage onLogin={mockOnLogin} />);

        fireEvent.change(screen.getByPlaceholderText('Votre identifiant'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Votre mot de passe'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

        await waitFor(() => {
            expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
        });
        expect(mockOnLogin).not.toHaveBeenCalled();
    });
});