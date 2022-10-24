'use strict'
function start() {
    // CREATION DES LIGNES
    for (let i = 1; i <= 10; i++) {
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

    const codeLineHoles = [...document.querySelectorAll('#secret-line .hole')];
    const colorButtons = [...document.getElementsByClassName('cb')];
    const undoButton = document.getElementById('undoButton');

    // GENERATION DE LA COMBINAISON SECRETE

    const colorList = ['red', 'blue', 'purple', 'green', 'black', 'yellow'];

    let secretCode = [];
    for (let i = 0; i < 4; i++) {
        let randomColor = colorList[Math.floor(Math.random() * colorList.length)];
        secretCode.push(randomColor);
    }

    // FONCTION MARQUAGE DES BONNES RÉPONSES ET VERIFICATION DE VICTOIRE
    function dotAndCheckWin(indexLine) {
        let userColors = [];
        [...document.getElementById('line'+indexLine).getElementsByClassName('color')].forEach((c) => {
            userColors.push([...c.classList][1]); // AJOUT DE LA COULEUR (red, blue,..) DANS LE TABLEAU userColors
        });

        // VERIFICATION DES BONNES COULEURS A LA BONNE PLACE
        let tempSCode = [...secretCode];
        let dotIndex = 1;
        for (let i = 0; i < 4; i++) {
            if (userColors[i] === tempSCode[i]) {
                document.querySelector('#line'+indexLine + ' .little-hole'+dotIndex).innerHTML = '<span class="red-dot"></span>';
                tempSCode[i] = '';
                userColors[i] = '';
                dotIndex++;
            }
        }

        // VERIFICATION DES BONNES COULEURS A LA MAUVAISE PLACE
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i !== j) {              // VERIFICATION POUR TOUT LES ELEMENTS MIS A LA MAUVAISE PLACE
                    if (userColors[i] === tempSCode[j] && userColors[i] !== '') {
                        document.querySelector('#line'+indexLine + ' .little-hole'+dotIndex).innerHTML = '<span class="white-dot"></span>';
                        userColors[i] = '';
                        tempSCode[j] = '';
                        dotIndex++;

                    }
                }
            }
        }
        dotIndex = 1;

        // VERIFICATION DE VICTOIRE
        const checkHoles = [...document.querySelectorAll('#checker'+lineIndex + ' .little-hole span')];
        if (checkHoles.length === 4) {
            for (let i = 0; i < 4; i++) {
                if (checkHoles[i].className !== 'red-dot') {
                    return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }

    // FONCTION REVEAL DE LA COMBINAISON
    function reveal() {
        for (let i = 0; i < 4; i++) {
            codeLineHoles[i].innerHTML = '<div class="color ' + secretCode[i] + '">';
        }
    }

    // FONCTION PRINCIPAL (QUAND UNE COULEUR EST CLIQUÉE)
    let lineIndex = 1;
    let holeIndex = 1;
    document.querySelector('#line1 .hole1').style.backgroundColor = 'rgba(230, 230, 230, 0.5)';
    function clickColorButton(c) {

        let color = c.target.id.split('-')[1];
        let hole = document.querySelector('#line'+lineIndex + ' .hole'+holeIndex);
        hole.innerHTML = '<div class="color '+color+'"></div>';
        holeIndex++;
        if (holeIndex > 4) {
            if (lineIndex !== 10) {
                document.querySelector('#line'+(lineIndex+1)+' .hole1').style.backgroundColor = 'rgba(230, 230, 230, 0.5)';
            }
            let isWin = dotAndCheckWin(lineIndex);
            holeIndex = 1;
            lineIndex++;

            // VICTOIRE / DÉFAITE
            if (lineIndex > 10 && isWin === false) {
                setTimeout(()=> {
                    document.getElementById('line-generator').innerHTML = '<h3 class="loose">Tu as perdu</h3>';
                    reveal();
                }, 1000)
            } else if (isWin === true) {
                setTimeout(() => {
                    document.getElementById('line-generator').innerHTML = '<h3 class="win">Tu as gagné</h3>';
                    reveal();
                }, 500);
            }
        } else {
            document.querySelector('#line'+lineIndex + ' .hole'+holeIndex).style.backgroundColor = 'rgba(230, 230, 230, 0.5)';
        }
    }

    // FONCTION UNDO BUTTON
    function clickUndoButton() {
        if (holeIndex !== 1) {
            let lastHole = document.querySelector('#line'+lineIndex + ' .hole'+(holeIndex-1));
            document.querySelector('#line'+lineIndex + ' .hole'+holeIndex).style.backgroundColor = 'rgb(161, 161, 161)';
            lastHole.innerHTML = '';
            holeIndex--;
        }
    }

    colorButtons.forEach((c) => {
        c.addEventListener('click', clickColorButton);
    })
    undoButton.addEventListener('click', clickUndoButton);
} start();