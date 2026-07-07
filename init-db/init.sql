DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    seller VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO articles (title, description, price, category, seller) VALUES
('Jordan 1 Retro High', 'Édition limitée 1985, état neuf.', 1200.00, 'Baskets', 'sneakerhead75'),
('Figurine Boba Fett Kenner', 'Originale 1979 sous blister.', 450.00, 'Figurines', 'starwars_collector'),
('VHS Retour vers le Futur', 'Première édition française scellée.', 150.00, 'Vintage', 'retro_passion'),
('Game Boy Color Pikachu', 'Édition spéciale jaune, parfait état.', 220.00, 'Jeux Vidéo', 'pixel_hunter'),
('Carte Dracaufeu 1ère Édition', 'Set de base, holographique, Gradée 9 PSA.', 2500.00, 'Cartes', 'pokemasterfr'),
('Baskets Nike Air Mag', 'Réplique officielle auto-laçante (2011).', 8500.00, 'Baskets', 'sneakerhead75'),
('Poster Star Wars Dédicacé', 'Signé par Mark Hamill, certifié.', 600.00, 'Autographes', 'starwars_collector'),
('Figurine Goldorak Shogun', 'Modèle géant 60cm de 1978.', 800.00, 'Figurines', 'retro_passion'),
('Zelda Ocarina of Time N64', 'Version boîte originale (Gold Cartridge).', 350.00, 'Jeux Vidéo', 'pixel_hunter'),
('Console NES Control Deck', 'Boîte d''origine, deux manettes et Zapper.', 280.00, 'Jeux Vidéo', 'pixel_hunter'),
('Adidas Stan Smith Vintage', 'Modèle fabriqué en France, années 70.', 300.00, 'Baskets', 'sneakerhead75'),
('Comics Spider-Man #121', 'La mort de Gwen Stacy, bon état.', 400.00, 'Comics', 'marvel_addict'),
('Tamagotchi Original 1996', 'Neuf sous emballage d''origine.', 90.00, 'Vintage', 'retro_passion'),
('Walkman Sony WM-F1', 'Le premier modèle avec radio, fonctionnel.', 180.00, 'Vintage', 'retro_passion'),
('Figurine Spawn Series 1', 'Signée par Todd McFarlane.', 200.00, 'Figurines', 'marvel_addict'),
('Carte Magic Black Lotus', 'Édition Unlimited, état correct.', 15000.00, 'Cartes', 'pokemasterfr'),
('Macintosh Plus 1986', 'Complet avec clavier et souris d''origine.', 550.00, 'Informatique', 'retrotech'),
('Lego Château Chevalier 6080', 'Modèle de 1984, avec toutes les figurines.', 450.00, 'Lego', 'brick_maniac'),
('Nike Dunk SB Pigeon', 'Édition limitée Jeff Staple (2005).', 12000.00, 'Baskets', 'sneakerhead75'),
('Vinyl Thriller Michael Jackson', 'Pressage original 1982, scellé.', 250.00, 'Musique', 'retro_passion');