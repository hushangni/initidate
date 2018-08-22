// On click of "begin" button, hide landing page
// Based on user input, store input value in variable (radio buttons)
// Q1 info -> CocktailDB base
//     - filter cocktail data based on main ingredient
// Q2 info -> MoviesDB genre
//     - create array of returned data
// Q3 info -> MoviesDB ratings
//     - filter movie array based on ratings
// Q4 info -> CocktailDB alcholic/non-alcoholic
//     - create array of returned data
// Use random function to generate results from the movies and the cocktail array
// Display information on page with jquery
// On click of "generate another", use random function to generate new result
// On click of "generate new date" take user back to questions page

// main app object
const app = {};

// moviesDB properties
app.moviesBaseURL = 'https://api.themoviedb.org/3';
app.moviesAPIKey = '0f074982f0e6a999d59865dff2184e86';

// app.getMovies(userGenre, userRating);
// requesting movie info from moviesDB API
app.getMovies = (userGenre, userRating) => {
    $.ajax({
        url: `${app.moviesBaseURL}/discover/movie`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.moviesAPIKey,
            language: 'en-US',
            sort_by: 'vote_average.desc',
            with_genres: userGenre, // genre id
            'vote_average.lte': userRating // rating =< userRating
        }
    }).then((res) => {
        const movieObjects = res.results;
        console.log(movieObjects);
    })
};

// init function
app.init = () => {
    // testing genre: action and userRating: 8 and below
    app.getMovies(28, 8);
}

$(function() {
    console.log("ready");
    app.init();
})