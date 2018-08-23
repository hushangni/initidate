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

// cocktail properties
app.cocktailBaseURL = 'https://www.thecocktaildb.com/api/json/v1/1/';
// app.cocktailSearchAlc = ['filter.php?a=Non_Alcoholic','filter.php?a=Alcoholic'];
// app.cocktailFilterIngredient = `filter.php?i=${drinkIngredient}`;
// app.coktailSearchId = `lookup.php?i=${drinkId}`;
app.cocktailCategory = {
    Alcoholic: {
        first: ['Wine', 'Gin', 'Brandy'],
        friends: ['Tequila', 'Vodka', 'Rum'],
        relationship: ['Whiskey', 'Rum']
    },
    Non_Alcoholic: {
        first: ['Float', 'Cocktail', 'Shake'],
        friends: ['Milk', 'Other/Unknown'],
        relationship: ['Coffee', 'Tea']
    }
}


// PSEUDO

// get drink by alc/none alc
// app.getCocktail('filter.php?a=Non_Alcoholic');

// filter results by strCategory

// get an ID from a random drink 
// retrieve the id - res[randomIndex].idDrink

// search for the drink based on ID
// app.getCocktail(`lookup.php?i=${drinkId}`);

// display the name - strDrink
// display the ingredients - strIngredient1-x
// display the measurements - strMeasure1-x
// display instructions - strInstructions

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
        url: `${app.cocktailBaseURL}${search}`,
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then((res)=> {
        console.log(res);
        
        console.log(app.getRandNum(res.drinks.length));
        app.randomDrinkNumber = app.getRandNum(res.drinks.length);
        

        const newSearch = `filter.php?i=${app.drinkType}`;
        console.log(newSearch);
        

        $.ajax({
            url: `${app.cocktailBaseURL}${newSearch}`,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }   
        }).then((res)=>{            
            // random array for drink - get ID
            console.log(res.drinks[app.randomDrinkNumber].idDrink);
            const getDrinkById = res.drinks[app.randomDrinkNumber].idDrink;

            $.ajax({
                url: `${app.cocktailBaseURL}lookup.php?i=${getDrinkById}`,
                method: 'GET',
                dataType: 'json',
                data: {
                    key: '1'
                }
            }).then((res) => {
                // grab drink data
                console.log(res);
                console.log(res.drinks[0]);

            });
        });
        

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

        //cocktail api
        const alcholic = $('input[name=alcohol]:checked').val();
        const drinkCategory = $('input[name=category]:checked').val();
        const drinkArray = app.cocktailCategory[alcholic][drinkCategory];
        const drinkNumber = app.getRandNum(drinkArray.length);
        app.drinkType = drinkArray[drinkNumber];
        
        // get array of drinks by type - wine/shake/etc
        app.getCocktail(`filter.php?i=${app.drinkType}`);
    });

    $('.another-movie').on('click', function(e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    })
};

// init function
app.init = () => {
    

    app.events();
}

$(function() {
    console.log("ready");
    app.init();
})