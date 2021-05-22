const menu = document.querySelector('.main-nav');
const openMenuButton = menu.querySelector('.main-nav__toggle');
const openClassName = 'main-nav--opened';

menu.classList.remove('main-nav--no-js');

openMenuButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  if (menu.classList.contains(openClassName)) {
    closeMenu();
  } else {
    openMenu();
  }
});

window.addEventListener('keydown', function(evt) {
  if (evt.keyCode === 27) {
    closeMenu();
  }
});

function openMenu() {
  menu.classList.add(openClassName);
}

function closeMenu() {
  menu.classList.remove(openClassName);
}
