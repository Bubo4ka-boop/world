const SECRET_WORD = 'funko';
const MAX_ATTEMPTS = 5;

const rows = Array.from(document.querySelectorAll('.row'));
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

let currentAttempt = 0;

const activeRow = () => rows[currentAttempt];

const setStatus = (text) => {
    if (statusMessage) {
        statusMessage.textContent = text;
    }
};

const enableRow = (row) => {
    row.querySelectorAll('input').forEach((input, index) => {
        input.disabled = false;
        input.value = '';
        input.classList.remove('correct', 'present', 'absent');
        if (index === 0) {
            input.focus();
        }
    });
};

const disableRow = (row) => {
    row.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
    });
};

const getGuessFromRow = (row) => {
    return Array.from(row.querySelectorAll('input'))
        .map((input) => input.value.trim().toLowerCase())
        .join('');
};

const markRow = (row, guess) => {
    const tiles = Array.from(row.querySelectorAll('input'));
    const secretLetters = SECRET_WORD.split('');
    const letterCount = {};

    secretLetters.forEach((letter) => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    tiles.forEach((tile, index) => {
        const letter = guess[index];
        if (letter === SECRET_WORD[index]) {
            tile.classList.add('correct');
            letterCount[letter] -= 1;
        }
    });

    tiles.forEach((tile, index) => {
        if (tile.classList.contains('correct')) {
            return;
        }
        const letter = guess[index];
        if (letter && letterCount[letter] > 0) {
            tile.classList.add('present');
            letterCount[letter] -= 1;
        } else {
            tile.classList.add('absent');
        }
    });
};

const checkCurrentRow = () => {
    const row = activeRow();
    const guess = getGuessFromRow(row);

    if (guess.length !== 5) {
        setStatus('Enter 5 letters before submitting.');
        return;
    }

    markRow(row, guess);
    disableRow(row);

    if (guess === SECRET_WORD) {
        setStatus('Correct! You guessed the word.');
        submitBtn.disabled = true;
        return;
    }

    currentAttempt += 1;

    if (currentAttempt >= MAX_ATTEMPTS) {
        setStatus(`Game over.`);
        submitBtn.disabled = true;
        return;
    }

    setStatus(`Try again. Attempt ${currentAttempt + 1} of ${MAX_ATTEMPTS}.`);
    enableRow(activeRow());
};

const handleInput = (event) => {
    const input = event.target;
    input.value = input.value.toUpperCase().slice(-1);
    if (input.value && input.nextElementSibling && input.nextElementSibling.tagName === 'INPUT') {
        input.nextElementSibling.focus();
    }
};

const handleKeyDown = (event) => {
    const input = event.target;

    if (event.key === 'Enter') {
        event.preventDefault();
        checkCurrentRow();
        return;
    }

    if (event.key === 'Backspace' && currentAttempt < MAX_ATTEMPTS) {
        const row = activeRow();
        const inputs = Array.from(row.querySelectorAll('input'));
        const currentIndex = inputs.indexOf(input);

        if (input.value) {
            input.value = '';
            return;
        }

        if (currentIndex > 0) {
            const previousInput = inputs[currentIndex - 1];
            previousInput.value = '';
            previousInput.focus();
            event.preventDefault();
        }
    }
};

const init = () => {
    rows.forEach((row, rowIndex) => {
        const inputs = row.querySelectorAll('input');
        inputs.forEach((input) => {
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeyDown);
        });

        if (rowIndex !== 0) {
            disableRow(row);
        }
    });

    enableRow(activeRow());

    if (submitBtn) {
        submitBtn.addEventListener('click', checkCurrentRow);
    }

    setStatus(`Attempt 1 of ${MAX_ATTEMPTS}.`);
};

init();
