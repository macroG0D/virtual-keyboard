class virtualKeyboard {
  constructor() {
    this.capsOn = false;
    this.shiftOn = false;
    this.mute = false;
    this.speak = false;
    this.lang = 'en';

    this.screen = document.querySelector('.screen');
    this.keyboard = document.querySelector('.keyboard');
    this.esc = document.querySelector('.key__escape');
    this.inputKeys = document.querySelectorAll('.key-input');
    this.letters = document.querySelectorAll('.key-letter');
    this.numbers = document.querySelectorAll('.key-number');
    this.extras = document.querySelectorAll('.key-extra');
    this.backspace = document.querySelector('.key__backspace');
    this.mutekey = document.querySelector('.key__mute');
    this.shiftkey = document.querySelectorAll('.key-special[data="shift"]');
    this.capsKey = document.querySelector('.key__caps');

  }

  escape() { // hide keyboard
    this.keyboard.classList.add('keyboard__hidden');
    this.screen.style.maxHeight = '80vh';
    this.screen.style.height = '80vh';
    document.querySelector('body').style.overflow = 'hidden';
  }
  show() { // show keyboard
    this.keyboard.classList.remove('keyboard__hidden');
    this.screen.style.maxHeight = '25rem';
    this.screen.style.height = '25rem';
    document.querySelector('body').style.overflow = 'visible';
  }

  input(char) {
    this.screen.value += char;
    addEventListener('mouseup', function () {
    });
  }

  keydownSound(key) {
    if (this.mute) {
      return;
    }
    let audio = new Audio();
    if (key === undefined) {
      audio = new Audio('../assets/sound/tap-set-normal-down.wav');
    } else if (key.innerText === 'ENTER') {
      audio = new Audio('../assets/sound/tap-set-enter-down.wav');
    } else if (key.classList.contains('key__space')) {
      audio = new Audio('../assets/sound/tap-set-space-down.wav');
    } else {
      audio = new Audio('../assets/sound/tap-set-normal-down.wav');
    }
    audio.volume = 0.2;
    audio.play();
  }

  keyupSound(key) {
    this.screen.focus(); // set focus on screen after keyup event
    if (this.mute) {
      return;
    }
    let audio = new Audio();
    if (key === undefined) {
      audio = new Audio('../assets/sound/tap-set-normal-up.wav');
    } else if (key.innerText === 'ENTER') {
      audio = new Audio('../assets/sound/tap-set-enter-up.wav');
    } else if (key.classList.contains('key__space')) {
      audio = new Audio('../assets/sound/tap-set-space-up.wav');
    } else {
      audio = new Audio('../assets/sound/tap-set-normal-up.wav');
    }
    audio.volume = 0.2;
    audio.play();
  }

  delete() {
    this.screen.value = this.screen.value.slice(0, this.screen.value.length - 1);

  }

  shift() {
    this.numbers.forEach(elem => {
      let temp = elem.querySelector('.first').innerText;
      elem.querySelector('.first').innerText = elem.querySelector('.second').innerText;
      elem.querySelector('.second').innerText = temp;
      elem.setAttribute('data', elem.querySelector('.second').innerText); // change num symbols
    });
    this.extras.forEach(extra => {
      let temp = extra.querySelector('.first').innerText;
      extra.querySelector('.first').innerText = extra.querySelector('.second').innerText;
      extra.querySelector('.second').innerText = temp;
      extra.setAttribute('data', extra.querySelector('.second').innerText); // change num symbols
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

  lang() {

  }

  arrows() {

  }

  typein() {
    // type from real keyboard
  }

}


// create keyboard object
const keyboard = new virtualKeyboard();

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
keyboard.backspace.addEventListener('mousedown', function () {
  keyboard.keydownSound(keyboard.backspace);
  keyboard.delete(); // delete first char
  if (mousedownID === 1) { // if backspace is pressed repeat delete method while mouseup 
    mousedownID = setInterval(() => keyboard.delete(), 100);
  }
});
keyboard.backspace.addEventListener('mouseup', function () {
  clearInterval(mousedownID); // stop repeat delete method when mouseup
  mousedownID = 1; // set mousedownID to default
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
