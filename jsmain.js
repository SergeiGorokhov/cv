// Копирование email
function copyEmail() {
    const email = 'maritimurus@mail.ru';
    navigator.clipboard.writeText(email).then(() => {
        const notification = document.getElementById('copy-notification');
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    });
}

// Находим форму на странице
const form = document.getElementById('feedback-form');

// Добавляем обработчик события отправки
form.addEventListener('submit', async (event) => {
    // 1. Отменяем стандартную перезагрузку страницы
    event.preventDefault();

    // 2. Собираем данные из формы в объект FormData
    const formData = new FormData(form);
    
    // 3. Показываем пользователю, что идёт отправка (меняем текст кнопки)
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Отправляю...';
    submitButton.disabled = true;

    try {
        // 4. Отправляем данные на сервер Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Говорим, что ждём ответ в JSON
            }
        });

        // 5. Обрабатываем ответ
        if (response.ok) {
            alert('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.');
            form.reset(); // Очищаем форму
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error || 'Не удалось отправить сообщение. Попробуйте позже.'}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке:', error);
        alert('Произошла техническая ошибка. Пожалуйста, попробуйте ещё раз или напишите мне напрямую в Telegram.');
    } finally {
        // 6. Возвращаем кнопке исходный вид
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Убегающая кнопка — простая стабильная версия
const escapeBtn = document.getElementById('escape-btn');
const testContainer = document.querySelector('.escape-wrapper');

if (escapeBtn && testContainer) {
    function moveAway(e) {
        const btnRect = escapeBtn.getBoundingClientRect();
        const containerRect = testContainer.getBoundingClientRect();
        
        // Центр кнопки
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        // Позиция курсора
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Вектор от кнопки к курсору
        let dx = mouseX - btnCenterX;
        let dy = mouseY - btnCenterY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            // Нормализуем и умножаем на силу отталкивания
            const force = Math.min((200 - distance) / 200, 1) * 250;
            if (distance > 5) {
                dx = (dx / distance) * force;
                dy = (dy / distance) * force;
            } else {
                dx = (Math.random() - 0.5) * 180;
                dy = (Math.random() - 0.5) * 180;
            }
            
            // Двигаем кнопку в противоположную сторону
            let newX = -dx;
            let newY = -dy;
            
            // Ограничиваем, чтобы кнопка не вылетала за пределы контейнера
            const maxX = (containerRect.width - btnRect.width) / 2;
            const maxY = (containerRect.height - btnRect.height) / 2;
            
            newX = Math.min(Math.max(newX, -maxX), maxX);
            newY = Math.min(Math.max(newY, -maxY), maxY);
            
            escapeBtn.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    }
    
    function resetPosition() {
        escapeBtn.style.transform = 'translate(0, 0)';
    }
    
    testContainer.addEventListener('mousemove', moveAway);
    testContainer.addEventListener('mouseleave', resetPosition);
    
    escapeBtn.addEventListener('click', function() {
        alert('🎉 Ты поймал! 🎉');
        escapeBtn.textContent = '✅ ПОЙМАНА! ✅';
        setTimeout(() => {
            escapeBtn.textContent = 'Нажми меня 👆';
            resetPosition();
        }, 1500);
    });
}



// Мобильная убегающая кнопка — убегает при касании (до нажатия)
function initMobileEscapeButton() {
    const escapeBtn = document.getElementById('escape-btn');
    const escapeWrapper = document.querySelector('.escape-wrapper');
    
    if (!escapeBtn || !escapeWrapper) return;
    
    // Проверяем мобильное устройство
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile) return;
    
    let isJumping = false;
    
    function jumpAway() {
        if (isJumping) return;
        isJumping = true;
        
        const containerRect = escapeWrapper.getBoundingClientRect();
        const btnRect = escapeBtn.getBoundingClientRect();
        
        const maxX = (containerRect.width - btnRect.width) / 2;
        const maxY = (containerRect.height - btnRect.height) / 2;
        
        let randomX = (Math.random() - 0.5) * maxX * 1.2;
        let randomY = (Math.random() - 0.5) * maxY * 1.2;
        
        randomX = Math.min(Math.max(randomX, -maxX), maxX);
        randomY = Math.min(Math.max(randomY, -maxY), maxY);
        
        escapeBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
        
        setTimeout(() => {
            isJumping = false;
        }, 200);
    }
    
    // 🟢 ПРЯМО ЗДЕСЬ — убегает при попытке нажать (до касания)
    escapeBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();  // блокируем стандартное поведение
        jumpAway();
    });
    
    // Блокируем click, чтобы не срабатывал после прыжка
    escapeBtn.addEventListener('click', function(e) {
        e.preventDefault();
    });
}

document.addEventListener('DOMContentLoaded', initMobileEscapeButton);