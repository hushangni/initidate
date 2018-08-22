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

// app.getMovies(userGenre, userRating);
// requesting movie info from moviesDB API
app.getMovies = function (userGenre, userRating) {
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
        url: 'https://www.thecocktaildb.com/api/json/v1/1/' + search,
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
    app.getCocktail('filter.php?a=Non_Alcoholic');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFJLE1BQUosR0FBYSxFQUFFLFNBQUYsQ0FBYjs7QUFFQTtBQUNBLElBQUksYUFBSixHQUFvQiw4QkFBcEI7QUFDQSxJQUFJLGNBQUosR0FBcUIsNkJBQXJCO0FBQ0EsSUFBSSxnQkFBSixHQUF1QixNQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixrQ0FBbkI7QUFDQSxJQUFJLFNBQUo7QUFDQSxJQUFJLGNBQUosR0FBcUI7QUFDakIsV0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsSUFBVCxDQURVO0FBRWpCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlM7QUFHakIsYUFBUyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksRUFBWjtBQUhRLENBQXJCOztBQU1BO0FBQ0E7QUFDQSxJQUFJLFNBQUosR0FBZ0IsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN2QyxNQUFFLElBQUYsQ0FBTztBQUNILGFBQVEsSUFBSSxhQUFaLG9CQURHO0FBRUgsZ0JBQVEsS0FGTDtBQUdILGtCQUFVLE1BSFA7QUFJSCxjQUFNO0FBQ0YscUJBQVMsSUFBSSxZQURYO0FBRUYsc0JBQVUsT0FGUjtBQUdGLHFCQUFTLG1CQUhQO0FBSUYseUJBQWEsU0FKWCxFQUlzQjtBQUN4QixnQ0FBb0IsVUFMbEIsQ0FLNkI7QUFMN0I7QUFKSCxLQUFQLEVBV0csSUFYSCxDQVdRLFVBQUMsR0FBRCxFQUFTO0FBQ2IsWUFBTSxhQUFhLElBQUksV0FBdkI7QUFDQSxZQUFNLGdCQUFnQixJQUFJLFVBQUosQ0FBZSxVQUFmLElBQTJCLENBQWpEOztBQUVBLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQVEsSUFBSSxhQUFaLG9CQURHO0FBRUgsb0JBQVEsS0FGTDtBQUdILHNCQUFVLE1BSFA7QUFJSCxrQkFBTTtBQUNGLHlCQUFTLElBQUksWUFEWDtBQUVGLDBCQUFVLE9BRlI7QUFHRix5QkFBUyxtQkFIUDtBQUlGLDZCQUFhLFNBSlgsRUFJc0I7QUFDeEIsb0NBQW9CLFVBTGxCLEVBSzhCO0FBQ2hDLHNCQUFNO0FBTko7QUFKSCxTQUFQLEVBWUcsSUFaSCxDQVlRLFVBQUMsR0FBRCxFQUFTO0FBQ2I7QUFDQSxnQkFBTSxRQUFRLElBQUksT0FBSixDQUFZLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBWixDQUFkO0FBQ0Esb0JBQVEsR0FBUixDQUFZLEtBQVo7O0FBRUE7QUFDQSxnQkFBSSxZQUFKLENBQWlCLEtBQWpCO0FBQ0gsU0FuQkQ7QUFvQkgsS0FuQ0Q7QUFvQ0gsQ0FyQ0Q7O0FBMkNBLElBQUksV0FBSixHQUFrQixVQUFDLE1BQUQsRUFBVztBQUN6QixNQUFFLElBQUYsQ0FBTztBQUNILDhEQUFvRCxNQURqRDtBQUVILGdCQUFRLEtBRkw7QUFHSCxrQkFBVSxNQUhQO0FBSUgsY0FBTTtBQUNGLGlCQUFLO0FBREg7QUFKSCxLQUFQLEVBT0csSUFQSCxDQU9RLFVBQUMsR0FBRCxFQUFRO0FBQ1osZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFFSCxLQVZEO0FBV0gsQ0FaRDs7QUFjQTtBQUNBLElBQUksVUFBSixHQUFpQixVQUFDLEdBQUQsRUFBUztBQUN0QixXQUFPLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixHQUEzQixDQUFQO0FBQ0gsQ0FGRDs7QUFJQSxJQUFJLFlBQUosR0FBbUIsVUFBQyxLQUFELEVBQVc7QUFDMUIsUUFBTSxRQUFRLE1BQU0sS0FBcEI7QUFDQSxRQUFNLFNBQVMsTUFBTSxXQUFyQjtBQUNBLFFBQU0sU0FBUyxNQUFNLFlBQXJCO0FBQ0EsTUFBRSwyQkFBRixFQUErQixLQUEvQjtBQUNBLE1BQUUsMkJBQUYsRUFBK0IsTUFBL0Isb0JBQ1UsS0FEVixrQ0FFZ0IsSUFBSSxjQUFKLEdBQW9CLElBQUksZ0JBQXhCLEdBQTJDLE1BRjNELDZDQUc4QixNQUg5QjtBQUtILENBVkQ7O0FBWUEsSUFBSSxNQUFKLEdBQWEsWUFBTTtBQUNmLE1BQUUsU0FBRixFQUFhLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsVUFBUyxDQUFULEVBQVk7QUFDakMsVUFBRSxjQUFGO0FBQ0EsWUFBTSxnQkFBZ0IsRUFBRSwyQkFBRixFQUErQixHQUEvQixFQUF0QjtBQUNBLFlBQU0sZ0JBQWdCLElBQUksY0FBSixDQUFtQixhQUFuQixFQUFrQyxNQUF4RDtBQUNBLFlBQU0sYUFBYSxJQUFJLFVBQUosQ0FBZSxhQUFmLENBQW5COztBQUVBLFlBQUksU0FBSixHQUFnQixJQUFJLGNBQUosQ0FBbUIsYUFBbkIsRUFBa0MsVUFBbEMsQ0FBaEI7QUFDQSxZQUFJLFVBQUosR0FBaUIsU0FBUyxFQUFFLDRCQUFGLEVBQWdDLEdBQWhDLEVBQVQsQ0FBakI7QUFDQSxZQUFJLFNBQUosQ0FBYyxJQUFJLFNBQWxCLEVBQTZCLElBQUksVUFBakM7QUFDSCxLQVREOztBQVdBLE1BQUUsZ0JBQUYsRUFBb0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBUyxDQUFULEVBQVk7QUFDeEMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxTQUFKLENBQWMsSUFBSSxTQUFsQixFQUE2QixJQUFJLFVBQWpDO0FBQ0gsS0FIRDtBQUlILENBaEJEOztBQWtCQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUksV0FBSixDQUFnQiw0QkFBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLFdBQUosQ0FBZ0Isb0JBQWhCOztBQUVBLFFBQUksTUFBSjtBQUNILENBWkQ7O0FBY0EsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBPbiBjbGljayBvZiBcImJlZ2luXCIgYnV0dG9uLCBoaWRlIGxhbmRpbmcgcGFnZVxuLy8gQmFzZWQgb24gdXNlciBpbnB1dCwgc3RvcmUgaW5wdXQgdmFsdWUgaW4gdmFyaWFibGUgKHJhZGlvIGJ1dHRvbnMpXG4vLyBRMSBpbmZvIC0+IENvY2t0YWlsREIgYmFzZVxuLy8gICAgIC0gZmlsdGVyIGNvY2t0YWlsIGRhdGEgYmFzZWQgb24gbWFpbiBpbmdyZWRpZW50XG4vLyBRMiBpbmZvIC0+IE1vdmllc0RCIGdlbnJlXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gUTMgaW5mbyAtPiBNb3ZpZXNEQiByYXRpbmdzXG4vLyAgICAgLSBmaWx0ZXIgbW92aWUgYXJyYXkgYmFzZWQgb24gcmF0aW5nc1xuLy8gUTQgaW5mbyAtPiBDb2NrdGFpbERCIGFsY2hvbGljL25vbi1hbGNvaG9saWNcbi8vICAgICAtIGNyZWF0ZSBhcnJheSBvZiByZXR1cm5lZCBkYXRhXG4vLyBVc2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJlc3VsdHMgZnJvbSB0aGUgbW92aWVzIGFuZCB0aGUgY29ja3RhaWwgYXJyYXlcbi8vIERpc3BsYXkgaW5mb3JtYXRpb24gb24gcGFnZSB3aXRoIGpxdWVyeVxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBhbm90aGVyXCIsIHVzZSByYW5kb20gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbmV3IHJlc3VsdFxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBuZXcgZGF0ZVwiIHRha2UgdXNlciBiYWNrIHRvIHF1ZXN0aW9ucyBwYWdlXG5cbi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5hcHAuc3VibWl0ID0gJCgnI3N1Ym1pdCcpO1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNJbWFnZVVSTCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xuYXBwLm1vdmllc0ltYWdlV2lkdGggPSAndzE4NSc7XG5hcHAubW92aWVzQVBJS2V5ID0gJzBmMDc0OTgyZjBlNmE5OTlkNTk4NjVkZmYyMTg0ZTg2JztcbmFwcC5tb3ZpZVBhZ2U7XG5hcHAubW92aWVzR2VucmVJRHMgPSB7XG4gICAgY29udm86IFs4MCwgOTksIDk2NDhdLFxuICAgIGxhdWdoczogWzM1LCAxMiwgMTgsIDEwNzUxXSxcbiAgICBjdWRkbGVzOiBbMjcsIDEwNzQ5LCA1M11cbn07XG5cbi8vIGFwcC5nZXRNb3ZpZXModXNlckdlbnJlLCB1c2VyUmF0aW5nKTtcbi8vIHJlcXVlc3RpbmcgbW92aWUgaW5mbyBmcm9tIG1vdmllc0RCIEFQSVxuYXBwLmdldE1vdmllcyA9ICh1c2VyR2VucmUsIHVzZXJSYXRpbmcpID0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgIHNvcnRfYnk6ICd2b3RlX2F2ZXJhZ2UuZGVzYycsXG4gICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nIC8vIHJhdGluZyA+PSB1c2VyUmF0aW5nXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgdG90YWxQYWdlcyA9IHJlcy50b3RhbF9wYWdlcztcbiAgICAgICAgY29uc3QgbmV3UGFnZU51bWJlciA9IGFwcC5nZXRSYW5kTnVtKHRvdGFsUGFnZXMpKzE7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICAgICAgc29ydF9ieTogJ3ZvdGVfYXZlcmFnZS5kZXNjJyxcbiAgICAgICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZywgLy8gcmF0aW5nID08IHVzZXJSYXRpbmdcbiAgICAgICAgICAgICAgICBwYWdlOiBuZXdQYWdlTnVtYmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gb24gcmFuZG9tIHBhZ2VcbiAgICAgICAgICAgIGNvbnN0IG1vdmllID0gcmVzLnJlc3VsdHNbYXBwLmdldFJhbmROdW0oMjApXVxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuXG4gICAgICAgICAgICAvLyBwdXQgbW92aWUgaW50byBIVE1MXG4gICAgICAgICAgICBhcHAuZGlzcGxheU1vdmllKG1vdmllKTtcbiAgICAgICAgfSlcbiAgICB9KVxufTtcblxuXG5cblxuXG5hcHAuZ2V0Q29ja3RhaWwgPSAoc2VhcmNoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGBodHRwczovL3d3dy50aGVjb2NrdGFpbGRiLmNvbS9hcGkvanNvbi92MS8xLyR7c2VhcmNofWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgfSlcbn1cblxuLy8gcmV0dXJuIHJhbmRvbSBudW1iZXJcbmFwcC5nZXRSYW5kTnVtID0gKG51bSkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pO1xufVxuXG5hcHAuZGlzcGxheU1vdmllID0gKG1vdmllKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBtb3ZpZS50aXRsZTtcbiAgICBjb25zdCBpbWdVcmwgPSBtb3ZpZS5wb3N0ZXJfcGF0aDtcbiAgICBjb25zdCByYXRpbmcgPSBtb3ZpZS52b3RlX2F2ZXJhZ2U7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmFwcGVuZChgXG4gICAgICAgIDxoMz4ke3RpdGxlfTwvaDM+XG4gICAgICAgIDxpbWcgc3JjPVwiJHthcHAubW92aWVzSW1hZ2VVUkwgK2FwcC5tb3ZpZXNJbWFnZVdpZHRoICsgaW1nVXJsfVwiPlxuICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJhdGluZ1wiPiR7cmF0aW5nfTwvcD5cbiAgICBgKTtcbn1cblxuYXBwLmV2ZW50cyA9ICgpID0+IHtcbiAgICAkKCcjc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGdlbnJlQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWdlbnJlXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXhNYXggPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV0ubGVuZ3RoO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4ID0gYXBwLmdldFJhbmROdW0oZ2VucmVJbmRleE1heCk7XG5cbiAgICAgICAgYXBwLnVzZXJHZW5yZSA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XVtnZW5yZUluZGV4XTtcbiAgICAgICAgYXBwLnVzZXJSYXRpbmcgPSBwYXJzZUludCgkKCdpbnB1dFtuYW1lPXJhdGluZ106Y2hlY2tlZCcpLnZhbCgpKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxufTtcblxuLy8gaW5pdCBmdW5jdGlvblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gICAgLy8gdGVzdGluZyBnZW5yZTogYWN0aW9uIGFuZCB1c2VyUmF0aW5nOiA4IGFuZCBiZWxvd1xuICAgIC8vIHRoZXJlIGFyZSBzcGVjaWZpYyBmaWx0ZXJzKGVuZCBwb2ludHMpIGRlcGVuZGluZyBvbiBpbmdyZWRpZW50cy9ldGNcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoJ2ZpbHRlci5waHA/aT1Wb2RrYScpO1xuICAgIC8vIGFwcC5nZXRDb2NrdGFpbCgnbG9va3VwLnBocD9pPTEzMDYwJyk7XG4gICAgYXBwLmdldENvY2t0YWlsKCdmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpYycpO1xuICAgIC8vIGFwcC5nZXRDb2NrdGFpbCgnbG9va3VwLnBocD9pPTEyNTYwJyk7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKCdsb29rdXAucGhwP2k9MTI2NTQnKTtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoJ2xvb2t1cC5waHA/aT0xMjc3MCcpO1xuICAgIGFwcC5nZXRDb2NrdGFpbCgnbG9va3VwLnBocD9pPTEyNzIwJyk7XG5cbiAgICBhcHAuZXZlbnRzKCk7XG59XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJyZWFkeVwiKTtcbiAgICBhcHAuaW5pdCgpO1xufSkiXX0=
