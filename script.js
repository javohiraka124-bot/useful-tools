/* ==========================================
   USEFUL TOOLS
   ========================================== */

let currentTool = "";

let favorites =
    JSON.parse(
        localStorage.getItem("favorites") || "[]"
    );

let timer = null;
let timerSeconds = 0;

let stopwatch = null;
let stopwatchSeconds = 0;

let calendarDate = new Date();

let qrScanner = null;


/* ==========================================
   STARS
   ========================================== */

const canvas =
    document.getElementById("stars");

const ctx =
    canvas.getContext("2d");

let stars = [];


function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createStars();
}


function createStars() {

    stars = [];

    const count =
        Math.floor(
            (canvas.width * canvas.height) / 9000
        );

    for (let i = 0; i < count; i++) {

        stars.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            size:
                Math.random() * 1.8 + 0.4,

            speed:
                Math.random() * 0.7 + 0.2,

            opacity:
                Math.random() * 0.8 + 0.2
        });
    }
}


function animateStars() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    stars.forEach(star => {

        star.x += star.speed;

        if (star.x > canvas.width) {

            star.x = -5;

            star.y =
                Math.random() *
                canvas.height;
        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${star.opacity})`;

        ctx.fill();
    });

    requestAnimationFrame(
        animateStars
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();
animateStars();


/* ==========================================
   OPEN TOOL
   ========================================== */

function openTool(tool) {

    currentTool = tool;

    document.getElementById(
        "toolPage"
    ).style.display = "block";

    const titles = {

        calculator: "Calculator",
        converter: "Converter",
        percentage: "Percentage",
        timer: "Timer & Stopwatch",
        clock: "Local Time",
        calendar: "Calendar",
        qr: "QR Scanner",
        weather: "Weather"
    };

    document.getElementById(
        "pageTitle"
    ).textContent = titles[tool];

    updateFavoriteButton();


    if (tool === "calculator")
        calculator();

    if (tool === "converter")
        converter();

    if (tool === "percentage")
        percentage();

    if (tool === "timer")
        timerTool();

    if (tool === "clock")
        clockTool();

    if (tool === "calendar")
        calendar();

    if (tool === "qr")
        qrTool();

    if (tool === "weather")
        weather();
}


function closePage() {

    stopQR();

    document.getElementById(
        "toolPage"
    ).style.display = "none";
}


/* ==========================================
   FAVORITES
   ========================================== */

function favoriteTool() {

    if (!currentTool)
        return;

    if (favorites.includes(currentTool)) {

        favorites =
            favorites.filter(
                item =>
                    item !== currentTool
            );

    } else {

        favorites.push(currentTool);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButton();
}


function updateFavoriteButton() {

    const button =
        document.getElementById(
            "favoriteButton"
        );

    if (
        favorites.includes(currentTool)
    ) {

        button.textContent = "★";

    } else {

        button.textContent = "☆";
    }
}


function showFavorites() {

    document.getElementById(
        "favoritesPage"
    ).style.display = "block";

    const box =
        document.getElementById(
            "favorites"
        );

    if (favorites.length === 0) {

        box.innerHTML = `

            <div class="settings-box">

                <h3>No Favorites</h3>

                <p>
                    Add tools to favorites using the ☆ button.
                </p>

            </div>
        `;

        return;
    }

    const names = {

        calculator: "🧮 Calculator",
        converter: "🔄 Converter",
        percentage: "％ Percentage",
        timer: "⏱️ Timer & Stopwatch",
        clock: "🕐 Local Time",
        calendar: "📅 Calendar",
        qr: "📷 QR Scanner",
        weather: "🌤️ Weather"
    };

    box.innerHTML =
        favorites
            .map(tool => `

                <div class="favorite-item">

                    <span>
                        ${names[tool]}
                    </span>

                    <button
                        onclick="openTool('${tool}')"
                    >
                        Open
                    </button>

                </div>

            `)
            .join("");
}


function closeFavorites() {

    document.getElementById(
        "favoritesPage"
    ).style.display = "none";
}


/* ==========================================
   CALCULATOR
   ========================================== */

function calculator() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="calculator">

            <input
                id="display"
                class="display"
                value="0"
                readonly
            >

            <div class="calc-buttons">

                <button onclick="clearCalc()">AC</button>
                <button onclick="deleteCalc()">⌫</button>
                <button onclick="addCalc('%')">%</button>
                <button onclick="addCalc('/')">÷</button>

                <button onclick="addCalc('7')">7</button>
                <button onclick="addCalc('8')">8</button>
                <button onclick="addCalc('9')">9</button>
                <button onclick="addCalc('*')">×</button>

                <button onclick="addCalc('4')">4</button>
                <button onclick="addCalc('5')">5</button>
                <button onclick="addCalc('6')">6</button>
                <button onclick="addCalc('-')">−</button>

                <button onclick="addCalc('1')">1</button>
                <button onclick="addCalc('2')">2</button>
                <button onclick="addCalc('3')">3</button>
                <button onclick="addCalc('+')">+</button>

                <button onclick="addCalc('00')">00</button>
                <button onclick="addCalc('0')">0</button>
                <button onclick="addCalc('.')">.</button>
                <button onclick="calculate()">=</button>

            </div>

        </div>
    `;
}


function addCalc(value) {

    const display =
        document.getElementById(
            "display"
        );

    if (display.value === "0")
        display.value = "";

    display.value += value;
}


function clearCalc() {

    document.getElementById(
        "display"
    ).value = "0";
}


function deleteCalc() {

    const display =
        document.getElementById(
            "display"
        );

    display.value =
        display.value.slice(0, -1);

    if (display.value === "")
        display.value = "0";
}


function calculate() {

    const display =
        document.getElementById(
            "display"
        );

    try {

        const expression =
            display.value.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );

        if (
            !/^[0-9+\-*/().\s]+$/.test(
                expression
            )
        ) {
            throw new Error();
        }

        const result =
            Function(
                `"use strict"; return (${expression})`
            )();

        if (!Number.isFinite(result))
            throw new Error();

        display.value = result;

    } catch {

        display.value = "Error";
    }
}


