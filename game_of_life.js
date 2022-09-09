const docStyle = document.documentElement.style;
const refTable = document.getElementById("gameArea");
const refPlayButton = document.getElementById("playPause");
const refIterations = document.getElementById("iterationNb");

const refSpeedRateSlider = document.getElementById("speedRateSlider");
const refSpeedRateValue = document.getElementById("speedRateValue");

const refGridButton = document.getElementById("isGrid");
const refGridSizeSlider = document.getElementById("gridSizeSlider");
const refGridSizeValue = document.getElementById("gridSizeValue");

var tableSize = 50;

var isDown = false;
var isPaused = true;

var speedRateValue = 5;
var iterations = 0;

var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var allCells = [];
var futureDeadCells = [];
var futureLivingCells = [];


// FUNCTIONS
function gridCreation() {
    refTable.textContent = "";
    allCells = [];

    for (var i = 0; i < tableSize; i++) {
        var newRow = document.createElement("tr");
        refTable.appendChild(newRow);

        for (var j = 0; j < tableSize; j++) {
            var newCell = document.createElement("td");
            newCell.onclick = function() { this.classList.toggle("alive"); };

            newRow.appendChild(newCell);
        }
    }
    allCells = [...document.querySelectorAll("td")];
}
gridCreation();

function startAnimating(fps) {
    // FPS limitation (from https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe)
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (!isPaused) {
        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            
            for (var i = 0; i < allCells.length; i++) {
                // Check around every cells for living ones and count them
                var neighboursAlive = 0;

                if (typeof allCells[i - 1] != "undefined") {
                    // Check left
                    if (allCells[i - 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i - tableSize - 1] != "undefined") {
                    // Check top left
                    if (allCells[i - tableSize - 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i - tableSize] != "undefined") {
                    // Check top
                    if (allCells[i - tableSize].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i - tableSize + 1] != "undefined") {
                    // Check top right
                    if (allCells[i - tableSize + 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i + 1] != "undefined") {
                    // Check right
                    if (allCells[i + 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i + tableSize + 1] != "undefined") {
                    // Check bottom right
                    if (allCells[i + tableSize + 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i + tableSize] != "undefined") {
                    // Check bottom
                    if (allCells[i + tableSize].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }
                if (typeof allCells[i + tableSize - 1] != "undefined") {
                    // Check bottom left
                    if (allCells[i + tableSize - 1].classList.contains("alive")) {
                        neighboursAlive++;
                    }
                }

                // I got the rules from https://en.wikipedia.org/wiki/Conway's_Game_of_Life
                if (neighboursAlive == 3 && !allCells[i].classList.contains("alive")) {
                    futureLivingCells.push(allCells[i]);
                }
                else if ((neighboursAlive == 2 || neighboursAlive == 3) && allCells[i].classList.contains("alive")) {
                    futureLivingCells.push(allCells[i]);
                }
                else {
                    futureDeadCells.push(allCells[i]);
                }
            }

            // Only now we apply the class changes, otherwise it misbehave
            futureLivingCells.forEach(cell => {
                cell.classList.add("alive");
            });
            futureLivingCells = [];

            futureDeadCells.forEach(cell => {
                cell.classList.remove("alive");
            });
            futureDeadCells = [];

            iterations++;
            refIterations.textContent = iterations;
        }
    }
}

function playPause() {
    isPaused = !isPaused;

    if (isPaused) {
        refPlayButton.textContent = "Play";
    } else if (!isPaused) {
        refPlayButton.textContent = "Pause";
        startAnimating(speedRateValue);
    }
}

function reset() {
    isPaused = false;
    playPause();

    tableSize = 50;
    refGridSizeSlider.value = tableSize;
    refGridSizeValue.textContent = tableSize;
    gridCreation();

    iterations = 0;
    refIterations.textContent = iterations;

    speedRateValue = 5;
    refSpeedRateSlider.value = speedRateValue;
    refSpeedRateValue.textContent = speedRateValue;
}

// Control of the speed of the game
refSpeedRateSlider.oninput = function() {
    refSpeedRateValue.textContent = this.value;
    speedRateValue = this.value;
    startAnimating(speedRateValue);
}

// Control of the size of the grid
refGridSizeSlider.oninput = function() {
    isPaused = false;
    playPause();

    refGridSizeValue.textContent = this.value;
    tableSize = parseInt(this.value);
    gridCreation();
}

// Set or remove the grid
refGridButton.oninput = function() {
    if (this.checked) {
        docStyle.setProperty("--cellBorder", "1px");
    } else {
        docStyle.setProperty("--cellBorder", "0px");
    }
}



// EVENTS LISTENERS
document.addEventListener("mousedown", function(e) {
    isDown = true;
});

document.addEventListener("mousemove", function(e) {
    if (isDown) {
        // Ability to "paint" the cells
        const elementHovered = document.elementFromPoint(e.clientX, e.clientY);
        if (elementHovered != null) {
            if (elementHovered.tagName = "td") {
                elementHovered.classList.add("alive");
            }
        }
    }
});

document.addEventListener("mouseup", function(e) {
    isDown = false;
});

// More shape : https://conwaylife.com/wiki/Main_Page