import {
    getAllMovies,
    getAllGames,
    getMovieById,
    getGameById,
    createMovie,
    createGame,
    updateMovie,
    updateGame,
    deleteMovie,
    deleteGame,
    addComment,
    searchMoviesAndGames
} from './database.js';

document.addEventListener('DOMContentLoaded', async () => {
    let siteData = {
        movies: [],
        games: []
    };

    async function loadData() {
        siteData.movies = await getAllMovies();
        siteData.games = await getAllGames();
    }

    await loadData();

    function getPopularItems() {
        const popularMovie = siteData.movies.find(m => m.popular);
        const popularGame = siteData.games.find(g => g.popular);
        return [popularMovie, popularGame].filter(Boolean);
    }

    function getYear(date) {
        return date ? date.getFullYear() : 'N/A';
    }

    function createItemCard(item, type) {
        const year = getYear(item.createdAt);
        const rating = item.rating || 'N/A';

        const card = document.createElement('div');
        card.classList.add('item-card');

        card.innerHTML = `
            <img src="${item.cardImageUrl}" alt="${item.title}">

            <div class="item-overlay">
                <h3 class="item-title-overlay">${item.title}</h3>
                <p class="item-meta">${year} | Rating: ${rating}</p>
            </div>

            <div class="item-info">
                </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `details.html?type=${type}&id=${item.id}`;
        });
        return card;
    }

    function displayItems(container, items) {
        container.innerHTML = '';
        items.forEach(item => {
            const type = container.id.includes('movies') ? 'movie' : 'game';
            const itemCard = createItemCard(item, type);
            container.appendChild(itemCard);
        });
    }

    async function loadDetails() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const id = parseInt(params.get('id'));

        if (type && id) {
            const item = type === 'movie' ? await getMovieById(id) : await getGameById(id);

            if (item) {
                document.getElementById('item-title').textContent = item.title;
                document.getElementById('edit-post-button').href = `edit.html?type=${type}&id=${id}`;
                document.getElementById('item-description').textContent = item.description;
                document.getElementById('item-rating').textContent = item.rating;
                document.getElementById('item-year').textContent = getYear(item.createdAt);

                const reviewsContainer = document.getElementById('item-reviews');
                reviewsContainer.innerHTML = '';
                if (item.reviews) {
                    item.reviews.forEach(review => {
                        const reviewDiv = document.createElement('div');
                        reviewDiv.classList.add('review');
                        reviewDiv.innerHTML = `<p><strong>${review.author}:</strong> ${review.text}</p>`;
                        reviewsContainer.appendChild(reviewDiv);
                    });
                }

                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.innerHTML = '';
                if (item.comments) {
                    item.comments.forEach(comment => {
                        const commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment');
                        commentDiv.innerHTML = `<p><strong>${comment.author}:</strong> ${comment.text}</p>`;
                        commentsContainer.appendChild(commentDiv);
                    });
                }

                const downloadLinksContainer = document.getElementById('item-download-links');
                downloadLinksContainer.innerHTML = '';
                if (item.downloadLinks) {
                    item.downloadLinks.forEach(link => {
                        const linkA = document.createElement('a');
                        linkA.href = link.url;
                        linkA.textContent = link.source;
                        downloadLinksContainer.appendChild(linkA);
                    });
                }

                const detailsSlider = document.getElementById('details-hero-slider');
                if (detailsSlider && item.media && item.media.length > 0) {
                    const slidesContainer = detailsSlider.querySelector('.hero-slides');
                    slidesContainer.innerHTML = '';
                    item.media.forEach(mediaItem => {
                        const slide = document.createElement('div');
                        slide.classList.add('slide');
                        if (mediaItem.type === 'image') {
                            slide.innerHTML = `<img src="${mediaItem.url}" alt="${item.title}">`;
                        } else if (mediaItem.type === 'video') {
                            slide.innerHTML = `<video controls src="${mediaItem.url}"></video>`;
                        }
                        slidesContainer.appendChild(slide);
                    });
                    initializeSlider(detailsSlider);
                }

                const commentForm = document.getElementById('comment-form');
                if (commentForm) {
                    commentForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const author = document.getElementById('comment-author').value;
                        const text = document.getElementById('comment-text').value;
                        if (author && text) {
                            await addComment(type, id, { author, text });
                            loadDetails();
                            commentForm.reset();
                        }
                    });
                }
            }
        }
    }

    function initializeSlider(slider) {
        let slideIndex = 0;
        const slides = slider.querySelectorAll('.slide');
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        prevButton.addEventListener('click', () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        });

        nextButton.addEventListener('click', () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        });

        showSlide(slideIndex);
    }

    if (document.getElementById('top-movies-container')) {
        displayItems(document.getElementById('top-movies-container'), siteData.movies.slice(0, 5));
    }
    if (document.getElementById('top-games-container')) {
        displayItems(document.getElementById('top-games-container'), siteData.games.slice(0, 5));
    }
    if (document.getElementById('all-movies-container')) {
        displayItems(document.getElementById('all-movies-container'), siteData.movies);
    }
    if (document.getElementById('all-games-container')) {
        displayItems(document.getElementById('all-games-container'), siteData.games);
    }
    if (document.getElementById('details-section')) {
        loadDetails();
    }

    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createPostForm);
            const type = formData.get('type');
            const mediaUrls = formData.get('media-urls').split('\n').filter(url => url.trim() !== '');
            const media = mediaUrls.map(url => ({ type: 'image', url }));

            const newPost = {
                title: formData.get('title'),
                description: formData.get('description'),
                rating: formData.get('rating'),
                imageUrl: formData.get('imageUrl'),
                cardImageUrl: formData.get('cardImageUrl'),
                reviews: [{ author: formData.get('review-author'), text: formData.get('review-text') }],
                downloadLinks: [{ source: formData.get('download-source'), url: formData.get('download-url') }],
                createdAt: new Date(),
                media: media,
                comments: []
            };

            if (type === 'movie') {
                await createMovie(newPost);
            } else {
                await createGame(newPost);
            }

            window.location.href = type === 'movie' ? 'movies.html' : 'games.html';
        });
    }

    const editPostForm = document.getElementById('edit-post-form');
    if (editPostForm) {
        const formatDate = (date) => {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const id = parseInt(params.get('id'));

        const item = type === 'movie' ? await getMovieById(id) : await getGameById(id);

        if (item) {
            document.getElementById('edit-id').value = item.id;
            document.getElementById('edit-type').value = type;
            document.getElementById('title').value = item.title;
            document.getElementById('description').value = item.description;
            document.getElementById('rating').value = item.rating;
            document.getElementById('createdDate').value = formatDate(item.createdAt);
            document.getElementById('imageUrl').value = item.imageUrl;
            document.getElementById('cardImageUrl').value = item.cardImageUrl;
            if (item.reviews && item.reviews.length > 0) {
                document.getElementById('review-author').value = item.reviews[0].author;
                document.getElementById('review-text').value = item.reviews[0].text;
            }
            if (item.downloadLinks && item.downloadLinks.length > 0) {
                document.getElementById('download-source').value = item.downloadLinks[0].source;
                document.getElementById('download-url').value = item.downloadLinks[0].url;
            }
            if (item.media && item.media.length > 0) {
                document.getElementById('media-urls').value = item.media.map(m => m.url).join('\n');
            }
            document.getElementById('popular').checked = item.popular || false;
        }

        editPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editPostForm);
            const updatedId = parseInt(formData.get('edit-id'));
            const updatedType = formData.get('edit-type');

            const mediaUrls = formData.get('media-urls').split('\n').filter(url => url.trim() !== '');
            const media = mediaUrls.map(url => ({ type: 'image', url }));

            const updatedItem = {
                title: formData.get('title'),
                description: formData.get('description'),
                rating: formData.get('rating'),
                createdAt: new Date(formData.get('createdDate')),
                imageUrl: formData.get('imageUrl'),
                cardImageUrl: formData.get('cardImageUrl'),
                reviews: [{ author: formData.get('review-author'), text: formData.get('review-text') }],
                downloadLinks: [{ source: formData.get('download-source'), url: formData.get('download-url') }],
                media: media,
                popular: formData.get('popular') === 'on',
                comments: item.comments || []
            };

            if (updatedType === 'movie') {
                await updateMovie(updatedId, updatedItem);
            } else {
                await updateGame(updatedId, updatedItem);
            }

            window.location.href = updatedType === 'movie' ? 'movies.html' : 'games.html';
        });

        const deleteButton = document.getElementById('delete-post-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                const confirmed = confirm('Are you sure you want to delete this post? This action cannot be undone.');
                if (confirmed) {
                    const deleteId = parseInt(document.getElementById('edit-id').value);
                    const deleteType = document.getElementById('edit-type').value;

                    if (deleteType === 'movie') {
                        await deleteMovie(deleteId);
                    } else {
                        await deleteGame(deleteId);
                    }

                    window.location.href = deleteType === 'movie' ? 'movies.html' : 'games.html';
                }
            });
        }
    }

    const homePageSlider = document.querySelector('.hero-section .hero-slider');
    if (homePageSlider) {
        const popularItems = getPopularItems();
        const slidesContainer = homePageSlider.querySelector('.hero-slides');

        popularItems.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('slide');

            const description = item.description.split(' ').slice(0, 20).join(' ') + '...';
            const type = siteData.movies.some(m => m.id === item.id) ? 'movie' : 'game';

            slide.style.backgroundImage = `url('${item.imageUrl}')`;
            slide.innerHTML = `
                <div class="hero-content">
                    <h3>${item.title}</h3>
                    <p class="rating">${item.rating}</p>
                    <p class="description">${description}</p>
                    <a href="details.html?type=${type}&id=${item.id}" class="details-button">View Details</a>
                </div>
            `;
            slidesContainer.appendChild(slide);
        });

        initializeSlider(homePageSlider);
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('search-input').value;
            if (query) {
                const results = await searchMoviesAndGames(query);
                const searchResults = {
                    movies: results.movies,
                    games: results.games,
                    query: query
                };

                localStorage.setItem('jiggyz-search-results', JSON.stringify(searchResults));
                window.location.href = 'search.html';
            }
        });
    }

    function displaySearchResults() {
        const resultsContainer = document.getElementById('search-results-container');
        const querySpan = document.getElementById('search-query');
        const searchResults = JSON.parse(localStorage.getItem('jiggyz-search-results'));

        if (resultsContainer && searchResults) {
            querySpan.textContent = searchResults.query;
            resultsContainer.innerHTML = '';

            if (searchResults.movies.length === 0 && searchResults.games.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
                return;
            }

            if (searchResults.movies.length > 0) {
                const moviesHeader = document.createElement('h3');
                moviesHeader.textContent = 'Movies';
                resultsContainer.appendChild(moviesHeader);
                const moviesContainer = document.createElement('div');
                moviesContainer.classList.add('item-container');
                searchResults.movies.forEach(movie => {
                    const movieCard = createItemCard(movie, 'movie');
                    moviesContainer.appendChild(movieCard);
                });
                resultsContainer.appendChild(moviesContainer);
            }

            if (searchResults.games.length > 0) {
                const gamesHeader = document.createElement('h3');
                gamesHeader.textContent = 'Games';
                resultsContainer.appendChild(gamesHeader);
                const gamesContainer = document.createElement('div');
                gamesContainer.classList.add('item-container');
                searchResults.games.forEach(game => {
                    const gameCard = createItemCard(game, 'game');
                    gamesContainer.appendChild(gameCard);
                });
                resultsContainer.appendChild(gamesContainer);
            }
        }
    }

    if (document.getElementById('search-results-container')) {
        displaySearchResults();
    }
});
