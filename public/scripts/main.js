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

app.cocktailCategory = {
    Alcoholic: {
        first: ['Wine', 'Gin', 'Brandy'],
        friends: ['Tequila', 'Vodka', 'Rum'],
        relationship: ['Whiskey', 'Rum']
    },
    // add literals?
    Non_Alcoholic: {
        first: ['', ''],
        friends: ['Milk', ''],
        relationship: ['Coffee', 'Tea']
    }

    // PSEUDO

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
        console.log(app.drinkType);

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

app.getDrink = function () {
    $.ajax({
        url: app.cocktailBaseURL + 'filter.php?a=Non_Alcoholic',
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then(function (res) {
        var randomDrinkNumber = app.getRandNum(res.drinks.length);
        console.log(randomDrinkNumber);

        var drinkId = res.drinks[randomDrinkNumber].idDrink;
        console.log(drinkId);

        $.ajax({
            url: app.cocktailBaseURL + 'lookup.php?i=' + drinkId,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then(function (res) {
            console.log(res);
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
        console.log(app.drinkType);

        if (alcholic === 'Alcoholic') {
            console.log('woo');
            app.getCocktail('filter.php?i=' + app.drinkType);
        } else {
            app.getDrink();
        }
        // get array of drinks by type - wine/shake/etc
    });

    $('.another-movie').on('click', function (e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    });
};

// init function
app.init = function () {
    // app.getCocktail(`filter.php?a=Non_Alcoholic`);

    // app.getCocktail(`filter.php?i=Coffee`);
    // app.getCocktail(`lookup.php?i=12770`);

    app.events();
};

$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFJLE1BQUosR0FBYSxFQUFFLFNBQUYsQ0FBYjs7QUFFQTtBQUNBLElBQUksYUFBSixHQUFvQiw4QkFBcEI7QUFDQSxJQUFJLGNBQUosR0FBcUIsNkJBQXJCO0FBQ0EsSUFBSSxnQkFBSixHQUF1QixNQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixrQ0FBbkI7QUFDQSxJQUFJLFNBQUo7QUFDQSxJQUFJLGNBQUosR0FBcUI7QUFDakIsV0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsSUFBVCxDQURVO0FBRWpCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlM7QUFHakIsYUFBUyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksRUFBWjtBQUhRLENBQXJCOztBQU1BO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLDhDQUF0Qjs7QUFFQSxJQUFJLGdCQUFKLEdBQXVCO0FBQ25CLGVBQVc7QUFDUCxlQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FEQTtBQUVQLGlCQUFTLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FGRjtBQUdQLHNCQUFjLENBQUMsU0FBRCxFQUFZLEtBQVo7QUFIUCxLQURRO0FBTW5CO0FBQ0EsbUJBQWU7QUFDWCxlQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FESTtBQUVYLGlCQUFTLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FGRTtBQUdYLHNCQUFjLENBQUMsUUFBRCxFQUFXLEtBQVg7QUFISDs7QUFRbkI7O0FBRUE7QUFD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QUE2QixJQUFJLFVBQWpDO0FBQ0gsS0FIRDtBQUlILENBaENEOztBQWtDQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYjs7QUFFQTtBQUNBOztBQUVBLFFBQUksTUFBSjtBQUNILENBUEQ7O0FBU0EsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBPbiBjbGljayBvZiBcImJlZ2luXCIgYnV0dG9uLCBoaWRlIGxhbmRpbmcgcGFnZVxuLy8gQmFzZWQgb24gdXNlciBpbnB1dCwgc3RvcmUgaW5wdXQgdmFsdWUgaW4gdmFyaWFibGUgKHJhZGlvIGJ1dHRvbnMpXG4vLyBRMSBpbmZvIC0+IENvY2t0YWlsREIgYmFzZVxuLy8gICAgIC0gZmlsdGVyIGNvY2t0YWlsIGRhdGEgYmFzZWQgb24gbWFpbiBpbmdyZWRpZW50XG4vLyBRMiBpbmZvIC0+IE1vdmllc0RCIGdlbnJlXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gUTMgaW5mbyAtPiBNb3ZpZXNEQiByYXRpbmdzXG4vLyAgICAgLSBmaWx0ZXIgbW92aWUgYXJyYXkgYmFzZWQgb24gcmF0aW5nc1xuLy8gUTQgaW5mbyAtPiBDb2NrdGFpbERCIGFsY2hvbGljL25vbi1hbGNvaG9saWNcbi8vICAgICAtIGNyZWF0ZSBhcnJheSBvZiByZXR1cm5lZCBkYXRhXG4vLyBVc2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJlc3VsdHMgZnJvbSB0aGUgbW92aWVzIGFuZCB0aGUgY29ja3RhaWwgYXJyYXlcbi8vIERpc3BsYXkgaW5mb3JtYXRpb24gb24gcGFnZSB3aXRoIGpxdWVyeVxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBhbm90aGVyXCIsIHVzZSByYW5kb20gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbmV3IHJlc3VsdFxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBuZXcgZGF0ZVwiIHRha2UgdXNlciBiYWNrIHRvIHF1ZXN0aW9ucyBwYWdlXG5cbi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5hcHAuc3VibWl0ID0gJCgnI3N1Ym1pdCcpO1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNJbWFnZVVSTCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xuYXBwLm1vdmllc0ltYWdlV2lkdGggPSAndzE4NSc7XG5hcHAubW92aWVzQVBJS2V5ID0gJzBmMDc0OTgyZjBlNmE5OTlkNTk4NjVkZmYyMTg0ZTg2JztcbmFwcC5tb3ZpZVBhZ2U7XG5hcHAubW92aWVzR2VucmVJRHMgPSB7XG4gICAgY29udm86IFs4MCwgOTksIDk2NDhdLFxuICAgIGxhdWdoczogWzM1LCAxMiwgMTgsIDEwNzUxXSxcbiAgICBjdWRkbGVzOiBbMjcsIDEwNzQ5LCA1M11cbn07XG5cbi8vIGNvY2t0YWlsIHByb3BlcnRpZXNcbmFwcC5jb2NrdGFpbEJhc2VVUkwgPSAnaHR0cHM6Ly93d3cudGhlY29ja3RhaWxkYi5jb20vYXBpL2pzb24vdjEvMS8nO1xuXG5hcHAuY29ja3RhaWxDYXRlZ29yeSA9IHtcbiAgICBBbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnV2luZScsICdHaW4nLCAnQnJhbmR5J10sXG4gICAgICAgIGZyaWVuZHM6IFsnVGVxdWlsYScsICdWb2RrYScsICdSdW0nXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ1doaXNrZXknLCAnUnVtJ11cbiAgICB9LFxuICAgIC8vIGFkZCBsaXRlcmFscz9cbiAgICBOb25fQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJycsICcnXSxcbiAgICAgICAgZnJpZW5kczogWydNaWxrJywgJyddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnQ29mZmVlJywgJ1RlYSddXG4gICAgfVxufVxuXG5cbi8vIFBTRVVET1xuXG4vLyBzZWFyY2ggZm9yIHRoZSBkcmluayBiYXNlZCBvbiBJRFxuLy8gYXBwLmdldENvY2t0YWlsKGBsb29rdXAucGhwP2k9JHtkcmlua0lkfWApO1xuXG4vLyBkaXNwbGF5IHRoZSBuYW1lIC0gc3RyRHJpbmtcbi8vIGRpc3BsYXkgdGhlIGluZ3JlZGllbnRzIC0gc3RySW5ncmVkaWVudDEteFxuLy8gZGlzcGxheSB0aGUgbWVhc3VyZW1lbnRzIC0gc3RyTWVhc3VyZTEteFxuLy8gZGlzcGxheSBpbnN0cnVjdGlvbnMgLSBzdHJJbnN0cnVjdGlvbnNcblxuLy8gYXBwLmdldE1vdmllcyh1c2VyR2VucmUsIHVzZXJSYXRpbmcpO1xuLy8gcmVxdWVzdGluZyBtb3ZpZSBpbmZvIGZyb20gbW92aWVzREIgQVBJXG5hcHAuZ2V0TW92aWVzID0gKHVzZXJHZW5yZSwgdXNlclJhdGluZykgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgICAgc29ydF9ieTogJ3ZvdGVfYXZlcmFnZS5kZXNjJyxcbiAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcgLy8gcmF0aW5nID49IHVzZXJSYXRpbmdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbFBhZ2VzID0gcmVzLnRvdGFsX3BhZ2VzO1xuICAgICAgICBjb25zdCBuZXdQYWdlTnVtYmVyID0gYXBwLmdldFJhbmROdW0odG90YWxQYWdlcykrMTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgICAgICBzb3J0X2J5OiAndm90ZV9hdmVyYWdlLmRlc2MnLFxuICAgICAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nLCAvLyByYXRpbmcgPTwgdXNlclJhdGluZ1xuICAgICAgICAgICAgICAgIHBhZ2U6IG5ld1BhZ2VOdW1iZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBvbiByYW5kb20gcGFnZVxuICAgICAgICAgICAgY29uc3QgbW92aWUgPSByZXMucmVzdWx0c1thcHAuZ2V0UmFuZE51bSgyMCldXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XG5cbiAgICAgICAgICAgIC8vIHB1dCBtb3ZpZSBpbnRvIEhUTUxcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5TW92aWUobW92aWUpO1xuICAgICAgICB9KVxuICAgIH0pXG59O1xuXG5cblxuXG5cbmFwcC5nZXRDb2NrdGFpbCA9IChzZWFyY2gpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke3NlYXJjaH1gLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKSk7XG4gICAgICAgIGFwcC5yYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgbmV3U2VhcmNoID0gYGZpbHRlci5waHA/aT0ke2FwcC5kcmlua1R5cGV9YDtcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmRyaW5rVHlwZSk7XG4gICAgICAgIFxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtuZXdTZWFyY2h9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICB9ICAgXG4gICAgICAgIH0pLnRoZW4oKHJlcyk9PnsgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHJhbmRvbSBhcnJheSBmb3IgZHJpbmsgLSBnZXQgSURcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGdldERyaW5rQnlJZCA9IHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtnZXREcmlua0J5SWR9YCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGdyYWIgZHJpbmsgZGF0YVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRyaW5rc1swXSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG5cbiAgICB9KVxufVxuXG5hcHAuZ2V0RHJpbmsgPSAoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9ZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWNgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICBjb25zdCByYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS5sb2cocmFuZG9tRHJpbmtOdW1iZXIpO1xuXG4gICAgICAgIGNvbnN0IGRyaW5rSWQgPSByZXMuZHJpbmtzW3JhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuICAgICAgICBjb25zb2xlLmxvZyhkcmlua0lkKTtcbiAgICAgICAgXG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtkcmlua0lkfWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgICAgICBcbiAgICB9KVxufVxuXG4vLyByZXR1cm4gcmFuZG9tIG51bWJlclxuYXBwLmdldFJhbmROdW0gPSAobnVtKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSk7XG59XG5cbmFwcC5kaXNwbGF5TW92aWUgPSAobW92aWUpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IG1vdmllLnRpdGxlO1xuICAgIGNvbnN0IGltZ1VybCA9IG1vdmllLnBvc3Rlcl9wYXRoO1xuICAgIGNvbnN0IHJhdGluZyA9IG1vdmllLnZvdGVfYXZlcmFnZTtcbiAgICAkKCcubW92aWVzLXJlc3VsdF9fY29udGFpbmVyJykuZW1wdHkoKTtcbiAgICAkKCcubW92aWVzLXJlc3VsdF9fY29udGFpbmVyJykuYXBwZW5kKGBcbiAgICAgICAgPGgzPiR7dGl0bGV9PC9oMz5cbiAgICAgICAgPGltZyBzcmM9XCIke2FwcC5tb3ZpZXNJbWFnZVVSTCArYXBwLm1vdmllc0ltYWdlV2lkdGggKyBpbWdVcmx9XCI+XG4gICAgICAgIDxwIGNsYXNzPVwibW92aWUtcmF0aW5nXCI+JHtyYXRpbmd9PC9wPlxuICAgIGApO1xufVxuXG5hcHAuZXZlbnRzID0gKCkgPT4ge1xuICAgICQoJyNzdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZ2VucmVDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Z2VucmVdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleE1heCA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXggPSBhcHAuZ2V0UmFuZE51bShnZW5yZUluZGV4TWF4KTtcblxuICAgICAgICBhcHAudXNlckdlbnJlID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldW2dlbnJlSW5kZXhdO1xuICAgICAgICBhcHAudXNlclJhdGluZyA9IHBhcnNlSW50KCQoJ2lucHV0W25hbWU9cmF0aW5nXTpjaGVja2VkJykudmFsKCkpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcblxuICAgICAgICAvL2NvY2t0YWlsIGFwaVxuICAgICAgICBjb25zdCBhbGNob2xpYyA9ICQoJ2lucHV0W25hbWU9YWxjb2hvbF06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBkcmlua0NhdGVnb3J5ID0gJCgnaW5wdXRbbmFtZT1jYXRlZ29yeV06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBkcmlua0FycmF5ID0gYXBwLmNvY2t0YWlsQ2F0ZWdvcnlbYWxjaG9saWNdW2RyaW5rQ2F0ZWdvcnldO1xuICAgICAgICBjb25zdCBkcmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKGRyaW5rQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgYXBwLmRyaW5rVHlwZSA9IGRyaW5rQXJyYXlbZHJpbmtOdW1iZXJdO1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZHJpbmtUeXBlKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChhbGNob2xpYyA9PT0gJ0FsY29ob2xpYycpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3dvbycpO1xuICAgICAgICAgICAgYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9JHthcHAuZHJpbmtUeXBlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwLmdldERyaW5rKClcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXQgYXJyYXkgb2YgZHJpbmtzIGJ5IHR5cGUgLSB3aW5lL3NoYWtlL2V0Y1xuICAgIH0pO1xuXG4gICAgJCgnLmFub3RoZXItbW92aWUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG4gICAgfSlcbn07XG5cbi8vIGluaXQgZnVuY3Rpb25cbmFwcC5pbml0ID0gKCkgPT4ge1xuICAgIC8vIGFwcC5nZXRDb2NrdGFpbChgZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWNgKTtcbiAgICBcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoYGZpbHRlci5waHA/aT1Db2ZmZWVgKTtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoYGxvb2t1cC5waHA/aT0xMjc3MGApO1xuXG4gICAgYXBwLmV2ZW50cygpO1xufVxuXG4kKGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVhZHlcIik7XG4gICAgYXBwLmluaXQoKTtcbn0pIl19
