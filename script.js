const encryptedKey1 = '3d91d3f5cc7098ca1f07fab3f679d829be458dbf295228efb89a6ea2762efdccc474d858de0498993745ba83543f05fc9c544b09b603eccef2881469e9c93bba';

const encryptedKey2 = "faf3c3d5a05cf72e6d45de746826f213dc29213d6c0be10e02afef09ff830e15001f71787b7570facc2a3768f2444c9c6588973cb3692229e765e1421bb251f3";

const encryptedKey3 = "548ed8f7e9283a22b4d7bf2eba15a38cf4bc6c324a8ceccebab6aa02e5a93975bf768d31c19ec065766e68a6b290b4e77dd7c21ed42bb49d5b87c319e4c6235c";

const maxKey = 3;


const CORRECT_KEYS = {
    1: encryptedKey1,
    2: encryptedKey2,
    3: encryptedKey3
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
        enteredValue = normalizeKey(enteredValue); // Добавить эту строку
    }
    entrance = new Stribog();
    let enteredHash = entrance.hashHex(enteredValue);



    if (enteredHash === CORRECT_KEYS[level]) {
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

function normalizeKey(key) {
    return key.toLowerCase();
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


