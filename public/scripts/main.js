(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

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
var app = {};
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
};app.getMovies = function (userGenre, userRating) {
    $.ajax({
        url: app.moviesBaseURL + '/discover/movie',
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.moviesAPIKey,
            language: 'en-US',
            sort_by: 'vote_average.desc',
            with_genres: userGenre, // genre id
            'vote_average.gte': userRating // rating >= userRating
        }
    }).then(function (res) {
        var totalPages = res.total_pages;
        var newPageNumber = app.getRandNum(totalPages) + 1;

        $.ajax({
            url: app.moviesBaseURL + '/discover/movie',
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
        }).then(function (res) {
            // on random page
            var movie = res.results[app.getRandNum(20)];
            console.log(movie);

            // put movie into HTML
            app.displayMovie(movie);
        });
    });
};

app.getCocktail = function (search) {
    $.ajax({
        url: '' + app.cocktailBaseURL + search,
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then(function (res) {
        console.log(res);

        console.log(app.getRandNum(res.drinks.length));
        app.randomDrinkNumber = app.getRandNum(res.drinks.length);

        var newSearch = 'filter.php?i=' + app.drinkType;
        console.log(newSearch);

        $.ajax({
            url: '' + app.cocktailBaseURL + newSearch,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then(function (res) {
            // random array for drink - get ID
            console.log(res.drinks[app.randomDrinkNumber].idDrink);
            var getDrinkById = res.drinks[app.randomDrinkNumber].idDrink;

            $.ajax({
                url: app.cocktailBaseURL + 'lookup.php?i=' + getDrinkById,
                method: 'GET',
                dataType: 'json',
                data: {
                    key: '1'
                }
            }).then(function (res) {
                // grab drink data
                console.log(res);
                console.log(res.drinks[0]);
            });
        });
    });
};

// return random number
app.getRandNum = function (num) {
    return Math.floor(Math.random() * num);
};

app.displayMovie = function (movie) {
    var title = movie.title;
    var imgUrl = movie.poster_path;
    var rating = movie.vote_average;
    $('.movies-result__container').empty();
    $('.movies-result__container').append('\n        <h3>' + title + '</h3>\n        <img src="' + (app.moviesImageURL + app.moviesImageWidth + imgUrl) + '">\n        <p class="movie-rating">' + rating + '</p>\n    ');
};

app.events = function () {
    $('#submit').on('click', function (e) {
        e.preventDefault();
        var genreCategory = $('input[name=genre]:checked').val();
        var genreIndexMax = app.moviesGenreIDs[genreCategory].length;
        var genreIndex = app.getRandNum(genreIndexMax);

        app.userGenre = app.moviesGenreIDs[genreCategory][genreIndex];
        app.userRating = parseInt($('input[name=rating]:checked').val());
        app.getMovies(app.userGenre, app.userRating);

        //cocktail api
        var alcholic = $('input[name=alcohol]:checked').val();
        var drinkCategory = $('input[name=category]:checked').val();
        var drinkArray = app.cocktailCategory[alcholic][drinkCategory];
        var drinkNumber = app.getRandNum(drinkArray.length);
        app.drinkType = drinkArray[drinkNumber];

        // get array of drinks by type - wine/shake/etc
        app.getCocktail('filter.php?i=' + app.drinkType);
    });

    $('.another-movie').on('click', function (e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    });
};

// init function
app.init = function () {

    app.events();
};

$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFJLE1BQUosR0FBYSxFQUFFLFNBQUYsQ0FBYjs7QUFFQTtBQUNBLElBQUksYUFBSixHQUFvQiw4QkFBcEI7QUFDQSxJQUFJLGNBQUosR0FBcUIsNkJBQXJCO0FBQ0EsSUFBSSxnQkFBSixHQUF1QixNQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixrQ0FBbkI7QUFDQSxJQUFJLFNBQUo7QUFDQSxJQUFJLGNBQUosR0FBcUI7QUFDakIsV0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsSUFBVCxDQURVO0FBRWpCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlM7QUFHakIsYUFBUyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksRUFBWjtBQUhRLENBQXJCOztBQU1BO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLDhDQUF0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQUosR0FBdUI7QUFDbkIsZUFBVztBQUNQLGVBQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixRQUFoQixDQURBO0FBRVAsaUJBQVMsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixLQUFyQixDQUZGO0FBR1Asc0JBQWMsQ0FBQyxTQUFELEVBQVksS0FBWjtBQUhQLEtBRFE7QUFNbkIsbUJBQWU7QUFDWCxlQUFPLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsT0FBdEIsQ0FESTtBQUVYLGlCQUFTLENBQUMsTUFBRCxFQUFTLGVBQVQsQ0FGRTtBQUdYLHNCQUFjLENBQUMsUUFBRCxFQUFXLEtBQVg7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QUFxQixRQUFyQixFQUErQixhQUEvQixDQUFuQjtBQUNBLFlBQU0sY0FBYyxJQUFJLFVBQUosQ0FBZSxXQUFXLE1BQTFCLENBQXBCO0FBQ0EsWUFBSSxTQUFKLEdBQWdCLFdBQVcsV0FBWCxDQUFoQjs7QUFFQTtBQUNBLFlBQUksV0FBSixtQkFBZ0MsSUFBSSxTQUFwQztBQUNILEtBbkJEOztBQXFCQSxNQUFFLGdCQUFGLEVBQW9CLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQ3hDLFVBQUUsY0FBRjtBQUNBLFlBQUksU0FBSixDQUFjLElBQUksU0FBbEIsRUFBNkIsSUFBSSxVQUFqQztBQUNILEtBSEQ7QUFJSCxDQTFCRDs7QUE0QkE7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFNOztBQUdiLFFBQUksTUFBSjtBQUNILENBSkQ7O0FBTUEsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBPbiBjbGljayBvZiBcImJlZ2luXCIgYnV0dG9uLCBoaWRlIGxhbmRpbmcgcGFnZVxuLy8gQmFzZWQgb24gdXNlciBpbnB1dCwgc3RvcmUgaW5wdXQgdmFsdWUgaW4gdmFyaWFibGUgKHJhZGlvIGJ1dHRvbnMpXG4vLyBRMSBpbmZvIC0+IENvY2t0YWlsREIgYmFzZVxuLy8gICAgIC0gZmlsdGVyIGNvY2t0YWlsIGRhdGEgYmFzZWQgb24gbWFpbiBpbmdyZWRpZW50XG4vLyBRMiBpbmZvIC0+IE1vdmllc0RCIGdlbnJlXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gUTMgaW5mbyAtPiBNb3ZpZXNEQiByYXRpbmdzXG4vLyAgICAgLSBmaWx0ZXIgbW92aWUgYXJyYXkgYmFzZWQgb24gcmF0aW5nc1xuLy8gUTQgaW5mbyAtPiBDb2NrdGFpbERCIGFsY2hvbGljL25vbi1hbGNvaG9saWNcbi8vICAgICAtIGNyZWF0ZSBhcnJheSBvZiByZXR1cm5lZCBkYXRhXG4vLyBVc2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJlc3VsdHMgZnJvbSB0aGUgbW92aWVzIGFuZCB0aGUgY29ja3RhaWwgYXJyYXlcbi8vIERpc3BsYXkgaW5mb3JtYXRpb24gb24gcGFnZSB3aXRoIGpxdWVyeVxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBhbm90aGVyXCIsIHVzZSByYW5kb20gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbmV3IHJlc3VsdFxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBuZXcgZGF0ZVwiIHRha2UgdXNlciBiYWNrIHRvIHF1ZXN0aW9ucyBwYWdlXG5cbi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5hcHAuc3VibWl0ID0gJCgnI3N1Ym1pdCcpO1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNJbWFnZVVSTCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xuYXBwLm1vdmllc0ltYWdlV2lkdGggPSAndzE4NSc7XG5hcHAubW92aWVzQVBJS2V5ID0gJzBmMDc0OTgyZjBlNmE5OTlkNTk4NjVkZmYyMTg0ZTg2JztcbmFwcC5tb3ZpZVBhZ2U7XG5hcHAubW92aWVzR2VucmVJRHMgPSB7XG4gICAgY29udm86IFs4MCwgOTksIDk2NDhdLFxuICAgIGxhdWdoczogWzM1LCAxMiwgMTgsIDEwNzUxXSxcbiAgICBjdWRkbGVzOiBbMjcsIDEwNzQ5LCA1M11cbn07XG5cbi8vIGNvY2t0YWlsIHByb3BlcnRpZXNcbmFwcC5jb2NrdGFpbEJhc2VVUkwgPSAnaHR0cHM6Ly93d3cudGhlY29ja3RhaWxkYi5jb20vYXBpL2pzb24vdjEvMS8nO1xuLy8gYXBwLmNvY2t0YWlsU2VhcmNoQWxjID0gWydmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpYycsJ2ZpbHRlci5waHA/YT1BbGNvaG9saWMnXTtcbi8vIGFwcC5jb2NrdGFpbEZpbHRlckluZ3JlZGllbnQgPSBgZmlsdGVyLnBocD9pPSR7ZHJpbmtJbmdyZWRpZW50fWA7XG4vLyBhcHAuY29rdGFpbFNlYXJjaElkID0gYGxvb2t1cC5waHA/aT0ke2RyaW5rSWR9YDtcbmFwcC5jb2NrdGFpbENhdGVnb3J5ID0ge1xuICAgIEFsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWydXaW5lJywgJ0dpbicsICdCcmFuZHknXSxcbiAgICAgICAgZnJpZW5kczogWydUZXF1aWxhJywgJ1ZvZGthJywgJ1J1bSddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnV2hpc2tleScsICdSdW0nXVxuICAgIH0sXG4gICAgTm9uX0FsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWydGbG9hdCcsICdDb2NrdGFpbCcsICdTaGFrZSddLFxuICAgICAgICBmcmllbmRzOiBbJ01pbGsnLCAnT3RoZXIvVW5rbm93biddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnQ29mZmVlJywgJ1RlYSddXG4gICAgfVxufVxuXG5cbi8vIFBTRVVET1xuXG4vLyBnZXQgZHJpbmsgYnkgYWxjL25vbmUgYWxjXG4vLyBhcHAuZ2V0Q29ja3RhaWwoJ2ZpbHRlci5waHA/YT1Ob25fQWxjb2hvbGljJyk7XG5cbi8vIGZpbHRlciByZXN1bHRzIGJ5IHN0ckNhdGVnb3J5XG5cbi8vIGdldCBhbiBJRCBmcm9tIGEgcmFuZG9tIGRyaW5rIFxuLy8gcmV0cmlldmUgdGhlIGlkIC0gcmVzW3JhbmRvbUluZGV4XS5pZERyaW5rXG5cbi8vIHNlYXJjaCBmb3IgdGhlIGRyaW5rIGJhc2VkIG9uIElEXG4vLyBhcHAuZ2V0Q29ja3RhaWwoYGxvb2t1cC5waHA/aT0ke2RyaW5rSWR9YCk7XG5cbi8vIGRpc3BsYXkgdGhlIG5hbWUgLSBzdHJEcmlua1xuLy8gZGlzcGxheSB0aGUgaW5ncmVkaWVudHMgLSBzdHJJbmdyZWRpZW50MS14XG4vLyBkaXNwbGF5IHRoZSBtZWFzdXJlbWVudHMgLSBzdHJNZWFzdXJlMS14XG4vLyBkaXNwbGF5IGluc3RydWN0aW9ucyAtIHN0ckluc3RydWN0aW9uc1xuXG4vLyBhcHAuZ2V0TW92aWVzKHVzZXJHZW5yZSwgdXNlclJhdGluZyk7XG4vLyByZXF1ZXN0aW5nIG1vdmllIGluZm8gZnJvbSBtb3ZpZXNEQiBBUElcbmFwcC5nZXRNb3ZpZXMgPSAodXNlckdlbnJlLCB1c2VyUmF0aW5nKSA9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICBzb3J0X2J5OiAndm90ZV9hdmVyYWdlLmRlc2MnLFxuICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZyAvLyByYXRpbmcgPj0gdXNlclJhdGluZ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdGFsUGFnZXMgPSByZXMudG90YWxfcGFnZXM7XG4gICAgICAgIGNvbnN0IG5ld1BhZ2VOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bSh0b3RhbFBhZ2VzKSsxO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgICAgICAgIHNvcnRfYnk6ICd2b3RlX2F2ZXJhZ2UuZGVzYycsXG4gICAgICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcsIC8vIHJhdGluZyA9PCB1c2VyUmF0aW5nXG4gICAgICAgICAgICAgICAgcGFnZTogbmV3UGFnZU51bWJlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgIC8vIG9uIHJhbmRvbSBwYWdlXG4gICAgICAgICAgICBjb25zdCBtb3ZpZSA9IHJlcy5yZXN1bHRzW2FwcC5nZXRSYW5kTnVtKDIwKV1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcblxuICAgICAgICAgICAgLy8gcHV0IG1vdmllIGludG8gSFRNTFxuICAgICAgICAgICAgYXBwLmRpc3BsYXlNb3ZpZShtb3ZpZSk7XG4gICAgICAgIH0pXG4gICAgfSlcbn07XG5cblxuXG5cblxuYXBwLmdldENvY2t0YWlsID0gKHNlYXJjaCk9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfSR7c2VhcmNofWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmdldFJhbmROdW0ocmVzLmRyaW5rcy5sZW5ndGgpKTtcbiAgICAgICAgYXBwLnJhbmRvbURyaW5rTnVtYmVyID0gYXBwLmdldFJhbmROdW0ocmVzLmRyaW5rcy5sZW5ndGgpO1xuICAgICAgICBcblxuICAgICAgICBjb25zdCBuZXdTZWFyY2ggPSBgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdTZWFyY2gpO1xuICAgICAgICBcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfSR7bmV3U2VhcmNofWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICB9KS50aGVuKChyZXMpPT57ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyByYW5kb20gYXJyYXkgZm9yIGRyaW5rIC0gZ2V0IElEXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZHJpbmtzW2FwcC5yYW5kb21Ecmlua051bWJlcl0uaWREcmluayk7XG4gICAgICAgICAgICBjb25zdCBnZXREcmlua0J5SWQgPSByZXMuZHJpbmtzW2FwcC5yYW5kb21Ecmlua051bWJlcl0uaWREcmluaztcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9bG9va3VwLnBocD9pPSR7Z2V0RHJpbmtCeUlkfWAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGRyaW5rIGRhdGFcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbMF0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuXG4gICAgfSlcbn1cblxuLy8gcmV0dXJuIHJhbmRvbSBudW1iZXJcbmFwcC5nZXRSYW5kTnVtID0gKG51bSkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pO1xufVxuXG5hcHAuZGlzcGxheU1vdmllID0gKG1vdmllKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBtb3ZpZS50aXRsZTtcbiAgICBjb25zdCBpbWdVcmwgPSBtb3ZpZS5wb3N0ZXJfcGF0aDtcbiAgICBjb25zdCByYXRpbmcgPSBtb3ZpZS52b3RlX2F2ZXJhZ2U7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmFwcGVuZChgXG4gICAgICAgIDxoMz4ke3RpdGxlfTwvaDM+XG4gICAgICAgIDxpbWcgc3JjPVwiJHthcHAubW92aWVzSW1hZ2VVUkwgK2FwcC5tb3ZpZXNJbWFnZVdpZHRoICsgaW1nVXJsfVwiPlxuICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJhdGluZ1wiPiR7cmF0aW5nfTwvcD5cbiAgICBgKTtcbn1cblxuYXBwLmV2ZW50cyA9ICgpID0+IHtcbiAgICAkKCcjc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGdlbnJlQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWdlbnJlXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXhNYXggPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV0ubGVuZ3RoO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4ID0gYXBwLmdldFJhbmROdW0oZ2VucmVJbmRleE1heCk7XG5cbiAgICAgICAgYXBwLnVzZXJHZW5yZSA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XVtnZW5yZUluZGV4XTtcbiAgICAgICAgYXBwLnVzZXJSYXRpbmcgPSBwYXJzZUludCgkKCdpbnB1dFtuYW1lPXJhdGluZ106Y2hlY2tlZCcpLnZhbCgpKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG5cbiAgICAgICAgLy9jb2NrdGFpbCBhcGlcbiAgICAgICAgY29uc3QgYWxjaG9saWMgPSAkKCdpbnB1dFtuYW1lPWFsY29ob2xdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Y2F0ZWdvcnldOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtBcnJheSA9IGFwcC5jb2NrdGFpbENhdGVnb3J5W2FsY2hvbGljXVtkcmlua0NhdGVnb3J5XTtcbiAgICAgICAgY29uc3QgZHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShkcmlua0FycmF5Lmxlbmd0aCk7XG4gICAgICAgIGFwcC5kcmlua1R5cGUgPSBkcmlua0FycmF5W2RyaW5rTnVtYmVyXTtcbiAgICAgICAgXG4gICAgICAgIC8vIGdldCBhcnJheSBvZiBkcmlua3MgYnkgdHlwZSAtIHdpbmUvc2hha2UvZXRjXG4gICAgICAgIGFwcC5nZXRDb2NrdGFpbChgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gKTtcbiAgICB9KTtcblxuICAgICQoJy5hbm90aGVyLW1vdmllJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGFwcC5nZXRNb3ZpZXMoYXBwLnVzZXJHZW5yZSwgYXBwLnVzZXJSYXRpbmcpO1xuICAgIH0pXG59O1xuXG4vLyBpbml0IGZ1bmN0aW9uXG5hcHAuaW5pdCA9ICgpID0+IHtcbiAgICBcblxuICAgIGFwcC5ldmVudHMoKTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
