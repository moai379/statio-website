var slideIndex = 1;
var slideInterval;

showSlideImage(slideIndex);
startSlideInterval();


function changeSlide(n) {
  showSlideImage(slideIndex += n);  // Next or previous controls
  resetSlideInterval();
}

function currentSlide(n) {
  showSlideImage(slideIndex = n); // Progression-dots or whatever it was
  resetSlideInterval();
}


function showSlideImage(n) {
  var i;
  var dots = document.getElementsByClassName("progress-dot");
  var slides = document.getElementsByClassName("slider-img");

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active"); 
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active"); 
  }

  slides[slideIndex - 1].classList.add("active"); 
  dots[slideIndex - 1].classList.add("active");
}


// Auto slide and Reset when using the dot-progression or arrow-progression
function startSlideInterval() {
  slideInterval = setInterval(function() {
    changeSlide(1);
  }, 4000);
}
function resetSlideInterval() {
  clearInterval(slideInterval);
  startSlideInterval();
}



function toggleCategories() {
  const categoryContainer = document.getElementById('categoryContainer');

  if (categoryContainer.style.display === 'none' || categoryContainer.style.display === '') {
      categoryContainer.style.display = 'flex';
  } else {
      categoryContainer.style.display = 'none';
  }
}


// Toggles the appearance of registration and its disappearance when clicked outside the 'accountContainer' and 'registerContainer'
function toggleAccount(){
  const registerContainer = document.getElementById('registerContainer');
  const isVisible = registerContainer.style.display === 'flex';

  registerContainer.style.display = isVisible ? 'none' : 'flex';


  if (!isVisible) {
    document.addEventListener('click', closeOnClickOutside);
  }
}

function closeOnClickOutside(event) {
  const accountContainer = document.getElementById('accountContainer');
  const registerContainer = document.getElementById('registerContainer');

  if (!accountContainer.contains(event.target) && !registerContainer.contains(event.target)) {
      registerContainer.style.display = 'none';
      document.removeEventListener('click', closeOnClickOutside);
  }
}

function openPage(page) {
  window.location.href = `${page}`;
}

