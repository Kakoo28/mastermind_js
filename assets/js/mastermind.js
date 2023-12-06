'use strict'
const LINE_COUNT = 8;
const COLOR_LIST = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

function start() {
    // CREATE ALL LINES
    for (let i = 1; i <= LINE_COUNT; i++) {
        document.getElementById('line-generator').innerHTML += '<div class="line" id="line' + i + '">\n' +
            '                <span class="hole hole1"></span>\n' +
            '                <span class="hole hole2"></span>\n' +
            '                <span class="hole hole3"></span>\n' +
            '                <span class="hole hole4"></span>\n' +
            '                <div class="checker" id="checker' + i + '">\n' +
            '                    <span class="little-hole little-hole1"></span>\n' +
            '                    <span class="little-hole little-hole2"></span>\n' +
            '                    <span class="little-hole little-hole3"></span>\n' +
            '                    <span class="little-hole little-hole4"></span>\n' +
            '                </div>\n' +
            '            </div>'
    }

    const SECRET_HOLES = [...document.querySelectorAll('#secret-line .hole')];
    const COLOR_BUTTONS = [...document.getElementsByClassName('cb')];
    const UNDO_BUTTONS = document.getElementById('undoButton');

    // GENERATE THE SECRET COMBINATION

    let secretCode = [];
    for (let i = 0; i < 4; i++) {
        let randomColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
        secretCode.push(randomColor);
    }

    // FUNCTION FOR MARK RED / WHITE DOT
    function dotAndCheckWin(indexLine) {
        let userColors = [];
        [...document.getElementById('line' + indexLine).getElementsByClassName('color')].forEach((c) => {
            userColors.push([...c.classList][1]); // AJOUT DE LA COULEUR (red, blue,..) DANS LE TABLEAU userColors
        });

        // CHECKING IF THE COLOR IS IN THE CORRECT POSITION
        let tempSCode = [...secretCode];
        let dotIndex = 1;
        for (let i = 0; i < 4; i++) {
            if (userColors[i] === tempSCode[i]) {
                document.querySelector('#line' + indexLine + ' .little-hole' + dotIndex).innerHTML = '<span class="red-dot"></span>';
                tempSCode[i] = '';
                userColors[i] = '';
                dotIndex++;
            }
        }

        // CHECKING FOR COLORS WHO'S NOT IN THE CORRECT POSITION
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i !== j) {              // VERIFICATION POUR TOUT LES ELEMENTS MIS A LA MAUVAISE PLACE
                    if (userColors[i] === tempSCode[j] && userColors[i] !== '') {
                        document.querySelector('#line' + indexLine + ' .little-hole' + dotIndex).innerHTML = '<span class="white-dot"></span>';
                        userColors[i] = '';
                        tempSCode[j] = '';
                        dotIndex++;

                    }
                }
            }
        }
        dotIndex = 1;

        // WIN CHECKER
        const CHECK_HOLES = [...document.querySelectorAll('#checker' + lineIndex + ' .little-hole span')];
        if (CHECK_HOLES.length === 4) {
            for (let i = 0; i < 4; i++) {
                if (CHECK_HOLES[i].className !== 'red-dot') {
                    return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }

    // REVEAL FUNCTION
    function reveal() {
        for (let i = 0; i < 4; i++) {
            SECRET_HOLES[i].innerHTML = '<div class="color ' + secretCode[i] + '">';
        }
        setTimeout(() => {
            document.location.href = './index.html';
        }, 5000);
    }

    // MAIN FUNCTION (WHEN A COLOR IS CLICKED)
    let lineIndex = 1;
    let holeIndex = 1;
    document.querySelector('#line1 .hole1').classList.add('active-hole');

    function clickColorButton(c) {

        let color = c.target.id.split('-')[1];
        let hole = document.querySelector('#line' + lineIndex + ' .hole' + holeIndex);
        hole.classList.remove('active-hole')
        hole.innerHTML = '<div class="color ' + color + '"></div>';
        holeIndex++;
        if (holeIndex > 4) {
            if (lineIndex !== LINE_COUNT) {
                document.querySelector('#line' + (lineIndex + 1) + ' .hole1').classList.add('active-hole');
            }
            let isWin = dotAndCheckWin(lineIndex);
            holeIndex = 1;
            lineIndex++;

            // WIN / LOOSE
            if (lineIndex > LINE_COUNT && isWin === false) {
                setTimeout(() => {
                    document.getElementById("rules").style.display = 'none';
                    document.getElementById("color-pallet").style.display = 'none';
                    document.getElementById('line-generator').innerHTML = '<h3 class="loose">You lost</h3>';
                    reveal();
                }, 1000);
            } else if (isWin === true) {
                setTimeout(() => {
                    document.getElementById("rules").style.display = 'none';
                    document.getElementById("color-pallet").style.display = 'none';
                    document.getElementById('line-generator').innerHTML = '<h3 class="win">You won</h3>';
                    reveal();
                }, 500);
            }
        } else {
            document.querySelector('#line' + lineIndex + ' .hole' + holeIndex).classList.add("active-hole")
        }
    }

    // UNDO BUTTON FUNCTION
    function clickUndoButton() {
        if (holeIndex !== 1) {
            let lastHole = document.querySelector('#line' + lineIndex + ' .hole' + (holeIndex - 1));
            lastHole.innerHTML = '';
            document.querySelector('#line' + lineIndex + ' .hole' + holeIndex).classList.remove('active-hole');
            holeIndex--;
            document.querySelector('#line' + lineIndex + ' .hole' + holeIndex).classList.add('active-hole');
        }
    }

    COLOR_BUTTONS.forEach((c) => {
        c.addEventListener('click', clickColorButton);
    })
    UNDO_BUTTONS.addEventListener('click', clickUndoButton);
}

start();
