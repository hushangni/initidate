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
        console.log(res.drinks);
        console.log(res.drinks.length);
        console.log(app.getRandNum(res.drinks.length));
        app.randomDrinkNumber = app.getRandNum(res.drinks.length);

        var newSearch = 'filter.php?i=Wine';

        $.ajax({
            url: '' + app.cocktailBaseURL + newSearch,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then(function (res) {
            console.log(res);
            console.log(app.randomDrinkNumber);

            console.log(res.drinks[2]);
            console.log(res.drinks[2].idDrink);
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
        var drinkType = drinkArray[drinkNumber];

        // get array of drinks by type - wine/shake/etc
        app.getCocktail('filter.php?i=' + drinkType);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFJLE1BQUosR0FBYSxFQUFFLFNBQUYsQ0FBYjs7QUFFQTtBQUNBLElBQUksYUFBSixHQUFvQiw4QkFBcEI7QUFDQSxJQUFJLGNBQUosR0FBcUIsNkJBQXJCO0FBQ0EsSUFBSSxnQkFBSixHQUF1QixNQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixrQ0FBbkI7QUFDQSxJQUFJLFNBQUo7QUFDQSxJQUFJLGNBQUosR0FBcUI7QUFDakIsV0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsSUFBVCxDQURVO0FBRWpCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlM7QUFHakIsYUFBUyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksRUFBWjtBQUhRLENBQXJCOztBQU1BO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLDhDQUF0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQUosR0FBdUI7QUFDbkIsZUFBVztBQUNQLGVBQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixRQUFoQixDQURBO0FBRVAsaUJBQVMsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixLQUFyQixDQUZGO0FBR1Asc0JBQWMsQ0FBQyxTQUFELEVBQVksS0FBWjtBQUhQLEtBRFE7QUFNbkIsbUJBQWU7QUFDWCxlQUFPLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsT0FBdEIsQ0FESTtBQUVYLGlCQUFTLENBQUMsTUFBRCxFQUFTLGVBQVQsQ0FGRTtBQUdYLHNCQUFjLENBQUMsUUFBRCxFQUFXLEtBQVg7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QUYsRUFBb0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBUyxDQUFULEVBQVk7QUFDeEMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxTQUFKLENBQWMsSUFBSSxTQUFsQixFQUE2QixJQUFJLFVBQWpDO0FBQ0gsS0FIRDtBQUlILENBMUJEOztBQTRCQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07O0FBR2IsUUFBSSxNQUFKO0FBQ0gsQ0FKRDs7QUFNQSxFQUFFLFlBQVc7QUFDVCxZQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsUUFBSSxJQUFKO0FBQ0gsQ0FIRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIE9uIGNsaWNrIG9mIFwiYmVnaW5cIiBidXR0b24sIGhpZGUgbGFuZGluZyBwYWdlXG4vLyBCYXNlZCBvbiB1c2VyIGlucHV0LCBzdG9yZSBpbnB1dCB2YWx1ZSBpbiB2YXJpYWJsZSAocmFkaW8gYnV0dG9ucylcbi8vIFExIGluZm8gLT4gQ29ja3RhaWxEQiBiYXNlXG4vLyAgICAgLSBmaWx0ZXIgY29ja3RhaWwgZGF0YSBiYXNlZCBvbiBtYWluIGluZ3JlZGllbnRcbi8vIFEyIGluZm8gLT4gTW92aWVzREIgZ2VucmVcbi8vICAgICAtIGNyZWF0ZSBhcnJheSBvZiByZXR1cm5lZCBkYXRhXG4vLyBRMyBpbmZvIC0+IE1vdmllc0RCIHJhdGluZ3Ncbi8vICAgICAtIGZpbHRlciBtb3ZpZSBhcnJheSBiYXNlZCBvbiByYXRpbmdzXG4vLyBRNCBpbmZvIC0+IENvY2t0YWlsREIgYWxjaG9saWMvbm9uLWFsY29ob2xpY1xuLy8gICAgIC0gY3JlYXRlIGFycmF5IG9mIHJldHVybmVkIGRhdGFcbi8vIFVzZSByYW5kb20gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgcmVzdWx0cyBmcm9tIHRoZSBtb3ZpZXMgYW5kIHRoZSBjb2NrdGFpbCBhcnJheVxuLy8gRGlzcGxheSBpbmZvcm1hdGlvbiBvbiBwYWdlIHdpdGgganF1ZXJ5XG4vLyBPbiBjbGljayBvZiBcImdlbmVyYXRlIGFub3RoZXJcIiwgdXNlIHJhbmRvbSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBuZXcgcmVzdWx0XG4vLyBPbiBjbGljayBvZiBcImdlbmVyYXRlIG5ldyBkYXRlXCIgdGFrZSB1c2VyIGJhY2sgdG8gcXVlc3Rpb25zIHBhZ2VcblxuLy8gbWFpbiBhcHAgb2JqZWN0XG5jb25zdCBhcHAgPSB7fTtcbmFwcC5zdWJtaXQgPSAkKCcjc3VibWl0Jyk7XG5cbi8vIG1vdmllc0RCIHByb3BlcnRpZXNcbmFwcC5tb3ZpZXNCYXNlVVJMID0gJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMnO1xuYXBwLm1vdmllc0ltYWdlVVJMID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wLyc7XG5hcHAubW92aWVzSW1hZ2VXaWR0aCA9ICd3MTg1JztcbmFwcC5tb3ZpZXNBUElLZXkgPSAnMGYwNzQ5ODJmMGU2YTk5OWQ1OTg2NWRmZjIxODRlODYnO1xuYXBwLm1vdmllUGFnZTtcbmFwcC5tb3ZpZXNHZW5yZUlEcyA9IHtcbiAgICBjb252bzogWzgwLCA5OSwgOTY0OF0sXG4gICAgbGF1Z2hzOiBbMzUsIDEyLCAxOCwgMTA3NTFdLFxuICAgIGN1ZGRsZXM6IFsyNywgMTA3NDksIDUzXVxufTtcblxuLy8gY29ja3RhaWwgcHJvcGVydGllc1xuYXBwLmNvY2t0YWlsQmFzZVVSTCA9ICdodHRwczovL3d3dy50aGVjb2NrdGFpbGRiLmNvbS9hcGkvanNvbi92MS8xLyc7XG4vLyBhcHAuY29ja3RhaWxTZWFyY2hBbGMgPSBbJ2ZpbHRlci5waHA/YT1Ob25fQWxjb2hvbGljJywnZmlsdGVyLnBocD9hPUFsY29ob2xpYyddO1xuLy8gYXBwLmNvY2t0YWlsRmlsdGVySW5ncmVkaWVudCA9IGBmaWx0ZXIucGhwP2k9JHtkcmlua0luZ3JlZGllbnR9YDtcbi8vIGFwcC5jb2t0YWlsU2VhcmNoSWQgPSBgbG9va3VwLnBocD9pPSR7ZHJpbmtJZH1gO1xuYXBwLmNvY2t0YWlsQ2F0ZWdvcnkgPSB7XG4gICAgQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJ1dpbmUnLCAnR2luJywgJ0JyYW5keSddLFxuICAgICAgICBmcmllbmRzOiBbJ1RlcXVpbGEnLCAnVm9ka2EnLCAnUnVtJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydXaGlza2V5JywgJ1J1bSddXG4gICAgfSxcbiAgICBOb25fQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJ0Zsb2F0JywgJ0NvY2t0YWlsJywgJ1NoYWtlJ10sXG4gICAgICAgIGZyaWVuZHM6IFsnTWlsaycsICdPdGhlci9Vbmtub3duJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydDb2ZmZWUnLCAnVGVhJ11cbiAgICB9XG59XG5cblxuLy8gUFNFVURPXG5cbi8vIGdldCBkcmluayBieSBhbGMvbm9uZSBhbGNcbi8vIGFwcC5nZXRDb2NrdGFpbCgnZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWMnKTtcblxuLy8gZmlsdGVyIHJlc3VsdHMgYnkgc3RyQ2F0ZWdvcnlcblxuLy8gZ2V0IGFuIElEIGZyb20gYSByYW5kb20gZHJpbmsgXG4vLyByZXRyaWV2ZSB0aGUgaWQgLSByZXNbcmFuZG9tSW5kZXhdLmlkRHJpbmtcblxuLy8gc2VhcmNoIGZvciB0aGUgZHJpbmsgYmFzZWQgb24gSURcbi8vIGFwcC5nZXRDb2NrdGFpbChgbG9va3VwLnBocD9pPSR7ZHJpbmtJZH1gKTtcblxuLy8gZGlzcGxheSB0aGUgbmFtZSAtIHN0ckRyaW5rXG4vLyBkaXNwbGF5IHRoZSBpbmdyZWRpZW50cyAtIHN0ckluZ3JlZGllbnQxLXhcbi8vIGRpc3BsYXkgdGhlIG1lYXN1cmVtZW50cyAtIHN0ck1lYXN1cmUxLXhcbi8vIGRpc3BsYXkgaW5zdHJ1Y3Rpb25zIC0gc3RySW5zdHJ1Y3Rpb25zXG5cbi8vIGFwcC5nZXRNb3ZpZXModXNlckdlbnJlLCB1c2VyUmF0aW5nKTtcbi8vIHJlcXVlc3RpbmcgbW92aWUgaW5mbyBmcm9tIG1vdmllc0RCIEFQSVxuYXBwLmdldE1vdmllcyA9ICh1c2VyR2VucmUsIHVzZXJSYXRpbmcpID0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgIHNvcnRfYnk6ICd2b3RlX2F2ZXJhZ2UuZGVzYycsXG4gICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nIC8vIHJhdGluZyA+PSB1c2VyUmF0aW5nXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgdG90YWxQYWdlcyA9IHJlcy50b3RhbF9wYWdlcztcbiAgICAgICAgY29uc3QgbmV3UGFnZU51bWJlciA9IGFwcC5nZXRSYW5kTnVtKHRvdGFsUGFnZXMpKzE7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICAgICAgc29ydF9ieTogJ3ZvdGVfYXZlcmFnZS5kZXNjJyxcbiAgICAgICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZywgLy8gcmF0aW5nID08IHVzZXJSYXRpbmdcbiAgICAgICAgICAgICAgICBwYWdlOiBuZXdQYWdlTnVtYmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gb24gcmFuZG9tIHBhZ2VcbiAgICAgICAgICAgIGNvbnN0IG1vdmllID0gcmVzLnJlc3VsdHNbYXBwLmdldFJhbmROdW0oMjApXVxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuXG4gICAgICAgICAgICAvLyBwdXQgbW92aWUgaW50byBIVE1MXG4gICAgICAgICAgICBhcHAuZGlzcGxheU1vdmllKG1vdmllKTtcbiAgICAgICAgfSlcbiAgICB9KVxufTtcblxuXG5cblxuXG5hcHAuZ2V0Q29ja3RhaWwgPSAoc2VhcmNoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtzZWFyY2h9YCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcyk9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3MpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuZHJpbmtzLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKSk7XG4gICAgICAgIGFwcC5yYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgbmV3U2VhcmNoID0gYGZpbHRlci5waHA/aT1XaW5lYFxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtuZXdTZWFyY2h9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcHAucmFuZG9tRHJpbmtOdW1iZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZHJpbmtzWzJdKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbMl0uaWREcmluayk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuXG4gICAgfSlcbn1cblxuLy8gcmV0dXJuIHJhbmRvbSBudW1iZXJcbmFwcC5nZXRSYW5kTnVtID0gKG51bSkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pO1xufVxuXG5hcHAuZGlzcGxheU1vdmllID0gKG1vdmllKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBtb3ZpZS50aXRsZTtcbiAgICBjb25zdCBpbWdVcmwgPSBtb3ZpZS5wb3N0ZXJfcGF0aDtcbiAgICBjb25zdCByYXRpbmcgPSBtb3ZpZS52b3RlX2F2ZXJhZ2U7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmFwcGVuZChgXG4gICAgICAgIDxoMz4ke3RpdGxlfTwvaDM+XG4gICAgICAgIDxpbWcgc3JjPVwiJHthcHAubW92aWVzSW1hZ2VVUkwgK2FwcC5tb3ZpZXNJbWFnZVdpZHRoICsgaW1nVXJsfVwiPlxuICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJhdGluZ1wiPiR7cmF0aW5nfTwvcD5cbiAgICBgKTtcbn1cblxuYXBwLmV2ZW50cyA9ICgpID0+IHtcbiAgICAkKCcjc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGdlbnJlQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWdlbnJlXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXhNYXggPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV0ubGVuZ3RoO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4ID0gYXBwLmdldFJhbmROdW0oZ2VucmVJbmRleE1heCk7XG5cbiAgICAgICAgYXBwLnVzZXJHZW5yZSA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XVtnZW5yZUluZGV4XTtcbiAgICAgICAgYXBwLnVzZXJSYXRpbmcgPSBwYXJzZUludCgkKCdpbnB1dFtuYW1lPXJhdGluZ106Y2hlY2tlZCcpLnZhbCgpKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG5cbiAgICAgICAgLy9jb2NrdGFpbCBhcGlcbiAgICAgICAgY29uc3QgYWxjaG9saWMgPSAkKCdpbnB1dFtuYW1lPWFsY29ob2xdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Y2F0ZWdvcnldOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtBcnJheSA9IGFwcC5jb2NrdGFpbENhdGVnb3J5W2FsY2hvbGljXVtkcmlua0NhdGVnb3J5XTtcbiAgICAgICAgY29uc3QgZHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShkcmlua0FycmF5Lmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGRyaW5rVHlwZSA9IGRyaW5rQXJyYXlbZHJpbmtOdW1iZXJdO1xuICAgICAgICBcbiAgICAgICAgLy8gZ2V0IGFycmF5IG9mIGRyaW5rcyBieSB0eXBlIC0gd2luZS9zaGFrZS9ldGNcbiAgICAgICAgYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9JHtkcmlua1R5cGV9YCk7XG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxufTtcblxuLy8gaW5pdCBmdW5jdGlvblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gICAgXG5cbiAgICBhcHAuZXZlbnRzKCk7XG59XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJyZWFkeVwiKTtcbiAgICBhcHAuaW5pdCgpO1xufSkiXX0=