/* ==========================================
   CONVERTER
   ========================================== */

function converter() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel">

            <h3>Unit Converter</h3>

            <br>

            <input
                id="convertValue"
                class="input"
                type="number"
                placeholder="Enter value"
            >

            <select
                id="convertType"
                class="input"
            >

                <option value="km">
                    Kilometers → Miles
                </option>

                <option value="miles">
                    Miles → Kilometers
                </option>

                <option value="kg">
                    Kilograms → Pounds
                </option>

                <option value="lb">
                    Pounds → Kilograms
                </option>

                <option value="c">
                    Celsius → Fahrenheit
                </option>

                <option value="f">
                    Fahrenheit → Celsius
                </option>

            </select>

            <button
                class="primary"
                onclick="convert()"
            >
                Convert
            </button>

            <div
                id="convertResult"
                class="result"
            >
                Result
            </div>

        </div>
    `;
}


function convert() {

    const value =
        Number(
            document.getElementById(
                "convertValue"
            ).value
        );

    const type =
        document.getElementById(
            "convertType"
        ).value;

    let result;

    if (type === "km")
        result = value * 0.621371;

    if (type === "miles")
        result = value * 1.609344;

    if (type === "kg")
        result = value * 2.20462;

    if (type === "lb")
        result = value * 0.453592;

    if (type === "c")
        result = value * 9 / 5 + 32;

    if (type === "f")
        result = (value - 32) * 5 / 9;

    document.getElementById(
        "convertResult"
    ).textContent =
        isNaN(result)
            ? "Enter a number"
            : "Result: " +
              result.toFixed(3);
}


/* ==========================================
   PERCENTAGE
   ========================================== */

function percentage() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel">

            <h3>Percentage Calculator</h3>

            <br>

            <input
                id="percent"
                class="input"
                type="number"
                placeholder="Percentage"
            >

            <input
                id="number"
                class="input"
                type="number"
                placeholder="Number"
            >

            <button
                class="primary"
                onclick="calculatePercent()"
            >
                Calculate
            </button>

            <div
                id="percentResult"
                class="result"
            >
                Result
            </div>

        </div>
    `;
}


function calculatePercent() {

    const percent =
        Number(
            document.getElementById(
                "percent"
            ).value
        );

    const number =
        Number(
            document.getElementById(
                "number"
            ).value
        );

    const result =
        number * percent / 100;

    document.getElementById(
        "percentResult"
    ).textContent =
        `${percent}% of ${number} = ${result}`;
}


/* ==========================================
   TIMER + STOPWATCH
   ========================================== */

