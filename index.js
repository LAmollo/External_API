import axios from './axiosHandler';
import { createCarouselItem, clear, appendCarousel, start } from '/Carousel';

const breedSelect = document.querySelector('#breedSelect');
const getFavouritesBtn = document.querySelector('#getFavouritesBtn');

document.addEventListener('DOMContentLoaded', async () => {
  await initialLoad();
});

async function initialLoad() {
  try {
    const response = await axios.get('/breeds');
    const breeds = response.data;

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Load initial breed info
    const initialBreedId = breeds[0].id;
    await loadBreedInfo(initialBreedId);
  } catch (error) {
    console.error('Error loading breeds:', error);
  }
}

breedSelect.addEventListener('change', async (event) => {
  const breedId = event.target.value;
  await loadBreedInfo(breedId);
});

async function loadBreedInfo(breedId) {
  try {
    const response = await axios.get(`/images/search?breed_ids=${breedId}&limit=10`);
    const images = response.data;

    clear();

    images.forEach(image => {
      const carouselItem = createCarouselItem(image.url, 'Cat Image', image.id);
      appendCarousel(carouselItem);

      const infoElement = document.createElement('div');
      infoElement.textContent = `Breed: ${image.breeds[0].name}, URL: ${image.url}`;
      document.getElementById('infoDump').appendChild(infoElement);
    });

    start();
  } catch (error) {
    console.error(`Error loading breed info for ${breedId}:`, error);
  }
}

getFavouritesBtn.addEventListener('click', async () => {
  try {
    const response = await axios.get('/favourites');
    const favourites = response.data;

    clear();

    favourites.forEach(favourite => {
      const carouselItem = createCarouselItem(favourite.image.url, 'Favourite Cat Image', favourite.image.id);
      appendCarousel(carouselItem);

      const infoElement = document.createElement('div');
      infoElement.textContent = `Favourite ID: ${favourite.id}, Image ID: ${favourite.image.id}, URL: ${favourite.image.url}`;
      document.getElementById('infoDump').appendChild(infoElement);
    });

    start();
  } catch (error) {
    console.error('Error loading favourites:', error);
  }
});
