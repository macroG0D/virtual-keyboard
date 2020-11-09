class virtualKeyboard {
  constructor() {
    this.capsOn = false;
    this.shiftOn = false;
    this.ctrlPressed = false;
    this.mute = false;
    this.speakActive = false;
    this.lang = 'En';
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
    this.anyKey = document.querySelectorAll('.key');
    this.esc = document.querySelector('.key__escape');
    this.langKey = document.querySelector('.key__lang');
    this.inputKeys = document.querySelectorAll('.key-input');
    this.letters = document.querySelectorAll('.key-letter');
    this.numbers = document.querySelectorAll('.key-number');
    this.extras = document.querySelectorAll('.key-extra');
    this.tildaKeyWrapper = document.querySelector('.key-tilda-wrapper');
    this.tildaKey = document.querySelector('.key-tilda');
    this.backspace = document.querySelector('.key__backspace');
    this.mutekey = document.querySelector('.key__mute');
    this.speakKey = document.querySelector('.key__speak');
    this.shiftkey = document.querySelectorAll('.key-special[data="shift"]');
    this.ctrlKeys = document.querySelectorAll('.ctrlKeys');
    this.capsKey = document.querySelector('.key__caps');
    this.arrows = document.querySelectorAll('.key-arrow');
    this.spacekey = document.querySelector('.key__space');
    this.init(this.lang);
  }

  init(lang) {
    let langObj;
    if (lang === 'En') {
      langObj = this.langKeysEn;
      // ё = tilda
      this.tildaKeyWrapper.innerHTML = `<div class="key-double key-extra key-switchable" data="\`" key="Backquote"><span class="symbols"><span class="first">~</span><span class="second">\`</span></span></div>`;
    } else if (lang === 'Ru') {
      langObj = this.langKeysRu;
      // tilda = ё
      this.tildaKeyWrapper.innerHTML = `<div class="key-letter key-switchable key-tilda" data="ё" key="Backquote">ё</div>`;
    }

    if (this.shiftOn) {
      // if shift is on when change lang — turn off shift to prevent unwanted symbols turn
      this.shift();
    }
    let i = 0;
    if (this.capsOn) {
      // if caps is on turn letters to upper case
      if (lang === 'Ru') {
        // ё toUpperCase when capslock on on lang switch
        this.tildaKeyWrapper.innerHTML = `<div class="key-letter key-switchable key-tilda" data="Ё" key="Backquote">Ё</div>`;
      }
      while (i < 3) {
        langObj[i].forEach((item, index) => {
          if (item.length === 1) {
            langObj[i][index] = item.toUpperCase();
          }
        });
        i++;
      }
    } else {
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
    this.numbers.forEach((elem) => {
      if (this.shiftOn) {
        // if on lang change shift is on, switch the new numbers
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
            key.children[0].innerHTML = `<div class="key-input key-letter key-switchable" data="${
              langObj[row][count - 1]
            }">${langObj[row][count - 1]}</div>`;
            key.children[0].setAttribute('data', key.children[0].innerText);
          } else {
            // if dobule
            key.children[0].innerHTML = `<span class="symbols"><span class="first">${
              langObj[row][count - 1][0]
            }</span><span class="second">${
              langObj[row][count - 1][1]
            }</span></span>`;
            key.children[0].setAttribute(
              'data',
              key.children[0].querySelector('.second').innerText
            );
          }
          count++;
        }
      }
      row++;
    }
    this.letters = document.querySelectorAll('.key-letter');
    this.extras = document.querySelectorAll('.key-extra');
  }

  escape() {
    // hide keyboard
    this.escaped = true;
    this.keyboard.classList.add('keyboard__hidden');
    this.screen.style.maxHeight = '80vh';
    this.screen.style.height = '80vh';
    document.querySelector('body').style.overflow = 'hidden';
  }
  show() {
    // show keyboard
    this.escaped = false;
    let screenHeight;
    if (window.innerHeight > 901) {
      screenHeight = '30rem';
    } else if (window.innerHeight <= 687) {
      screenHeight = '15rem';
    } else if (window.innerHeight <= 740) {
      screenHeight = '20rem';
    } else if (window.innerHeight <= 900) {
      screenHeight = '25rem';
    }

    this.keyboard.classList.remove('keyboard__hidden');
    this.screen.style.maxHeight = screenHeight;
    this.screen.style.height = screenHeight;
    document.querySelector('body').style.overflow = 'visible';
  }

  input(char) {
    if (this.ctrlPressed) {
      return;
    }

    let currentPositionStart = this.screen.selectionStart;
    let currentPositionEnd = this.screen.selectionEnd;

    if (currentPositionStart !== this.screen.value.length) {
      let valBefore = this.screen.value.substring(0, currentPositionStart);
      let valAfter = this.screen.value.substring(currentPositionEnd);
      valBefore += char;
      let result = valBefore + valAfter;
      this.screen.value = result;
      this.screen.setSelectionRange(valBefore.length, valBefore.length);
    } else {
      this.screen.value += char;
      addEventListener('mouseup', function () {});
    }
    this.screen.blur();
    this.screen.focus();
  }

  selectAll() {
    this.selectionEnd = this.screen.value.length;
    this.screen.setSelectionRange(this.selectionStart, this.selectionEnd);
  }

  keydownSound(key) {
    if (this.mute) {
      return;
    }
    let audio = new Audio();

    if (this.lang === 'En') {
      if (key === undefined) {
        audio = new Audio('./assets/sound/tap-set-normal-down.wav');
      } else if (key.innerText === 'ENTER') {
        audio = new Audio('./assets/sound/tap-set-enter-down.wav');
      } else if (key.classList.contains('key__space')) {
        audio = new Audio('./assets/sound/tap-set-space-down.wav');
      } else if (key.classList.contains('key__lshift')) {
        audio = new Audio('./assets/sound/tap-set-shift.wav');
      } else if (key.classList.contains('key__caps')) {
        audio = new Audio('./assets/sound/tap-set-caps.wav');
      } else if (key.classList.contains('key__backspace')) {
        audio = new Audio('./assets/sound/tap-set-backspace.wav');
      } else {
        audio = new Audio('./assets/sound/tap-set-normal-down.wav');
      }
    } else {
      // if russian
      if (key === undefined) {
        audio = new Audio('./assets/sound/ru-key-down.wav');
      } else if (key.innerText === 'ENTER') {
        audio = new Audio('./assets/sound/ru-enter-down.wav');
      } else if (key.classList.contains('key__space')) {
        audio = new Audio('./assets/sound/ru-space-down.wav');
      } else if (key.classList.contains('key__lshift')) {
        audio = new Audio('./assets/sound/ru-shift-down.wav');
      } else if (key.classList.contains('key__caps')) {
        audio = new Audio('./assets/sound/ru-caps-down.wav');
      } else if (key.classList.contains('key__backspace')) {
        audio = new Audio('./assets/sound/ru-backspace-down.wav');
      } else {
        audio = new Audio('./assets/sound/ru-key-down.wav');
      }
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

    if (this.lang === 'En') {
      if (key === undefined) {
        audio = new Audio('./assets/sound/tap-set-normal-up.wav');
      } else if (key.innerText === 'ENTER') {
        audio = new Audio('./assets/sound/tap-set-enter-up.wav');
      } else if (key.classList.contains('key__space')) {
        audio = new Audio('./assets/sound/tap-set-space-up.wav');
      } else if (key.classList.contains('key__lshift')) {
        audio = new Audio('./assets/sound/tap-set-shift.wav');
      } else if (key.classList.contains('key__caps')) {
        audio = new Audio('./assets/sound/tap-set-caps.wav');
      } else {
        audio = new Audio('./assets/sound/tap-set-normal-up.wav');
      }
    } else {
      // if russian
      if (key === undefined) {
        audio = new Audio('./assets/sound/ru-key-up.wav');
      } else if (key.innerText === 'ENTER') {
        audio = new Audio('./assets/sound/ru-enter-up.wav');
      } else if (key.classList.contains('key__space')) {
        audio = new Audio('./assets/sound/ru-space-up.wav');
      } else if (key.classList.contains('key__lshift')) {
        audio = new Audio('./assets/sound/ru-shift-up.wav');
      } else if (key.classList.contains('key__caps')) {
        audio = new Audio('./assets/sound/ru-caps-up.wav');
      } else if (key.classList.contains('key__backspace')) {
        audio = new Audio('./assets/sound/ru-backspace-up.wav');
      } else {
        audio = new Audio('./assets/sound/ru-key-up.wav');
      }
    }

    audio.volume = 0.5;
    audio.play();
  }

  delete() {
    let currentPositionStart = this.screen.selectionStart;
    let currentPositionEnd = this.screen.selectionEnd;
    let valBefore;

    if (currentPositionStart !== this.screen.value.length) {
      if (currentPositionStart !== currentPositionEnd) {
        valBefore = this.screen.value.substring(0, currentPositionStart + 1);
      } else {
        valBefore = this.screen.value.substring(0, currentPositionStart);
      }
      let valAfter = this.screen.value.substring(currentPositionEnd);
      valBefore = valBefore.slice(0, valBefore.length - 1);
      let result = valBefore + valAfter;
      this.screen.value = result;
      keyboard.screen.setSelectionRange(valBefore.length, valBefore.length);
    } else {
      this.screen.value = this.screen.value.slice(
        0,
        this.screen.value.length - 1
      );
    }
  }

  shift() {
    this.numbers.forEach((elem) => {
      let temp = elem.querySelector('.first').innerText;
      elem.querySelector('.first').innerText = elem.querySelector(
        '.second'
      ).innerText;
      elem.querySelector('.second').innerText = temp;
      elem.setAttribute('data', elem.querySelector('.second').innerText); // change num symbols
    });
    this.extras.forEach((extra) => {
      try {
        let temp = extra.querySelector('.first').innerText;
        extra.querySelector('.first').innerText = extra.querySelector(
          '.second'
        ).innerText;
        extra.querySelector('.second').innerText = temp;
        extra.setAttribute('data', extra.querySelector('.second').innerText); // change num symbols
      } catch (e) {}
    });
    let shiftbutton = document.querySelector('.key__lshift');
    if (!this.shiftOn) {
      this.keydownSound(shiftbutton);
      this.shiftOn = true;
      if (this.capsOn) {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      } else {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toUpperCase();
          elem.setAttribute('data', elem.innerText.toUpperCase());
        });
      }
      this.shiftkey.forEach(function (shift) {
        shift.classList.add('key__pressed');
        shift.parentElement.classList.add('key__active-grad');
      });
    } else {
      this.keyupSound(shiftbutton);
      this.shiftOn = false;

      if (this.capsOn) {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toUpperCase();
          elem.setAttribute('data', elem.innerText.toUpperCase());
        });
      } else {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      }

      this.shiftkey.forEach(function (shift) {
        shift.classList.remove('key__pressed');
        shift.parentElement.classList.remove('key__active-grad');
      });
    }
  }

  caps() {
    if (!this.capsOn) {
      this.keydownSound(this.capsKey);
      this.capsKey.classList.add('key__pressed');
      this.capsKey.parentElement.classList.add('key__active-grad');
      this.capsOn = true;

      if (!this.shiftOn) {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toUpperCase();
          elem.setAttribute('data', elem.innerText.toUpperCase());
        });
      } else {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      }
    } else {
      this.keyupSound(this.capsKey);
      this.capsOn = false;
      this.capsKey.classList.remove('key__pressed');
      this.capsKey.parentElement.classList.remove('key__active-grad');
      if (!this.shiftOn) {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toLowerCase();
          elem.setAttribute('data', elem.innerText.toLowerCase());
        });
      } else {
        this.letters.forEach((elem) => {
          elem.innerText = elem.innerText.toUpperCase();
          elem.setAttribute('data', elem.innerText.toUpperCase());
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

  // speach recognition
  speak() {
    let currentText = keyboard.screen.value;

    function playsound(status) {
      if (status === 'start') {
        let speakstart = new Audio('./assets/sound/speakstart.mp3');
        speakstart.volume = 0.5;
        speakstart.play();
      } else {
        let speakstop = new Audio('./assets/sound/speakstop.mp3');
        speakstop.volume = 0.5;
        speakstop.play();
      }
    }

    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.interimResults = true;
    if (keyboard.lang === 'En') {
      recognition.lang = 'en-US';
    } else {
      recognition.lang = 'ru-Ru';
    }

    if (!keyboard.speakActive) {
      keyboard.speakActive = true;
      playsound('start');
      this.parentElement.classList.add('hoverEffect');
      this.parentElement.classList.add('key__active-grad');
      this.classList.add('key__pressed');

      recognition.start();
      recognition.addEventListener('result', (e) => {
        if (keyboard.speakActive === true) {
          let input = e.results[0][0].transcript;
          keyboard.screen.value = `${currentText} ${input}`;
        } else {
          recognition.abort();
          recognition.stop();
        }
      });
      recognition.onend = (e) => {
        if (keyboard.speakActive) {
          currentText = keyboard.screen.value;
          if (keyboard.lang === 'En') {
            recognition.lang = 'en-US';
          } else {
            recognition.lang = 'ru-Ru';
          }
          keyboard.screen.blur();
          keyboard.screen.focus();
          recognition.start();
        }
      };
      recognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          keyboard.screen.value +=
            '\r\n' +
            'Для работы данной функции необходимо предоставить странице разрешение на использование микрофона 🎤';
          keyboard.speakActive = false;
          this.parentElement.classList.remove('hoverEffect');
          this.parentElement.classList.remove('key__active-grad');
          this.classList.remove('key__pressed');
        } else {
          recognition.abort();
          recognition.stop();
        }
      };
    } else {
      keyboard.speakActive = false;
      playsound('stop');
      this.parentElement.classList.remove('hoverEffect');
      this.parentElement.classList.remove('key__active-grad');
      this.classList.remove('key__pressed');
      recognition.abort();
      recognition.stop();
      keyboard.screen.blur();
      keyboard.screen.focus();
    }
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
    let currentPositionStart = this.screen.selectionStart;
    let currentPositionEnd = this.screen.selectionEnd;

    if (this.shiftOn) {
      // shift on arrows movement creates selection
      if (dir === 'right') {
        currentPositionStart = this.screen.selectionStart;
        currentPositionEnd++;
        keyboard.screen.setSelectionRange(
          currentPositionStart,
          currentPositionEnd
        );
      } else if (dir === 'left') {
        if (currentPositionStart > 0) {
          currentPositionStart--;
          keyboard.screen.setSelectionRange(
            currentPositionStart,
            currentPositionEnd
          );
        }
      }
    } else {
      // if no shift on when using arrows
      if (dir === 'right') {
        currentPositionStart++;
        keyboard.screen.setSelectionRange(
          currentPositionStart,
          currentPositionStart
        );
      } else if (dir === 'left') {
        if (currentPositionStart > 0) {
          currentPositionStart--;
          keyboard.screen.setSelectionRange(
            currentPositionStart,
            currentPositionStart
          );
        }
      }
    }
    this.screen.focus();
  }
}

