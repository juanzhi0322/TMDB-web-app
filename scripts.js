// modal
const State = {
  nav: "HOME",
  selection: "popular",
  page: 1,
  totalPage: 1,
  apiResponse: [],
  liked: [],
};

BASE_URL = "https://api.themoviedb.org/3/movie/";
API = "?api_key=1ffee81271c6424b117014332c4bb778&language=en-US&page=";
IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const homeArea = document.querySelector(".home");
const likedListArea = document.querySelector(".liked-list");
const dropdownArea = document.querySelector(".category-section");

// view
function getDataAndRefresh() {
  fetch(`${BASE_URL}${State.selection}${API}${State.page}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("api return", data);
      State.totalPage = data.total_pages;
      State.apiResponse = data.results.map((each) => {
        let rObj = {};
        rObj.id = each.id;
        rObj.title = each.title;
        rObj.poster_path = each.poster_path;
        rObj.vote_average = each.vote_average;
        // rObj.favorite = true;
        // if (State.liked.length === 0) {
        //   console.log("liked length 0");
        // }
        return rObj;
      });
    })
    .then(() => {
      displayMovieCards(homeArea);
      displayPagination();
    });
}
function oneMovieCard(each, isLiked) {
  const oneMovieContainer = document.createElement("div");
  oneMovieContainer.className = "card";
  oneMovieContainer.id = each.id;
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
    <i class="like-icon ${
      isLiked ? `ion-ios-heart` : `ion-ios-heart-outline`
    }"></i>
  </div>
  <h3 class="movie-name">
    ${each.title}
  </h3>
  `;
  return oneMovieContainer;
}
function displayMovieCards(renderdiv) {
  const renderArea = renderdiv;
  renderArea.innerHTML = "";
  const movieContainer = document.createElement("section");
  movieContainer.className = "movie-cards";
  renderArea.append(movieContainer);
  if (renderArea.className === "home") {
    State.apiResponse.forEach((each) => {
      const likedMovie = State.liked.find((mov) => {
        return mov.id === each.id;
      });
      const isLiked = Boolean(likedMovie);
      const oneCard = oneMovieCard(each, isLiked);
      movieContainer.append(oneCard);
    });
  } else if (renderArea.className === "liked-list") {
    State.liked.forEach((each) => {
      const oneCard = oneMovieCard(each, true);
      movieContainer.append(oneCard);
    });
  }
  renderArea.addEventListener("click", handleCardClick);
  //   renderArea.addEventListener("click", popupDetail);
}
function displayPagination() {
  const PageArea = document.querySelector(".page");
  PageArea.innerHTML = `${State.page}/${State.totalPage}`;
}
function switchView() {
  likedListArea.style.display = "none";
  homeArea.style.display = "none";
  dropdownArea.style.display = "none";
  if (State.nav === "HOME") {
    homeArea.style.display = "block";
    dropdownArea.style.display = "block";
  } else if (State.nav === "LIKED LIST") {
    likedListArea.style.display = "block";
    displayMovieCards(likedListArea);
  }
}

// Controller
// load default page
window.addEventListener("load", getDataAndRefresh);
// categories dropdown controll
const selector = document.querySelector("#categories");
let selectorVal = selector.value;

function changeSelector() {
  selectorVal = selector.value;
  State.selection = selectorVal;
  State.page = 1;
  //   renderView();
  getDataAndRefresh();
}

selector.addEventListener("change", changeSelector);

// navigation bar controller
const headerNav = document.querySelector(".header-tags");
function changeNav(e) {
  if (e.target.tagName === "LI") {
    const navVal = e.target.innerHTML;
    State.nav = navVal;
    switchView();
  }
}
headerNav.addEventListener("click", changeNav);

// favorite controller
function handleCardClick(e) {
  const parentId = e.target.closest(".card").id;
  if (e.target.tagName === "I") {
    const userLike = State.apiResponse.filter((each) => {
      return each.id.toString() === parentId;
    });

    const likedMovie = State.liked.find((movie) => {
      return movie.id.toString() === parentId;
    });
    const isliked = Boolean(likedMovie);
    if (isliked) {
      State.liked = State.liked.filter((movie) => {
        return movie.id != parentId;
      });
    } else {
      State.liked.push(...userLike);
    }
    displayMovieCards(homeArea);
    displayMovieCards(likedListArea);
  } else if (e.target.className === "movie-name") {
    console.log("title clicked", parentId);
  }
}

//pop up window controller
// pagination controller
const prevBar = document.querySelector(".prev");
function goPrev() {
  if (State.page > 1) {
    State.page -= 1;
    getDataAndRefresh();
  }
}
prevBar.addEventListener("click", goPrev);

const nextBar = document.querySelector(".next");
function goNext() {
  if (State.page < State.totalPage) {
    State.page += 1;
    getDataAndRefresh();
  }
}
nextBar.addEventListener("click", goNext);

// const truetest = false
//   ? `ion-ios-heart like-icon`
//   : `ion-ios-heart-outline like-icon`;
// console.log("true test", truetest);