function timerTool() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel">

            <h3>Timer</h3>

            <input
                id="timerInput"
                class="input"
                type="number"
                placeholder="Seconds"
            >

            <div
                id="timerDisplay"
                class="big-time"
            >
                00:00
            </div>

            <div class="timer-buttons">

                <button onclick="startTimer()">
                    Start
                </button>

                <button onclick="pauseTimer()">
                    Pause
                </button>

                <button onclick="resetTimer()">
                    Reset
                </button>

            </div>

        </div>

        <br>

        <div class="panel">

            <h3>Stopwatch</h3>

            <div
                id="stopwatchDisplay"
                class="big-time"
            >
                00:00:00
            </div>

            <div class="timer-buttons">

                <button onclick="startStopwatch()">
                    Start
                </button>

                <button onclick="pauseStopwatch()">
                    Pause
                </button>

                <button onclick="resetStopwatch()">
                    Reset
                </button>

            </div>

        </div>
    `;
}


/* TIMER */

function startTimer() {

    if (timer)
        return;

    if (timerSeconds === 0) {

        timerSeconds =
            Number(
                document.getElementById(
                    "timerInput"
                ).value
            );

        if (timerSeconds <= 0) {

            alert(
                "Enter seconds first."
            );

            return;
        }
    }

    timer =
        setInterval(() => {

            timerSeconds--;

            updateTimer();

            if (timerSeconds <= 0) {

                clearInterval(timer);

                timer = null;

                alert(
                    "Timer finished!"
                );
            }

        }, 1000);
}


function pauseTimer() {

    clearInterval(timer);

    timer = null;
}


function resetTimer() {

    clearInterval(timer);

    timer = null;

    timerSeconds = 0;

    updateTimer();
}


function updateTimer() {

    const display =
        document.getElementById(
            "timerDisplay"
        );

    if (!display)
        return;

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;

    display.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


/* STOPWATCH */

function startStopwatch() {

    if (stopwatch)
        return;

    stopwatch =
        setInterval(() => {

            stopwatchSeconds++;

            updateStopwatch();

        }, 1000);
}


function pauseStopwatch() {

    clearInterval(stopwatch);

    stopwatch = null;
}


function resetStopwatch() {

    clearInterval(stopwatch);

    stopwatch = null;

    stopwatchSeconds = 0;

    updateStopwatch();
}


function updateStopwatch() {

    const display =
        document.getElementById(
            "stopwatchDisplay"
        );

    if (!display)
        return;

    const hours =
        Math.floor(
            stopwatchSeconds / 3600
        );

    const minutes =
        Math.floor(
            (stopwatchSeconds % 3600) / 60
        );

    const seconds =
        stopwatchSeconds % 60;

    display.textContent =
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


/* ==========================================
   LOCAL TIME
   ========================================== */

function clockTool() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel">

            <div
                id="clock"
                class="clock"
            >
                --:--:--
            </div>

            <div
                id="location"
                class="location"
            >
                Detecting your location...
            </div>

        </div>
    `;

    updateClock();

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            () => {

                document.getElementById(
                    "location"
                ).textContent =
                    "Location detected ✓";
            },

            () => {

                document.getElementById(
                    "location"
                ).textContent =
                    "Location permission denied.";
            }
        );
    }
}


function updateClock() {

    const element =
        document.getElementById(
            "clock"
        );

    if (!element)
        return;

    element.textContent =
        new Date().toLocaleTimeString();
}


setInterval(
    updateClock,
    1000
);


/* ==========================================
   CALENDAR
   ========================================== */

function calendar() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="calendar">

            <div class="calendar-top">

                <button
                    onclick="previousMonth()"
                >
                    ‹
                </button>

                <b id="calendarTitle"></b>

                <button
                    onclick="nextMonth()"
                >
                    ›
                </button>

            </div>

            <div class="calendar-week">

                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>

            </div>

            <div
                id="calendarDays"
                class="calendar-days"
            ></div>

        </div>
    `;

    renderCalendar();
}


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();

    document.getElementById(
        "calendarTitle"
    ).textContent =
        new Date(
            year,
            month
        ).toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    const days =
        document.getElementById(
            "calendarDays"
        );

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    let html = "";

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        html += `
            <button class="day"></button>
        `;
    }

    const today =
        new Date();

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        html += `

            <button
                class="day ${
                    isToday
                        ? "today"
                        : ""
                }"
            >
                ${day}
            </button>
        `;
    }

    days.innerHTML = html;
}


function previousMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() - 1
    );

    renderCalendar();
}


function nextMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() + 1
    );

    renderCalendar();
}


/* ==========================================
   QR
   ========================================== */

function qrTool() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel">

            <h3>QR Scanner</h3>

            <p style="margin:12px 0;color:#aaa;">
                Camera access is required.
            </p>

            <div id="qr-reader"></div>

            <div
                id="qrResult"
                class="result"
            >
                No QR code scanned.
            </div>

        </div>
    `;

    loadQR();
}