// create keyboard object
const keyboard = new virtualKeyboard();

keyboard.spacekey.addEventListener('mousedown', () => {
  keyboard.spacekey.classList.remove('key__space-free');
  keyboard.spacekey.classList.add('key__space-pressed');
});

keyboard.spacekey.addEventListener('mouseup', () => {
  keyboard.spacekey.classList.remove('key__space-pressed');
  keyboard.spacekey.classList.add('key__space-free');
});
keyboard.spacekey.addEventListener('mouseleave', () => {
  keyboard.spacekey.classList.remove('key__space-pressed');
  keyboard.spacekey.classList.add('key__space-free');
});

// hide & show methods calls
keyboard.esc.addEventListener('click', () => {
  keyboard.escape();
  keyboard.keyupSound();
});
keyboard.screen.addEventListener('click', () => {
  keyboard.show();
});

keyboard.tildaKeyWrapper.addEventListener('mousedown', () => {
  keyboard.keydownSound();
  keyboard.input(
    keyboard.tildaKeyWrapper.children[0].getAttribute('data'),
    keyboard.tildaKeyWrapper.children[0]
  );
  if (keyboard.tildaKeyWrapper.children.length > 0) {
    keyboard.tildaKeyWrapper.firstChild.classList.add('highlighted');
  } else {
    keyboard.tildaKeyWrapper.classList.add('highlighted');
  }
});

