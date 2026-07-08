import { render } from '@testing-library/react';
import { IconCart, IconUser, IconClose, IconTag } from './Icons';

describe('Icons Components', () => {
    it('rendent tous les SVGs sans erreur', () => {
        const { container: cart } = render(<IconCart />);
        const { container: user } = render(<IconUser />);
        const { container: close } = render(<IconClose />);
        const { container: tag } = render(<IconTag />);

        expect(cart.querySelector('svg')).toBeInTheDocument();
        expect(user.querySelector('svg')).toBeInTheDocument();
        expect(close.querySelector('svg')).toBeInTheDocument();
        expect(tag.querySelector('svg')).toBeInTheDocument();
    });
});