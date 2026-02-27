-- =========================
-- Cities
-- =========================
INSERT INTO cities (name, region, country) VALUES
    ('Brussels', 'Brussels-Capital Region', 'Belgium'),
    ('Antwerp', 'Flanders', 'Belgium'),
    ('Ghent', 'Flanders', 'Belgium'),
    ('Bruges', 'Flanders', 'Belgium'),
    ('Liège', 'Wallonia', 'Belgium')
ON CONFLICT DO NOTHING;

-- =========================
-- Venues
-- =========================
INSERT INTO venues (name, address, capacity, city_id) VALUES
    ('Forest National', 'Avenue du Globe 36, 1190 Forest', 8000,  1),
    ('Palais 12',       'Avenue de Marathon 1, 1020 Laeken', 12000, 1),
    ('Ancienne Belgique','Boulevard Anspach 110, 1000 Brussels', 2000, 1),
    ('Lotto Arena',     'Sportpaleis­laan 1, 2020 Antwerp',    8000,  2),
    ('Sportpaleis',     'Sportpaleis­laan 1, 2020 Antwerp',   23000,  2),
    ('Trix',            'Noordersingel 28, 2140 Antwerp',      1400,  2),
    ('Vooruit',         'Sint-Pietersnieuwstraat 23, 9000 Ghent', 1700, 3),
    ('Capitole Ghent',  'Graaf van Vlaanderenplein 29, 9000 Ghent', 2000, 3),
    ('Cactus Club',     'Magdalenastraat 27, 8000 Bruges',      500,  4),
    ('La Boverie',      'Parc de la Boverie, 4020 Liège',      3000,  5)
ON CONFLICT DO NOTHING;

-- =========================
-- Events
-- =========================
INSERT INTO events (title, event_date, start_time, end_time, available_tickets) VALUES
    ('Stromae Live 2026',             '2026-03-15', '20:00', '23:00', 8000),
    ('Dua Lipa – Radical Optimism Tour','2026-04-02','19:30','22:30',12000),
    ('Jazz Middelheim Preview Night', '2026-04-18', '18:00', '23:00', 1800),
    ('Rammstein European Tour',       '2026-05-10', '19:00', '22:30',22000),
    ('Tomorrowland Winter Warm-Up',   '2026-05-24', '14:00', '23:59', 7500),
    ('Arctic Monkeys',                '2026-06-06', '20:00', '23:00', 7800),
    ('Rock Werchter Opening Night',   '2026-07-02', '16:00', '23:59',12000),
    ('Editors – EBM Night',           '2026-07-19', '20:30', '23:30', 1600),
    ('Balthazar Farewell Show',       '2026-08-08', '20:00', '23:00', 1900),
    ('Coldplay – Music of the Spheres','2026-08-22','19:00','23:00',23000),
    ('Massive Attack',                '2026-09-05', '21:00', '23:30', 2000),
    ('Ghent Jazz Festival Closing',   '2026-09-13', '15:00', '23:00', 3000),
    ('Amenra – Church of Ra',         '2026-10-03', '20:00', '23:00',  480),
    ('Brussels Electronic Marathon',  '2026-10-17', '22:00', '23:59', 1200),
    ('Liège Philharmonic Gala',       '2026-11-28', '19:30', '22:00', 1500)
ON CONFLICT DO NOTHING;

-- =========================
-- Event Descriptions
-- =========================
INSERT INTO event_descriptions (event_id, event_type, featured_artists, ticket_purchase_link, extra_description) VALUES
    (1,  'Concert',     'Stromae',                         'https://tickets.forestnational.be', 'Stromae returns to Belgium for a spectacular homecoming show.'),
    (2,  'Concert',     'Dua Lipa',                        'https://tickets.palais12.be',       'Pop sensation Dua Lipa brings her Radical Optimism Tour to Brussels.'),
    (3,  'Jazz',        'Various Jazz Artists',             'https://jazzmiddelheim.be',         'A preview evening ahead of the main Jazz Middelheim festival.'),
    (4,  'Rock',        'Rammstein',                       'https://tickets.sportpaleis.be',    'German industrial metal giants Rammstein with their legendary pyrotechnics.'),
    (5,  'Electronic',  'Various DJs',                     'https://tomorrowland.com',          'Official Tomorrowland warm-up party at Lotto Arena.'),
    (6,  'Rock',        'Arctic Monkeys',                  'https://tickets.forestnational.be', 'Sheffield indie rock legends Arctic Monkeys on their world tour.'),
    (7,  'Festival',    'Various Artists',                  'https://rockwerchter.be',           'Opening night of Rock Werchter with a star-studded lineup.'),
    (8,  'Alternative', 'Editors',                         'https://tickets.vooruit.be',        'Post-punk legends Editors with a special EBM-influenced set.'),
    (9,  'Indie',       'Balthazar',                       'https://tickets.capitoleghent.be',  'Ghent''s own Balthazar in an emotional farewell show at home.'),
    (10, 'Concert',     'Coldplay',                        'https://tickets.sportpaleis.be',    'Coldplay''s eco-friendly spectacular with their Music of the Spheres show.'),
    (11, 'Electronic',  'Massive Attack',                  'https://tickets.ab.be',             'Trip-hop pioneers Massive Attack with a visually stunning audio-visual experience.'),
    (12, 'Jazz',        'Various Jazz Artists',             'https://gentjazz.com',              'Closing night of the Ghent Jazz Festival with special guests.'),
    (13, 'Metal',       'Amenra',                          'https://tickets.cactusmuziekcentrum.be', 'Intimate Church of Ra show — Amenra at their most raw and powerful.'),
    (14, 'Electronic',  'Various DJs',                     'https://tickets.ab.be',             'An all-night electronic marathon across multiple stages in Brussels.'),
    (15, 'Classical',   'Liège Philharmonic Orchestra',    'https://oprl.be',                   'A grand classical gala evening with the Liège Philharmonic Orchestra.')
ON CONFLICT DO NOTHING;

-- =========================
-- Event ↔ Venue links
-- =========================
INSERT INTO event_venues (event_id, venue_id) VALUES
    (1,  1),   -- Stromae @ Forest National
    (2,  2),   -- Dua Lipa @ Palais 12
    (3,  6),   -- Jazz Middelheim @ Trix
    (4,  5),   -- Rammstein @ Sportpaleis
    (5,  4),   -- Tomorrowland Warm-Up @ Lotto Arena
    (6,  1),   -- Arctic Monkeys @ Forest National
    (7,  2),   -- Rock Werchter @ Palais 12
    (8,  7),   -- Editors @ Vooruit
    (9,  8),   -- Balthazar @ Capitole Ghent
    (10, 5),   -- Coldplay @ Sportpaleis
    (11, 3),   -- Massive Attack @ Ancienne Belgique
    (12, 7),   -- Ghent Jazz @ Vooruit
    (13, 9),   -- Amenra @ Cactus Club
    (14, 3),   -- Brussels Electronic @ Ancienne Belgique
    (15, 10)   -- Liège Philharmonic @ La Boverie
ON CONFLICT DO NOTHING;
