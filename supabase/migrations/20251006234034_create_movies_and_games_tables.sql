/*
  # Create Movies and Games Review Database

  1. New Tables
    - `movies`
      - `id` (bigint, primary key, generated as identity)
      - `title` (text, required)
      - `description` (text, required)
      - `rating` (text, required)
      - `image_url` (text, required)
      - `card_image_url` (text, required)
      - `popular` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `reviews` (jsonb, default empty array)
      - `download_links` (jsonb, default empty array)
      - `media` (jsonb, default empty array)
      - `comments` (jsonb, default empty array)
    
    - `games`
      - `id` (bigint, primary key, generated as identity)
      - `title` (text, required)
      - `description` (text, required)
      - `rating` (text, required)
      - `image_url` (text, required)
      - `card_image_url` (text, required)
      - `popular` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `reviews` (jsonb, default empty array)
      - `download_links` (jsonb, default empty array)
      - `media` (jsonb, default empty array)
      - `comments` (jsonb, default empty array)

  2. Security
    - Enable RLS on both tables
    - Add public read policies (anyone can view)
    - Add public write policies (anyone can add/edit/delete for now)

  3. Important Notes
    - Reviews stored as JSON: [{"author": "name", "text": "review text"}]
    - Download links as JSON: [{"source": "source name", "url": "url"}]
    - Media as JSON: [{"type": "image|video", "url": "url"}]
    - Comments as JSON: [{"author": "name", "text": "comment text"}]
    - Public access enabled for demo purposes
*/

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text NOT NULL,
  rating text NOT NULL,
  image_url text NOT NULL,
  card_image_url text NOT NULL,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  reviews jsonb DEFAULT '[]'::jsonb,
  download_links jsonb DEFAULT '[]'::jsonb,
  media jsonb DEFAULT '[]'::jsonb,
  comments jsonb DEFAULT '[]'::jsonb
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text NOT NULL,
  rating text NOT NULL,
  image_url text NOT NULL,
  card_image_url text NOT NULL,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  reviews jsonb DEFAULT '[]'::jsonb,
  download_links jsonb DEFAULT '[]'::jsonb,
  media jsonb DEFAULT '[]'::jsonb,
  comments jsonb DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Public read access for movies
CREATE POLICY "Anyone can view movies"
  ON movies FOR SELECT
  USING (true);

-- Public write access for movies
CREATE POLICY "Anyone can insert movies"
  ON movies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update movies"
  ON movies FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete movies"
  ON movies FOR DELETE
  USING (true);

-- Public read access for games
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  USING (true);

-- Public write access for games
CREATE POLICY "Anyone can insert games"
  ON games FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update games"
  ON games FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete games"
  ON games FOR DELETE
  USING (true);