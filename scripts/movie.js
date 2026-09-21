
let currentId = localStorage.getItem("movieId") || "550";
let currentName = localStorage.getItem("movieName") || "Fight Club";

const player = document.getElementById('player');
const idInput = document.getElementById('id-input');
const savedShows = document.getElementById("savedShows");

function movieServers() {
    return [
        `https://peachify.pro/embed/movie/${currentId}`,
        `https://vidup.to/movie/${currentId}?nextButton=false&autoNext=false`,
        `https://player.vidlove.cc/embed/movie/${currentId}`,
        `https://vidfast.vc/movie/${currentId}?nextButton=false&autoNext=false`,
        `https://vidnest.fun/movie/${currentId}`
    ];
}

let currentServer = 2;

const playerButtons = document.querySelector(".player-buttons");

movieServers().forEach((_, index) => {
    const button = document.createElement("button");
    button.className = "server-btn";
    button.dataset.server = index;
    button.textContent = `Server ${index + 1}`;

    playerButtons.appendChild(button);
});

idInput.value = currentName;

function updateSavedMovies() {
    const movies = JSON.parse(localStorage.getItem("movies")) || {};
    savedShows.innerHTML = "";

    for (const id in movies) {
        const div = document.createElement("div");
        div.className = "saved-show";
        div.textContent = movies[id].name;

        div.addEventListener("click", function () {
            currentId = id;
            currentName = movies[id].name;

            idInput.value = currentName;

            updatePlayer();
        });

        div.addEventListener("dblclick", function () {
            delete movies[id];

            localStorage.setItem(
                "movies",
                JSON.stringify(movies)
            );

            if (id === currentId) {
                currentId = "";
                currentName = "";

                player.src = "";
                idInput.value = "";

                localStorage.removeItem("movieId");
                localStorage.removeItem("movieName");
            }
            updateSavedMovies();
        });
        savedShows.appendChild(div);
    }
}

function saveMovie() {
    let movies = JSON.parse(localStorage.getItem("movies")) || {};

    movies[currentId] = {
        name: currentName
    };

    localStorage.setItem("movies", JSON.stringify(movies));
    localStorage.setItem("movieId", currentId);
    localStorage.setItem("movieName", currentName);
    updateSavedMovies();
}

function updatePlayer() {
    player.src = movieServers()[currentServer];
    //god
    saveMovie();
}

updatePlayer();
updateSavedMovies();

idInput.addEventListener("keydown", async function (event) {
    if (event.key !== "Enter") return;

    const query = this.value.trim();
    if (!query) return;
    try {
        const response = await fetch(`/api/tmdbMT?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.results.length > 0) {
            const movie = data.results[0];

            currentName = movie.title;
            currentId = movie.id.toString();
            idInput.value = currentName
            updatePlayer();
        } else {
            console.log("No movie found.");
        }
    } catch (error) {
        console.error(error);
    }
});

document.querySelectorAll(".server-btn").forEach(button => {
    button.addEventListener("click", function () {
        currentServer = Number(this.dataset.server);
        updatePlayer();
    });
});

