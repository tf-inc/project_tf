class JeffersonCylinder {
    constructor(numDisks = 15, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        this.numDisks = numDisks;
        this.alphabet = alphabet;
        this.disks = ['MGUHDIYNLASVXKWTJBRECQOFPZ', 'UNXBTPLCZYQSDAVWJMKOEHGFRI', 'PQILOTJGYBUKVACRSZXEHMWDFN', 'FCEDVMIWKJBHZPUTLYOXRAGSNQ', 'LUPFZYCQMDHWINGVXATEBOJSRK', 'VNWKEUZBFTXHRGPYAQLDJSCOIM', 'FPGUZBQSWXRYMDOCJHKVLTIANE', 'ZOUKLQAESFPJRCXMHDIWTGVYNB', 'HJAXMLFCSBYQITGNODPKZWEUVR', 'GMIKOCPNTSFRLVUJDYXZHWBQEA', 'QHTMRICXSGYWAEVDPZKNUJBFLO', 'PHNFJXBAEQVIZDOURKLSYTMGCW', 'HJPKTVYLFIQOBRANSZCWMUXDGE', 'TDMWHARGJZXQSLVNCFEPIBKYUO', 'VNRIMBWTJKHUSQDGZAPELXOCYF', 'CYPFKXQBVUMTHRGJSLIEWAODNZ', 'OKVNAURJTWMFPCYEXGHQIBZDSL', 'RVHMSTQKZLPGJBINXYCAUODEFW', 'YPBNXJRACDQHTEILWFUZSVGKOM', 'VTJPLYSKBOUCDEFRINWQMGHZXA', 'CUYWFQMPLZXITEDBRGKHANSJOV', 'DMLCHNKWRGAPSZQOIVYUFTBJEX', 'OFWQZAEURTMXSCJDNLBPYVIGHK', 'QBFTUOYMJPXSEWGZILRDHVKNAC', 'WFPSJKDQZYEXBMLOHNVGUTRCAI', 'ZPYRWCQMSHKJBDLAVGEONITUFX', 'CPJOWXTLMRQIEBHVKYUFSZDNAG', 'FLVMECYUDBKIJXGWHATRQSPNOZ', 'KMAWXUZFJRLCYIGDEHNVQBOSTP', 'AUKWXHNDMLTRYSZPIEBOGVCFJQ', 'HIFWKLSCDOPGQEXJTVBZNUYAMR', 'FHETRLKIOAVDQGUSWXBYCZPNMJ', 'SIHAGXPLFKNUJZBQMTWDYROCEV', 'PLMYRNIKOCGWVHBDXFUESQATZJ', 'HYPOWLXFCMSGTDJBRZVAINUQEK', 'FVBDIJWNXMKLCAOYPGHQTRSZEU']
        this.diskPositions = new Array(numDisks).fill(0);
        this.canvas = document.getElementById('cylinderCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.diskWidth = 45;
        this.startX = 50;
        this.startY = 50;
        this.rowHeight = 28;
        this.canvas.width = Math.max(900, this.startX * 2 + this.numDisks * this.diskWidth);

        this.initEventListeners();
        this.draw();
        this.updateDiskControls();

        this.activeDisk = null;
        this.isDragging = false;
        this.lastMouseY = 0;
        this.velocities = new Array(this.numDisks).fill(0);
        this.animationFrame = null;
    }


    rotateDisk(diskIndex, delta) {
        // delta: +1 вверх, -1 вниз
        const newPos = this.diskPositions[diskIndex] + delta;
        this.diskPositions[diskIndex] = ((newPos % this.alphabet.length) + this.alphabet.length) % this.alphabet.length;
        this.draw();
        this.updateDiskControls();
    }

    getCharAt(diskIndex, rowOffset) {
        const position = Math.round(this.diskPositions[diskIndex]);
        let charIndex = (position + rowOffset) % this.alphabet.length;
        if (charIndex < 0) charIndex += this.alphabet.length;
        return this.disks[diskIndex][charIndex];
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerY = this.startY + 2 * this.rowHeight; // центральный ряд (индекс 2 из 5)

        for (let i = 0; i < this.numDisks; i++) {
            const x = this.startX + i * this.diskWidth;

            this.ctx.fillStyle = '#0a050a';
            this.ctx.fillRect(x, this.startY - 8, this.diskWidth - 5, 160);

            this.ctx.strokeStyle = '#1a0e1a';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, this.startY - 8, this.diskWidth - 5, 160);

            for (let row = -2; row <= 2; row++) {
                const char = this.getCharAt(i, row);
                let offset = this.diskPositions[i] - Math.round(this.diskPositions[i]);
                const y = centerY + (row - offset) * this.rowHeight;

                // Прозрачность: центральный ряд — полная, дальше — тусклее
                let opacity;
                if (row === 0) opacity = 1;
                else if (Math.abs(row) === 1) opacity = 0.45;
                else opacity = 0.15;

                this.ctx.font = `bold ${24}px 'Courier New', monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                if (row === 0) {
                    this.ctx.shadowBlur = 6;
                    this.ctx.shadowColor = '#422442';
                } else {
                    this.ctx.shadowBlur = 0;
                }

                this.ctx.fillStyle = `rgba(212, 184, 212, ${opacity})`;
                this.ctx.fillText(char, x + this.diskWidth / 2 - 2.5, y);
            }

            this.ctx.shadowBlur = 0;

            if (i < this.numDisks - 1) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#1a0e1a';
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(x + this.diskWidth - 5, this.startY - 8);
                this.ctx.lineTo(x + this.diskWidth - 5, this.startY + 152);
                this.ctx.stroke();
            }
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2A182A';
        this.ctx.lineWidth = 1;
        const centerYLine = centerY + 2;
        this.ctx.moveTo(this.startX - 5, centerYLine);
        this.ctx.lineTo(this.startX + this.numDisks * this.diskWidth, centerYLine);
        this.ctx.stroke();
    }

    updateDiskControls() {
        const container = document.getElementById('diskButtons');
        if (!container) return;

        container.innerHTML = '';

        for (let i = 0; i < this.numDisks; i++) {
            const diskDiv = document.createElement('div');
            diskDiv.className = 'disk-control';

            const label = document.createElement('div');
            label.className = 'disk-label';
            label.textContent = `${i + 1}`;

            const buttonsGroup = document.createElement('div');
            buttonsGroup.className = 'disk-buttons-group';

            const upBtn = document.createElement('button');
            upBtn.textContent = '▲';
            upBtn.className = 'disk-btn';
            upBtn.title = 'Вращать вверх';
            upBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rotateDisk(i, 1);
            });

            const downBtn = document.createElement('button');
            downBtn.textContent = '▼';
            downBtn.className = 'disk-btn';
            downBtn.title = 'Вращать вниз';
            downBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rotateDisk(i, -1);
            });

            buttonsGroup.appendChild(upBtn);
            buttonsGroup.appendChild(downBtn);

            diskDiv.appendChild(label);
            diskDiv.appendChild(buttonsGroup);
            container.appendChild(diskDiv);
        }
    }

    resetPositions() {
        for (let i = 0; i < this.numDisks; i++) {
            this.diskPositions[i] = 0;
        }
        this.draw();
    }

    randomizePositions() {
        for (let i = 0; i < this.numDisks; i++) {
            this.diskPositions[i] = Math.floor(Math.random() * this.alphabet.length);
        }
        this.draw();
    }

    initEventListeners() {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetPositions());
        }

        const randomizeBtn = document.getElementById('randomizeBtn');
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => this.randomizePositions());
        }

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const diskIndex = this.getDiskIndexFromX(x);
            if (diskIndex !== null) {
                this.activeDisk = diskIndex;
                this.isDragging = true;
                this.lastMouseY = y;
                this.velocity = 0;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging || this.activeDisk === null) return;

            const rect = this.canvas.getBoundingClientRect();
            const y = e.clientY - rect.top;

            const deltaY = this.lastMouseY - y;

            const rotation = Math.max(-1, Math.min(1, deltaY / 20));

            this.diskPositions[this.activeDisk] += rotation;
            this.velocities[this.activeDisk] = rotation;

            this.lastMouseY = y;

            this.normalizeDisk(this.activeDisk);
            this.draw();
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.startInertia(this.activeDisk);
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];



            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const diskIndex = this.getDiskIndexFromX(x);

            if (diskIndex !== null) {
                this.activeDisk = diskIndex;
                this.isDragging = true;
                this.lastMouseY = y;
                this.velocities[diskIndex] = 0;

                this.startTouchX = x;
                this.startTouchY = y;
                this.touchMode = null;
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.activeDisk === null) return;

            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();

            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const deltaX = x - this.startTouchX;
            const deltaY = this.startTouchY - y;

            // Определяем режим только один раз
            if (!this.touchMode) {
                const threshold = 5; // защита от случайных движений

                if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
                    return;
                }

                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    this.touchMode = 'rotate';
                } else {
                    this.touchMode = 'scroll';
                }
            }

            // Если пользователь скроллит — не мешаем браузеру
            if (this.touchMode === 'scroll') {
                return;
            }

            // 👉 Вращение диска
            const moveY = this.lastMouseY - y;
            const rotation = Math.max(-1, Math.min(1, moveY / 15)); // чуть чувствительнее для тача

            this.diskPositions[this.activeDisk] += rotation;
            this.velocities[this.activeDisk] = rotation;

            this.lastMouseY = y;

            this.normalizeDisk(this.activeDisk);
            this.draw();

            e.preventDefault(); // ❗ только при вращении
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.startInertia(this.activeDisk);
            }
            this.touchMode = null;
        });
    }

    getDiskIndexFromX(x) {
        const relativeX = x - this.startX;
        if (relativeX < 0) return null;

        const index = Math.floor(relativeX / this.diskWidth);
        if (index >= 0 && index < this.numDisks) return index;

        return null;
    }

    normalizeDisk(index) {
        const len = this.alphabet.length;
        this.diskPositions[index] = ((this.diskPositions[index] % len) + len) % len;
    }

    startInertia(diskIndex) {
        const friction = 0.95;

        const animate = () => {
            let v = this.velocities[diskIndex];

            if (Math.abs(v) < 0.001) {
                this.velocities[diskIndex] = 0;
                this.startSnap(diskIndex);
                return;
            }

            this.diskPositions[diskIndex] += v;
            this.normalizeDisk(diskIndex);

            this.velocities[diskIndex] *= friction;

            this.draw();

            requestAnimationFrame(animate);
        };

        animate();
    }

    startSnap(diskIndex) {
        const target = Math.round(this.diskPositions[diskIndex]);

        const stiffness = 0.15;
        const damping = 0.8;

        let velocity = 0;

        const animate = () => {
            let pos = this.diskPositions[diskIndex];

            const force = (target - pos) * stiffness;
            velocity += force;
            velocity *= damping;

            pos += velocity;

            this.diskPositions[diskIndex] = pos;

            // Условие остановки
            if (Math.abs(velocity) < 0.001 && Math.abs(target - pos) < 0.001) {
                this.diskPositions[diskIndex] = target;
                this.draw();
                return;
            }

            this.draw();
            requestAnimationFrame(animate);
        };

        animate();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new JeffersonCylinder(36, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
});