keyboard.tildaKeyWrapper.addEventListener('mouseup', () => {
  keyboard.keyupSound();
  if (keyboard.tildaKeyWrapper.children.length > 0) {
    keyboard.tildaKeyWrapper.firstChild.classList.remove('highlighted');
  } else {
    keyboard.tildaKeyWrapper.classList.remove('highlighted');
  }
});

// all input keys event listener
keyboard.inputKeys.forEach((key) => {
  key.addEventListener('mousedown', function () {
    keyboard.keydownSound(key);
    keyboard.input(key.getAttribute('data'), key);

    if (key.children.length > 0) {
      key.firstChild.classList.add('highlighted');
    } else {
      key.classList.add('highlighted');
    }
  });
  key.addEventListener('mouseup', function () {
    keyboard.keyupSound(key);
    if (key.children.length > 0) {
      key.firstChild.classList.remove('highlighted');
    } else {
      key.classList.remove('highlighted');
    }
  });
  key.addEventListener('mouseleave', function () {
    if (key.children.length > 0) {
      key.firstChild.classList.remove('highlighted');
    } else {
      key.classList.remove('highlighted');
    }
    keyboard.screen.focus();
  });
});

// backspace delete button method
let mousedownID = 1; // set default mousedownID for repeatable delete method
let timeout = 1; // set default timeout
keyboard.backspace.addEventListener('mousedown', function () {
  keyboard.keydownSound(keyboard.backspace);
  keyboard.delete(); // delete first char
  keyboard.backspace.classList.remove('key__backspace-free');
  keyboard.backspace.classList.add('key__backspace-pressed');
  timeout = setTimeout(function () {
    // add .5s delay before starting repeatable removing
    if (mousedownID === 1) {
      // if backspace is pressed repeat delete method while mouseup
      mousedownID = setInterval(() => keyboard.delete(), 80);
    }
  }, 500);
});

