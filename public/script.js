AOS.init({
  duration: 1500
});

/* Please ❤ this and follow me if you like it! */

class Dots {
	constructor(width, height, spacing) {
		this.spacing = spacing;
		this.dots = [];
		this.alphaStep = 1 / 10;
		this.cols = Math.floor(width / spacing);
		this.rows = Math.floor(height / spacing);

		const canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;
		this.canvas = canvas;
		this.ctx = ctx;

		this.draw();
	}
	draw() {
		const ctx = this.ctx,
			spacing = this.spacing;

		ctx.fillStyle = 'rgba(24, 129, 141, .1)';
		this.dots = Array.apply(null, Array(this.cols)).map((n, x) => {
			return Array.apply(null, Array(this.rows)).map((p, y) => {
				let dot = {
					opacity: 0.1,
					x: x * spacing,
					y: y * spacing
				};

				ctx.fillRect(dot.x, dot.y, 1, 1);
				return dot;
			});
		});
	}
	ghost() {
		const ghostDots = document.createElement('canvas');
		ghostDots.width = this.canvas.width;
		ghostDots.height = this.canvas.height;

		const dotsCtx = ghostDots.getContext('2d');
		dotsCtx.fillStyle = 'rgb(24, 129, 141)';
		this.dots.forEach(col => {
			col.forEach(dot => {
				dotsCtx.fillRect(dot.x, dot.y, 1, 1);
			});
		});

		return ghostDots;
	}
}

