import { render, screen, fireEvent } from '@testing-library/react';
import AddArticleForm from './AddArticleForm';

describe('AddArticleForm Component', () => {
    it('met à jour les champs du formulaire lors de la saisie', () => {
        const mockOnChange = jest.fn();
        const mockOnSubmit = jest.fn(e => e.preventDefault());
        const formState = { title: '', category: '', condition: '', description: '', price: '' };

        render(<AddArticleForm form={formState} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

        const titleInput = screen.getByPlaceholderText('Ex: Jordan 1 Retro 1985');
        fireEvent.change(titleInput, { target: { value: 'Nouvel Objet' } });
        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ title: 'Nouvel Objet' }));

        const selectCondition = screen.getByLabelText(/État de l'objet/i);
        fireEvent.change(selectCondition, { target: { value: 'Très bon état' } });
        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ condition: 'Très bon état' }));

        fireEvent.submit(screen.getByRole('button', { name: "Publier l'annonce" }));
        expect(mockOnSubmit).toHaveBeenCalled();
    });
});