function leaveDelete(e) {
  clearTimeout(timeout);
  clearInterval(mousedownID); // stop repeat delete method when mouseup
  mousedownID = 1; // set mousedownID to default
  timeout = 1;
  if (e.type !== 'mouseleave') {
    keyboard.keyupSound(keyboard.backspace);
  }
  keyboard.backspace.classList.remove('key__backspace-pressed');
  keyboard.backspace.classList.add('key__backspace-free');
  keyboard.screen.focus();
}
keyboard.backspace.addEventListener('mouseup', leaveDelete);
keyboard.backspace.addEventListener('mouseleave', (e) => {
  leaveDelete(e);
});

// mute and unmute keyboard sounds
keyboard.mutekey.addEventListener('click', function () {
  keyboard.mutesound();
});

// ctrl click
keyboard.ctrlKeys.forEach((ctrl) => {
  ctrl.addEventListener('mousedown', () => {
    keyboard.keydownSound(ctrl);
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.children[0].classList.add('highlighted');
      ctrl.classList.add('hoverEffect');
    });
  });
});
keyboard.ctrlKeys.forEach((ctrl) => {
  ctrl.addEventListener('mouseup', () => {
    keyboard.keyupSound(ctrl);
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.children[0].classList.remove('highlighted');
      ctrl.classList.remove('hoverEffect');
    });
  });
  ctrl.addEventListener('mouseleave', () => {
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.children[0].classList.remove('highlighted');
      ctrl.classList.remove('hoverEffect');
    });
    keyboard.screen.focus();
  });
});

