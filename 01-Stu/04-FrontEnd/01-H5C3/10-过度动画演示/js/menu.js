const icon = document.getElementById('icon-toggle')
const clickmenu = document.getElementsByClassName('click-menu')[0]
function toggleIcon() {

  if (icon.classList.contains('icon-sanheng')) {
    icon.classList.remove('icon-sanheng')
    icon.classList.add('icon-cha')

    // 增加菜单显示
    clickmenu.classList.add('menu-active')
    clickmenu.classList.remove('click-menu')

  }
  else {
    icon.classList.add('icon-sanheng')
    icon.classList.remove('icon-cha')

    clickmenu.classList.add('click-menu')
    clickmenu.classList.remove('menu-active')

  }



}

icon.addEventListener('click', toggleIcon)