class Circuits {
	constructor(width, height, size, minLength, maxLength) {
		this.size = size;
		this.width = width;
		this.height = height;
		this.cols = ~~(width / size);
		this.rows = ~~(height / size);

		this.scene = Array.apply(null, Array(this.cols)).map(() => new Col(this.rows));

		this.collection = [];
		this.minLength = minLength;
		this.maxLength = maxLength;


		this.populate();
		this.draw();
	}
	draw() {
		const canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			size = this.size;

		canvas.width = this.width;
		canvas.height = this.height;

		ctx.strokeStyle = 'rgba(59, 177, 188, 1)';
		ctx.lineWidth = Math.round(size / 10);
		this.collection.forEach(circuit => {
			let point = [circuit.start[0], circuit.start[1]],
				path = circuit.path;

			ctx.beginPath();
			ctx.moveTo(point[0] * size + size / 2 + path[0][0] * size / 4, point[1] * size + size / 2 + path[0][1] * size / 4);
			path.forEach((dir, index) => {
				point[0] += dir[0];
				point[1] += dir[1];
				if (index === path.length - 1) {
					ctx.lineTo(point[0] * size + size / 2 - dir[0] * size / 4, point[1] * size + size / 2 - dir[1] * size / 4);
				} else {
					ctx.lineTo(point[0] * size + size / 2, point[1] * size + size / 2);
				}
			});
			ctx.stroke();
		});

		ctx.lineWidth = ~~(this.size / 5);
		ctx.strokeStyle = 'rgba(59, 177, 188, .6)';
		this.collection.forEach(circuit => {
			ctx.beginPath();
			ctx.arc(circuit.start[0] * size + size / 2, circuit.start[1] * size + size / 2, size / 4, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(circuit.end[0] * size + size / 2, circuit.end[1] * size + size / 2, size / 4, 0, 2 * Math.PI, false);
			ctx.stroke();
		});

		this.canvas = canvas;
	}
	populate() {
		const size = this.size;

		let start = null,
			n = 1000,
			maxLength = this.maxLength,
			minLength = this.minLength,
			length = 0,
			dir = null;

		while ((start = this.getStart()) && n--) {
			length = minLength + ~~(Math.random() * (maxLength - minLength));
			dir = this.getDir(start);

			this.setUsed(start[0], start[1]);
			// if we can move from this point
			if (dir[0] !== 0 || dir[1] !== 0) {
				let circuit = new Circuit(start, size),
					moving = true,
					path = [start[0], start[1]],
					coords = [start[0], start[1]];
				length--;

				while (moving && length) {
					circuit.path.push(dir);
					circuit.coords.push([path[0], path[1]]);

					path[0] += dir[0];
					path[1] += dir[1];

					// set used
					this.setUsed(path[0], path[1]);
					// get new dir
					dir = this.getDir(path, dir);
					if (dir[0] === 0 && dir[1] === 0) {
						moving = false;
					}
					length--;
				}

				if (circuit.path.length >= minLength) {
					circuit.end = path;
					circuit.coords.push([path[0], path[1]]);

					let speed = Math.random() * 0.5 + 0.5;

					circuit.things.push(things.create(circuit, speed * 1));

					if (circuit.path.length > maxLength / 3) {
						speed = Math.random() * 0.5 + 0.5;
						circuit.things.push(things.create(circuit, -speed, circuit.path.length * size));
					}

					if (circuit.path.length > maxLength / 1.5) {
						speed = Math.random() * 0.5 + 0.5 * (Math.random() >= 0.5 ? -1 : 1);
						circuit.things.push(things.create(circuit, speed, Math.random() * circuit.path.length * size));
					}

					circuit.length = circuit.path.length * size;
					this.collection.push(circuit);
				}
			}
		}
	}
	getStart() {
		let found = false,
			col = null,
			row = null,
			free = [],
			result = false;

		const scene = this.scene;

		// select cols with free cell
		scene.forEach((col, index) => {
			if (col.free) {
				free.push(index);
			}
		});

		if (free.length) {
			// pick one of the col
			col = this.pickOne(free);

			// select the free cells in the col
			free.length = 0;
			scene[col].rows.forEach((row, index) => {
				if (row === 0) {
					free.push(index);
				}
			});

			// pick one of the cell
			row = this.pickOne(free);

			result = [col, row];
		}
		return result;
	}
	pickOne(array) {
		return array[~~(Math.random() * array.length)];
	}
	setUsed(x, y) {
		this.scene[x].rows[y] = 1;
		this.scene[x].free--;
	}
	isAvailable(x, y) {
		const scene = this.scene;
		let result = false;
		if (typeof scene[x] !== 'undefined') {
			if (typeof scene[x].rows[y] !== 'undefined') {
				if (scene[x].rows[y] === 0) {
					result = true;
				}
			}
		}
		return result;
	}

	// get direction
	// if a current direction is given, there is 50% chances to go in the same
	getDir(fromPoint, oldDir = null) {
		const possibleX = [],
			possibleY = [],
			result = [0, 0];

		if (oldDir && Math.random() <= 0.5) {
			if (this.isAvailable(fromPoint[0] + oldDir[0], fromPoint[1] + oldDir[1])) {
				return oldDir;
			}
		}

		// Xs
		if (this.isAvailable(fromPoint[0] - 1, fromPoint[1])) {
			possibleX.push(-1);
		}
		if (this.isAvailable(fromPoint[0] + 1, fromPoint[1])) {
			possibleX.push(1);
		}

		// Ys
		if (this.isAvailable(fromPoint[0], fromPoint[1] - 1)) {
			possibleY.push(-1);
		}
		if (this.isAvailable(fromPoint[0], fromPoint[1] + 1)) {
			possibleY.push(1);
		}

		if (possibleX.length && Math.random() < 0.5) {
			result[0] = this.pickOne(possibleX);
		} else if (possibleY.length) {
			result[1] = this.pickOne(possibleY);
		}

		return result;
	}
}

class Col {
	constructor(rows) {
		this.rows = Array.apply(null, Array(rows)).map(() => 0);
		this.free = rows;
	}
}

class Circuit {
	constructor(start, size) {
		this.start = start;
		this.cellSize = size;
		this.path = [];
		this.end = null;
		this.things = [];
		this.length = 0;
		this.coords = [];
	}
}

class Things {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');

