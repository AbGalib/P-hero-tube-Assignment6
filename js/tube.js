const categories = async () => {
  const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
  const data = await res.json();
  const info = data.data;

  const categoryButtonsContainer = document.getElementById('categoryButtons');

  info.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.category;
    button.classList.add('mr-2', 'mb-2', 'px-4', 'py-2', 'bg-slate-400', 'text-white', 'rounded');
    categoryButtonsContainer.appendChild(button);

    button.addEventListener('click', async () => {
      const categoryId = category.category_id;
      const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
      const data = await res.json();
      const allCards = data.data;

      // Check if allCards is empty
      const cardContainer = document.getElementById('card-container');

      if (allCards.length === 0) {
        // Show default image in the card-place section
        cardContainer.innerHTML = `
          <div class="text-center mt-5">
            <img src="images/icon.png" class="w-48 h-42 mx-auto" alt="No data Found">
            <p class=" text-2xl font-extrabold text-black">Oops!! Sorry, There is no content here</p>
          </div>
        `;
        cardContainer.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-5');

      } else {
        cardContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-5');
        // Display cards normally
        displayCards(allCards);
      }


      // Highlight the clicked button
      highlightButton(button);

      // Sort by View button event listener
      const sortByViewButton = document.getElementById('sort');
      sortByViewButton.addEventListener('click', () => {
        // Sort allCards by views in descending order
        allCards.sort((a, b) => {
          const viewsA = parseInt(a.others.views.replace('K', '000').replace('.', '')); // Convert views to number
          const viewsB = parseInt(b.others.views.replace('K', '000').replace('.', ''));
          return viewsB - viewsA; // Sort in descending order
        });
        // Display sorted cards
        displayCards(allCards);
      });



    });
  });

  // Highlight the first button by default
  const firstButton = categoryButtonsContainer.querySelector('button');
  if (firstButton) {
    highlightButton(firstButton);
    // Fetch and display cards for the first category by default
    const firstCategoryId = info[0].category_id;
    fetchAndDisplayCards(firstCategoryId);
  }
};

// Function for button highlight
const highlightButton = button => {
  const buttons = document.querySelectorAll('#categoryButtons button');
  buttons.forEach(btn => {
    btn.classList.remove('bg-red-500'); // Remove highlighting from all buttons
  });
  button.classList.add('bg-red-500'); // Highlight the clicked button
};

const displayCards = allCards => {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // Clear previous cards
  allCards.forEach(singleCard => {
    const videoCard = document.createElement('div');
    videoCard.classList.add('card', 'bg-base-100', 'shadow-xl');

    videoCard.innerHTML = `

    <figure class="relative w-full h-36">
    <img src="${singleCard.thumbnail}" alt="thumbnail" style="width: 100%; height: 100%;" />
    <div class="absolute bottom-0 right-0 bg-gray-500 rounded-md text-white p-1 text-sm">${calculateTime(singleCard['others']['posted_date'])}</div>
    </figure>

    <div class="card-body bg-slate-100">
        <div class="flex"> 
            <div class="mr-3">
                <img src="${singleCard['authors'][0]['profile_picture']}" alt="profile picture" style="width: 60px; height: 55px; border-radius: 50%;" />
            </div>
            <div>
                <h2 class="card-title text-black">${singleCard.title}</h2>
                <div class="flex items-center">
                <p class="text-gray-500">${singleCard['authors'][0]['profile_name']}</p>
                ${singleCard['authors'][0]['verified'] ? '<img src="images/Blue-check.png" class="w-4 h-4 ml-1" alt="blue tik">' : ''}
            </div>
                <p class=" text-gray-500">${singleCard['others']['views']}</p>
            </div>
        </div>
    </div>
`;
    cardContainer.appendChild(videoCard);
  });
};

const fetchAndDisplayCards = async categoryId => {
  const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
  const data = await res.json();
  const allCards = data.data;
  displayCards(allCards);
};


const calculateTime = (postedDate) => {
  const hours = Math.floor(postedDate / 3600); // Convert seconds to hours
  const minutes = Math.floor((postedDate % 3600) / 60); // Convert remaining seconds to minutes

  return `${hours} hours ${minutes} min ago`;
};





// for content loaded and show categories 
document.addEventListener('DOMContentLoaded', () => {
  categories();
});


const BlogPost = document.getElementById('blog');
BlogPost.addEventListener('click', () => {
  window.location.href = 'blog.html';

})

