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

// moviesDB properties
app.moviesBaseURL = 'https://api.themoviedb.org/3';
app.moviesAPIKey = '0f074982f0e6a999d59865dff2184e86';

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
            'vote_average.lte': userRating // rating =< userRating
        }
    }).then(function (res) {
        var movieObjects = res.results;
        console.log(movieObjects);
    });
};

// init function
app.init = function () {
    // testing genre: action and userRating: 8 and below
    app.getMovies(28, 8);
};

$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxZQUFKLEdBQW1CLGtDQUFuQjs7QUFFQTtBQUNBO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLFVBQUMsU0FBRCxFQUFZLFVBQVosRUFBMkI7QUFDdkMsTUFBRSxJQUFGLENBQU87QUFDSCxhQUFRLElBQUksYUFBWixvQkFERztBQUVILGdCQUFRLEtBRkw7QUFHSCxrQkFBVSxNQUhQO0FBSUgsY0FBTTtBQUNGLHFCQUFTLElBQUksWUFEWDtBQUVGLHNCQUFVLE9BRlI7QUFHRixxQkFBUyxtQkFIUDtBQUlGLHlCQUFhLFNBSlgsRUFJc0I7QUFDeEIsZ0NBQW9CLFVBTGxCLENBSzZCO0FBTDdCO0FBSkgsS0FBUCxFQVdHLElBWEgsQ0FXUSxVQUFDLEdBQUQsRUFBUztBQUNiLFlBQU0sZUFBZSxJQUFJLE9BQXpCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLFlBQVo7QUFDSCxLQWREO0FBZUgsQ0FoQkQ7O0FBa0JBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBTTtBQUNiO0FBQ0EsUUFBSSxTQUFKLENBQWMsRUFBZCxFQUFrQixDQUFsQjtBQUNILENBSEQ7O0FBS0EsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBPbiBjbGljayBvZiBcImJlZ2luXCIgYnV0dG9uLCBoaWRlIGxhbmRpbmcgcGFnZVxuLy8gQmFzZWQgb24gdXNlciBpbnB1dCwgc3RvcmUgaW5wdXQgdmFsdWUgaW4gdmFyaWFibGUgKHJhZGlvIGJ1dHRvbnMpXG4vLyBRMSBpbmZvIC0+IENvY2t0YWlsREIgYmFzZVxuLy8gICAgIC0gZmlsdGVyIGNvY2t0YWlsIGRhdGEgYmFzZWQgb24gbWFpbiBpbmdyZWRpZW50XG4vLyBRMiBpbmZvIC0+IE1vdmllc0RCIGdlbnJlXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gUTMgaW5mbyAtPiBNb3ZpZXNEQiByYXRpbmdzXG4vLyAgICAgLSBmaWx0ZXIgbW92aWUgYXJyYXkgYmFzZWQgb24gcmF0aW5nc1xuLy8gUTQgaW5mbyAtPiBDb2NrdGFpbERCIGFsY2hvbGljL25vbi1hbGNvaG9saWNcbi8vICAgICAtIGNyZWF0ZSBhcnJheSBvZiByZXR1cm5lZCBkYXRhXG4vLyBVc2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHJlc3VsdHMgZnJvbSB0aGUgbW92aWVzIGFuZCB0aGUgY29ja3RhaWwgYXJyYXlcbi8vIERpc3BsYXkgaW5mb3JtYXRpb24gb24gcGFnZSB3aXRoIGpxdWVyeVxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBhbm90aGVyXCIsIHVzZSByYW5kb20gZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbmV3IHJlc3VsdFxuLy8gT24gY2xpY2sgb2YgXCJnZW5lcmF0ZSBuZXcgZGF0ZVwiIHRha2UgdXNlciBiYWNrIHRvIHF1ZXN0aW9ucyBwYWdlXG5cbi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5cbi8vIG1vdmllc0RCIHByb3BlcnRpZXNcbmFwcC5tb3ZpZXNCYXNlVVJMID0gJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMnO1xuYXBwLm1vdmllc0FQSUtleSA9ICcwZjA3NDk4MmYwZTZhOTk5ZDU5ODY1ZGZmMjE4NGU4Nic7XG5cbi8vIGFwcC5nZXRNb3ZpZXModXNlckdlbnJlLCB1c2VyUmF0aW5nKTtcbi8vIHJlcXVlc3RpbmcgbW92aWUgaW5mbyBmcm9tIG1vdmllc0RCIEFQSVxuYXBwLmdldE1vdmllcyA9ICh1c2VyR2VucmUsIHVzZXJSYXRpbmcpID0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgIHNvcnRfYnk6ICd2b3RlX2F2ZXJhZ2UuZGVzYycsXG4gICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5sdGUnOiB1c2VyUmF0aW5nIC8vIHJhdGluZyA9PCB1c2VyUmF0aW5nXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgbW92aWVPYmplY3RzID0gcmVzLnJlc3VsdHM7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vdmllT2JqZWN0cyk7XG4gICAgfSlcbn07XG5cbi8vIGluaXQgZnVuY3Rpb25cbmFwcC5pbml0ID0gKCkgPT4ge1xuICAgIC8vIHRlc3RpbmcgZ2VucmU6IGFjdGlvbiBhbmQgdXNlclJhdGluZzogOCBhbmQgYmVsb3dcbiAgICBhcHAuZ2V0TW92aWVzKDI4LCA4KTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
