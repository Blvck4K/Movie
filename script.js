document.addEventListener('DOMContentLoaded', () => {
    const sampleData = {
        movies: [
            { id: 1, title: 'Movie 1', description: 'Description for Movie 1', rating: '8.5/10', reviews: [{ author: 'User1', text: 'Great movie!' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }, { type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 2, title: 'Movie 2', description: 'Description for Movie 2', rating: '8.2/10', reviews: [{ author: 'User2', text: 'Very good.' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 3, title: 'Movie 3', description: 'Description for Movie 3', rating: '7.9/10', reviews: [{ author: 'User3', text: 'Not bad.' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 4, title: 'Movie 4', description: 'Description for Movie 4', rating: '8.8/10', reviews: [{ author: 'User4', text: 'Excellent!' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date() },
            { id: 5, title: 'Movie 5', description: 'Description for Movie 5', rating: '8.1/10', reviews: [{ author: 'User5', text: 'I liked it.' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 6, title: 'Movie 6', description: 'Description for Movie 6', rating: '7.5/10', reviews: [{ author: 'User6', text: 'Decent.' }], comments: [], downloadLinks: [{ source: 'Source 1', url: '#' }], imageUrl: 'https://via.placeholder.com/200x300', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
        ],
        games: [
            { id: 1, title: 'Game 1', description: 'Description for Game 1', rating: '9/10', reviews: [{ author: 'Gamer1', text: 'Amazing gameplay!' }], comments: [], downloadLinks: [{ source: 'Steam', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }, { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }], createdAt: new Date('2023-01-01') },
            { id: 2, title: 'Game 2', description: 'Description for Game 2', rating: '8.5/10', reviews: [{ author: 'Gamer2', text: 'Hours of fun.' }], comments: [], downloadLinks: [{ source: 'Epic Games', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 3, title: 'Game 3', description: 'Description for Game 3', rating: '8/10', reviews: [{ author: 'Gamer3', text: 'Good story.' }], comments: [], downloadLinks: [{ source: 'Steam', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 4, title: 'Game 4', description: 'Description for Game 4', rating: '9.2/10', reviews: [{ author: 'Gamer4', text: 'A masterpiece.' }], comments: [], downloadLinks: [{ source: 'Epic Games', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date() },
            { id: 5, title: 'Game 5', description: 'Description for Game 5', rating: '8.8/10', reviews: [{ author: 'Gamer5', text: 'Highly recommended.' }], comments: [], downloadLinks: [{ source: 'Steam', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
            { id: 6, title: 'Game 6', description: 'Description for Game 6', rating: '7.8/10', reviews: [{ author: 'Gamer6', text: 'Solid game.' }], comments: [], downloadLinks: [{ source: 'Epic Games', url: '#' }], imageUrl: 'https://via.placeholder.com/300x200', media: [{ type: 'image', url: 'https://via.placeholder.com/600x400' }], createdAt: new Date('2023-01-01') },
        ]
    };

    function getData() {
        let data = JSON.parse(localStorage.getItem('jiggyz-data'));
        if (!data) {
            data = sampleData;
            localStorage.setItem('jiggyz-data', JSON.stringify(data));
        } else {
            // Dates are not preserved when stringifying, so we need to convert them back
            data.movies.forEach(m => {
                m.createdAt = new Date(m.createdAt);
                if (!m.comments) m.comments = [];
            });
            data.games.forEach(g => {
                g.createdAt = new Date(g.createdAt);
                if (!g.comments) g.comments = [];
            });
        }
        return data;
    }

    function saveData(data) {
        localStorage.setItem('jiggyz-data', JSON.stringify(data));
    }

    const siteData = getData();

    function getPopularItems() {
        // Find the single movie and game marked as popular
        const popularMovie = siteData.movies.find(m => m.popular);
        const popularGame = siteData.games.find(g => g.popular);

        // Return them in an array, filtering out any that are undefined
        return [popularMovie, popularGame].filter(Boolean);
    }

    function createItemCard(item, type) {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <h3>${item.title}</h3>
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

    function loadDetails() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const id = parseInt(params.get('id'));

        if (type && id) {
            const items = type === 'movie' ? siteData.movies : siteData.games;
            const item = items.find(i => i.id === id);

            if (item) {
                document.getElementById('item-title').textContent = item.title;
                document.getElementById('edit-post-button').href = `edit.html?type=${type}&id=${id}`;
                document.getElementById('item-description').textContent = item.description;
                document.getElementById('item-rating').textContent = item.rating;

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
                    commentForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const author = document.getElementById('comment-author').value;
                        const text = document.getElementById('comment-text').value;
                        if (author && text) {
                            if (!item.comments) {
                                item.comments = [];
                            }
                            item.comments.push({ author, text });
                            saveData(siteData);
                            loadDetails(); // Reload details to show new comment
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
        createPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(createPostForm);
            const type = formData.get('type');
            const mediaUrls = formData.get('media-urls').split('\n').filter(url => url.trim() !== '');
            const media = mediaUrls.map(url => ({ type: 'image', url }));

            const newPost = {
                id: Date.now(),
                title: formData.get('title'),
                description: formData.get('description'),
                rating: formData.get('rating'),
                imageUrl: formData.get('imageUrl'),
                reviews: [{ author: formData.get('review-author'), text: formData.get('review-text') }],
                downloadLinks: [{ source: formData.get('download-source'), url: formData.get('download-url') }],
                createdAt: new Date(),
                media: media,
                comments: []
            };

            if (type === 'movie') {
                siteData.movies.push(newPost);
            } else {
                siteData.games.push(newPost);
            }

            saveData(siteData);
            window.location.href = type === 'movie' ? 'movies.html' : 'games.html';
        });
    }

    const editPostForm = document.getElementById('edit-post-form');
    if (editPostForm) {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const id = parseInt(params.get('id'));

        const items = type === 'movie' ? siteData.movies : siteData.games;
        const item = items.find(i => i.id === id);

        if (item) {
            document.getElementById('edit-id').value = item.id;
            document.getElementById('edit-type').value = type;
            document.getElementById('title').value = item.title;
            document.getElementById('description').value = item.description;
            document.getElementById('rating').value = item.rating;
            document.getElementById('imageUrl').value = item.imageUrl;
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

        editPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(editPostForm);
            const updatedId = parseInt(formData.get('edit-id'));
            const updatedType = formData.get('edit-type');
            
            const items = updatedType === 'movie' ? siteData.movies : siteData.games;
            const itemIndex = items.findIndex(i => i.id === updatedId);

            if (itemIndex > -1) {
                const mediaUrls = formData.get('media-urls').split('\n').filter(url => url.trim() !== '');
                const media = mediaUrls.map(url => ({ type: 'image', url }));

                items[itemIndex] = {
                    ...items[itemIndex],
                    title: formData.get('title'),
                    description: formData.get('description'),
                    rating: formData.get('rating'),
                    imageUrl: formData.get('imageUrl'),
                    reviews: [{ author: formData.get('review-author'), text: formData.get('review-text') }],
                    downloadLinks: [{ source: formData.get('download-source'), url: formData.get('download-url') }],
                    media: media,
                    popular: formData.get('popular') === 'on'
                };
                saveData(siteData);
                window.location.href = updatedType === 'movie' ? 'movies.html' : 'games.html';
            }
        });
    }

    const homePageSlider = document.querySelector('.hero-section .hero-slider');
    if (homePageSlider) {
        const popularItems = getPopularItems();
        const slidesContainer = homePageSlider.querySelector('.hero-slides');

        popularItems.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <h3>${item.title}</h3>
            `;
            slide.addEventListener('click', () => {
                const type = siteData.movies.some(m => m.id === item.id) ? 'movie' : 'game';
                window.location.href = `details.html?type=${type}&id=${item.id}`;
            });
            slidesContainer.appendChild(slide);
        });

        initializeSlider(homePageSlider);
    }
});