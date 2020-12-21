const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal"),
  baseURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`,
  mealById = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`,
  randomMeal = `https://www.themealdb.com/api/json/v1/1/random.php`;

// Search Meal & fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    try {
      fetch(`${baseURL}${term}`)
        .then(res => res.json())
        .then(data => {
          resultHeading.innerHTML = `
          <h2>Search results for "${term}"</h2>`;

          if (data.meals === null) {
            resultHeading.innerHTML = `
            <p>Sorry 😥... There are no search results. Try again!</p>`;
          } else {
            mealsEl.innerHTML = data.meals
              .map(
                meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
              `
              )
              .join("");
          }
        });
      // Clear search text
      search.value = "";
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  } else {
    alert("Please enter a search term");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  try {
    fetch(`${mealById}${mealID}`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
      });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// Fetch random meal
function getRandomMeal() {
  try {
    // clear meals and heading
    mealsEl.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(randomMeal)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
      });
  } catch (err) {}
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
  </div>
  `;
}

// Event Listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", e => {
  // path is supported in chrome but not in Firefox
  const path = e.path || (e.composedPath && e.composedPath());

  const mealInfo = path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
