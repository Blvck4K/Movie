import { supabase } from './supabaseClient.js';

export async function getAllMovies() {
    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching movies:', error);
        return [];
    }

    return data.map(movie => ({
        ...movie,
        imageUrl: movie.image_url,
        cardImageUrl: movie.card_image_url,
        createdAt: new Date(movie.created_at),
        downloadLinks: movie.download_links
    }));
}

export async function getAllGames() {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching games:', error);
        return [];
    }

    return data.map(game => ({
        ...game,
        imageUrl: game.image_url,
        cardImageUrl: game.card_image_url,
        createdAt: new Date(game.created_at),
        downloadLinks: game.download_links
    }));
}

export async function getMovieById(id) {
    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching movie:', error);
        return null;
    }

    if (!data) return null;

    return {
        ...data,
        imageUrl: data.image_url,
        cardImageUrl: data.card_image_url,
        createdAt: new Date(data.created_at),
        downloadLinks: data.download_links
    };
}

export async function getGameById(id) {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching game:', error);
        return null;
    }

    if (!data) return null;

    return {
        ...data,
        imageUrl: data.image_url,
        cardImageUrl: data.card_image_url,
        createdAt: new Date(data.created_at),
        downloadLinks: data.download_links
    };
}

export async function createMovie(movie) {
    const { data, error } = await supabase
        .from('movies')
        .insert([{
            title: movie.title,
            description: movie.description,
            rating: movie.rating,
            image_url: movie.imageUrl,
            card_image_url: movie.cardImageUrl,
            reviews: movie.reviews || [],
            download_links: movie.downloadLinks || [],
            media: movie.media || [],
            comments: movie.comments || [],
            popular: movie.popular || false,
            created_at: movie.createdAt || new Date()
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating movie:', error);
        return null;
    }

    return data;
}

export async function createGame(game) {
    const { data, error } = await supabase
        .from('games')
        .insert([{
            title: game.title,
            description: game.description,
            rating: game.rating,
            image_url: game.imageUrl,
            card_image_url: game.cardImageUrl,
            reviews: game.reviews || [],
            download_links: game.downloadLinks || [],
            media: game.media || [],
            comments: game.comments || [],
            popular: game.popular || false,
            created_at: game.createdAt || new Date()
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating game:', error);
        return null;
    }

    return data;
}

export async function updateMovie(id, movie) {
    const updateData = {
        title: movie.title,
        description: movie.description,
        rating: movie.rating,
        image_url: movie.imageUrl,
        card_image_url: movie.cardImageUrl,
        reviews: movie.reviews || [],
        download_links: movie.downloadLinks || [],
        media: movie.media || [],
        comments: movie.comments || [],
        popular: movie.popular || false
    };

    if (movie.createdAt) {
        updateData.created_at = movie.createdAt;
    }

    const { data, error } = await supabase
        .from('movies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating movie:', error);
        return null;
    }

    return data;
}

export async function updateGame(id, game) {
    const updateData = {
        title: game.title,
        description: game.description,
        rating: game.rating,
        image_url: game.imageUrl,
        card_image_url: game.cardImageUrl,
        reviews: game.reviews || [],
        download_links: game.downloadLinks || [],
        media: game.media || [],
        comments: game.comments || [],
        popular: game.popular || false
    };

    if (game.createdAt) {
        updateData.created_at = game.createdAt;
    }

    const { data, error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating game:', error);
        return null;
    }

    return data;
}

export async function deleteMovie(id) {
    const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting movie:', error);
        return false;
    }

    return true;
}

export async function deleteGame(id) {
    const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting game:', error);
        return false;
    }

    return true;
}

export async function addComment(type, id, comment) {
    const table = type === 'movie' ? 'movies' : 'games';

    const item = type === 'movie' ? await getMovieById(id) : await getGameById(id);
    if (!item) return false;

    const updatedComments = [...(item.comments || []), comment];

    const { error } = await supabase
        .from(table)
        .update({ comments: updatedComments })
        .eq('id', id);

    if (error) {
        console.error('Error adding comment:', error);
        return false;
    }

    return true;
}

export async function searchMoviesAndGames(query) {
    const lowerQuery = query.toLowerCase();

    const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .ilike('title', `%${lowerQuery}%`);

    const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .ilike('title', `%${lowerQuery}%`);

    if (moviesError) console.error('Error searching movies:', moviesError);
    if (gamesError) console.error('Error searching games:', gamesError);

    return {
        movies: (movies || []).map(movie => ({
            ...movie,
            imageUrl: movie.image_url,
            cardImageUrl: movie.card_image_url,
            createdAt: new Date(movie.created_at),
            downloadLinks: movie.download_links
        })),
        games: (games || []).map(game => ({
            ...game,
            imageUrl: game.image_url,
            cardImageUrl: game.card_image_url,
            createdAt: new Date(game.created_at),
            downloadLinks: game.download_links
        }))
    };
}
