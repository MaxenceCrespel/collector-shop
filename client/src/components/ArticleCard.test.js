import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from './ArticleCard';

jest.mock('../../utils/categoryEmoji', () => ({
    getCategoryEmoji: jest.fn(() => '🏷️')
}), { virtual: true });

describe('ArticleCard Component', () => {
    const mockArticle = {
        id: 1,
        title: 'Carte Dracaufeu',
        description: 'Très rare',
        price: '250.00',
        category: 'Cartes',
        seller: 'poke_master'
    };

    it('affiche les détails de l\'article et permet l\'ajout au panier', () => {
        const mockAddToCart = jest.fn();
        render(<ArticleCard article={mockArticle} inCart={false} onAddToCart={mockAddToCart} />);

        expect(screen.getByText('Carte Dracaufeu')).toBeInTheDocument();
        expect(screen.getByText(/250.*€/)).toBeInTheDocument();
        expect(screen.getByText('par poke_master')).toBeInTheDocument();

        const btn = screen.getByRole('button', { name: 'Ajouter' });
        expect(btn).toBeEnabled();

        fireEvent.click(btn);
        expect(mockAddToCart).toHaveBeenCalledWith(mockArticle);
    });

    it('désactive le bouton si l\'article est déjà dans le panier', () => {
        render(<ArticleCard article={mockArticle} inCart={true} onAddToCart={jest.fn()} />);

        const btn = screen.getByRole('button', { name: 'Ajouté' });

        expect(btn).toBeDisabled();
        expect(btn).toHaveClass('btn-cart--added');
    });
});
