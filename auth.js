document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPage = window.location.pathname.split('/').pop();

    // Если пользователь авторизован и пытается получить доступ к странице входа/регистрации
    if (isAuthenticated && ['login.html', 'register.html'].includes(currentPage)) {
        window.location.href = 'index.html';
        return;
    }

    // Управление отображением кнопок авторизации
    const authButtons = document.querySelector('.auth-buttons');
    const languageSwitcher = document.querySelector('.language-switcher');

    if (isAuthenticated) {
        // Если пользователь авторизован
        if (authButtons) {
            authButtons.style.display = 'none';
        }

        if (languageSwitcher) {
            // Показываем email пользователя
            const userEmail = localStorage.getItem('userEmail');
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `<span class="user-email">${userEmail}</span>`;
            languageSwitcher.appendChild(userInfo);

            // Добавляем кнопку выхода
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.title = 'Выйти';
            languageSwitcher.appendChild(logoutBtn);

            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                window.location.reload();
            });
        }
    } else {
        // Если пользователь не авторизован
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
    }
});

function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', user.username);
        
        // Проверка на админа
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAdmin', 'true');
        } else {
            localStorage.removeItem('isAdmin');
        }
        return true;
    }
    return false;
} 