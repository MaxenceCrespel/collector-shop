import { render, screen, fireEvent } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
    it('affiche le bouton de dépôt par défaut et réagit au clic', () => {
        const mockToggle = jest.fn();
        render(<Hero showAddForm={false} onToggleForm={mockToggle} />);

        const button = screen.getByRole('button', { name: '+ Déposer une annonce' });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('affiche "Annuler" quand le formulaire est ouvert', () => {
        render(<Hero showAddForm={true} onToggleForm={jest.fn()} />);

        expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument();
    });
});