// shift
keyboard.shiftkey.forEach((shift) => {
  shift.addEventListener('mousedown', function () {
    keyboard.shift();
  });
});

keyboard.shiftkey.forEach((shift) => {
  shift.addEventListener('mouseup', function () {
    keyboard.screen.focus();
  });
});

// caps
keyboard.capsKey.addEventListener('mousedown', function () {
  keyboard.caps();
});
keyboard.capsKey.addEventListener('mouseup', function () {
  keyboard.screen.focus();
});

// change lang
keyboard.langKey.addEventListener('mousedown', () => {
  keyboard.langSwitch();
});
keyboard.langKey.addEventListener('mouseup', () => {
  keyboard.keyupSound();
});

// arrows mouse interaction
keyboard.arrows.forEach((arrow) => {
  arrow.onmosedown = () => {
    keyboard.keyupSound();
  };
  arrow.addEventListener('mousedown', () => {
    keyboard.keydownSound();
  });
  arrow.addEventListener('click', () => {
    if (arrow.getAttribute('data') === 'top') {
      keyboard.screen.setSelectionRange(0, 0);
      keyboard.screen.focus();
      keyboard.keyupSound();
      return;
    } else if (arrow.getAttribute('data') === 'bottom') {
      keyboard.screen.setSelectionRange(
        keyboard.screen.value.length,
        keyboard.screen.value.length
      );
      keyboard.screen.focus();
      keyboard.keyupSound();
      return;
    }
    keyboard.arrowsAction(arrow.getAttribute('data'));
    keyboard.keyupSound();
  });
});

