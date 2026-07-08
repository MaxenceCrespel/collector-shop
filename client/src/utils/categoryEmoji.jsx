export function getCategoryEmoji(category) {
    const map = {
        'Baskets': '👟', 'Figurines': '🗿', 'Vintage': '📼', 'Jeux Vidéo': '🎮',
        'Cartes': '🃏', 'Comics': '📚', 'Autographes': '✍️', 'Musique': '🎵',
        'Informatique': '💻', 'Lego': '🧱',
    };
    return map[category] || '📦';
}
