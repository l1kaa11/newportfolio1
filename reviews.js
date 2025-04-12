document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const ratingStars = document.querySelectorAll('.rating i');
    const reviewsContainer = document.querySelector('.reviews-container');
    let currentRating = 0;

    // Загружаем существующие отзывы
    loadReviews();

    // Обработка наведения на звезды
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });

        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            highlightStars(currentRating);
        });
    });

    // Обработка отправки формы
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!currentRating) {
            showError('Пожалуйста, поставьте оценку');
            return;
        }

        const reviewText = document.getElementById('reviewText').value.trim();
        if (!reviewText) {
            showError('Пожалуйста, напишите текст отзыва');
            return;
        }

        // Создаем новый отзыв
        const review = {
            rating: currentRating,
            text: reviewText,
            author: localStorage.getItem('userEmail') || 'Гость',
            date: new Date().toLocaleDateString()
        };

        // Сохраняем отзыв
        saveReview(review);

        // Очищаем форму
        reviewForm.reset();
        currentRating = 0;
        highlightStars(0);

        // Показываем сообщение об успехе
        showSuccess('Спасибо за ваш отзыв!');
    });

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.classList.add('active');
            } else {
                star.classList.add('far');
                star.classList.remove('fas');
                star.classList.remove('active');
            }
        });
    }

    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.unshift(review); // Добавляем новый отзыв в начало массива
        localStorage.setItem('reviews', JSON.stringify(reviews));
        displayReviews(reviews);
    }

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        displayReviews(reviews);
    }

    function displayReviews(reviews) {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${getStarRating(review.rating)}
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
    }

    function getStarRating(rating) {
        return Array(5).fill(0).map((_, index) => 
            `<i class="${index < rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        reviewForm.insertBefore(errorDiv, reviewForm.firstChild);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        reviewForm.insertBefore(successDiv, reviewForm.firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }
}); 