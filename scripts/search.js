search = document.getElementById('search');

search.addEventListener("keydown", async function (event) {
    if (event.key !== "Enter") return;

    const query = this.value.trim();
    if (!query) return;
    try {
        const response = await fetch(`/api/tmdbTvT?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            alert(data.results[0].id);
        } else {
            console.log("No show found.");
        }

    } catch (error) {
        console.error("Error searching for show:", error);
        alert("Something went wrong while searching.");
    }
});