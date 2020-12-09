//app is for general control over the application
//and connections between the other components

const APP = {
    API_KEY: 'b97ecfd9f6c001f009f834f53e775a46',
    MAIN_URL: "https://api.themoviedb.org/3/",
    IMG_URL: 'https://image.tmdb.org/t/p/',
    init: () => {
        document.querySelector("#btnSearch").addEventListener('click', SEARCH.getData);
        document.querySelector('#actors .content').addEventListener('click', ACTORS.pickActor);
        //ACTORS
        //click listener on #actors .content to handle when the user selects an actor
    },
};

//search is for anything to do with the fetch api
const SEARCH = {
    results: [],
    getData(ev) {
        ev.preventDefault();
        let search = document.getElementById('search').value.trim();

        let url = `${APP.MAIN_URL}search/person?api_key=${APP.API_KEY}&query=${search}&language=en-US&page=1`
        if (search) {
            url += search;

            fetch(url)
                .then((resp) => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error(`ERROR: ${resp.status} ${resp.statusText}`);
                    }
                })
                .then((data) => {
                    //SEARCH.results = data.results;
                    //NAV.switchPage('actors');
                    console.log(data.results);
                    ACTORS.buildActors(data.results);
                })
                .catch((err) => {
                    alert(err);

                });
        }
    },
};
//use fetch

//actors is for changes connected to content in the actors section
const ACTORS = {
    buildActors(results) {
        let content = document.querySelector("section#actors div.content");
        document.querySelector('p').setAttribute('id', 'instructions-Off');
        document.getElementById("actors").style.display = 'flex';
        let df = document.createDocumentFragment();
        SEARCH.results = results;

        SEARCH.results.forEach(person => {
            let card = document.createElement('div');
            let img = document.createElement('img');
            let imgDiv = document.createElement('figure');
            let name = document.createElement('h3');
            let pop = document.createElement('p');

            imgDiv.className = "imgDiv";
            name.className = "actor-name";
            name.textContent = person.name;
            pop.textContent = "Popularity rating: " + person.popularity;

            if (person.profile_path == null) {
                img.src = "#";
                img.alt = "Image not found";
            } else { //build each actor card
                card.className = "actor-card";
                card.setAttribute('id', person.id);

                img.src = APP.IMG_URL + 'w500' + person.profile_path;
                img.alt = person.name;

                imgDiv.append(img);
                card.append(imgDiv, name, pop);
                df.append(card);
                console.log("hi");
            }
            card.addEventListener('click', MEDIA.showMedia);
        });
        //content.innerHTML = "";
        content.append(df);
    },
}
//media is for changes connected to content in the media section
const MEDIA = {
    showMedia(ev) {
        let card = ev.currentTarget;
        let id = card.getAttribute('id');
        let content = document.querySelector("section#media div.content");

        let actors = document.getElementById("actors");
        console.log(actors);
        actors.style.display = 'none';

        //document.getElementById("actor-card").style.display = 'none';

        document.getElementById("media").style.display = 'flex';
        let df = document.createDocumentFragment();

        SEARCH.results.forEach(person => {
            if (id == person.id) {
                person.known_for.forEach(item => {
                    let cardDiv = document.createElement('div');
                    let movie_img = document.createElement('img');
                    let imgDiv = document.createElement('figure');
                    let title = document.createElement('p');
                    let rel_date = document.createElement('p');
                    let overview = document.createElement('p');
                    let vote_avg = document.createElement('p');

                    cardDiv.className = "media-card";
                    //imgDiv.className = item.title
                    movie_img.src = APP.IMG_URL + 'w500' + item.poster_path;
                    movie_img.alt = item.name;

                    title.textContent = item.title;
                    rel_date.textContent = "Release Date" + item.release_date;

                    if (item.overview == null || item.overview == 0) {
                        overview.textContent = "Error: Overview Unavailable"
                    } else if (item.overview.length > 240) {
                        overview.textContent = item.overview.substring(0, 275) + '...';
                    } else {
                        overview.textContent = item.overview;
                    }

                    vote_avg.textContent = "Voter Average: " + item.vote_average;

                    imgDiv.append(movie_img);
                    card.append(imgDiv, title, rel_date, overview, vote_avg);
                    df.append(card);

                    
                });
            } 
        });
        content.append(df);
        card.removeEventListener('click', MEDIA.showMedia);
    },
};

document.addEventListener('DOMContentLoaded', APP.init);

//storage is for working with localstorage
// const STORAGE = {
//   //this will be used in Assign 4
// };

//nav is for anything connected to the history api and location
// const NAV = {
//     swichPage(page) {
//         //when the app loads...
//         // history.replaceState({}, null, '/');
//     },
//     //this will be used in Assign 4
// };