		this.collection = [];
	}
	create(circuit, velocity, done = 0) {
		const thing = new Thing(circuit, velocity, done);
		this.collection.push(thing)
		return thing;
	}
	update() {
		this.collection.forEach(thing => {
			thing.update();
		});
	}
	draw() {
		const ctx = this.ctx,
			radius = this.lightRadius,
			diameter = radius * 2,
			space = radius / 3;

		let radial = null,
			diffX = null,
			diffY = null;
		ctx.clearRect(0, 0, this.width, this.height);
		this.collection.forEach(thing => {
			thing.update();
			radial = this.ghostRadial;
			diffX = diffY = radius;
			if (thing.distFromSister() <= space) {
				radial = this.ghostSuperRadial;
				diffX = radial.width / 2;
				diffY = radial.height / 2;
			}
			ctx.drawImage(radial, thing.x - diffX, thing.y - diffY, radial.width, radial.height);
		});

		ctx.save();
		ctx.globalCompositeOperation = 'destination-in';
		ctx.drawImage(this.dotsGhost, 0, 0);
		ctx.restore();

		ctx.save();
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = '#afe3e9';
		this.collection.forEach(thing => {
			ctx.beginPath();
			ctx.arc(thing.x, thing.y, radius / 6, 0, 2 * Math.PI, false);
			ctx.fill();
		});
		ctx.restore();
	}
	setDotsGhost(canvas) {
		this.dotsGhost = canvas;
	}
	setLight(lightRadius) {
		this.lightRadius = lightRadius;

		this.ghostRadial = document.createElement('canvas');
		this.ghostRadial.width = lightRadius * 2;
		this.ghostRadial.height = lightRadius * 2;

		const radialCtx = this.ghostRadial.getContext('2d');
		let gradient = radialCtx.createRadialGradient(lightRadius, lightRadius, lightRadius, lightRadius, lightRadius, 0);
		gradient.addColorStop(0, "rgba(24, 129, 141, 0)");
		gradient.addColorStop(1, "rgba(24, 129, 141, .6)");

		radialCtx.fillStyle = gradient;
		radialCtx.fillRect(0, 0, lightRadius * 2, lightRadius * 2);


		// star
		this.ghostSuperRadial = document.createElement('canvas');
		const radWidth = this.ghostSuperRadial.width = lightRadius * 15;
		const radHeight = this.ghostSuperRadial.height = lightRadius * 20;

		const superRadialCtx = this.ghostSuperRadial.getContext('2d');

		gradient = superRadialCtx.createRadialGradient(radWidth / 2, radHeight / 2, radWidth / 2, radWidth / 2, radHeight / 2, 0);
		gradient.addColorStop(0, "rgba(37, 203, 223, 0)");
		gradient.addColorStop(1, "rgba(37, 203, 223,  .4)");

		superRadialCtx.fillStyle = gradient;

		superRadialCtx.beginPath();
		superRadialCtx.moveTo(radWidth / 2 + lightRadius / 6, radHeight / 2 - lightRadius / 3);
		superRadialCtx.lineTo(radWidth, 0);
		superRadialCtx.lineTo(radWidth / 2 + lightRadius / 3, radHeight / 2 - lightRadius / 6);
		superRadialCtx.lineTo(3 * radWidth / 4, radHeight / 2);
		superRadialCtx.lineTo(radWidth / 2 + lightRadius / 3, radHeight / 2 + lightRadius / 6);
		superRadialCtx.lineTo(radWidth, radHeight);
		superRadialCtx.lineTo(radWidth / 2 + lightRadius / 6, radHeight / 2 + lightRadius / 3);
		superRadialCtx.lineTo(radWidth / 2, 3 * radHeight / 4);
		superRadialCtx.lineTo(radWidth / 2 - lightRadius / 6, radHeight / 2 + lightRadius / 3);
		superRadialCtx.lineTo(0, radHeight);
		superRadialCtx.lineTo(radWidth / 2 - lightRadius / 3, radHeight / 2 + lightRadius / 6);
		superRadialCtx.lineTo(radWidth / 4, radHeight / 2);
		superRadialCtx.lineTo(radWidth / 2 - lightRadius / 3, radHeight / 2 - lightRadius / 6);
		superRadialCtx.lineTo(0, 0);
		superRadialCtx.lineTo(radWidth / 2 - lightRadius / 6, radHeight / 2 - lightRadius / 3);
		superRadialCtx.lineTo(radWidth / 2, radHeight / 4);
		superRadialCtx.lineTo(radWidth / 2 + lightRadius / 6, radHeight / 2 - lightRadius / 3);
		superRadialCtx.fill();
	}
}


