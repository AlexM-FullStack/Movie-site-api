document.addEventListener('DOMContentLoaded', () => {

    // API URLs
    const apiKey = 'a76f0d2654ade11210a1f5ac8b5129a7';
    const baseUrl = 'https://api.themoviedb.org/3/';
    const discoverMoviesUrl = `${baseUrl}discover/movie?sort_by=popularity.desc&api_key=${apiKey}`;
    const discoverSeriesUrl = `${baseUrl}discover/tv?sort_by=popularity.desc&api_key=${apiKey}`;
    const searchUrl = `${baseUrl}search/movie?api_key=${apiKey}`;
    const trendingUrl = `${baseUrl}trending/all/day?language=en-US&api_key=${apiKey}`;
    const imgUrl = 'https://image.tmdb.org/t/p/w500';
  
    // Genre array
    const genreArray = [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 10770, name: 'TV Movie' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' }
    ];
  
    // DOM elements
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const main = document.getElementById('main');
    const trendingEl = document.querySelector('.trending');
    const genreEl = document.querySelector('.genre');
    const moviesEl = document.querySelector('.movies');
    const seriesEl = document.querySelector('.series');
    const tagsEl = document.querySelector('.genre-tags');
    const pageInfoDiv = document.querySelector('.page-info')
    
  
   // Add an event listener for each link in the header
    trendingEl.addEventListener('click', (e) => {
        e.preventDefault();
        getMovies(trendingUrl);
        setActiveLink(e.target); // Set the clicked link as active
        updatePageInfo(e.target.textContent)
        updateSearchInfo(''); // Clear the search info
    });
    
    genreEl.addEventListener('click', (e) => {
        e.preventDefault();
        getMovies(discoverMoviesUrl);
        setActiveLink(e.target); // Set the clicked link as active
        updatePageInfo(e.target.textContent)
        updateSearchInfo(''); // Clear the search info
    });
    
    moviesEl.addEventListener('click', (e) => {
        e.preventDefault();
        getMovies(discoverMoviesUrl);
        setActiveLink(e.target); // Set the clicked link as active
        updatePageInfo(e.target.textContent)
        updateSearchInfo(''); // Clear the search info
    });
    
    seriesEl.addEventListener('click', (e) => {
        e.preventDefault();
        getMovies(discoverSeriesUrl);
        setActiveLink(e.target); // Set the clicked link as active
        updatePageInfo(e.target.textContent)
        updateSearchInfo(''); // Clear the search info
    });

   
  function setActiveLink(clickedLink) {
    const links = document.querySelectorAll('.links h3');
    links.forEach(link => {
      link.classList.remove('active'); // Remove active class from all links
    });
    clickedLink.classList.add('active'); // Add active class to the clicked link
  }
  
    // Genre search functionality
    let selectedGenre = [];
    setGenre();

     // Add event listeners to genre tags
     tagsEl.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
        const isActive = tag.classList.contains('active');
        tagsEl.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
        if (!isActive) {
            tag.classList.add('active');
            setSelectedGenreName(tag.innerText);
        } else {
            clearSelectedGenreName();
        }
        const genreId = tag.id;
        selectedGenre = isActive ? [] : [genreId];
        const genreName = genreArray.find(genre => genre.id === Number(genreId)).name;
        const linkName = `Genre: ${genreName}`;
        getMovies(`${discoverMoviesUrl}&with_genres=${selectedGenre.join(',')}`);
        updatePageInfo(linkName);
        });
    });
  
    function setGenre() {
        tagsEl.innerHTML = '';
      
        genreArray.forEach(element => {
          const tagDiv = document.createElement('div');
          tagDiv.classList.add('tag');
          tagDiv.id = element.id;
          tagDiv.innerText = element.name;
          tagsEl.appendChild(tagDiv);
      
          tagDiv.addEventListener('click', () => {
            const isActive = tagDiv.classList.toggle('active');
            isGenreTagActive = isActive;
            const genreId = tagDiv.id;
            selectedGenre = isActive ? [genreId] : [];
            const genreName = genreArray.find(genre => genre.id === Number(genreId)).name;
            const linkName = isActive ? `Genre: ${genreName}` : '';
            getMovies(`${discoverMoviesUrl}&with_genres=${selectedGenre.join(',')}`);
            updatePageInfo(linkName);
          });
        });
      }
      
  
    // Functions
    async function getMovies(url) {
        const response = await fetch(url);
        const data = await response.json();
      
        if (data.results.length === 0) {
          displayNotFoundMessage();
          return

        } else {
          const searchTerm = search.value.trim();
          let linkName = ''
      
          if (searchTerm) {
            // updateSearchInfo(searchTerm)
            linkName = `Search results for "${searchTerm}"`;
          } else {
            const activeLink = document.querySelector('.links h3.active');
            if (activeLink) {
              linkName = activeLink.textContent;
            }
          }
      
          updatePageInfo(linkName); 
          displayMovies(data.results);
        return data;
        }
      }


      // Function to update page info div
      function updatePageInfo(linkName, searchTerm) {
        const pageInfoDiv = document.querySelector('.page-info');
        const searchInfoDiv = document.querySelector('.search-info');
      
        // Clear the content of both divs
        pageInfoDiv.innerHTML = '';
        searchInfoDiv.innerHTML = '';
      
        // Check if a search term exists
        if (searchTerm) {
          const h2 = document.createElement('h2');
          h2.textContent = `Search results for "${searchTerm}"`;
          pageInfoDiv.appendChild(h2);
        } else if (linkName) {
          const h2 = document.createElement('h2');
          h2.textContent = linkName;
          pageInfoDiv.appendChild(h2);
        }
      }
      
      
      
    
    // Function to update search info div
    function updateSearchInfo(searchTerm) {
        const searchInfoDiv = document.querySelector('.search-info');
    
        // Clear the content of search info div
        searchInfoDiv.innerHTML = '';
    
        // Check if searchTerm exists and update the search info div
        if (searchTerm) {
        const h2 = document.createElement('h2');
        h2.textContent = `Search results for "${searchTerm}"`;
        searchInfoDiv.appendChild(h2);
        }
    }  
      
      function displayNotFoundMessage() {
        main.innerHTML = '';
        const notFoundMessage = document.createElement('p');
        notFoundMessage.classList.add('not-found');
        notFoundMessage.textContent = 'We are sorry, your search did not return any results 😔 !';
        main.appendChild(notFoundMessage);
      }
      
  
      function displayMovies(data) {
        main.innerHTML = '';
      
        data.forEach(element => {
          const { poster_path, title, name, vote_average, id } = element;
      
          const movieCard = document.createElement('div');
          movieCard.classList.add('movie-card');
          movieCard.setAttribute('id', `${id}`);
          movieCard.innerHTML = `
            <img src="${poster_path ? imgUrl + poster_path : 'default-img.jpg'}" />
            <div class='movie-info'>
              <h3>${title || name}</h3>
              <span class='rating'>${vote_average >= 1 ? vote_average.toFixed(1) : '-'}</span>
            </div>
          `;
      
          main.appendChild(movieCard);
      
          movieCard.addEventListener('click', async () => {
            console.log(id);
            const trailers = await fetchMovieTrailer(id);
            openNav(trailers);
          });
      
          document.querySelector('.closebtn').addEventListener('click', () => {
            console.log('close btn clicked');
            closeNav();
          });
      
          function openNav(trailers) {
            document.getElementById('myNav').style.width = '100%';
            const overlayContent = document.querySelector('.overlay-content');
            overlayContent.innerHTML = '';
      
            if (trailers && trailers.length > 0) {
              console.log(trailers[0]);
      
              // Get the first video trailer
              const { key, name, site } = trailers[0];
      
              if (site === 'YouTube') {
                const trailerTitle = document.createElement('h2');
                trailerTitle.classList.add('trailer-title');
                trailerTitle.textContent = name;
      
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${key}`;
                iframe.width = '560';
                iframe.height = '315';
                iframe.title = name;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
      
                overlayContent.appendChild(trailerTitle);
                overlayContent.appendChild(iframe);
              } else {
                displayTrailerNotFoundMessage(overlayContent, 'We are sorry, no movie trailer available 😔 !');
              }
            } else {
              displayTrailerNotFoundMessage(overlayContent, 'We are sorry, no movie trailer available 😔 !');
            }
          }
      
          function closeNav() {
            document.getElementById('myNav').style.width = '0%';
          }
        });
      }

      function displayTrailerNotFoundMessage(container, message) {
        const messageElement = document.createElement('h2');
        messageElement.classList.add('not-found')
        messageElement.textContent = message;
        container.appendChild(messageElement);
      }
      
  
    async function fetchMovieTrailer(movieId) {
      const trailerUrl = `${baseUrl}movie/${movieId}/videos?api_key=${apiKey}`;
      const response = await fetch(trailerUrl);
      const data = await response.json();
      return data.results;
    }
  
    // Event listeners
    window.onload = () => {
      getMovies(trendingUrl);
    };
  
  // Genre section functionality
let isHovering = false;
let timeoutId;
let isGenreTagActive = false;

genreEl.addEventListener('mouseenter', () => {
  isHovering = true;

  clearTimeout(timeoutId);
  tagsEl.classList.remove('hidden');
});

genreEl.addEventListener('mouseleave', () => {
  isHovering = false;
  timeoutId = setTimeout(() => {
    if (!isHovering && !isGenreTagActive) {
      tagsEl.classList.add('hidden');
    }
  }, 3000);
});

tagsEl.addEventListener('mouseenter', () => {
  clearTimeout(timeoutId);
});

tagsEl.addEventListener('mouseleave', () => {
  timeoutId = setTimeout(() => {
    if (!isHovering && !isGenreTagActive) {
      tagsEl.classList.add('hidden');
    }
  }, 3000);
});

// Add event listeners to genre tags
    tagsEl.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const isActive = tag.classList.contains('active');
        tagsEl.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
        if (!isActive) {
        tag.classList.add('active');
        setSelectedGenreName(tag.innerText);
        } else {
        clearSelectedGenreName();
        }
        const genreId = tag.id;
        selectedGenre = isActive ? [] : [genreId];
        const genreName = genreArray.find(genre => genre.id === Number(genreId)).name;
        const linkName = `Genre: ${genreName}`;
        getMovies(`${discoverMoviesUrl}&with_genres=${selectedGenre.join(',')}`);
        updatePageInfo(linkName);
    });
    });

    document.addEventListener('click', (event) => {
    const isGenreTagClicked = event.target.closest('.genre-tags');
    isGenreTagActive = isGenreTagClicked !== null;

    if (!isGenreTagActive && !isHovering) {
        tagsEl.classList.add('hidden');
    }
    });

  
    moviesEl.addEventListener('click', () => {
      getMovies(discoverMoviesUrl);
    });
  
    seriesEl.addEventListener('click', () => {
      getMovies(discoverSeriesUrl);
    });

    // form handling search functionality

    form.addEventListener('submit', async event => {
        event.preventDefault();

    let searchTerm = search.value.trim();

    if (searchTerm) {
        searchTerm = searchTerm.toUpperCase(); // Convert the search term to uppercase
        const searchMovieUrl = `${searchUrl}&query=${searchTerm}`;
        console.log('Search URL:', searchMovieUrl); // Log the search URL to check its value
        updateSearchInfo(searchTerm); // Update the search info with the uppercase search term

        try {
        const moviesData = await getMovies(searchMovieUrl);
        console.log('Search Results:', moviesData.results); // Log the search results to check if any data is returned
        displayMovies(moviesData.results);
        } 
        catch (error) {
        console.log('Error:', error);
        displayNotFoundMessage();
        }
    } else {
        // Clear the search results and reset the page info
        main.innerHTML = '';
        updatePageInfo('Popular Movies');
        updateSearchInfo('');
    }

    form.reset(); // Reset the form input value
});

      
    
  });
  