
// ============================================
// SCREEN MANAGEMENT
// ============================================

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}


// ============================================
// FLOATING FLOWERS
// ============================================

const flowerLayer = document.getElementById("flowerLayer");
const flowers = ["🌸", "🌼", "✿", "❀", "🌷"];

for (let i = 0; i < 22; i++) {
    const flower = document.createElement("div");

    flower.className = "flower-particle";
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + "%";
    flower.style.fontSize = (15 + Math.random() * 18) + "px";
    flower.style.animationDuration = (10 + Math.random() * 12) + "s";
    flower.style.animationDelay = (-Math.random() * 15) + "s";

    flowerLayer.appendChild(flower);
}


// ============================================
// COUNTDOWN SCREEN -> WELCOME SCREEN
// ============================================

const bgMusic = document.getElementById("bgMusic");
const continueBtn = document.getElementById("continueBtn");
const birthdayCountdown = document.getElementById("birthdayCountdown");
const startSurpriseBtn = document.getElementById("startSurpriseBtn");

// Timer date - change this later when you are ready.
const birthdayUnlockTime =
    new Date("2026-10-31T00:00:00+05:30").getTime();

let countdownInterval = null;

function updateBirthdayCountdown() {
    const remaining = birthdayUnlockTime - Date.now();

    if (remaining <= 0) {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        birthdayCountdown.hidden = true;
        startSurpriseBtn.hidden = false;
        startSurpriseBtn.disabled = false;

        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("countdownDays").textContent =
        String(days).padStart(2, "0");

    document.getElementById("countdownHours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("countdownMinutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("countdownSeconds").textContent =
        String(seconds).padStart(2, "0");

    birthdayCountdown.hidden = false;
    startSurpriseBtn.hidden = true;
}

updateBirthdayCountdown();

if (Date.now() < birthdayUnlockTime) {
    countdownInterval = setInterval(updateBirthdayCountdown, 1000);
}


// ============================================
// START BUTTON: PLAY MUSIC + OPEN WELCOME
// ============================================

startSurpriseBtn.addEventListener("click", async () => {
    if (Date.now() < birthdayUnlockTime) return;

    bgMusic.volume = 0.4;

    try {
        await bgMusic.play();
    } catch (error) {
        console.log("Music playback failed:", error);
    }

    showScreen("welcome");
});


// ============================================
// CONTINUE BUTTON: WELCOME -> HEART SCREEN
// ============================================

continueBtn.addEventListener("click", () => {
    showScreen("heartScreen");
});


// ============================================
// SCREEN 2: DRAG HEART
// ============================================

const heart = document.getElementById("dragHeart");
const dragText = document.getElementById("dragText");

let dragging = false;
let startY = 0;
let distance = 0;
let heartCompleted = false;

heart.addEventListener("pointerdown", event => {
    if (heartCompleted) return;

    dragging = true;
    startY = event.clientY;
    distance = 0;

    heart.setPointerCapture(event.pointerId);
});

heart.addEventListener("pointermove", event => {
    if (!dragging || heartCompleted) return;

    distance = Math.max(
        0,
        Math.min(180, event.clientY - startY)
    );

    heart.style.transform =
        `translateY(${distance}px) scale(1.1)`;
});

function releaseHeart() {
    if (!dragging || heartCompleted) return;

    dragging = false;

    if (distance >= 80) {
        heartCompleted = true;
        dragText.style.opacity = "0";

        heart.style.transition = ".7s ease";
        heart.style.transform = "translateY(180px) scale(0)";

        setTimeout(() => {
            showScreen("birthdayScreen");
            drawHeartTree();
        }, 700);

    } else {
        heart.style.transition = ".4s ease";
        heart.style.transform = "translateY(0)";
    }
}

heart.addEventListener("pointerup", releaseHeart);
heart.addEventListener("pointercancel", releaseHeart);


// ============================================
// SCREEN 3: HEART TREE
// ============================================

function drawHeartTree() {
    const canvas = document.getElementById("heartTree");
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const centerX = w * .52;

    // TREE TRUNK
    ctx.beginPath();
    ctx.moveTo(centerX, h);

    ctx.bezierCurveTo(
        centerX - 20, h * .75,
        centerX + 25, h * .50,
        centerX, h * .35
    );

    ctx.strokeStyle = "#8a6252";
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.stroke();

    // TREE BRANCHES
    const branches = [
        [-100, -100],
        [-130, -160],
        [-60, -190],
        [50, -190],
        [110, -145],
        [130, -90],
        [-20, -125],
        [75, -115]
    ];

    branches.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.moveTo(centerX, h * .52);

        ctx.quadraticCurveTo(
            centerX + x * .4,
            h * .4 + y * .4,
            centerX + x,
            h * .3 + y * .3
        );

        ctx.strokeStyle = "#9c7460";
        ctx.lineWidth = 3;
        ctx.stroke();
    });

    // HEART COLOURS
    const colors = [
        "#f6a0b5",
        "#ee819e",
        "#ffc6a9",
        "#f6ce7d",
        "#e9a5bb",
        "#f5b8c4"
    ];

    function drawHeart(x, y, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 18, size / 18);

        ctx.beginPath();
        ctx.moveTo(0, 7);

        ctx.bezierCurveTo(-18, -5, -13, -20, 0, -10);
        ctx.bezierCurveTo(13, -20, 18, -5, 0, 7);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 7;

        ctx.fill();
        ctx.restore();
    }

    // HEART TREE CANOPY
    for (let i = 0; i < 450; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;

        const formula =
            Math.pow(x * x + y * y - 1, 3) -
            x * x * y * y * y;

        if (formula <= 0) {
            const px = centerX + x * w * .35;
            const py = h * .28 + y * h * .22;

            const size = 10 + Math.random() * 13;

            const color =
                colors[Math.floor(Math.random() * colors.length)];

            drawHeart(px, py, size, color);
        }
    }
}


