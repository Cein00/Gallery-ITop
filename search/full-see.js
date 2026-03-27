// Demo данные для работ
const worksData = [
    { id: 1, author: "@USER123", likes: 42, description: "Моя первая работа в стиле киберпанк", images: ["../img/placeholder1.jpg", "../img/placeholder2.jpg"], comments: [{author: "fan1", text: "Круто!"}], link: "https://github.com/user123/project" },
    { id: 2, author: "@USER456", likes: 18, description: "Абстракция", images: ["../img/placeholder1.jpg"], comments: [], link: "" }
];

let currentWork = null;
let currentImageIndex = 0;

// Элементы
const modal = document.getElementById('workModal');
const closeModalBtn = modal.querySelector('.work-close');
const workImage = modal.querySelector('.work-image');
const prevBtn = modal.querySelector('.prev');
const nextBtn = modal.querySelector('.next');
const imageCounter = modal.querySelector('.image-counter');
const likeBtn = modal.querySelector('.like-btn');
const likeCountSpan = modal.querySelector('.like-count');
const likeIcon = likeBtn.querySelector('img'); // иконка лайка
const copyLinkBtn = modal.querySelector('.copy-link-btn');
const workAuthor = modal.querySelector('.work-author');
const workDesc = modal.querySelector('.work-description');
const workLink = modal.querySelector('.work-link');

// Модалка комментариев
const commentsModal = document.getElementById('commentsModal');
const closeCommentsBtn = commentsModal.querySelector('.comments-close');
const commentsListFull = commentsModal.querySelector('.comments-list-full');
const sendCommentFullBtn = commentsModal.querySelector('.send-comment-full');
const commentFullTextarea = commentsModal.querySelector('.add-comment-full textarea');

// Кнопка открытия модалки комментариев
const openCommentsBtn = document.getElementById('openCommentsBtn');

// Тостер
const toast = document.getElementById('toastNotification');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function openWorkModal(work) {
    currentWork = work;
    currentImageIndex = 0;
    if (currentWork.liked === undefined) currentWork.liked = false;

    workAuthor.textContent = currentWork.author;
    workDesc.textContent = currentWork.description;
    likeCountSpan.textContent = currentWork.likes;
    if (currentWork.link && currentWork.link.trim() !== '') {
        workLink.innerHTML = `<a href="${currentWork.link}" target="_blank">${currentWork.link}</a>`;
        workLink.style.display = 'block';
    } else {
        workLink.style.display = 'none';
    }

    updateImage();
    updateLikeUI(); // обновить иконку и счётчик
    modal.style.display = 'flex';
}

function updateImage() {
    const imgSrc = currentWork.images[currentImageIndex];
    workImage.src = imgSrc;
    imageCounter.textContent = `${currentImageIndex+1} / ${currentWork.images.length}`;
    prevBtn.style.visibility = currentWork.images.length > 1 ? 'visible' : 'hidden';
    nextBtn.style.visibility = currentWork.images.length > 1 ? 'visible' : 'hidden';
}

function updateLikeUI() {
    likeCountSpan.textContent = currentWork.likes;
    if (currentWork.liked) {
        likeIcon.src = '../img/heart-filled.png';
    } else {
        likeIcon.src = '../img/heart.png';
    }
}

function toggleLike() {
    if (!currentWork.liked) {
        currentWork.likes++;
        currentWork.liked = true;
    } else {
        currentWork.likes--;
        currentWork.liked = false;
    }
    updateLikeUI();
}

function renderFullComments() {
    commentsListFull.innerHTML = '';
    currentWork.comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `<span class="comment-author">${comment.author}</span><span class="comment-text">${comment.text}</span>`;
        commentsListFull.appendChild(div);
    });
}

function addComment(text, author = "Вы") {
    const newComment = { author, text };
    currentWork.comments.push(newComment);
    renderFullComments();
}

// События слайдера
prevBtn.addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImage();
    }
});
nextBtn.addEventListener('click', () => {
    if (currentImageIndex < currentWork.images.length - 1) {
        currentImageIndex++;
        updateImage();
    }
});

// Лайк
likeBtn.addEventListener('click', toggleLike);

// Копирование ссылки
function copyLink() {
    const fakeLink = `https://gallery-itop.com/work/${currentWork.id}`;
    navigator.clipboard.writeText(fakeLink).then(() => showToast('Ссылка скопирована'));
}
copyLinkBtn.addEventListener('click', copyLink);

// Открытие модалки комментариев
openCommentsBtn.addEventListener('click', () => {
    renderFullComments();
    commentsModal.style.display = 'flex';
});
closeCommentsBtn.addEventListener('click', () => commentsModal.style.display = 'none');
commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) commentsModal.style.display = 'none';
});

// Отправка комментария
sendCommentFullBtn.addEventListener('click', () => {
    const text = commentFullTextarea.value.trim();
    if (text) {
        addComment(text);
        commentFullTextarea.value = '';
        commentsListFull.scrollTop = commentsListFull.scrollHeight;
    }
});

// Закрытие главного модального окна
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Привязка к карточкам
document.querySelectorAll('.card-modern').forEach((card, idx) => {
    card.addEventListener('click', () => {
        const work = worksData[idx % worksData.length];
        openWorkModal(work);
    });
});

