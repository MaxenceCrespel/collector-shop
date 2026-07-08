import { render, screen } from '@testing-library/react';
import OwnArticles from './OwnArticles';

jest.mock('../../utils/categoryEmoji', () => ({
    getCategoryEmoji: jest.fn(() => '🏷️')
}), { virtual: true });

describe('OwnArticles Component', () => {
    it('ne doit absolument rien afficher si la liste d\'articles est vide', () => {
        const { container } = render(<OwnArticles articles={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it('doit afficher correctement une liste d\'articles avec le bon formatage de prix', () => {
        const sampleArticles = [
            {
                id: 1,
                title: 'Casque Vintage',
                description: 'En très bon état',
                price: '65.50',
                category: 'Audio'
            }
        ];

        render(<OwnArticles articles={sampleArticles} />);

        expect(screen.getByText('Mes annonces en ligne')).toBeInTheDocument();
        expect(screen.getByText('Casque Vintage')).toBeInTheDocument();
        expect(screen.getByText('En très bon état')).toBeInTheDocument();

        expect(screen.getByText(/Audio/)).toBeInTheDocument();

        expect(screen.getByText(/65.*€/)).toBeInTheDocument();
    });
});
