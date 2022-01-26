// modal
const State = {
  nav: "HOME",
  selection: "popular",
  page: 1,
  apiResponse: [],
  liked: [],
};

BASE_URL = "https://api.themoviedb.org/3/movie/";
API = "?api_key=1ffee81271c6424b117014332c4bb778&language=en-US&page=";
IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// view
function oneMovieCard(each) {
  const oneMovieContainer = document.createElement("div");
  oneMovieContainer.className = "card";
  oneMovieContainer.innerHTML = `      
  <img
    src="${IMAGE_BASE}${each.poster_path}"
    alt="${each.title}"
  />
  <div class="card-icons">
    <div class="rating">
      <i class="ion-star"></i>
      <span>${each.vote_average}</span>
    </div>
    <i class="ion-ios-heart-outline like-icon" id=${each.id}></i>
  </div>
  <h3 class="movie-name">
    ${each.title}
  </h3>
  `;
  return oneMovieContainer;
}
function displayMovieCards(renderdiv) {
  const renderArea = renderdiv;
  console.log("render area", renderArea);
  renderArea.innerHTML = "";
  const movieContainer = document.createElement("section");
  movieContainer.className = "movie-cards";
  renderArea.append(movieContainer);
  console.log("before foreach", State.apiResponse);
  if (renderArea.className === "home") {
    State.apiResponse.forEach((each) => {
      const oneCard = oneMovieCard(each);
      movieContainer.append(oneCard);
    });
  } else if (renderArea.className === "liked-list") {
    console.log("liked list render");
    State.liked.forEach((each) => {
      const oneCard = oneMovieCard(each);
      movieContainer.append(oneCard);
    });
  }
  renderArea.addEventListener("click", favoriteToggle);
}
function renderView() {
  const homeArea = document.querySelector(".home");
  const likedListArea = document.querySelector(".liked-list");
  const dropdownArea = document.querySelector(".category-section");
  likedListArea.style.display = "none";
  homeArea.style.display = "none";
  dropdownArea.style.display = "none";
  if (State.nav === "HOME") {
    homeArea.style.display = "block";
    dropdownArea.style.display = "block";

    fetch(`${BASE_URL}${State.selection}${API}${State.page}`)
      .then((res) => res.json())
      .then((data) => {
        State.apiResponse = data.results;
        console.log("save api", State.apiResponse);
      })
      .then(() => {
        displayMovieCards(homeArea);
      });
  } else if (State.nav === "LIKED LIST") {
    likedListArea.style.display = "block";
    displayMovieCards(likedListArea);
  }
}

// Controller
// categories dropdown controll
const selector = document.querySelector("#categories");
let selectorVal = selector.value;
console.log("load", selectorVal);

function changeSelector() {
  selectorVal = selector.value;
  State.selection = selectorVal;
  console.log(State);
}

selector.addEventListener("change", changeSelector);

// navigation bar controller
const headerNav = document.querySelector(".header-tags");
function changeNav(e) {
  if (e.target.tagName === "LI") {
    const navVal = e.target.innerHTML;
    State.nav = navVal;
    renderView();
  }
}
headerNav.addEventListener("click", changeNav);

// favorite controller
function favoriteToggle(e) {
  if (e.target.tagName === "I") {
    const userLike = State.apiResponse.filter((each) => {
      return each.id.toString() === e.target.id;
    });
    console.log("filter like", userLike);
    State.liked.push(...userLike);
    console.log("push like", State);
  }
}
