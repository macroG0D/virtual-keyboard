// show/hide keyboard
document.querySelector('.escape-wrapper').addEventListener('click', () => {
  document.querySelector('.keyboard').classList.add('keyboard__hidden');
  document.querySelector('.screen').style.maxHeight = '80vh';
  document.querySelector('.screen').style.height = '80vh';
  document.querySelector('body').style.overflow = 'hidden';
});
document.querySelector('.screen').addEventListener('click', () => {
  document.querySelector('.keyboard').classList.remove('keyboard__hidden');
  document.querySelector('.screen').style.maxHeight = '25rem';
  document.querySelector('.screen').style.height = '25rem';
  document.querySelector('body').style.overflow = 'visible';
});

const screen = document.querySelector('.screen');
const backspace = document.querySelector('.key__backspace');

document.querySelectorAll('.key-input').forEach(key => {
  key.addEventListener('click', function(){
    let input = key.getAttribute('data');
    screen.value += input;
    screen.focus();
  });
});

backspace.addEventListener('click', function(){
  screen.value = screen.value.slice(0,screen.value.length-1);
  screen.focus();
});