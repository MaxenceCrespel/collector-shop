-- Nettoyage si besoin (pour repartir à zéro)
DROP TABLE IF EXISTS articles;

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO articles (title, description, price, category) VALUES
('Jordan 1 Retro High', 'Édition limitée 1985, état neuf.', 1200.00, 'Baskets'),
('Figurine Boba Fett Kenner', 'Originale 1979 sous blister.', 450.00, 'Figurines'),
('VHS Retour vers le Futur', 'Première édition française scellée.', 150.00, 'Vintage'),
('Game Boy Color Pikachu', 'Édition spéciale jaune, parfait état.', 220.00, 'Jeux Vidéo'),
('Carte Dracaufeu 1ère Édition', 'Set de base, holographique, Gradée 9 PSA.', 2500.00, 'Cartes'),
('Baskets Nike Air Mag', 'Réplique officielle auto-laçante (2011).', 8500.00, 'Baskets'),
('Poster Star Wars Dédicacé', 'Signé par Mark Hamill, certifié.', 600.00, 'Autographes'),
('Figurine Goldorak Shogun', 'Modèle géant 60cm de 1978.', 800.00, 'Figurines'),
('Zelda Ocarina of Time N64', 'Version boîte originale (Gold Cartridge).', 350.00, 'Jeux Vidéo'),
('Console NES Control Deck', 'Boîte d''origine, deux manettes et Zapper.', 280.00, 'Jeux Vidéo'),
('Adidas Stan Smith Vintage', 'Modèle fabriqué en France, années 70.', 300.00, 'Baskets'),
('Comics Spider-Man #121', 'La mort de Gwen Stacy, bon état.', 400.00, 'Comics'),
('Tamagotchi Original 1996', 'Neuf sous emballage d''origine.', 90.00, 'Vintage'),
('Walkman Sony WM-F1', 'Le premier modèle avec radio, fonctionnel.', 180.00, 'Vintage'),
('Figurine Spawn Series 1', 'Signée par Todd McFarlane.', 200.00, 'Figurines'),
('Carte Magic Black Lotus', 'Édition Unlimited, état correct.', 15000.00, 'Cartes'),
('Macintosh Plus 1986', 'Complet avec clavier et souris d''origine.', 550.00, 'Informatique'),
('Lego Château Chevalier 6080', 'Modèle de 1984, avec toutes les figurines.', 450.00, 'Lego'),
('Nike Dunk SB Pigeon', 'Édition limitée Jeff Staple (2005).', 12000.00, 'Baskets'),
('Vinyl Thriller Michael Jackson', 'Pressage original 1982, scellé.', 250.00, 'Musique');