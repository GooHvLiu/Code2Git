const registerButton = document.getElementById('btn-register');
const logoinButton = document.getElementById('btn-logoin');
const containerNote = document.getElementById('container-note');
const containerform = document.getElementById('container-form');

logoinButton.addEventListener('click', () => {
  // console.log('123');
  containerNote.classList.add('note-move-right');
  containerform.classList.add('form-move-left');
})

registerButton.addEventListener('click', () => {
  // console.log('234');
  containerNote.classList.remove('note-move-right');
  containerform.classList.remove('form-move-left');
})