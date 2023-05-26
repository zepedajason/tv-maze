"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $form = $("#searchForm-term");
const $episodesList = $("#episodesList");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get("https://api.tvmaze.com/search/shows", {
        params: {
            q: searchTerm,
        }
    });
  
  let showArray = [];
  for(let i = 0; i < res.data.length; i++){
    console.log(res.data[i]);
    let id = res.data[i].show.id;
    let showName = res.data[i].show.name;
    let summary = res.data[i].show.summary;
    let img;
    
     try{img = res.data[i].show.image.medium}
     catch(e){
      img = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
     }

    let obj = 
      {
        id: id,
        name: showName,
        summary:
          summary,
        image: img
      }
    ;
    showArray.push(obj)
  }
  
  console.log(showArray)
  return showArray;
}
/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  $form.val("");
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  
    
    let episodes =  res.data.map(e => ({
      id: e.id,
      name: e.name,
      season: e.season,
      number: e.number
    }))
    
    return episodes;
  }

  function populateEpisodes(episodes){
    $episodesList.empty();

    for (let episode of episodes){
      const $item = $(`<li> ${episode.name} (season: ${episode.season} episode: ${episode.number}) </li>`);

      $episodesList.append($item);
    }
    $episodesArea.show();
    
  }

  async function getEpisodesAndDisplay(evt) {

    const showId = $(evt.target).closest(".Show").data("show-id");
    
    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
    $showsList.empty();
  }
  
  $showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
/** Write a clear docstring for this function... */