document.addEventListener('keydown', (e) => {
  if (
    e.ctrlKey ||
    e.code === 'F5' ||
    e.code === 'ArrowUp' ||
    e.code === 'ArrowDown' ||
    e.code === 'Delete'
  ) {
    // don't preventDefault if ctrl+c or ctrl+v or ctrl+X or f5 (refresh) or arrows or delete buttons ware pressed
  } else {
    e.preventDefault();
  }
  if (e.code === 'Delete') {
    keyboard.keydownSound();
  }
});

function pressKey(selector) {
  document.querySelector(`.${selector}`).classList.add('highlighted');
}

function freeKey(selector) {
  document.querySelector(`.${selector}`).classList.remove('highlighted');
}

keyboard.speakKey.onclick = keyboard.speak;

// physical keyboard keydown listener
let keyActive;
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    keyboard.spacekey.classList.remove('key__space-free');
    keyboard.spacekey.classList.add('key__space-pressed');
  }

  // switch lang combo
  if (e.shiftKey && e.altKey) {
    keyboard.langSwitch();
    return;
  }

  // escape
  if (e.code === 'Escape') {
    if (!keyboard.escaped) {
      keyboard.escape();
      keyboard.keyupSound();
    } else {
      keyboard.keyupSound();
      keyboard.show();
    }
  }

  // arrows
  if (
    e.code === 'ArrowLeft' ||
    e.code === 'ArrowRight' ||
    e.code === 'ArrowUp' ||
    e.code === 'ArrowDown'
  ) {
    keyboard.keydownSound();
    if (e.code === 'ArrowLeft') {
      keyboard.arrowsAction('left');
      document.querySelector('#arrow-left').classList.add('hoverEffect');
      document.querySelector('#arrow-left').classList.add('key__active-grad');
    }
    if (e.code === 'ArrowRight') {
      keyboard.arrowsAction('right');
      document.querySelector('#arrow-right').classList.add('hoverEffect');
      document.querySelector('#arrow-right').classList.add('key__active-grad');
    }
    if (e.code === 'ArrowUp') {
      keyboard.arrowsAction('top');
      document.querySelector('#arrow-top').classList.add('hoverEffect');
      document.querySelector('#arrow-top').classList.add('key__active-grad');
    }
    if (e.code === 'ArrowDown') {
      keyboard.arrowsAction('bottom');
      document.querySelector('#arrow-bot').classList.add('hoverEffect');
      document.querySelector('#arrow-bot').classList.add('key__active-grad');
    }
    return;
  }

  // backspace
  if (e.code === 'Backspace') {
    document.querySelector('.backspace-wrapper').classList.add('hoverEffect');
  }

  // ctrl
  if (e.ctrlKey || e.code === 'ControlLeft' || e.code === 'ControlRight') {
    pressKey('key__rctrl');
    pressKey('key__lctrl');
    keyboard.keydownSound();
    keyboard.ctrlPressed = true;
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.classList.add('hoverEffect');
    });
  }

  // select all
  if (e.ctrlKey && e.code === 'KeyA') {
    keyboard.selectAll();
    return;
  }

  // caps lock
  if (e.code === 'CapsLock') {
    keyboard.caps();
  }

  if (e.code === 'Backspace') {
    keyboard.keydownSound(keyboard.backspace);
    keyboard.backspace.classList.remove('key__backspace-free');
    keyboard.backspace.classList.add('key__backspace-pressed');
    keyboard.delete();
    return;
  }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keyboard.shift();
  }

  if (e.code === 'Backquote') {
    keyboard.keydownSound();
    keyboard.input(
      keyboard.tildaKeyWrapper.children[0].getAttribute('data'),
      keyboard.tildaKeyWrapper.children[0]
    );
    if (keyboard.tildaKeyWrapper.children.length > 0) {
      keyboard.tildaKeyWrapper.firstChild.classList.add('highlighted');
    } else {
      keyboard.tildaKeyWrapper.classList.add('highlighted');
    }
    keyboard.tildaKeyWrapper.classList.add('hoverEffect');
  }

  keyboard.inputKeys.forEach((key) => {
    if (e.code === key.getAttribute('key')) {
      keyActive = key;
      keyboard.keydownSound(keyActive);
      keyboard.input(key.getAttribute('data'), key);
      key.parentElement.classList.add('hoverEffect');
      if (key.children.length > 0) {
        key.firstChild.classList.add('highlighted');
      } else {
        key.classList.add('highlighted');
      }
    }
  });
});

