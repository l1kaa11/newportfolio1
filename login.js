document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Если пользователь уже авторизован, перенаправляем на главную
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'index.html';
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Простая проверка на заполнение полей
        if (!email || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            // Сохраняем данные пользователя и авторизуем
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isAuthenticated', 'true');
            
            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка при входе:', error);
            showError('Ошибка при входе в систему');
        }
    });

    function showError(message) {
        // Создаем элемент для отображения ошибки
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Удаляем предыдущее сообщение об ошибке, если оно есть
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Добавляем новое сообщение об ошибке
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}); 