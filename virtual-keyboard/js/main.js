class virtualKeyboard {
  constructor() {
    this.capsOn = false;
    this.shiftOn = false;
    this.mute = false;
    this.speak = false;
    this.lang = 'En';
    this.allSelected = false;
    this.selectionEnd = 0;
    this.escaped = false;

    this.langKeysEn = {
      'numbers': [['!', '1'], ['@', '2'], ['#', '3'], ['$', '4'], ['%', '5'], ['^', '6'], ['&', '7'], ['*', '8'], ['(', '9'], [')', '0'], ['_', '-'], ['+', '='],],
      0: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['{', '['], ['}', ']'], ['|', '\\']],
      1: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [':', ';'], ['"', '\'']],
      2: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ['<', ','], ['>', '.'], ['?', '/']],
    };

    this.langKeysRu = {
      'numbers': [['!', '1'], ['"', '2'], ['№', '3'], [';', '4'], ['%', '5'], [':', '6'], ['?', '7'], ['*', '8'], ['(', '9'], [')', '0'], ['_', '-'], ['+', '='],],
      0: ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', ['/', '\\']],
      1: ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
      2: ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', [',', '.']],
    };

    this.screen = document.querySelector('.screen');
    this.keyboard = document.querySelector('.keyboard');
    this.keyRows = document.querySelectorAll('.key-row');
    this.esc = document.querySelector('.key__escape');
    this.langKey = document.querySelector('.key__lang');
    this.inputKeys = document.querySelectorAll('.key-input');
    this.letters = document.querySelectorAll('.key-letter');
    this.numbers = document.querySelectorAll('.key-number');
    this.extras = document.querySelectorAll('.key-extra');
    this.backspace = document.querySelector('.key__backspace');
    this.mutekey = document.querySelector('.key__mute');
    this.shiftkey = document.querySelectorAll('.key-special[data="shift"]');
    this.capsKey = document.querySelector('.key__caps');
    this.arrows = document.querySelectorAll('.key-arrow');
    this.init(this.lang);
  }

  init(lang) {

    let langObj;
    if (lang === 'En') {
      langObj = this.langKeysEn;
    } else if (lang === 'Ru') {
      langObj = this.langKeysRu;
    }

    if (this.shiftOn || this.capsOn) {
      let i = 0;
      while (i < 3) {
        langObj[i].forEach((item, index) => {
          if (item.length === 1) {
            langObj[i][index] = item.toLocaleUpperCase();
          }
        });
        i++;
      }
    } else {
      let i = 0;
      while (i < 3) {
        langObj[i].forEach((item, index) => {
          if (item.length === 1) {
            langObj[i][index] = item.toLowerCase();
          }
        });
        i++;
      }
    }

    let count = 0;
    // change digits-symbols
    this.numbers.forEach(elem => {
      if (this.shiftOn) { // if on lang change shift is on, switch the new numbers  
        elem.querySelector('.first').innerText = langObj.numbers[count][1];
        elem.querySelector('.second').innerText = langObj.numbers[count][0];
        elem.setAttribute('data', elem.querySelector('.first').innerText);
      } else {
        elem.querySelector('.first').innerText = langObj.numbers[count][0];
        elem.querySelector('.second').innerText = langObj.numbers[count][1];
        elem.setAttribute('data', elem.querySelector('.second').innerText); // change num symbols 
      }
      count++;
    });

    let row = 0;
    for (let i = 1; i < 4; i++) {

      count = 1;
      for (let key of this.keyRows[i].children) {
        if (key.children[0].classList.contains('key-switchable')) {
          if (langObj[row][count - 1].length === 1) {
            key.children[0].innerHTML = `<div class="key-input key-letter key-switchable" data="${langObj[row][count - 1]}">${langObj[row][count - 1]}</div>`;
            key.children[0].setAttribute('data', key.children[0].innerText);
          }
          else { // if dobule
            key.children[0].innerHTML = `<span class="symbols"><span class="first">${langObj[row][count - 1][0]}</span><span class="second">${langObj[row][count - 1][1]}</span></span>`;
            key.children[0].setAttribute('data', key.children[0].querySelector('.second').innerText);
          }
          count++;
        }
      }
      row++;
    }
    this.letters = document.querySelectorAll('.key-letter');
  }

  escape() { // hide keyboard
    this.escaped = true;
    this.keyboard.classList.add('keyboard__hidden');
    this.screen.style.maxHeight = '80vh';
    this.screen.style.height = '80vh';
    document.querySelector('body').style.overflow = 'hidden';
  }
  show() { // show keyboard
    this.escaped = false;
    this.keyboard.classList.remove('keyboard__hidden');
    this.screen.style.maxHeight = '25rem';
    this.screen.style.height = '25rem';
    document.querySelector('body').style.overflow = 'visible';
  }

  input(char) {
    if (this.shiftOn || this.capsOn) {
      char = char.toUpperCase();
    }

    if (this.allSelected) {
      this.allSelected = false;
      this.screen.value = char;
      return;
    }

    let currentPosition = this.screen.selectionStart;
    if (currentPosition !== this.screen.value.length) {
      let valBefore = this.screen.value.substring(0, currentPosition)
      let valAfter = this.screen.value.substring(currentPosition)
      valBefore += char;
      let result = valBefore + valAfter;
      this.screen.value = result;
      this.screen.setSelectionRange(valBefore.length, valBefore.length);
    } else {
      this.screen.value += char;
      addEventListener('mouseup', function () {
      });
    }
    this.screen.blur();
    this.screen.focus();
  }

  selectAll() {
    this.allSelected = true;
    this.selectionEnd = this.screen.value.length;
    this.screen.setSelectionRange(this.selectionStart, this.selectionEnd);
  }

  keydownSound(key) {
    if (this.mute) {
      return;
    }
    let audio = new Audio();
    if (key === undefined) {
      audio = new Audio('./assets/sound/tap-set-normal-down.wav');
    } else if (key.innerText === 'ENTER') {
      audio = new Audio('./assets/sound/tap-set-enter-down.wav');
    } else if (key.classList.contains('key__space')) {
      audio = new Audio('./assets/sound/tap-set-space-down.wav');
    } else {
      audio = new Audio('./assets/sound/tap-set-normal-down.wav');
    }
    audio.volume = 0.5;
    audio.play();
  }

  keyupSound(key) {
    this.screen.focus(); // set focus on screen after keyup event
    if (this.mute) {
      return;
    }
    let audio = new Audio();
    if (key === undefined) {
      audio = new Audio('./assets/sound/tap-set-normal-up.wav');
    } else if (key.innerText === 'ENTER') {
      audio = new Audio('./assets/sound/tap-set-enter-up.wav');
    } else if (key.classList.contains('key__space')) {
      audio = new Audio('./assets/sound/tap-set-space-up.wav');
    } else {
      audio = new Audio('./assets/sound/tap-set-normal-up.wav');
    }
    audio.volume = 0.5;
    audio.play();
  }

  delete() {
    if (this.allSelected === true) {
      this.screen.value = '';
      this.allSelected = false;
    }
    let currentPosition = this.screen.selectionStart;
    if (currentPosition !== this.screen.value.length) {
      let valBefore = this.screen.value.substring(0, currentPosition);
      let valAfter = this.screen.value.substring(currentPosition);
      valBefore = valBefore.slice(0, valBefore.length - 1);
      let result = valBefore + valAfter;
      this.screen.value = result;
      keyboard.screen.setSelectionRange(valBefore.length, valBefore.length);
    } else {
      this.screen.value = this.screen.value.slice(0, this.screen.value.length - 1);
    }
  }

  shift() {
    this.numbers.forEach(elem => {
      let temp = elem.querySelector('.first').innerText;
      elem.querySelector('.first').innerText = elem.querySelector('.second').innerText;
      elem.querySelector('.second').innerText = temp;
      elem.setAttribute('data', elem.querySelector('.second').innerText); // change num symbols
    });
    this.extras.forEach(extra => {

      try {
        let temp = extra.querySelector('.first').innerText;
        extra.querySelector('.first').innerText = extra.querySelector('.second').innerText;
        extra.querySelector('.second').innerText = temp;
        extra.setAttribute('data', extra.querySelector('.second').innerText); // change num symbols

      } catch (e) { }
    });
    if (!this.shiftOn) {
      this.keydownSound();
      this.shiftOn = true;
      this.shiftkey.forEach(function (shift) {
        shift.classList.add('key__pressed');
        shift.parentElement.classList.add('key__active-grad');
      });
      this.letters.forEach(elem => {
        elem.innerText = elem.innerText.toUpperCase();
        elem.setAttribute('data', elem.innerText.toUpperCase());
      });
    } else {
      this.keyupSound();
      this.shiftOn = false;
      this.shiftkey.forEach(function (shift) {
        shift.classList.remove('key__pressed');
        shift.parentElement.classList.remove('key__active-grad');
      });

      if (!this.capsOn) {
        this.letters.forEach(elem => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      }
    }
  }

  caps() {
    if (!this.capsOn) {
      this.keydownSound();
      this.capsKey.classList.add('key__pressed');
      this.capsKey.parentElement.classList.add('key__active-grad');
      this.capsOn = true;
      this.letters.forEach(elem => {
        elem.innerText = elem.innerText.toUpperCase();
        elem.setAttribute('data', elem.innerText.toUpperCase());
      });

    } else {
      this.keyupSound();
      this.capsOn = false;
      this.capsKey.classList.remove('key__pressed');
      this.capsKey.parentElement.classList.remove('key__active-grad');
      if (!this.shiftOn) {
        this.letters.forEach(elem => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      }
    }
  }

  mutesound() {
    if (!this.mute) {
      this.mute = true;
      this.mutekey.classList.add('key__pressed');
    } else {
      this.mute = false;
      this.mutekey.classList.remove('key__pressed');
      this.keyupSound(this.mutekey);
    }
  }
  speak() {

  }

  langSwitch() {
    this.keydownSound();
    if (this.lang === 'En') {
      this.lang = 'Ru';
    } else {
      this.lang = 'En';
    }
    // switch text on key
    let temp = this.langKey.children[0].children[0].innerText;
    this.langKey.children[0].children[0].innerText = this.langKey.children[0].children[1].innerText.toLowerCase();
    this.langKey.children[0].children[1].innerText = temp.toUpperCase();
    // init keyboard with new lang
    this.init(this.lang);
  }

  arrowsAction(dir) {
    let currentPosition = this.screen.selectionStart;
    // console.log(this.screen.clientWidth)
    let screenWidth = this.screen.clientWidth - 20;
    let longestLine = screenWidth / 7.97;
    let screenVal = this.screen.value;

    if (dir === 'right') {
      currentPosition++;
      keyboard.screen.setSelectionRange(currentPosition, currentPosition);
    } else if (dir === 'left') {
      if (currentPosition > 0) {
        currentPosition--;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (dir === 'bottom') {
      if (screenVal.length < longestLine) {
        currentPosition = screenVal.length;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      } else {
        currentPosition += longestLine;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (dir === 'top') {
      if (screenVal.length < longestLine) {
        currentPosition = 0;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      } else if (currentPosition < longestLine) {
        currentPosition = 0;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      } else {
        currentPosition -= longestLine;
        keyboard.screen.setSelectionRange(currentPosition, currentPosition);
      }
    }
    this.screen.focus();
  }

}


// create keyboard object
const keyboard = new virtualKeyboard();
// keyboard.inputselection();

// hide & show methods calls
keyboard.esc.addEventListener('click', () => {
  keyboard.escape();
});
keyboard.screen.addEventListener('click', () => {
  keyboard.show();
});


// all input keys event listener
keyboard.inputKeys.forEach(key => {
  key.addEventListener('mousedown', function () {
    keyboard.keydownSound(key);
    keyboard.input(key.getAttribute('data'), key);
  });
  key.addEventListener('mouseup', function () {
    keyboard.keyupSound(key);
  });
});

// backspace delete button method
let mousedownID = 1; // set default mousedownID for repeatable delete method
let timeout = 1; // set default timeout
keyboard.backspace.addEventListener('mousedown', function () {
  keyboard.keydownSound(keyboard.backspace);
  keyboard.delete(); // delete first char
  timeout = setTimeout(function () { // add .5s delay before starting repeatable removing
    if (mousedownID === 1) { // if backspace is pressed repeat delete method while mouseup 
      mousedownID = setInterval(() => keyboard.delete(), 80);
    }
  }, 500);

});
keyboard.backspace.addEventListener('mouseup', function () {
  clearTimeout(timeout);
  clearInterval(mousedownID); // stop repeat delete method when mouseup
  mousedownID = 1; // set mousedownID to default
  timeout = 1;
  keyboard.keyupSound(keyboard.backspace);
});

// mute and unmute keyboard sounds
keyboard.mutekey.addEventListener('click', function () {
  keyboard.mutesound();
});

//shift 
keyboard.shiftkey.forEach(shift => {
  shift.addEventListener('mousedown', function () {
    keyboard.shift();
  });
});

//caps
keyboard.capsKey.addEventListener('mousedown', function () {
  keyboard.caps();
});

//change lang
keyboard.langKey.addEventListener('mousedown', () => {
  keyboard.langSwitch();
});

keyboard.langKey.addEventListener('mouseup', () => {
  keyboard.keyupSound();
});



keyboard.arrows.forEach(arrow => {
  arrow.onmosedown = () => { keyboard.keyupSound() };
  arrow.addEventListener('mousedown', () => {
    keyboard.keydownSound();
  });
  arrow.addEventListener('click', () => {
    keyboard.arrowsAction(arrow.getAttribute('data'));
    keyboard.keyupSound();
  });
});


// prevent direct phisical keyboard input in textarea
keyboard.screen.addEventListener('keydown', e => {
  e.preventDefault();
});

function pressKey(selector) {
  document.querySelector(`.${selector}`).classList.add('physicalPress');
}

function freeKey(selector) {
  document.querySelector(`.${selector}`).classList.remove('physicalPress');
}

let keyActive;
document.addEventListener('keydown', e => {

  // SWITCH LANG COMBO
  if (e.shiftKey && e.altKey) {
    keyboard.langSwitch();
    return;
  }

  // ESCAPE
  if (e.code === 'Escape') {
    if (!keyboard.escaped) {
      keyboard.escape();
      keyboard.keyupSound(keyActive);
    } else {
      keyboard.keyupSound(keyActive);
      keyboard.show();
    }
  }

  // ARROWS
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    keyboard.keydownSound(keyActive);
    if (e.code === 'ArrowLeft') {
      keyboard.arrowsAction('left');
    }
    if (e.code === 'ArrowRight') {
      keyboard.arrowsAction('right');
    }
    if (e.code === 'ArrowUp') {
      keyboard.arrowsAction('top');
    }
    if (e.code === 'ArrowDown') {
      keyboard.arrowsAction('bottom');
    }
    return;
  }

  // BACKSPACE
  if (e.code === 'Backspace') {
    document.querySelector('.backspace-wrapper').classList.add('hoverEffect');
  }

  if (e.ctrlKey || e.code === 'ControlLeft' || e.code === 'ControlRight') {
    pressKey('key__rctrl');
    pressKey('key__lctrl');
    keyboard.keydownSound(keyActive);
  }

  // SELECT ALL
  if (e.ctrlKey && e.code === 'KeyA') {
    keyboard.selectAll();
    return;
  }

  // console.log(e.code);
  // CAPS LOCK
  if (e.code === 'CapsLock') {
    keyboard.caps();
  }

  if (e.code === 'Backspace') {
    keyboard.keydownSound(keyActive);
    keyboard.delete();
    return;
  }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keyboard.shift();
  }
  // console.log(e.code);


  keyboard.inputKeys.forEach(key => {
    if (e.code === key.getAttribute('key')) {
      keyActive = key;
      keyboard.keydownSound(keyActive);
      keyboard.input(key.getAttribute('data'), key);
      key.parentElement.classList.add('hoverEffect');
      if (key.children.length > 0) {
        key.firstChild.classList.add('physicalPress');
      } else {
        key.classList.add('physicalPress');
      }
    }
  });
});

document.addEventListener('keyup', e => {


  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    keyboard.keyupSound(keyActive);
    return;
  }

  if (e.ctrlKey || e.code === 'ControlLeft' || e.code === 'ControlRight') {
    freeKey('key__lctrl');
    freeKey('key__rctrl');
    keyboard.keyupSound(keyActive);
  }

  // BACKSPACE KEYUP
  if (e.code === 'Backspace') {
    document.querySelector('.backspace-wrapper').classList.remove('hoverEffect');
    keyboard.keyupSound(keyActive);
    return;
  }



  keyboard.inputKeys.forEach(key => {
    if (e.code === key.getAttribute('key')) {
      key.parentElement.classList.remove('hoverEffect');
      keyboard.keyupSound(keyActive);
      if (key.children.length > 0) {
        key.firstChild.classList.remove('physicalPress');
      } else {
        key.classList.remove('physicalPress');
      }
    }
  });
});


