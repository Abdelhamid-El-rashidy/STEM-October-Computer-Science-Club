AOS.init({
  duration: 1500
});




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
fetch("https://csc-e925.onrender.com/api/articles?id_like=1&id_like=2&id_like=3")
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
  articleCard.setAttribute('data-aos', 'zoom-in-up');

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

// // Select and process odd nth-child elements
// var article_oddChildren = articleContainer.querySelectorAll(":nth-child(odd)");
// for (var i = 0; i < article_oddChildren.length; i++) {
//   article_oddChildren[i].setAttribute("data-aos", "fade-left");
// }

// // Select and process even nth-child elements
// var article_evenChildren = articleContainer.querySelectorAll(":nth-child(even)");
// for (var i = 0; i < article_evenChildren.length; i++) {
//   article_evenChildren[i].setAttribute("data-aos", "fade-right");
// }

let projectContainer = document.getElementById("project-contianer");



// fetch json data
fetch("https://csc-e925.onrender.com/api/projects?id_like=1&id_like=2&id_like=3")
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
  projectCard.setAttribute('data-aos', 'zoom-in-up');

  projectCard.innerHTML = `
    <img src="${data["image"]}" alt="">
    <div class="info">
    <h4>${data["title"]}</h4>
    <p><i class="fa-solid fa-user"></i>${data["contributor"]}</p>
    <a class="track-tag" href="${data["trackTagLink"]}">${data["trackTagName"]}</a>
    <ul class="social-bar">
      <li class="social-link"><a href="${data["githubLink"]}"><i class="fa fa-github-square" aria-hidden="true"></i></a></li>
    </ul>
  </div>
  `;

  return projectCard;
}

// // Select and process odd nth-child elements
// var project_oddChildren = projectContainer.querySelectorAll(":nth-child(odd)");
// for (var i = 0; i < project_oddChildren.length; i++) {
//   project_oddChildren[i].setAttribute("data-aos", "fade-left");
// }

// // Select and process even nth-child elements
// var project_evenChildren = projectContainer.querySelectorAll(":nth-child(even)");
// for (var i = 0; i < project_evenChildren.length; i++) {
//   project_evenChildren[i].setAttribute("data-aos", "fade-right");
// }


var swiper = new Swiper('.Slider-container', {
    effect: 'cards',
    grabCursor: true,
    centerdSlides: true,
    loop: true,
    autoplay: true,
  });


// Slider for mobile view
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);