const encryptedKey1 = [53, 55, 55, 53, 53, 55];


const encryptedKey2 = [99, 97];

const encryptedKey3 = "=EDMwIzXjlmbvN3XxQTM1kjM";

const maxKey = 3;

function decryptKey1() {
    return String.fromCharCode(...encryptedKey1.map(c => c - 3));
}

function decryptKey2() {
    return String.fromCharCode(...encryptedKey2.map(c => c ^ 0x55));
}

function encryptKey3(plainKey) {
    return plainKey.split('').map((char, index) => {
        return char.charCodeAt(0) ^ index;
    });
}

function decryptKey3() {
    return atob(encryptedKey3.split('').reverse().join(''));
}

function normalizeKey(key) {
    const parts = key.split('_');
    if (parts.length >= 3 && parts[1].toLowerCase() === 'sonic') {
        return parts[0] + '_sonic_' + parts.slice(2).join('_');
    }
    return key;
}

const CORRECT_KEYS = {
    1: decryptKey1(),
    2: decryptKey2(),
    3: decryptKey3()
};

let currentLevel = 0;
const inputsContainer = document.getElementById('key-inputs-container');
const soonMessage = document.getElementById('soon-message');

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

function handleInputCheck(inputElement) {
    const level = parseInt(inputElement.dataset.level);
    let enteredValue = inputElement.value.trim();

    if (level === 3) {
        enteredValue = normalizeKey(enteredValue);
    }

    if (enteredValue === CORRECT_KEYS[level]) {
        if (level === maxKey) {
            showSoonMessage();
        }
        else {
            showNextInput(level + 1);
        }
    }
    else {
        inputElement.classList.add('error');
        inputElement.value = '';
        inputElement.placeholder = 'Неверный ключ. Попробуйте снова.';
        setTimeout(() => {
            inputElement.classList.remove('error');
            inputElement.placeholder = `Введите ключ ${level}`;
        }, 1500);
    }
}

function showNextInput(level) {
    if (level > maxKey) return;

    const nextInput = createInputElement(`Введите ключ ${level}`, level);
    inputsContainer.appendChild(nextInput);
    currentLevel = level;
    nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nextInput.querySelector('.key-input').focus();
}

function showSoonMessage() {
    soonMessage.classList.remove('hidden');
    soonMessage.textContent = 'SOON';
    currentLevel = maxKey + 1;
    soonMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('DOMContentLoaded', () => {
    const firstInput = createInputElement('Введите ключ 1', 1);
    inputsContainer.appendChild(firstInput);
    currentLevel = 1;

    setTimeout(() => {
        document.querySelector('.key-input')?.focus();
    }, 100);
});