function loadQR() {

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        document.getElementById(
            "qrResult"
        ).textContent =
            "QR scanner library is loading...";

        return;
    }

    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );

    qrScanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }
        },

        text => {

            document.getElementById(
                "qrResult"
            ).textContent =
                "Result: " + text;
        },

        () => {}

    ).catch(() => {

        document.getElementById(
            "qrResult"
        ).textContent =
            "Camera permission was denied.";
    });
}


function stopQR() {

    if (!qrScanner)
        return;

    qrScanner
        .stop()
        .then(() => {

            qrScanner.clear();

        })
        .catch(() => {});

    qrScanner = null;
}


/* ==========================================
   WEATHER
   ========================================== */

function weather() {

    document.getElementById(
        "content"
    ).innerHTML = `

        <div class="panel weather">

            <h3>Weather</h3>

            <p
                id="weatherStatus"
                style="color:#aaa;margin-top:10px;"
            >
                Getting your location...
            </p>

            <div
                id="weatherData"
                style="display:none;"
            >

                <div
                    id="weatherIcon"
                    class="weather-icon"
                >
                    🌤️
                </div>

                <div
                    id="temperature"
                    class="temperature"
                >
                    --°C
                </div>

                <p
                    id="weatherInfo"
                    style="margin-top:10px;color:#aaa;"
                ></p>

            </div>

        </div>
    `;

    getWeather();
}


function getWeather() {

    if (!navigator.geolocation) {

        document.getElementById(
            "weatherStatus"
        ).textContent =
            "Location is not supported.";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async position => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            try {

                const response =
                    await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
                    );

                const data =
                    await response.json();

                const current =
                    data.current;

                document.getElementById(
                    "weatherStatus"
                ).textContent =
                    "Current weather";

                document.getElementById(
                    "weatherData"
                ).style.display =
                    "block";

                document.getElementById(
                    "temperature"
                ).textContent =
                    Math.round(
                        current.temperature_2m
                    ) + "°C";

                document.getElementById(
                    "weatherInfo"
                ).textContent =
                    "Wind: " +
                    current.wind_speed_10m +
                    " km/h";

                document.getElementById(
                    "weatherIcon"
                ).textContent =
                    weatherIcon(
                        current.weather_code
                    );

            } catch {

                document.getElementById(
                    "weatherStatus"
                ).textContent =
                    "Weather could not be loaded.";
            }
        },

        () => {

            document.getElementById(
                "weatherStatus"
            ).textContent =
                "Location permission denied.";
        }
    );
}


function weatherIcon(code) {

    if (code === 0)
        return "☀️";

    if ([1,2,3].includes(code))
        return "🌤️";

    if ([45,48].includes(code))
        return "🌫️";

    if ([51,53,55,56,57].includes(code))
        return "🌦️";

    if ([61,63,65,80,81,82].includes(code))
        return "🌧️";

    if ([71,73,75,77].includes(code))
        return "❄️";

    if ([95,96,99].includes(code))
        return "⛈️";

    return "🌤️";
}


/* ==========================================
   SETTINGS
   ========================================== */

function showSettings() {

    document.getElementById(
        "settingsPage"
    ).style.display = "block";
}


function closeSettings() {

    document.getElementById(
        "settingsPage"
    ).style.display = "none";
}


/* ==========================================
   COLOR
   ========================================== */

function changeColor(color) {

    document.documentElement
        .style
        .setProperty(
            "--primary",
            color
        );

    localStorage.setItem(
        "color",
        color
    );
}


/* ==========================================
   DARK MODE
   ========================================== */

function darkMode() {

    document.body.classList.remove(
        "light-mode"
    );

    document.body.classList.add(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        "dark"
    );

    console.log(
        "Dark mode enabled"
    );
}


/* ==========================================
   LIGHT MODE
   ========================================== */

function lightMode() {

    document.body.classList.remove(
        "dark-mode"
    );

    document.body.classList.add(
        "light-mode"
    );

    localStorage.setItem(
        "theme",
        "light"
    );

    console.log(
        "Light mode enabled"
    );
}


/* ==========================================
   LOAD THEME
   ========================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );

    } else {

        document.body.classList.add(
            "dark-mode"
        );
    }
}


/* ==========================================
   LOAD COLOR
   ========================================== */

function loadColor() {

    const savedColor =
        localStorage.getItem(
            "color"
        );

    if (savedColor) {

        document.documentElement
            .style
            .setProperty(
                "--primary",
                savedColor
            );

        const picker =
            document.getElementById(
                "colorPicker"
            );

        if (picker)
            picker.value = savedColor;
    }
}


/* ==========================================
   START APP
   ========================================== */

loadTheme();
loadColor();