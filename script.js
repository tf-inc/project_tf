// --- Зашифрованные ключи ---
// Ключ 1: 244224 (зашифрован сдвигом Цезаря +3 в Unicode)
const encryptedKey1 = [55, 55, 55, 55, 55, 55]; // '7' (код 55) вместо '4' (код 52). Сдвиг +3
// Ключ 2: 64 (зашифрован XOR с ключом 0x55)
const encryptedKey2 = [53, 33]; // 6 XOR 0x55 = 53 (char '5'), 4 XOR 0x55 = 33 (char '!')

// Дешифровка
function decryptKey1() {
    return String.fromCharCode(...encryptedKey1.map(c => c - 3)); // Обратный сдвиг
}

function decryptKey2() {
    return String.fromCharCode(...encryptedKey2.map(c => c ^ 0x55)); // XOR
}

// Правильные ключи
const CORRECT_KEYS = {
    1: decryptKey1(), // "244224"
    2: decryptKey2()  // "64"
};

// Состояние приложения
let currentLevel = 0; // 0, 1, 2, 3 (3 = "Soon")
const inputsContainer = document.getElementById('key-inputs-container');
const soonMessage = document.getElementById('soon-message');

// Функция для создания поля ввода
function createInputElement(placeholderText, level) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group';
    wrapper.id = `input-group-${level}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'key-input';
    input.placeholder = `Введите ключ ${level}`;
    input.dataset.level = level;

    // Добавляем обработчик на нажатие Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInputCheck(e.target);
        }
    });

    wrapper.appendChild(input);
    return wrapper;
}

// Проверка введенного ключа
function handleInputCheck(inputElement) {
    const level = parseInt(inputElement.dataset.level);
    const enteredValue = inputElement.value.trim();

    // Проверяем, какой ключ должен быть на этом уровне
    if (level === 1 && enteredValue === CORRECT_KEYS[1]) {
        // Правильный первый ключ -> показываем второй
        inputElement.disabled = true;
        inputElement.style.opacity = '0.6';
        showNextInput(2);
    }
    else if (level === 2 && enteredValue === CORRECT_KEYS[2]) {
        // Правильный второй ключ -> показываем третий
        inputElement.disabled = true;
        inputElement.style.opacity = '0.6';
        showNextInput(3);
    }
    else if (level === 3) {
        // Третий ключ (любой ввод) -> Soon
        inputElement.disabled = true;
        inputElement.style.opacity = '0.6';
        showSoonMessage();
    }
    else {
        // Неверный ключ
        inputElement.style.borderColor = '#8b0000'; // Темно-красный для ошибки
        inputElement.value = '';
        inputElement.placeholder = 'Неверный ключ. Попробуйте снова.';
        setTimeout(() => {
            inputElement.style.borderColor = '#244224';
            inputElement.placeholder = `Введите ключ ${level}`;
        }, 1500);
    }
}

// Показать следующее поле ввода
function showNextInput(level) {
    if (level > 3) return; // Максимум 3 поля

    const nextInput = createInputElement(`Введите ключ ${level}`, level);
    inputsContainer.appendChild(nextInput);
    currentLevel = level;

    // Плавный скролл к новому полю (опционально)
    nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Показать сообщение "Soon"
function showSoonMessage() {
    soonMessage.classList.remove('hidden');
    soonMessage.textContent = 'SOON';
    currentLevel = 3;

    // Плавный скролл к сообщению
    soonMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- Инициализация при загрузке страницы ---
document.addEventListener('DOMContentLoaded', () => {
    // Для отладки (можно удалить позже)
    console.log('Ключ 1 (зашифрован):', CORRECT_KEYS[1]);
    console.log('Ключ 2 (зашифрован):', CORRECT_KEYS[2]);

    // Создаем первое поле ввода
    const firstInput = createInputElement('Введите ключ 1', 1);
    inputsContainer.appendChild(firstInput);
    currentLevel = 1;

    // Фокус на первом поле
    setTimeout(() => {
        document.querySelector('.key-input')?.focus();
    }, 100);
});