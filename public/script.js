// Counter hero section
const updatedCounters = [
  { target: 60, elementId: "applicants-stats" },
  { target: 5, elementId: "projects-stats" },
  { target: 5, elementId: "articles-stats" }
];

const updatedDuration = 2000; // The duration in milliseconds for the counter effect
const updatedInterval = 50; // The interval in milliseconds between each count update

function updatedEaseOutQuad(t) {
  return t * (2 - t);
}

updatedCounters.forEach(updatedCounter => {
  let currentNumber = 0;
  const increment = updatedCounter.target / (updatedDuration / updatedInterval);
  const counterElement = document.getElementById(updatedCounter.elementId);
  
  const counterInterval = setInterval(() => {
    currentNumber += increment;
    const progress = updatedEaseOutQuad(currentNumber / updatedCounter.target);
    const currentValue = Math.ceil(progress * updatedCounter.target);
    
    if (currentValue >= updatedCounter.target) {
      clearInterval(counterInterval);
      currentNumber = updatedCounter.target;
    }
    
    counterElement.textContent = currentValue + "+";
  }, updatedInterval);
});


// Counter tracks stats
const counters = [
  { target: 2, elementId: "alg-DS-art" },
  { target: 0, elementId: "alg-DS-proj" },
  { target: 0, elementId: "web-art" },
  { target: 2, elementId: "web-proj" },
  { target: 0, elementId: "mobile-art" },
  { target: 0, elementId: "mobile-proj" },
  { target: 1, elementId: "machine-learning-art" },
  { target: 0, elementId: "machine-learning-proj" },
  { target: 2, elementId: "robotics-art" },
  { target: 0, elementId: "robotics-proj" },
  { target: 0, elementId: "fundamentals-art" },
  { target: 0, elementId: "fundamentals-proj" }
];

const duration = 1500; // The duration in milliseconds for the counter effect
const interval = 50; // The interval in milliseconds between each count update

function easeOutQuad(t) {
  return t * (2 - t);
}

function startCounter(elementId, target) {
  let currentNumber = 0;
  const increment = target / (duration / interval);
  const counterElement = document.getElementById(elementId);

  const counterInterval = setInterval(() => {
    currentNumber += increment;
    const progress = easeOutQuad(currentNumber / target);
    const currentValue = Math.ceil(progress * target);

    if (currentValue >= target) {
      clearInterval(counterInterval);
      currentNumber = target;
    }

    if (target === 0) {
      counterElement.textContent = "⏳"; // Replace with the unicode for "upcoming"
    } else {
      counterElement.textContent = currentValue + "+";
    }
  }, interval);
}


const trackCardElements = document.querySelectorAll("#track-card");

trackCardElements.forEach((trackCardElement) => {
  let isHovered = false;

  trackCardElement.addEventListener("mouseover", function () {
    if (!isHovered) {
      const trackStatsElement = this.querySelector(".track-stats");
      const spanElements = trackStatsElement.querySelectorAll("span");

      spanElements.forEach((spanElement) => {
        const elementId = spanElement.getAttribute("id");
        const counter = counters.find((item) => item.elementId === elementId);

        if (counter) {
          startCounter(elementId, counter.target);
        }
      });

      isHovered = true;
    }
  });
});








// image slider
const slider = document.querySelector(".slider");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slides = document.querySelectorAll(".slide");
const slideIcons = document.querySelectorAll(".slide-icon");
const numberOfSlides = slides.length;
var slideNumber = 0;

//image slider next button
nextBtn.addEventListener("click", () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  slideIcons.forEach((slideIcon) => {
    slideIcon.classList.remove("active");
  });

  slideNumber++;

  if(slideNumber > (numberOfSlides - 1)){
    slideNumber = 0;
  }

  slides[slideNumber].classList.add("active");
  slideIcons[slideNumber].classList.add("active");
});

//image slider previous button
prevBtn.addEventListener("click", () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  slideIcons.forEach((slideIcon) => {
    slideIcon.classList.remove("active");
  });

  slideNumber--;

  if(slideNumber < 0){
    slideNumber = numberOfSlides - 1;
  }

  slides[slideNumber].classList.add("active");
  slideIcons[slideNumber].classList.add("active");
});

//image slider autoplay
var playSlider;

var repeater = () => {
  playSlider = setInterval(function(){
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    slideIcons.forEach((slideIcon) => {
      slideIcon.classList.remove("active");
    });

    slideNumber++;

    if(slideNumber > (numberOfSlides - 1)){
      slideNumber = 0;
    }

    slides[slideNumber].classList.add("active");
    slideIcons[slideNumber].classList.add("active");
  }, 4000);
}
repeater();

//stop the image slider autoplay on mouseover
slider.addEventListener("mouseover", () => {
  clearInterval(playSlider);
});

//start the image slider autoplay again on mouseout
slider.addEventListener("mouseout", () => {
  repeater();
});


let articleContainer = document.getElementById("articles-container");

// fetch json data
fetch("https://csc-e925.onrender.com/api/articles")
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
    <a href="${data["readMoreLink"]}">
      <div class="card-top">
        <img src="../../${data["image"]}" alt="">
      </div>
      <div class="card-info">
        <h3>${data["title"]}</h3>
        <span>${data["date"]}</span>
        <p class="intro">${data["intro"]}</p>
      </div>
      <div class="card-bottom">
        <a href="${data["readMoreLink"]}" target="_blank" class="read-more">Read more</a>
        <a href="${data["trackTagLink"]}" class="track-tag">${data["trackTagName"]}</a> 
      </div>
    </a> 
  `;
  
  return articleCard;
}


let projectContainer = document.getElementById("project-contianer");



// fetch json data
fetch("https://csc-e925.onrender.com/api/projects")
  .then(res => res.json())
  .then(json => {
    json.map(data => {
      projectContainer.appendChild(project_fun(data));
    })
  });

// Project card 
function project_fun(data) {
  let projectCard = document.createElement('div');
  projectCard.classList.add('project-card');

  projectCard.innerHTML = `
    <img src="${data["image"]}" alt="">
    <div class="info">
    <h4>${data["title"]}</h4>
    <p><i class="fa-solid fa-user"></i>${data["contributor"]}</p>
    <a class="track-tag" href="${data["trackTagLink"]}">${data["trackTagName"]}</a>
    <p>${data["intro"]}</p>
    <ul class="social-bar">
      <li class="social-link"><a href="${data["githubLink"]}"><i class="fa fa-github-square" aria-hidden="true"></i></a></li>
    </ul>
  </div>
  `;

  return projectCard;
}




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
        ScrollReveal().reveal('.applicants-stats', {delay: 250, origin: 'left'});
        ScrollReveal().reveal('.projects-stats', {delay: 250, origin: 'bottom'});
        ScrollReveal().reveal('.articles-stats', {delay: 250, origin: 'bottom'});
    }
  }
  
  var x = window.matchMedia("(max-width: 750px)")
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes


//  const map = L.map('map')
//  map.setView([ 52.488, -0.89], 7);

//  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
// }).addTo(map);
