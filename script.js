// --- Зашифрованные ключи ---
// Ключ 1: "244224" (зашифрован сдвигом +3)
// Символ '2' (код 50) -> '5' (код 53), '4' (52) -> '7' (55)
const encryptedKey1 = [53, 55, 55, 53, 53, 55]; // "575557"

// Ключ 2: "64" (зашифрован XOR с 0x55)
// '6' (54) XOR 85 = 101 ('e'), '4' (52) XOR 85 = 97 ('a')
const encryptedKey2 = [99, 97]; // "ea"

// Дешифровка
function decryptKey1() {
    return String.fromCharCode(...encryptedKey1.map(c => c - 3));
}

function decryptKey2() {
    return String.fromCharCode(...encryptedKey2.map(c => c ^ 0x55));
}

// Правильные ключи
const CORRECT_KEYS = {
    1: decryptKey1(), // "244224"
    2: decryptKey2()  // "64"
};

// Состояние приложения
let currentLevel = 0; // 0 – нет полей, 1 – первое поле, 2 – второе поле, 3 – Soon
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
    input.placeholder = `Введите ключ ${level} (Enter для проверки)`;
    input.dataset.level = level;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInputCheck(e.target);
        }
    });

    wrapper.appendChild(input);
    return wrapper;
}

// Проверка введённого ключа
function handleInputCheck(inputElement) {
    const level = parseInt(inputElement.dataset.level);
    const enteredValue = inputElement.value.trim();

    if (level === 1 && enteredValue === CORRECT_KEYS[1]) {
        // Первый ключ верен -> показываем второе поле
        inputElement.disabled = true;
        inputElement.style.opacity = '0.6';
        showNextInput(2);
    }
    else if (level === 2 && enteredValue === CORRECT_KEYS[2]) {
        // Второй ключ верен -> показываем Soon (третье поле не создаётся)
        inputElement.disabled = true;
        inputElement.style.opacity = '0.6';
        showSoonMessage();
    }
    else {
        // Неверный ключ
        inputElement.classList.add('error');
        inputElement.value = '';
        inputElement.placeholder = 'Неверный ключ. Попробуйте снова.';
        setTimeout(() => {
            inputElement.classList.remove('error');
            inputElement.placeholder = `Введите ключ ${level}`;
        }, 1500);
    }
}

// Показать следующее поле ввода
function showNextInput(level) {
    if (level > 2) return; // Максимум два поля, дальше сразу Soon

    const nextInput = createInputElement(`Введите ключ ${level}`, level);
    inputsContainer.appendChild(nextInput);
    currentLevel = level;
    nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Показать сообщение "Soon"
function showSoonMessage() {
    soonMessage.classList.remove('hidden');
    soonMessage.textContent = 'SOON';
    currentLevel = 3;
    soonMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    // Для отладки (можно удалить)
    console.log('Ключ 1 (расшифрован):', CORRECT_KEYS[1]);
    console.log('Ключ 2 (расшифрован):', CORRECT_KEYS[2]);

    // Создаём первое поле
    const firstInput = createInputElement('Введите ключ 1', 1);
    inputsContainer.appendChild(firstInput);
    currentLevel = 1;

    setTimeout(() => {
        document.querySelector('.key-input')?.focus();
    }, 100);
});