// ============================================
// SCREEN 3 TO SCREEN 4
// ============================================

document.getElementById("cakeNextBtn")
    .addEventListener("click", () => {
        showScreen("cakeScreen");
    });


// ============================================
// SCREEN 4: BLOW THE CANDLE
// ============================================

const blowBtn = document.getElementById("blowBtn");
const flame = document.getElementById("flame");
const wishMessage = document.getElementById("wishMessage");

let candleBlown = false;

blowBtn.addEventListener("click", async () => {
    if (candleBlown) return;

    candleBlown = true;
    blowBtn.disabled = true;

    // Flame slowly fades out over 2.2 seconds.
    const flameFade = flame.animate(
        [
            {
                opacity: 1,
                filter: "blur(0px)",
                boxShadow: "0 0 20px #ffb34e"
            },
            {
                opacity: 0.75,
                filter: "blur(1px)",
                boxShadow: "0 0 14px #ffb34e"
            },
            {
                opacity: 0.35,
                filter: "blur(4px)",
                boxShadow: "0 0 6px #ffb34e"
            },
            {
                opacity: 0,
                filter: "blur(8px)",
                boxShadow: "0 0 0 transparent"
            }
        ],
        {
            duration: 2200,
            easing: "ease-out",
            fill: "forwards"
        }
    );

    await flameFade.finished;

    flame.classList.add("off");

    blowBtn.style.display = "none";
    wishMessage.style.display = "block";

    createConfetti(45);
});


// ============================================
// CONFETTI EFFECT
// ============================================

function createConfetti(count = 35) {
    const symbols = ["✨", "⭐", "💫", "🌟", "🎉", "💗"];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.position = "fixed";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = "-30px";
        particle.style.fontSize = (15 + Math.random() * 15) + "px";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "100";

        document.body.appendChild(particle);

        const duration = 2000 + Math.random() * 2500;

        particle.animate(
            [
                {
                    transform: "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        `translateY(${window.innerHeight + 50}px) rotate(500deg)`,
                    opacity: 0
                }
            ],
            {
                duration: duration,
                easing: "ease-in"
            }
        );

        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}


// ============================================
// SCREEN 4 TO SCREEN 5
// ============================================

