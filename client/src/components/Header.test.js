import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
    const mockOnCartOpen = jest.fn();
    const mockOnLogout = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it('affiche l\'utilisateur et cache le badge si le panier est vide', () => {
        render(<Header currentUser="testUser" cartCount={0} onCartOpen={mockOnCartOpen} onLogout={mockOnLogout} />);

        expect(screen.getByText(/testUser/)).toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('affiche le badge du panier et réagit aux clics', () => {
        render(<Header currentUser="admin" cartCount={3} onCartOpen={mockOnCartOpen} onLogout={mockOnLogout} />);

        const badge = screen.getByText('3');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('cart-badge');

        fireEvent.click(badge.closest('button'));
        expect(mockOnCartOpen).toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'Déconnexion' }));
        expect(mockOnLogout).toHaveBeenCalled();
    });
});
