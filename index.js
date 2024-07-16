import * as Carousel from "/Carousel.js";
import axios from "axios";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

const API_KEY = "live_CdfYUk5OZFFCG9I3eDKEc3Wnr6LOv21HIJHgznTXWvIToKYbE8zoRpBygRUbEjKY'"; // actual API key

async function initialLoad() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data;

    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    const initialBreedId = breeds[0].id; // Assuming there's at least one breed
    await loadBreedInfo(initialBreedId);
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

async function loadBreedInfo(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=10`
    );
    const images = response.data;

    Carousel.clear(); // Clear previous carousel items
    infoDump.innerHTML = ''; // Clear previous infoDump content

    images.forEach(image => {
      const carouselItem = Carousel.createCarouselItem(
        image.url,
        "Cat Image",
        image.id
      );
      Carousel.appendCarousel(carouselItem);

      const infoElement = document.createElement("div");
      infoElement.textContent = `Breed: ${image.breeds[0].name}, URL: ${image.url}`;
      infoDump.appendChild(infoElement);
    });

    Carousel.start(); // Start the carousel
  } catch (error) {
    console.error(`Error loading breed info for ${breedId}:`, error);
  }
}

initialLoad();

breedSelect.addEventListener("change", async event => {
  const breedId = event.target.value;
  await loadBreedInfo(breedId);
});

axios.interceptors.request.use(config => {
  console.log("Request started");
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log("Request finished");
    progressBar.style.width = "100%";
    document.body.style.cursor = "default";
    return response;
  },
  error => {
    console.error("Error in request:", error);
    progressBar.style.width = "100%";
    document.body.style.cursor = "default";
    return Promise.reject(error);
  }
);

function updateProgress(progressEvent) {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  console.log(`Progress: ${percentCompleted}%`);
  progressBar.style.width = `${percentCompleted}%`;
}

axios.interceptors.request.use(config => {
  config.onDownloadProgress = updateProgress;
  return config;
});

export async function favourite(imgId) {
  try {
    const response = await axios.post(
      "https://api.thecatapi.com/v1/favourites",
      { image_id: imgId },
      { headers: { "x-api-key": API_KEY } }
    );
    console.log("Image favorited:", response.data);
    // Implement UI update or toggle favorite logic
  } catch (error) {
    if (error.response.status === 400) {
      try {
        const response = await axios.delete(
          `https://api.thecatapi.com/v1/favourites/${imgId}`,
          { headers: { "x-api-key": API_KEY } }
        );
        console.log("Favorite removed:", response.data);
        // Implement UI update or toggle favorite logic
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } else {
      console.error("Error favoriting image:", error);
    }
  }
}

getFavouritesBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/favourites", {
      headers: { "x-api-key": API_KEY }
    });
    const favourites = response.data;

    Carousel.clear(); // Clear previous carousel items
    infoDump.innerHTML = ''; // Clear previous infoDump content

    favourites.forEach(favourite => {
      const carouselItem = Carousel.createCarouselItem(
        favourite.image.url,
        "Favourite Cat Image",
        favourite.image.id
      );
      Carousel.appendCarousel(carouselItem);

      const infoElement = document.createElement("div");
      infoElement.textContent = `Favourite ID: ${favourite.id}, Image ID: ${favourite.image.id}, URL: ${favourite.image.url}`;
      infoDump.appendChild(infoElement);
    });

    Carousel.start(); // Start the carousel
  } catch (error) {
    console.error("Error loading favourites:", error);
  }
});
