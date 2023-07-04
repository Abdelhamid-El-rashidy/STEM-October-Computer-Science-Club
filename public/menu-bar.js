// menu bar
document.addEventListener('DOMContentLoaded', function() {
    var subBtns = document.querySelectorAll('.sub-btn');
    var menuBtn = document.querySelector('.menu-btn');
    var closeBtn = document.querySelector('.close-btn');
    var sideBar = document.querySelector('.side-bar');
    
    // Event listener for toggle sub menus
    subBtns.forEach(function(subBtn) {
      subBtn.addEventListener('click', function() {
        var subMenu = this.nextElementSibling;
        subMenu.style.display = (subMenu.style.display === 'block') ? 'none' : 'block';
        this.querySelector('.dropdown').classList.toggle('rotate');
      });
    });
    
    // Event listener for expand and collapse the sidebar
    menuBtn.addEventListener('click', function() {
      sideBar.classList.add('active');
      menuBtn.style.visibility = 'hidden';
    });
    
    closeBtn.addEventListener('click', function() {
      sideBar.classList.remove('active');
      menuBtn.style.visibility = 'visible';
    });
  });


// Preloader
window.addEventListener('load', () => {
  const preload = document.querySelector('.preload');
  const navbar = document.querySelector('.nav-bar');
  preload.classList.add('preload-finish');  
  
});
  