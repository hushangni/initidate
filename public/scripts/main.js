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
    // testing genre: action and userRating: 8 and below
    // there are specific filters(end points) depending on ingredients/etc
    // app.getCocktail('filter.php?i=Vodka');
    // app.getCocktail('lookup.php?i=13060');
    // app.getCocktail('filter.php?a=Non_Alcoholic');
    // app.getCocktail('lookup.php?i=12560');
    // app.getCocktail('lookup.php?i=12654');
    // app.getCocktail('lookup.php?i=12770');
    app.getCocktail('lookup.php?i=12720');

    app.events();
};

$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFJLE1BQUosR0FBYSxFQUFFLFNBQUYsQ0FBYjs7QUFFQTtBQUNBLElBQUksYUFBSixHQUFvQiw4QkFBcEI7QUFDQSxJQUFJLGNBQUosR0FBcUIsNkJBQXJCO0FBQ0EsSUFBSSxnQkFBSixHQUF1QixNQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixrQ0FBbkI7QUFDQSxJQUFJLFNBQUo7QUFDQSxJQUFJLGNBQUosR0FBcUI7QUFDakIsV0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsSUFBVCxDQURVO0FBRWpCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlM7QUFHakIsYUFBUyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksRUFBWjtBQUhRLENBQXJCOztBQU1BO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLDhDQUF0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQUosR0FBdUI7QUFDbkIsZUFBVztBQUNQLGVBQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixRQUFoQixDQURBO0FBRVAsaUJBQVMsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixLQUFyQixDQUZGO0FBR1Asc0JBQWMsQ0FBQyxTQUFELEVBQVksS0FBWjtBQUhQLEtBRFE7QUFNbkIsbUJBQWU7QUFDWCxlQUFPLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsT0FBdEIsQ0FESTtBQUVYLGlCQUFTLENBQUMsTUFBRCxFQUFTLGVBQVQsQ0FGRTtBQUdYLHNCQUFjLENBQUMsUUFBRCxFQUFXLEtBQVg7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QyxHQUFoQyxFQUFULENBQWpCO0FBQ0EsWUFBSSxTQUFKLENBQWMsSUFBSSxTQUFsQixFQUE2QixJQUFJLFVBQWpDOztBQUVBO0FBQ0EsWUFBTSxXQUFXLEVBQUUsNkJBQUYsRUFBaUMsR0FBakMsRUFBakI7QUFDQSxZQUFNLGdCQUFnQixFQUFFLDhCQUFGLEVBQWtDLEdBQWxDLEVBQXRCO0FBQ0EsWUFBTSxhQUFhLElBQUksZ0JBQUosQ0FBcUIsUUFBckIsRUFBK0IsYUFBL0IsQ0FBbkI7QUFDQSxZQUFNLGNBQWMsSUFBSSxVQUFKLENBQWUsV0FBVyxNQUExQixDQUFwQjtBQUNBLFlBQU0sWUFBWSxXQUFXLFdBQVgsQ0FBbEI7O0FBRUE7QUFDQSxZQUFJLFdBQUosbUJBQWdDLFNBQWhDO0FBQ0gsS0FuQkQ7O0FBcUJBLE1BQUUsZ0JBQUYsRUFBb0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBUyxDQUFULEVBQVk7QUFDeEMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxTQUFKLENBQWMsSUFBSSxTQUFsQixFQUE2QixJQUFJLFVBQWpDO0FBQ0gsS0FIRDtBQUlILENBMUJEOztBQTRCQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxXQUFKLENBQWdCLG9CQUFoQjs7QUFFQSxRQUFJLE1BQUo7QUFDSCxDQVpEOztBQWNBLEVBQUUsWUFBVztBQUNULFlBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxRQUFJLElBQUo7QUFDSCxDQUhEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gT24gY2xpY2sgb2YgXCJiZWdpblwiIGJ1dHRvbiwgaGlkZSBsYW5kaW5nIHBhZ2Vcbi8vIEJhc2VkIG9uIHVzZXIgaW5wdXQsIHN0b3JlIGlucHV0IHZhbHVlIGluIHZhcmlhYmxlIChyYWRpbyBidXR0b25zKVxuLy8gUTEgaW5mbyAtPiBDb2NrdGFpbERCIGJhc2Vcbi8vICAgICAtIGZpbHRlciBjb2NrdGFpbCBkYXRhIGJhc2VkIG9uIG1haW4gaW5ncmVkaWVudFxuLy8gUTIgaW5mbyAtPiBNb3ZpZXNEQiBnZW5yZVxuLy8gICAgIC0gY3JlYXRlIGFycmF5IG9mIHJldHVybmVkIGRhdGFcbi8vIFEzIGluZm8gLT4gTW92aWVzREIgcmF0aW5nc1xuLy8gICAgIC0gZmlsdGVyIG1vdmllIGFycmF5IGJhc2VkIG9uIHJhdGluZ3Ncbi8vIFE0IGluZm8gLT4gQ29ja3RhaWxEQiBhbGNob2xpYy9ub24tYWxjb2hvbGljXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gVXNlIHJhbmRvbSBmdW5jdGlvbiB0byBnZW5lcmF0ZSByZXN1bHRzIGZyb20gdGhlIG1vdmllcyBhbmQgdGhlIGNvY2t0YWlsIGFycmF5XG4vLyBEaXNwbGF5IGluZm9ybWF0aW9uIG9uIHBhZ2Ugd2l0aCBqcXVlcnlcbi8vIE9uIGNsaWNrIG9mIFwiZ2VuZXJhdGUgYW5vdGhlclwiLCB1c2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIG5ldyByZXN1bHRcbi8vIE9uIGNsaWNrIG9mIFwiZ2VuZXJhdGUgbmV3IGRhdGVcIiB0YWtlIHVzZXIgYmFjayB0byBxdWVzdGlvbnMgcGFnZVxuXG4vLyBtYWluIGFwcCBvYmplY3RcbmNvbnN0IGFwcCA9IHt9O1xuYXBwLnN1Ym1pdCA9ICQoJyNzdWJtaXQnKTtcblxuLy8gbW92aWVzREIgcHJvcGVydGllc1xuYXBwLm1vdmllc0Jhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMyc7XG5hcHAubW92aWVzSW1hZ2VVUkwgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvJztcbmFwcC5tb3ZpZXNJbWFnZVdpZHRoID0gJ3cxODUnO1xuYXBwLm1vdmllc0FQSUtleSA9ICcwZjA3NDk4MmYwZTZhOTk5ZDU5ODY1ZGZmMjE4NGU4Nic7XG5hcHAubW92aWVQYWdlO1xuYXBwLm1vdmllc0dlbnJlSURzID0ge1xuICAgIGNvbnZvOiBbODAsIDk5LCA5NjQ4XSxcbiAgICBsYXVnaHM6IFszNSwgMTIsIDE4LCAxMDc1MV0sXG4gICAgY3VkZGxlczogWzI3LCAxMDc0OSwgNTNdXG59O1xuXG4vLyBjb2NrdGFpbCBwcm9wZXJ0aWVzXG5hcHAuY29ja3RhaWxCYXNlVVJMID0gJ2h0dHBzOi8vd3d3LnRoZWNvY2t0YWlsZGIuY29tL2FwaS9qc29uL3YxLzEvJztcbi8vIGFwcC5jb2NrdGFpbFNlYXJjaEFsYyA9IFsnZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWMnLCdmaWx0ZXIucGhwP2E9QWxjb2hvbGljJ107XG4vLyBhcHAuY29ja3RhaWxGaWx0ZXJJbmdyZWRpZW50ID0gYGZpbHRlci5waHA/aT0ke2RyaW5rSW5ncmVkaWVudH1gO1xuLy8gYXBwLmNva3RhaWxTZWFyY2hJZCA9IGBsb29rdXAucGhwP2k9JHtkcmlua0lkfWA7XG5hcHAuY29ja3RhaWxDYXRlZ29yeSA9IHtcbiAgICBBbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnV2luZScsICdHaW4nLCAnQnJhbmR5J10sXG4gICAgICAgIGZyaWVuZHM6IFsnVGVxdWlsYScsICdWb2RrYScsICdSdW0nXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ1doaXNrZXknLCAnUnVtJ11cbiAgICB9LFxuICAgIE5vbl9BbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnRmxvYXQnLCAnQ29ja3RhaWwnLCAnU2hha2UnXSxcbiAgICAgICAgZnJpZW5kczogWydNaWxrJywgJ090aGVyL1Vua25vd24nXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ0NvZmZlZScsICdUZWEnXVxuICAgIH1cbn1cblxuXG4vLyBQU0VVRE9cblxuLy8gZ2V0IGRyaW5rIGJ5IGFsYy9ub25lIGFsY1xuLy8gYXBwLmdldENvY2t0YWlsKCdmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpYycpO1xuXG4vLyBmaWx0ZXIgcmVzdWx0cyBieSBzdHJDYXRlZ29yeVxuXG4vLyBnZXQgYW4gSUQgZnJvbSBhIHJhbmRvbSBkcmluayBcbi8vIHJldHJpZXZlIHRoZSBpZCAtIHJlc1tyYW5kb21JbmRleF0uaWREcmlua1xuXG4vLyBzZWFyY2ggZm9yIHRoZSBkcmluayBiYXNlZCBvbiBJRFxuLy8gYXBwLmdldENvY2t0YWlsKGBsb29rdXAucGhwP2k9JHtkcmlua0lkfWApO1xuXG4vLyBkaXNwbGF5IHRoZSBuYW1lIC0gc3RyRHJpbmtcbi8vIGRpc3BsYXkgdGhlIGluZ3JlZGllbnRzIC0gc3RySW5ncmVkaWVudDEteFxuLy8gZGlzcGxheSB0aGUgbWVhc3VyZW1lbnRzIC0gc3RyTWVhc3VyZTEteFxuLy8gZGlzcGxheSBpbnN0cnVjdGlvbnMgLSBzdHJJbnN0cnVjdGlvbnNcblxuLy8gYXBwLmdldE1vdmllcyh1c2VyR2VucmUsIHVzZXJSYXRpbmcpO1xuLy8gcmVxdWVzdGluZyBtb3ZpZSBpbmZvIGZyb20gbW92aWVzREIgQVBJXG5hcHAuZ2V0TW92aWVzID0gKHVzZXJHZW5yZSwgdXNlclJhdGluZykgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgICAgc29ydF9ieTogJ3ZvdGVfYXZlcmFnZS5kZXNjJyxcbiAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcgLy8gcmF0aW5nID49IHVzZXJSYXRpbmdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbFBhZ2VzID0gcmVzLnRvdGFsX3BhZ2VzO1xuICAgICAgICBjb25zdCBuZXdQYWdlTnVtYmVyID0gYXBwLmdldFJhbmROdW0odG90YWxQYWdlcykrMTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgICAgICBzb3J0X2J5OiAndm90ZV9hdmVyYWdlLmRlc2MnLFxuICAgICAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nLCAvLyByYXRpbmcgPTwgdXNlclJhdGluZ1xuICAgICAgICAgICAgICAgIHBhZ2U6IG5ld1BhZ2VOdW1iZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBvbiByYW5kb20gcGFnZVxuICAgICAgICAgICAgY29uc3QgbW92aWUgPSByZXMucmVzdWx0c1thcHAuZ2V0UmFuZE51bSgyMCldXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XG5cbiAgICAgICAgICAgIC8vIHB1dCBtb3ZpZSBpbnRvIEhUTUxcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5TW92aWUobW92aWUpO1xuICAgICAgICB9KVxuICAgIH0pXG59O1xuXG5cblxuXG5cbmFwcC5nZXRDb2NrdGFpbCA9IChzZWFyY2gpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke3NlYXJjaH1gLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgIH0pXG59XG5cbi8vIHJldHVybiByYW5kb20gbnVtYmVyXG5hcHAuZ2V0UmFuZE51bSA9IChudW0pID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKTtcbn1cblxuYXBwLmRpc3BsYXlNb3ZpZSA9IChtb3ZpZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gbW92aWUudGl0bGU7XG4gICAgY29uc3QgaW1nVXJsID0gbW92aWUucG9zdGVyX3BhdGg7XG4gICAgY29uc3QgcmF0aW5nID0gbW92aWUudm90ZV9hdmVyYWdlO1xuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5lbXB0eSgpO1xuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5hcHBlbmQoYFxuICAgICAgICA8aDM+JHt0aXRsZX08L2gzPlxuICAgICAgICA8aW1nIHNyYz1cIiR7YXBwLm1vdmllc0ltYWdlVVJMICthcHAubW92aWVzSW1hZ2VXaWR0aCArIGltZ1VybH1cIj5cbiAgICAgICAgPHAgY2xhc3M9XCJtb3ZpZS1yYXRpbmdcIj4ke3JhdGluZ308L3A+XG4gICAgYCk7XG59XG5cbmFwcC5ldmVudHMgPSAoKSA9PiB7XG4gICAgJCgnI3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBnZW5yZUNhdGVnb3J5ID0gJCgnaW5wdXRbbmFtZT1nZW5yZV06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4TWF4ID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleCA9IGFwcC5nZXRSYW5kTnVtKGdlbnJlSW5kZXhNYXgpO1xuXG4gICAgICAgIGFwcC51c2VyR2VucmUgPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV1bZ2VucmVJbmRleF07XG4gICAgICAgIGFwcC51c2VyUmF0aW5nID0gcGFyc2VJbnQoJCgnaW5wdXRbbmFtZT1yYXRpbmddOmNoZWNrZWQnKS52YWwoKSk7XG4gICAgICAgIGFwcC5nZXRNb3ZpZXMoYXBwLnVzZXJHZW5yZSwgYXBwLnVzZXJSYXRpbmcpO1xuXG4gICAgICAgIC8vY29ja3RhaWwgYXBpXG4gICAgICAgIGNvbnN0IGFsY2hvbGljID0gJCgnaW5wdXRbbmFtZT1hbGNvaG9sXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWNhdGVnb3J5XTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQXJyYXkgPSBhcHAuY29ja3RhaWxDYXRlZ29yeVthbGNob2xpY11bZHJpbmtDYXRlZ29yeV07XG4gICAgICAgIGNvbnN0IGRyaW5rTnVtYmVyID0gYXBwLmdldFJhbmROdW0oZHJpbmtBcnJheS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBkcmlua1R5cGUgPSBkcmlua0FycmF5W2RyaW5rTnVtYmVyXTtcbiAgICAgICAgXG4gICAgICAgIC8vIGdldCBhcnJheSBvZiBkcmlua3MgYnkgdHlwZSAtIHdpbmUvc2hha2UvZXRjXG4gICAgICAgIGFwcC5nZXRDb2NrdGFpbChgZmlsdGVyLnBocD9pPSR7ZHJpbmtUeXBlfWApO1xuICAgIH0pO1xuXG4gICAgJCgnLmFub3RoZXItbW92aWUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG4gICAgfSlcbn07XG5cbi8vIGluaXQgZnVuY3Rpb25cbmFwcC5pbml0ID0gKCkgPT4ge1xuICAgIC8vIHRlc3RpbmcgZ2VucmU6IGFjdGlvbiBhbmQgdXNlclJhdGluZzogOCBhbmQgYmVsb3dcbiAgICAvLyB0aGVyZSBhcmUgc3BlY2lmaWMgZmlsdGVycyhlbmQgcG9pbnRzKSBkZXBlbmRpbmcgb24gaW5ncmVkaWVudHMvZXRjXG4gICAgLy8gYXBwLmdldENvY2t0YWlsKCdmaWx0ZXIucGhwP2k9Vm9ka2EnKTtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoJ2xvb2t1cC5waHA/aT0xMzA2MCcpO1xuICAgIC8vIGFwcC5nZXRDb2NrdGFpbCgnZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWMnKTtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoJ2xvb2t1cC5waHA/aT0xMjU2MCcpO1xuICAgIC8vIGFwcC5nZXRDb2NrdGFpbCgnbG9va3VwLnBocD9pPTEyNjU0Jyk7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKCdsb29rdXAucGhwP2k9MTI3NzAnKTtcbiAgICBhcHAuZ2V0Q29ja3RhaWwoJ2xvb2t1cC5waHA/aT0xMjcyMCcpO1xuXG4gICAgYXBwLmV2ZW50cygpO1xufVxuXG4kKGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVhZHlcIik7XG4gICAgYXBwLmluaXQoKTtcbn0pIl19
