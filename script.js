let articleContainer = document.getElementById("articles-container");



// fetch json data
fetch("http://localhost:3001/Article")
  .then(res => res.json())
  .then(json => {
    json.map(data => {
      articleContainer.appendChild(article_fun(data));
    })
  })

  .catch(error => {
    console.log("Error fetching JSON data:", error);
  });

// Articles card 
function article_fun(data) {
  let articleCard = document.createElement('div');
  articleCard.classList.add('article-card');

  articleCard.innerHTML = `
      <div class="card-top">
      <img src="${data["image"]}" alt="">
    </div>
    <div class="card-info">
      <h3>${data["title"]}</h3>
      <span>${data["date"]}</span>
      <p class="intro">${data["intro"]}</p>
    </div>
    <div class="card-bottom">
      <a href="" class="read-more">Read more</a>
      <a href="${data["trackTagLink"]}" class="track-tag">${data["trackTagName"]}</a> 
    </div>
  `;

  return articleCard;
}

let projectContainer = document.getElementById("project-contianer");



// fetch json data
fetch("http://localhost:3002/Projects")
  .then(res => res.json())
  .then(json => {
    json.map(data => {
      projectContainer.appendChild(project_fun(data));
    })
  })

  .catch(error => {
    console.log("Error fetching JSON data:", error);
  });

// Articles card 
function project_fun(data) {
  let projectCard = document.createElement('div');
  projectCard.classList.add('project-card');

  projectCard.innerHTML = `
    <img src="${data["image"]}" alt="">
    <div class="info">
      <h4>${data["title"]}</h4>
      <a class="track-tag" href="${data["trackTagLink"]}">${data["trackTagName"]}</a>
      <p>${data["intro"]}</p>
      <ul class="social-bar">
        <li class="social-link"><a href="${data["githubLink"]}"><i class="fa fa-github-square" aria-hidden="true"></i></a></li>
      </ul>
    </div>
  `;

  return projectCard;
}


// Toggle the menu when the hamburger icon is clicked
const menuToggle = document.querySelector('.menu-toggle input');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', function () {
  menu.classList.toggle('active');
});




var swiper = new Swiper('.Slider-container', {
    effect: 'cards',
    grabCursor: true,
    centerdSlides: true,
    loop: true,
    autoplay: true,
  });


  // scroll reveal
  ScrollReveal({
    reset: true,
    distance: '60px',
    duration: 2500,
    delay: 100
});
function myFunction(x) {
    if (x.matches) { // If media query matches
        ScrollReveal().reveal('.navbar', {delay: 150, origin: 'top'});
        ScrollReveal().reveal('.hero-section .hero-content h1', {delay: 200, origin: 'top'});
        ScrollReveal().reveal('.footer-content .down-below', {delay: 100, origin: 'bottom'});
        ScrollReveal().reveal('.footer-content .links, .footer-content .to-top, .footer-content p', {delay: 150, origin: 'bottom'});
        ScrollReveal().reveal('.projects-container .project-card .project-description', {delay: 100, origin: 'left'});
        ScrollReveal().reveal('.projects-container .project-card .project-img', {delay: 100, origin: 'right'});
        ScrollReveal().reveal('.skills__list .skills__item', {delay: 100, origin: 'bottom'});
                ScrollReveal().reveal('.applicants-stats', {delay: 250, origin: 'bottom'});
        ScrollReveal().reveal('.projects-stats', {delay: 250, origin: 'bottom'});
        
        
    } else {
        ScrollReveal().reveal('.applicants-stats', {delay: 250, origin: 'bottom'});
        ScrollReveal().reveal('.projects-stats', {delay: 250, origin: 'bottom'});
        ScrollReveal().reveal('.articles-stats', {delay: 250, origin: 'bottom'});
        ScrollReveal().reveal('.hero-section .hero-content h2', {delay: 250, origin: 'left'});
        ScrollReveal().reveal('.hero-section .hero-content .links .codeforces', {delay: 350, origin: 'bottom'});
        ScrollReveal().reveal('.hero-section .hero-content .links .Upwork', {delay: 450, origin: 'bottom'});
        ScrollReveal().reveal('.hero-section .hero-content .links .linkedin', {delay: 550, origin: 'bottom'});

        // 
        ScrollReveal().reveal('.footer-content .down-below', {delay: 100, origin: 'bottom'});
        ScrollReveal().reveal('.footer-content .links, .footer-content .to-top, .footer-content p', {delay: 150, origin: 'bottom'});
        // 
        ScrollReveal().reveal('.projects-container .project-card .project-description', {delay: 100, origin: 'left'});
        ScrollReveal().reveal('.projects-container .project-card .project-img', {delay: 100, origin: 'right'});
        ScrollReveal().reveal('.skills__list .skills__item', {delay: 100, origin: 'bottom'});
    }
  }
  
  var x = window.matchMedia("(max-width: 750px)")
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes
