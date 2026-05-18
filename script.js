(function () {
    const encryptedKey1 = '3d91d3f5cc7098ca1f07fab3f679d829be458dbf295228efb89a6ea2762efdccc474d858de0498993745ba83543f05fc9c544b09b603eccef2881469e9c93bba';

    const encryptedKey2 = "faf3c3d5a05cf72e6d45de746826f213dc29213d6c0be10e02afef09ff830e15001f71787b7570facc2a3768f2444c9c6588973cb3692229e765e1421bb251f3";

    const encryptedKey3 = "548ed8f7e9283a22b4d7bf2eba15a38cf4bc6c324a8ceccebab6aa02e5a93975bf768d31c19ec065766e68a6b290b4e77dd7c21ed42bb49d5b87c319e4c6235c";

    const encryptedKey4 = "525dcabed8747e6b7b6bd4639a9f17ce7d5a145cd2e6859c8526f1da15575da4446939819b206fc5ea38ce5cc44af4dd82c12c8d7d1d5c7cab246bb00182e203"

    const encryptedKey5_v1 = "fb292f58b215899a81b3d8b3a377a55590827c5bd0bee7ff6592a1fd05963ccdc91783246017aea35250863330c81d2b84806834601932e834245b220b5ee28a";
    const encryptedKey5_v2 = "51052b26f88ca28aa66db587e645764c6b7ba0c90cd75ea4d5e959db30659f8c12c44a023038adac8e751a88f42f295eac2d7d8983e4e38e5fa6261345375772";
    const encryptedKey5_v3 = "f20c48bc89289c7e180e01e5c869f2625b9658b664b358498a19631d0d07f77370f652f699919833fda34eafdd58a76fe73a514843354b5bfc63d552ed419f53";
    const encryptedKey5_v4 = "876ebb88d1f859df120b8f6613f2632052d52cf7743c9c8e4b4a7065735573b3bfc27692e2602ff2599e7dceb574635808bbbd60aaa2f2153e3b0140424d9230";

    const maxKey = 5;


    const CORRECT_KEYS = {
        1: encryptedKey1,
        2: encryptedKey2,
        3: encryptedKey3,
        4: encryptedKey4
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

        if (level === 3 || level === 4 || level === 5) {
            enteredValue = normalizeKey(enteredValue);
        }
        entrance = new Stribog();
        let enteredHash = entrance.hashHex(enteredValue);


        if (level === 5) {
            const validHashes = [encryptedKey5_v1, encryptedKey5_v2, encryptedKey5_v3, encryptedKey5_v4];
            isCorrect = validHashes.includes(enteredHash);
        } else {
            isCorrect = (enteredHash === CORRECT_KEYS[level]);
        }

        if (isCorrect) {
            if (level === 4) {
                applyTrueTheme();
                showNextInput(level + 1);
            }
            else if (level === maxKey) {
                showCompletionScreen();
                // showSoonMessage();
            } else {
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

        // applyTrueTheme();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const firstInput = createInputElement('Введите ключ 1', 1);
        inputsContainer.appendChild(firstInput);
        currentLevel = 1;

        setTimeout(() => {
            document.querySelector('.key-input')?.focus();
        }, 100);
    });


    function applyTrueTheme() {

        document.body.classList.add('theme-true');
    }

    function showCompletionScreen() {

        const elementsToHide = [
            document.querySelector('.logo-header'),
            document.querySelector('.manual-section'),
            document.querySelector('.logo-footer'),
            inputsContainer,
            soonMessage
        ];

        // Создаём контейнер сразу, но скрытым
        const completionDiv = document.createElement('div');
        completionDiv.className = 'completion-container';
        completionDiv.style.opacity = '0';
        completionDiv.innerHTML = `
        <div class="completion-box">
            <a href="https://forms.gle/3Kra9gjADj5QAiUz8" target="_blank" class="completion-link">
                Завершить испытание
            </a>
        </div>
    `;
        document.querySelector('.container').appendChild(completionDiv);

        // Плавно скрываем старые элементы и показываем новый
        setTimeout(() => {
            elementsToHide.forEach(el => {
                if (el) {
                    el.style.transition = 'opacity 1s ease';
                    el.style.opacity = '0';
                }
            });

            completionDiv.style.transition = 'opacity 1s ease';
            completionDiv.style.opacity = '1';

            // Удаляем старые элементы после исчезновения
            setTimeout(() => {
                elementsToHide.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            }, 1000);
        }, 50);
    }
})();