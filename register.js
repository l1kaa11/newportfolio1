document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация формы регистрации');
    
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.error('Форма регистрации не найдена');
        return;
    }
    
    console.log('Форма регистрации найдена');
    
    // Проверяем, авторизован ли пользователь
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Форма отправлена');
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error('Не все поля формы найдены');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        console.log('Получены значения полей формы');

        // Проверка на заполнение всех полей
        if (!name || !email || !password || !confirmPassword) {
            showError('Пожалуйста, заполните все поля');
            return;
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Пожалуйста, введите корректный email');
            return;
        }

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            showError('Пароли не совпадают');
            return;
        }

        // Проверка длины пароля
        if (password.length < 6) {
            showError('Пароль должен содержать минимум 6 символов');
            return;
        }

        try {
            console.log('Начало процесса регистрации');
            
            // Проверка существующего email
            const existingEmail = localStorage.getItem('userEmail');
            console.log('Существующий email:', existingEmail);
            
            if (existingEmail === email) {
                showError('Пользователь с таким email уже существует');
                return;
            }

            // Сохраняем данные пользователя
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);
            localStorage.setItem('isAuthenticated', 'true');
            
            console.log('Данные пользователя сохранены');
            
            // Перенаправляем на главную страницу
            console.log('Перенаправление на главную страницу...');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            showError('Ошибка при регистрации');
        }
    });

    function showError(message) {
        console.log('Показ сообщения об ошибке:', message);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        registerForm.insertBefore(errorDiv, registerForm.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}); 