// real keyboard keyup listener
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    keyboard.spacekey.classList.remove('key__space-pressed');
    keyboard.spacekey.classList.add('key__space-free');
  }

  if (e.code === 'Delete') {
    keyboard.keyupSound();
  }

  if (
    e.code === 'ArrowLeft' ||
    e.code === 'ArrowRight' ||
    e.code === 'ArrowUp' ||
    e.code === 'ArrowDown'
  ) {
    document.querySelectorAll('.arrow-wrapper').forEach((arrow) => {
      arrow.classList.remove('hoverEffect');
      arrow.classList.remove('key__active-grad');
    });
    keyboard.keyupSound();
    return;
  }

  if (e.ctrlKey || e.code === 'ControlLeft' || e.code === 'ControlRight') {
    freeKey('key__lctrl');
    freeKey('key__rctrl');
    keyboard.keyupSound();
    keyboard.ctrlPressed = false;
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.classList.remove('hoverEffect');
    });
  }

  // backspace keyup
  if (e.code === 'Backspace') {
    document
      .querySelector('.backspace-wrapper')
      .classList.remove('hoverEffect');
    keyboard.backspace.classList.remove('key__backspace-pressed');
    keyboard.backspace.classList.add('key__backspace-free');
    keyboard.keyupSound();
    return;
  }

  if (e.code === 'Backquote') {
    keyboard.keyupSound();
    if (keyboard.tildaKeyWrapper.children.length > 0) {
      keyboard.tildaKeyWrapper.firstChild.classList.remove('highlighted');
    } else {
      keyboard.tildaKeyWrapper.classList.remove('highlighted');
    }
    keyboard.tildaKeyWrapper.classList.remove('hoverEffect');
  }

  keyboard.inputKeys.forEach((key) => {
    if (e.code === key.getAttribute('key')) {
      key.parentElement.classList.remove('hoverEffect');
      keyboard.keyupSound(keyActive);
      if (key.children.length > 0) {
        key.firstChild.classList.remove('highlighted');
      } else {
        key.classList.remove('highlighted');
      }
    }
  });
});

// transform rotateX is working only on chrome
function setPerspectiveKeys() {
  if (window.innerWidth > 1140) {
    if (navigator.appVersion.indexOf('Chrome/') != -1) {
      document.querySelectorAll('.key-row').forEach((e) => {
        e.style.transform = 'rotateX(5deg)';
      });
    } else {
      document.querySelector('#arrow-top').style.margin = '0 1.5rem';
    }
  } else {
    if (navigator.appVersion.indexOf('Chrome/') != -1) {
      document.querySelectorAll('.key-row').forEach((e) => {
        e.style.transform = 'none';
      });
    } else {
      document.querySelector('#arrow-top').style.removeProperty('margin');
    }
  }
}

keyboard.screen.addEventListener('focus', () => {
  if (keyboard.ctrlPressed) {
    // prevent ctrl keys stuck
    freeKey('key__lctrl');
    freeKey('key__rctrl');
    keyboard.keyupSound();
    keyboard.ctrlPressed = false;
    keyboard.ctrlKeys.forEach((ctrl) => {
      ctrl.classList.remove('hoverEffect');
    });
  }
});

window.onload = setPerspectiveKeys;
window.onresize = setPerspectiveKeys;
keyboard.screen.focus(); // auto focus on text input onload
