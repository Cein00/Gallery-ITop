// Функция для уведомлений в стиле GALLERYITOP
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.5s ease forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

// 1. ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЕЙ (Чтение JSON)
async function getUsers() {
    try {
        const response = await fetch('../users.json'); // Путь к файлу
        return await response.json();
    } catch (error) {
        console.error("Ошибка чтения базы:", error);
        return [];
    }
}

// 2. ЛОГИКА ВХОДА
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('loginInput').value;
        const pass = document.getElementById('passInput').value;

        const users = await getUsers();
        const user = users.find(u => u.login === login && u.pass === pass);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'search/search.html';
        } else {
            showToast("Неверный логин или пароль!");
        }
    });
}


// --- 1. ЛОГИКА КАСТОМНОГО SELECT ---
const customSelect = document.getElementById('regRoleContainer');
if (customSelect) {
    const trigger = customSelect.querySelector('.select-trigger');
    const label = document.getElementById('regRoleLabel');
    const hiddenInput = document.getElementById('regRole');
    const options = customSelect.querySelectorAll('.option');

    // Открытие/Закрытие списка
    trigger.addEventListener('click', () => {
        customSelect.classList.toggle('open');
    });

    // Клик по опции
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.innerText;

            // Обновляем текст и скрытое поле
            label.innerText = text;
            hiddenInput.value = value;

            // Добавляем класс 'selected' триггеру (чтобы текст стал ярким)
            trigger.classList.add('selected');

            // Убираем 'selected' у всех опций и добавляем кликнутой
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // Закрываем список
            customSelect.classList.remove('open');
        });
    });

    // Закрытие списка при клике вне его
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });
}

// --- 2. ПЕРЕКЛЮЧЕНИЕ ВИДИМОСТИ ПАРОЛЯ (Глазик) ---
function setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    if (input && toggle) {
        toggle.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggle.src = '../img/eye-crossed.png'; // Перечеркнутый глаз
            } else {
                input.type = 'password';
                toggle.src = '../img/eye.png'; // Открытый глаз
            }
        });
    }
}

setupPasswordToggle('regPass', 'togglePass');
setupPasswordToggle('regPassConfirm', 'togglePassConfirm');



// ОБНОВЛЕННАЯ ЛОГИКА РЕГИСТРАЦИИ (БЕЗ Fetch, чтобы работало)
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => { // Убрали async
        e.preventDefault();
        
        const login = document.getElementById('regLogin').value;
        const role = document.getElementById('regRole').value; // Значение из скрытого поля
        const pass = document.getElementById('regPass').value;
        const passConfirm = document.getElementById('regPassConfirm').value;

        // Требования: 8 символов, 1 заглавная, 1 цифра
        const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!role) {
            showToast("Выберите направление!");
            return;
        }

        if (!passRegex.test(pass)) {
            showToast("Пароль: мин. 8 знаков, заглавная буква и цифра!");
            return;
        }

        if (pass !== passConfirm) {
            showToast("Пароли не совпадают!");
            return;
        }

        console.log("Успешная регистрация:", { login, pass, role });
        
        showToast("Регистрация успешна! Переходим ко входу...");

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const modal = document.getElementById('profileEditModal');
    const openBtn = document.getElementById('openEditBtn'); // Твоя шестеренка
    const closeBtn = document.getElementById('closeModalBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('editAvatarPreview');

    // 1. ОТКРЫТИЕ ПОПАПА
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex'; // Показываем оверлей
            
            // Заполняем поле логина текущим значением
            const currentNick = document.getElementById('displayNickname').innerText.replace('@', '');
            document.getElementById('editNickname').value = currentNick;
        });
    }

    // 2. ЗАКРЫТИЕ ПОПАПА
    // По клику на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // По клику на фон (вне карточки)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 3. ПРЕВЬЮ АВАТАРА (при выборе файла)
    if (avatarUpload && avatarPreview) {
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result; // Меняем превью в модалке
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. СОХРАНЕНИЕ (Обработка формы)
    const form = document.getElementById('editProfileForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Не перезагружаем страницу

            const newNick = document.getElementById('editNickname').value;
            const newPass = document.getElementById('editPass').value;
            const newPassConfirm = document.getElementById('editPassConfirm').value;
            const newAvatarSrc = avatarPreview.src;

            // Валидация пароля (твои правила из регистрации)
            if (newPass.length > 0) {
                const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
                if (!passRegex.test(newPass)) {
                    showToast("Пароль: 8+ знаков, заглавная и цифра!");
                    return;
                }
                if (newPass !== newPassConfirm) {
                    showToast("Пароли не совпадают!");
                    return;
                }
            }

            // ПРИМЕНЯЕМ ИЗМЕНЕНИЯ К СТРАНИЦЕ
            if (newNick) document.getElementById('displayNickname').innerText = '@' + newNick;
            if (avatarPreview.src !== '../img/user.png') {
                document.getElementById('displayAvatar').src = newAvatarSrc;
            }

            showToast("Профиль обновлен!");
            modal.style.display = 'none'; // Закрываем окно
        });
    }
});