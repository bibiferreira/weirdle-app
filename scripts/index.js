/** Words */
const fiveLetterWords = [
  'bilbo', 'joker', 'harry', 'marge', 'woody', 'groot', 'frodo', 'rocky', 'jules', 'stark',
  'marty', 'mcfly', 'vader', 'tyler', 'bruce', 'james', 'ariel', 'jason', 'kevin', 'rambo',
  'regan', 'shrek', 'fiona', 'sloth', 'spock', 'penny', 'anton', 'homer', 'daffy', 'shifu',
  'genie', 'dumbo', 'baloo', 'morty', 'peppa', 'cosmo', 'wanda', 'daria', 'betty', 'shera',
  'pinky', 'brain', 'jerry', 'spock', 'marty', 'zorro', 'mario', 'wonka', 'bambi', 'waldo',
  'wally', 'buffy', 'sonic', 'peter', 'alice', 'beast', 'bella', 'buddy', 'luigi', 'goofy',
  'manny', 'pluto', 'robin', 'sully', 'flash', 'chuck', 'pumba', 'timon', 'wayne', 'conan',
  'ralph', 'jabba', 'gomez', 'blade', 'kronk', 'simba', 'draco', 'danny', 'arwen', 'aslan',
  'padme', 'venom', 'uhura', 'butch', 'dopey', 'ethan', 'edgar', 'snape', 'gloin', 'albus',
  'thing', 'mater', 'shego', 'mandy', 'velma', 'tiana', 'rogue', 'storm', 'misty', 'maron',
  'logan', 'bulma', 'azula', 'leela', 'sarah', 'peggy', 'peach', 'teela', 'holly', 'sansa',
  'perry'
];


/** Game Grid */
const gameRows = document.querySelectorAll('#game > div');
let wordOfTheDay = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];


// Maximum number of letters per word
const maxLength = 5;

let currentRow = 0;
let currentWord = [];

const drawLetter = (letter, index) => {
    const row = gameRows[currentRow];
    row.querySelectorAll('.game-box > div > p')[index].innerHTML = letter;
};

const markBoxAs = (index, className) => {
    const row = gameRows[currentRow];
    row.querySelectorAll('.game-box')[index].classList.add(className);
};

/** Overlay */
const createWordBoxes = (letters) => {
    return `<div class="row game-row-4">
    <div class="col-md-1 col-xs-1"></div>
    <div class="col-md-2 col-xs-2 game-box correct-position">
        <div><p>${letters[0]}</p></div>
    </div>
    <div class="col-md-2 col-xs-2 game-box correct-position">
        <div><p>${letters[1]}</p></div>
    </div>
    <div class="col-md-2 col-xs-2 game-box correct-position">
        <div><p>${letters[2]}</p></div>
    </div>
    <div class="col-md-2 col-xs-2 game-box correct-position">
        <div><p>${letters[3]}</p></div>
    </div>
    <div class="col-md-2 col-xs-2 game-box correct-position">
        <div><p>${letters[4]}</p></div>
    </div>
    <div class="col-md-1 col-xs-1"></div>
</div><br>`;
}

const resetGame = () => {
    currentRow = 0;
    currentWord = [];
    wordOfTheDay = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    gameRows.forEach((row) => {
        row.querySelectorAll('.game-box').forEach((box) => {
            box.classList.remove('wrong-letter');
            box.classList.remove('correct-letter');
            box.classList.remove('correct-position');
            box.querySelector('div > p').innerHTML = '';
        });
    });
    document.querySelector('#overlay').style.display = 'none';
    validateButtonsState();
};

document.querySelector('#overlay').addEventListener('click', resetGame);

const displayInOverlay = (title, showWord, gif) => {
    const overlay = document.querySelector("#overlay");
    const wordHtml = showWord ? createWordBoxes(wordOfTheDay) : '';
    overlay.innerHTML = `<div class="container">
    <h1>${title}</h1>
    ${wordHtml}
    <img src="${gif}">
    </div>`;
    overlay.style.display = 'block';
};

const displayFailure = () => {
    const gif = 'https://media.giphy.com/media/5b5DnFB0m1FWXwmPJS/giphy.gif';
    displayInOverlay('You lost!', false, gif);
};

const displaySuccess = () => {
    const gif = 'https://media.giphy.com/media/eHRwLGsS6QDViZhp2P/giphy.gif';
    displayInOverlay('You won!', true, gif);
}

/** ----- */
const enterButton = document.getElementById('enter');
const deleteButton = document.getElementById('delete');

const validateButtonsState = () => {
  deleteButton.disabled = currentWord.length == 0;
  enterButton.disabled = currentWord.length < 5;
}

validateButtonsState();

const appendLetter = (letter) => {
  if (currentWord.length >= maxLength) {
    return;
  }
  currentWord.push(letter);
  drawLetter(letter, currentWord.length - 1);
  validateButtonsState();
}

const popLastLetter = () => {
  if(currentWord.length === 0) {
    return;
  }
  currentWord.pop();
  drawLetter('', currentWord.length);
  validateButtonsState();
}

const validate = () => {
    if(currentWord.length < 5) {
        return;
    }

    const toCheck = wordOfTheDay.split('');
    const hits = [];
    const semiHits = [];

    // aqui vamos validar a palavra, primeriso só os matches perfeitos
    currentWord.forEach((letter, index) => {
        if(toCheck[index] === letter) {
            markBoxAs(index, "correct-position");
            toCheck[index] = '_';
            hits.push(letter);
            return;
        }
    });

    // depois os matches incompletos
    currentWord.forEach((letter, index) => {
      if(!hits.includes(letter) && toCheck.includes(letter)) {
        // marca como existente apenas 1 vez
        if(!semiHits.includes(letter) || (toCheck.filter(d => d === letter).length > semiHits.filter(d => d === letter).length)) {
          markBoxAs(index, "correct-letter");
          semiHits.push(letter);
          return;
        }
      }

      // marcar letra como errada
      markBoxAs(index, "wrong-letter");
    });

    if(wordOfTheDay.length === hits.length) {
        displaySuccess();
        return;
    }

    // aqui vamos para a proxima linha
    currentWord = [];

    if (currentRow === (gameRows.length - 1)) {
        displayFailure();
        return;
    }
    currentRow += 1;
}


/** Keyboard */
const buttons = document.querySelectorAll('#keyboard button');

const keypressed = (event) => {
    const pressedKey = event.currentTarget.dataset.key;

    switch (pressedKey) {
        case "enter":
            validate();
            break;
        case "delete":
            popLastLetter();
            break;
        default:
            appendLetter(pressedKey);
            break;
    }

};

buttons.forEach((button) => {
    button.addEventListener("click", keypressed);
});