class Thing {
	constructor(circuit, velocity, done = 0) {
		this.circuit = circuit;
		this.velocity = velocity;
		this.done = done;
		this.x = 0;
		this.y = 0;
		this.dots = [];
	}
	update() {
		const circuit = this.circuit,
			size = circuit.cellSize;

		let x = 0,
			y = 0;
		// update this
		const length = circuit.length,
			start = circuit.start,
			end = circuit.end,
			path = circuit.path;
		this.done += this.velocity;
		if (this.done <= 0) {
			this.done = 0;
			this.velocity = -this.velocity;
		} else if (this.done >= length) {
			this.done = length;
			this.velocity = -this.velocity;
		}

		if (this.done <= size / 2) {
			x = (start[0] * size + size / 2) + this.done * path[0][0];
			y = (start[1] * size + size / 2) + this.done * path[0][1];
		} else if (this.done > (length - size / 2)) {
			x = (end[0] * size + size / 2) - (length - this.done) * path[path.length - 1][0];
			y = (end[1] * size + size / 2) - (length - this.done) * path[path.length - 1][1];
		} else {

			const index = ~~(this.done / size),
				done = this.done - index * size,
				dir = [path[index][0], path[index][1]],
				point = circuit.coords[index];

			x = point[0] * size + size / 2 + done * dir[0];
			y = point[1] * size + size / 2 + done * dir[1];
		}
		x = ~~x;
		y = ~~y;
		this.x = x;
		this.y = y;
	}
	distFromSister() {
		const circuit = this.circuit;
		let dist = Infinity,
			tmp = null;
		circuit.things.forEach(thing => {
			if (thing !== this) {
				tmp = Math.abs(thing.done - this.done);
				if (tmp < dist) {
					dist = tmp;
				}
			}
		});

		return dist;
	}
}


class Background {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	getBackground() {
		const canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		canvas.width = this.width;
		canvas.height = this.height;

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, this.width, this.height);

		ctx.drawImage(dots.canvas, 0, 0);
		ctx.drawImage(circuits.canvas, 0, 0);

		return canvas;
	}
}




// background init
const bgCanvas = document.getElementById('c'),
	width = bgCanvas.width = window.innerWidth,
	height = bgCanvas.height = window.innerHeight,
	bgCtx = bgCanvas.getContext('2d');

// dots
const dots = new Dots(width, height, 2);

// things
const things = new Things(width, height);
// get dot ghost
// it will serve as a clip canvas for the gradients to only show where there is originally dots in the background
things.setDotsGhost(dots.ghost());
things.setLight(dots.spacing * 4);

// circuits
const maxLength = 16,
	minLength = 3,
	cellSize = 10,
	circuits = new Circuits(width, height, cellSize, minLength, maxLength);

// background first and only draw
const background = new Background(width, height),
	staticBG = background.getBackground();
bgCtx.drawImage(staticBG, 0, 0);

// animation
const canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

function loop() {
	ctx.clearRect(0, 0, width, height);
	// draw things
	things.draw();
	ctx.drawImage(things.canvas, 0, 0);

	requestAnimationFrame(loop);
}

// draw bg (dots + circuit) on the main canvas
loop();





// Counter tracks stats
const counters = [
  { target: 3, elementId: "alg-DS-art" },
  { target: 0, elementId: "alg-DS-proj" },

  { target: 0, elementId: "web-art" },
  { target: 2, elementId: "web-proj" },

  { target: 1, elementId: "mobile-art" },
  { target: 1, elementId: "mobile-proj" },

  { target: 2, elementId: "machine-learning-art" },
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
fetch("https://www.stemcomputerscienceclub.org/api/articles?id_like=1&id_like=2&id_like=3")
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
<span>${data["writer"]}</span>
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
fetch("https://www.stemcomputerscienceclub.org/api/projects")
.then((res) => res.json())
.then((json) => {
  // Check if json.projects exists and is an array
  if (json.projects && Array.isArray(json.projects)) {
	// Get the first 6 projects
	const firstSixProjects = json.projects.slice(0, 6);

	// Loop through the first 6 projects and append them to the container
	firstSixProjects.forEach((data) => {
	  projectContainer.appendChild(project_fun(data));
	});
  } else {
	console.log("No projects data found in the API response.");
  }
})
.catch((error) => {
  console.log("Error fetching JSON data:", error);
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


// // clicking effect
// var clickSound = new Audio();
// clickSound.src = "Sounds/click-button.mp3";

// var clickedButtons = document.getElementsByClassName('click');
// for (var i = 0; i < clickedButtons.length; i++) {
//   clickedButtons[i].addEventListener('mousedown', function() {
//     clickSound.play();
//   });
// }



