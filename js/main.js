//app is for general control over the application
//and connections between the other components

const APP = {
    API_KEY: 'b97ecfd9f6c001f009f834f53e775a46',
    MAIN_URL: "https://api.themoviedb.org/3/",
    IMG_URL: 'https://image.tmdb.org/t/p/',
    init: () => {
        document.querySelector("#btnSearch").addEventListener('click', SEARCH.getData);
        document.querySelector('#backBtn').style.display = 'none';
    },
};

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
                    console.log(data.results);
                    ACTORS.buildActors(data.results);
                })
                .catch((err) => {
                    alert(err);

                });
        }
    },
};
const ACTORS = {
    buildActors(results) {
        let content = document.querySelector("section#actors div.content");
        document.querySelector('p').setAttribute('id', 'instructions-Off');
        let act_page = document.getElementById("actors");
        content.innerHTML = ""; 
        act_page.style.display = 'flex';
        
        let df = document.createDocumentFragment();
        SEARCH.results = results;
        
        SEARCH.results.forEach(person => {
            let card = document.createElement('div');
            let img = document.createElement('img');
            let imgDiv = document.createElement('figure');
            let name = document.createElement('h2');
            let pop = document.createElement('p');
            
            imgDiv.className = "imgDiv";
            name.className = "actor-name";
            name.textContent = person.name;
            pop.textContent = "Popularity rating: " + person.popularity;
            
            if (person.profile_path == null) {
                img.src = "#";
                img.alt = "Image not found";
            } else {
                card.className = "actor-card";
                card.setAttribute('id', person.id);
                img.src = APP.IMG_URL + 'w500' + person.profile_path;
                img.alt = "actor";
                imgDiv.append(img);
                card.append(imgDiv, name, pop);
                df.append(card);
            }
            card.addEventListener('click', MEDIA.showMedia);
        });
        content.append(df);
    },
}

const MEDIA = {
    showMedia(ev) {
        let card = ev.currentTarget;
        let id = card.getAttribute('id');
        let content = document.querySelector("section#media div.content");
        let actors = document.getElementById("actors");
        actors.style.display = 'none';

        document.getElementById("media").style.display = 'flex';
        document.querySelector("#backBtn").style.display = 'flex';

        let df = document.createDocumentFragment();

        SEARCH.results.forEach(person => {
            if (id == person.id) {
                person.known_for.forEach(item => {
                    let cardDiv = document.createElement('div');
                    let movie_img = document.createElement('img');
                    let imgDiv = document.createElement('figure');
                    let title = document.createElement('h2');
                    let rel_date = document.createElement('p');
                    let overview = document.createElement('p');
                    let vote_avg = document.createElement('p');

                    cardDiv.className = "media-card";
                    imgDiv.className = "img-card";
                    movie_img.src = APP.IMG_URL + 'w500' + item.poster_path;
                    movie_img.alt = item.name;
                    title.textContent = item.title;
                    rel_date.textContent = "Release Date" + item.release_date;

                    if (item.overview == null || item.overview == 0) {
                        overview.textContent = "Error: Overview Unavailable"
                    } else if (item.overview.length > 300) {
                        overview.textContent = item.overview.substring(0, 300) + '...';
                    } else {
                        overview.textContent = item.overview;
                    }

                    vote_avg.textContent = "Voter Average: " + item.vote_average;

                    imgDiv.append(movie_img);
                    cardDiv.append(imgDiv, title, rel_date, overview, vote_avg);
                    content.append(cardDiv);
                    df.append(cardDiv);

                });
            }
        });
        content.append(df);

        document.querySelector("#backBtn").addEventListener('click', (ev) => {         //handle back button
            ev.preventDefault();
            actors.style.display = "flex";
            card.addEventListener('click', MEDIA.showMedia);
            content.innerHTML = "";
            document.querySelector('#backBtn').style.display = 'none';
        });

    },

};

document.addEventListener('DOMContentLoaded', APP.init);