document.getElementById("balloonNextBtn")
    .addEventListener("click", () => {
        showScreen("balloonScreen");
    });


// ============================================
// SCREEN 5: BALLOON GAME
// ============================================

const balloons = document.querySelectorAll(".balloon");

const messages = [
    {
        emoji: "💗",
        text: "You make the world a little more beautiful!"
    },
    {
        emoji: "🌸",
        text: "Never stop smiling. Your smile is precious!"
    },
    {
        emoji: "⭐",
        text: "May your dreams reach the brightest stars!"
    },
    {
        emoji: "🦋",
        text: "May every new day bring you something wonderful!"
    },
    {
        emoji: "🎀",
        text: "You deserve all the happiness in the world!"
    },
    {
        emoji: "❤️",
        text: "You are truly one of a kind, Yoshitha!"
    }
];

let poppedCount = 0;

const progressText = document.getElementById("progressText");
const balloonMessage = document.getElementById("balloonMessage");
const messageEmoji = document.getElementById("messageEmoji");
const messageText = document.getElementById("messageText");
const balloonFinish = document.getElementById("balloonFinish");


// POP SOUND
function playPopSound() {
    try {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        const audio = new AudioContext();

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            650, audio.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            180, audio.currentTime + .12
        );

        gain.gain.setValueAtTime(
            .18, audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .001, audio.currentTime + .15
        );

        oscillator.start();
        oscillator.stop(audio.currentTime + .15);

        oscillator.onended = () => audio.close();

    } catch (error) {
        console.log("Audio unavailable", error);
    }
}


// BALLOON CLICK
balloons.forEach(balloon => {
    balloon.addEventListener("click", () => {
        if (balloon.classList.contains("popped")) return;

        const index = Number(balloon.dataset.index);

        balloon.classList.add("popped");

        playPopSound();
        createConfetti(8);

        poppedCount++;

        messageEmoji.textContent = messages[index].emoji;
        messageText.textContent = messages[index].text;

        balloonMessage.classList.remove("show");
        void balloonMessage.offsetWidth;
        balloonMessage.classList.add("show");

        progressText.textContent =
            `${poppedCount} / ${balloons.length} balloons popped`;

        if (poppedCount === balloons.length) {
            setTimeout(() => {
                balloonFinish.style.display = "block";

                createConfetti(65);

                balloonFinish.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            }, 700);
        }
    });
});


// ============================================
// SCREEN 5 TO SCREEN 6: REASONS
// ============================================

document.getElementById("finishBalloonBtn")
    .addEventListener("click", () => {
        showScreen("reasonsScreen");
    });


// ============================================
// SCREEN 6 TO SCREEN 7: PHOTO MEMORIES
// ============================================

document.getElementById("openMemoriesBtn")
    .addEventListener("click", () => {
        showScreen("memoriesScreen");
        showMemoryPage(0);
    });


// ============================================
// SCREEN 7: THREE-PAGE PHOTO SLIDESHOW
// ============================================

const memoryPages = [
    [
        "Snapchat-509234225.jpg",
        "Snapchat-824593152.jpg",
        "Snapchat-867032066.jpg"
    ],
    [
        "Snapchat-1013757910.jpg",
        "Snapchat-1285177890.jpg",
        "Snapchat-1373368559.jpg"
    ],
    [
        "Snapchat-1830466275.jpg",
        "Snapchat-2009337599.jpg",
        "Snapchat-2097493672.jpg"
    ]
];

let currentMemoryPage = 0;

const memoryPhotos = document.getElementById("memoryPhotos");
const memoryPageLabel = document.getElementById("memoryPageLabel");
const memoryPrevBtn = document.getElementById("memoryPrevBtn");
const memoryNextBtn = document.getElementById("memoryNextBtn");
const memoryLightbox = document.getElementById("memoryLightbox");
const memoryLightboxImage = document.getElementById("memoryLightboxImage");
const memoryLightboxClose = document.getElementById("memoryLightboxClose");


