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
app.submit = $('#submit');

// moviesDB properties
app.moviesBaseURL = 'https://api.themoviedb.org/3';
app.moviesImageURL = 'https://image.tmdb.org/t/p/';
app.moviesImageWidth = 'w185';
app.moviesAPIKey = '0f074982f0e6a999d59865dff2184e86';
app.moviePage;
app.moviesGenreIDs = {
    convo: [80, 99, 9648],
    laughs: [35, 12, 18, 10751],
    cuddles: [27, 10749, 53]
};

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
            'vote_average.gte': userRating // rating >= userRating
        }
    }).then((res) => {
        const totalPages = res.total_pages;
        const newPageNumber = app.getRandNum(totalPages)+1;

        $.ajax({
            url: `${app.moviesBaseURL}/discover/movie`,
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: app.moviesAPIKey,
                language: 'en-US',
                sort_by: 'vote_average.desc',
                with_genres: userGenre, // genre id
                'vote_average.gte': userRating, // rating =< userRating
                page: newPageNumber
            }
        }).then((res) => {
            // on random page
            const movie = res.results[app.getRandNum(20)]
            console.log(movie);

            // put movie into HTML
            app.displayMovie(movie);
        })
    })
};





app.getCocktail = (search)=> {
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/${search}`,
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then((res)=> {
        console.log(res);

    })
}

// return random number
app.getRandNum = (num) => {
    return Math.floor(Math.random() * num);
}

app.displayMovie = (movie) => {
    const title = movie.title;
    const imgUrl = movie.poster_path;
    const rating = movie.vote_average;
    $('.movies-result__container').empty();
    $('.movies-result__container').append(`
        <h3>${title}</h3>
        <img src="${app.moviesImageURL +app.moviesImageWidth + imgUrl}">
        <p class="movie-rating">${rating}</p>
    `);
}

app.events = () => {
    $('#submit').on('click', function(e) {
        e.preventDefault();
        const genreCategory = $('input[name=genre]:checked').val();
        const genreIndexMax = app.moviesGenreIDs[genreCategory].length;
        const genreIndex = app.getRandNum(genreIndexMax);

        app.userGenre = app.moviesGenreIDs[genreCategory][genreIndex];
        app.userRating = parseInt($('input[name=rating]:checked').val());
        app.getMovies(app.userGenre, app.userRating);
    });

    $('.another-movie').on('click', function(e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    })
};

// init function
app.init = () => {
    // testing genre: action and userRating: 8 and below
    // there are specific filters(end points) depending on ingredients/etc
    // app.getCocktail('filter.php?i=Vodka');
    // app.getCocktail('lookup.php?i=13060');
    app.getCocktail('filter.php?a=Non_Alcoholic');
    // app.getCocktail('lookup.php?i=12560');
    // app.getCocktail('lookup.php?i=12654');
    // app.getCocktail('lookup.php?i=12770');
    app.getCocktail('lookup.php?i=12720');

    app.events();
}

$(function() {
    console.log("ready");
    app.init();
})