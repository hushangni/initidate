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
app.cocktailCategory = {
    Alcoholic: {
        first: ['Wine', 'Gin', 'Brandy'],
        friends: ['Tequila', 'Vodka', 'Rum'],
        relationship: ['Whiskey', 'Rum']
    },
        // add literals
    Non_Alcoholic: {
        first: ['', ''],
        friends: ['Milk', ''],
        relationship: ['Coffee', 'Tea']
    }
}


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
            sort_by: 'popularity.desc',
            with_genres: userGenre, // genre id
            'vote_average.gte': userRating // rating >= userRating
        }
    }).then((res) => {
        const totalPages = res.total_pages;
        const topPopular = Math.floor(totalPages * 0.2);
        const newPageNumber = app.getRandNum(topPopular)+1;

        $.ajax({
            url: `${app.moviesBaseURL}/discover/movie`,
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: app.moviesAPIKey,
                language: 'en-US',
                sort_by: 'popularity.desc',
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
        console.log(app.drinkType);


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
                app.displayDrink(res.drinks[0]);

            });
        });


    })
}

app.getDrink = ()=> {
    $.ajax({
        url: `${app.cocktailBaseURL}filter.php?a=Non_Alcoholic`,
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then((res)=>{
        const randomDrinkNumber = app.getRandNum(res.drinks.length);
        console.log(randomDrinkNumber);

        const drinkId = res.drinks[randomDrinkNumber].idDrink;
        console.log(drinkId);


        $.ajax({
            url: `${app.cocktailBaseURL}lookup.php?i=${drinkId}`,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then((res)=>{
            console.log(res);
            app.displayDrink(res.drinks[0]);
        })


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

app.displayDrink = (drink) => {
    const name = drink.strDrink;
    const imgUrl = drink.strDrinkThumb;
    $('.drinks-result__container').empty();
    $('.drinks-result__container').append(`
        <h3>${name}</h3>
        <img src="${imgUrl}">
    `);
}

app.generateDrink = (alcoholic) => {
    if (alcoholic === 'Alcoholic') {
        app.getCocktail(`filter.php?i=${app.drinkType}`);
    } else {
        app.getDrink()
    }
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
        app.alcoholic = $('input[name=alcohol]:checked').val();
        const drinkCategory = $('input[name=category]:checked').val();
        const drinkArray = app.cocktailCategory[app.alcoholic][drinkCategory];
        const drinkNumber = app.getRandNum(drinkArray.length);
        app.drinkType = drinkArray[drinkNumber];
        console.log(app.drinkType);

        app.generateDrink(app.alcoholic);
        // get array of drinks by type - wine/shake/etc
    });

    $('.another-movie').on('click', function(e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    })

    $('.another-drink').on('click', function(e) {
        e.preventDefault();
        app.generateDrink(app.alcoholic);
    })
};

// init function
app.init = () => {
    // app.getCocktail(`filter.php?a=Non_Alcoholic`);

    // app.getCocktail(`filter.php?i=Coffee`);
    // app.getCocktail(`lookup.php?i=12770`);

    app.events();
}

$(function() {
    console.log("ready");
    app.init();
})