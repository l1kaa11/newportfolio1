document.addEventListener('DOMContentLoaded', () => {
    // Инициализация языка
    let currentLang = localStorage.getItem('language') || 'ru';
    updateLanguage(currentLang);
    updateActiveButton(document.querySelector(`.lang-btn[data-lang="${currentLang}"]`));

    // Обработчики переключения языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            updateLanguage(lang);
            updateActiveButton(btn);
        });
    });

    // Функция обновления языка
    function updateLanguage(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // Функция обновления активной кнопки
    function updateActiveButton(activeBtn) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Анимация появления элементов
    const elements = document.querySelectorAll('.profile-card > *');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Эффекты карточки и навигации
    initializeCardEffects();
    initializeNavigation();
    
    // Инициализация редактируемых элементов
    initializeEditableElements();
    
    // Инициализация админ-панели и загрузка сохраненных изменений
    if (checkAdmin()) {
        initAdminPanel();
        loadSavedChanges();
    }
});

// Функции для эффектов карточки
function initializeCardEffects() {
    const profileCard = document.querySelector('.profile-card');
    
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    // Анимация для социальных ссылок
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        });
    });
}

// Функции для навигации
function initializeNavigation() {
    const floatingNav = document.querySelector('.floating-nav');
    const floatingNavToggle = document.querySelector('.floating-nav-toggle');
    const floatingNavItems = document.querySelectorAll('.floating-nav-item');

    floatingNavToggle.addEventListener('click', () => {
        floatingNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!floatingNav.contains(e.target)) {
            floatingNav.classList.remove('active');
        }
    });

    floatingNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                    floatingNav.classList.remove('active');
                }
            }
        });
    });

    // Добавление ID к секциям
    const sections = {
        'about': document.querySelector('.about'),
        'skills': document.querySelector('.skills'),
        'education': document.querySelector('.education'),
        'contacts': document.querySelector('.contact')
    };

    Object.entries(sections).forEach(([id, section]) => {
        if (section && !section.id) {
            section.id = id;
        }
    });
}

// Функции для редактируемых элементов
function initializeEditableElements() {
    const processSteps = document.querySelectorAll('.process-step .step-content p');
    processSteps.forEach((step, index) => {
        step.id = `process-step-${index}`;
        step.classList.add('editable');
    });

    const planItems = document.querySelectorAll('.plan-list li');
    planItems.forEach((item, index) => {
        item.id = `plan-item-${index}`;
        item.classList.add('editable');
    });
}

// Функции для админ-панели
function checkAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

function initAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel active';
    adminPanel.innerHTML = `
        <button onclick="toggleEditMode()">Режим редактирования</button>
        <button onclick="saveChanges()">Сохранить изменения</button>
    `;
    document.body.appendChild(adminPanel);
}

function toggleEditMode() {
    const editables = document.querySelectorAll('.editable');
    editables.forEach(element => {
        if (element.contentEditable === 'true') {
            element.contentEditable = 'false';
            element.style.backgroundColor = 'transparent';
        } else {
            element.contentEditable = 'true';
            element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

function saveChanges() {
    const editables = document.querySelectorAll('.editable');
    const changes = {};
    
    editables.forEach(element => {
        changes[element.id] = element.textContent;
    });
    
    localStorage.setItem('portfolioContent', JSON.stringify(changes));
    alert('Изменения сохранены!');
}

function loadSavedChanges() {
    const savedChanges = JSON.parse(localStorage.getItem('portfolioContent')) || {};
    Object.entries(savedChanges).forEach(([id, content]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    });
} 