function showMemoryPage(pageIndex) {
    if (!memoryPhotos) return;

    currentMemoryPage = Math.max(0, Math.min(2, pageIndex));

    memoryPhotos.innerHTML = "";

    memoryPages[currentMemoryPage].forEach((filename, index) => {
        const frame = document.createElement("button");

        frame.type = "button";
        frame.className = `memory-polaroid memory-photo-${index + 1}`;

        frame.setAttribute(
            "aria-label",
            `Open memory photo ${currentMemoryPage * 3 + index + 1}`
        );

        const image = document.createElement("img");

        image.src = `/static/images/${filename}`;
        image.alt = `Memory photo ${currentMemoryPage * 3 + index + 1}`;
        image.loading = "eager";

        image.addEventListener("error", () => {
            frame.classList.add("memory-image-error");

            image.alt =
                "Photo could not be loaded. Check the filename in static/images.";
        });

        const caption = document.createElement("span");

        caption.className = "memory-caption";
        caption.textContent =
            `A little memory ${currentMemoryPage * 3 + index + 1} ♡`;

        frame.append(image, caption);

        frame.addEventListener("click", () => {
            if (!memoryLightbox || !memoryLightboxImage) return;

            memoryLightboxImage.src = image.src;
            memoryLightboxImage.alt = image.alt;

            memoryLightbox.classList.add("open");
        });

        memoryPhotos.appendChild(frame);
    });

    memoryPageLabel.textContent =
        `MEMORIES ${currentMemoryPage + 1} / 3`;

    memoryPrevBtn.disabled = currentMemoryPage === 0;

    memoryNextBtn.textContent =
        currentMemoryPage === 2
            ? "Finish Memories ♡"
            : "Next Memories →";
}


// PREVIOUS PAGE
memoryPrevBtn.addEventListener("click", () => {
    showMemoryPage(currentMemoryPage - 1);
});


// NEXT PAGE
memoryNextBtn.addEventListener("click", () => {
    if (currentMemoryPage < 2) {
        showMemoryPage(currentMemoryPage + 1);

    } else {
        const ending = document.getElementById("memoryEnding");

        if (ending) {
            ending.classList.add("show");
        }

        createConfetti(35);
    }
});


// ============================================
// FULL-SIZE PHOTO VIEW
// ============================================

memoryLightboxClose.addEventListener("click", () => {
    memoryLightbox.classList.remove("open");
});

memoryLightbox.addEventListener("click", event => {
    if (event.target === memoryLightbox) {
        memoryLightbox.classList.remove("open");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && memoryLightbox) {
        memoryLightbox.classList.remove("open");
    }
});


// ============================================
// SCREEN 7 TO SCREEN 8: PERSONAL LETTER
// ============================================

const openLetterBtn = document.getElementById("openLetterBtn");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const letterOpenedNote = document.getElementById("letterOpenedNote");
const grandFinaleBtn = document.getElementById("grandFinaleBtn");

if (openLetterBtn) {
    openLetterBtn.addEventListener("click", () => {
        showScreen("letterScreen");
    });
}


// OPEN ENVELOPE
if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", () => {
        if (envelopeWrapper.classList.contains("opened")) return;

        envelopeWrapper.classList.add("opened");

        envelopeWrapper.setAttribute(
            "aria-label",
            "Birthday letter opened"
        );

        setTimeout(() => {
            letterOpenedNote.classList.add("show");
            grandFinaleBtn.classList.add("show");

            createConfetti(35);
        }, 1000);
    });
}


// ============================================
// SCREEN 8 TO SCREEN 9: GRAND FINALE
// ============================================

if (grandFinaleBtn) {
    grandFinaleBtn.addEventListener("click", () => {
        showScreen("finaleScreen");
        createConfetti(100);
    });
}


// ============================================
// REPLAY THE SURPRISE FROM THE BEGINNING
// ============================================

const replayBtn = document.getElementById("replayBtn");

if (replayBtn) {
    replayBtn.addEventListener("click", () => {
        showScreen("welcome");
    });
}


console.log("Yoshitha Birthday Surprise Website Ready! ❤️");
