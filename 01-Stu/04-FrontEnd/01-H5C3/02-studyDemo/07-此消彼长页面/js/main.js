const left = document.getElementsByClassName('left-page')[0];
const right = document.getElementsByClassName('right-page')[0];
const mainpage = document.getElementsByClassName('main-page')[0];
left.addEventListener('mouseenter', () => {
  mainpage.classList.add("hover-left");
})

left.addEventListener('mouseleave', () => {
  mainpage.classList.remove("hover-left");
})

right.addEventListener('mouseenter', () => {
  mainpage.classList.add("hover-right");
})

right.addEventListener('mouseleave', () => {
  mainpage.classList.remove("hover-right");
})