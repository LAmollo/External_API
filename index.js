import * as Carousel from "/Carousel.js";
import axios from './axiosHandler';

async function initialLoad() {
  try {
    const breeds = await axios.get('/breeds');
    // Populate breed select
    breeds.forEach(breed => {
      // Populate breed select options
    });

    // Load initial breed info
    const initialBreedId = breeds[0].id; // Assuming at least one breed is returned
    await loadBreedInfo(initialBreedId);
  } catch (error) {
    console.error('Error loading breeds:', error);
  }
}

async function loadBreedInfo(breedId) {
  try {
    const data = await axios.get(`/images/search?breed_ids=${breedId}`);
    clear(); // Clear existing carousel items
    data.forEach(image => {
      const carouselItem = createCarouselItem(image.url, 'Cat Image', image.id);
      appendCarousel(carouselItem);
    });
    start(); // Start or restart the carousel
  } catch (error) {
    console.error(`Error loading breed info for ${breedId}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initialLoad();
});

breedSelect.addEventListener('change', async (event) => {
  const breedId = event.target.value;
  await loadBreedInfo(breedId);
});