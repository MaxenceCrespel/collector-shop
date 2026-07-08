import { render, screen, fireEvent } from '@testing-library/react';
import CartModal from './CartModal';

describe('CartModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnRemove = jest.fn();
    const sampleCart = [
        { id: 1, title: 'Super Nintendo', price: '120.00', seller: 'retro_passion' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('affiche un panier vide correctement', () => {
        render(<CartModal cart={[]} onClose={mockOnClose} onRemove={mockOnRemove} />);
        expect(screen.getByText('Votre panier est vide.')).toBeInTheDocument();
    });

    it('permet de retirer un article et de fermer la modale', () => {
        render(<CartModal cart={sampleCart} onClose={mockOnClose} onRemove={mockOnRemove} />);

        expect(screen.getAllByText(/120.*€/)[0]).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Retirer' }));
        expect(mockOnRemove).toHaveBeenCalledWith(1);

        const closeBtn = document.querySelector('.btn-icon');
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('ferme la modale avec la touche Echap', () => {
        render(<CartModal cart={sampleCart} onClose={mockOnClose} onRemove={mockOnRemove} />);
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });
});
