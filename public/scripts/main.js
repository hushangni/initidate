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

// init function
app.init = function () {
    // testing genre: action and userRating: 8 and below
    app.getMovies(28, 8);
    // there are specific filters(end points) depending on ingredients/etc
    app.getCocktail('filter.php?i=Vodka');
};

$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxZQUFKLEdBQW1CLGtDQUFuQjs7QUFFQTtBQUNBO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLFVBQUMsU0FBRCxFQUFZLFVBQVosRUFBMkI7QUFDdkMsTUFBRSxJQUFGLENBQU87QUFDSCxhQUFRLElBQUksYUFBWixvQkFERztBQUVILGdCQUFRLEtBRkw7QUFHSCxrQkFBVSxNQUhQO0FBSUgsY0FBTTtBQUNGLHFCQUFTLElBQUksWUFEWDtBQUVGLHNCQUFVLE9BRlI7QUFHRixxQkFBUyxtQkFIUDtBQUlGLHlCQUFhLFNBSlgsRUFJc0I7QUFDeEIsZ0NBQW9CLFVBTGxCLENBSzZCO0FBTDdCO0FBSkgsS0FBUCxFQVdHLElBWEgsQ0FXUSxVQUFDLEdBQUQsRUFBUztBQUNiLFlBQU0sZUFBZSxJQUFJLE9BQXpCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLFlBQVo7QUFDSCxLQWREO0FBZUgsQ0FoQkQ7O0FBbUJBLElBQUksV0FBSixHQUFrQixVQUFDLE1BQUQsRUFBVztBQUN6QixNQUFFLElBQUYsQ0FBTztBQUNILDhEQUFvRCxNQURqRDtBQUVILGdCQUFRLEtBRkw7QUFHSCxrQkFBVSxNQUhQO0FBSUgsY0FBTTtBQUNGLGlCQUFLO0FBREg7QUFKSCxLQUFQLEVBT0csSUFQSCxDQU9RLFVBQUMsR0FBRCxFQUFRO0FBQ1osZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFFSCxLQVZEO0FBV0gsQ0FaRDs7QUFjQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYjtBQUNBLFFBQUksU0FBSixDQUFjLEVBQWQsRUFBa0IsQ0FBbEI7QUFDQTtBQUNBLFFBQUksV0FBSixDQUFnQixvQkFBaEI7QUFDSCxDQUxEOztBQU9BLEVBQUUsWUFBVztBQUNULFlBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxRQUFJLElBQUo7QUFDSCxDQUhEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gT24gY2xpY2sgb2YgXCJiZWdpblwiIGJ1dHRvbiwgaGlkZSBsYW5kaW5nIHBhZ2Vcbi8vIEJhc2VkIG9uIHVzZXIgaW5wdXQsIHN0b3JlIGlucHV0IHZhbHVlIGluIHZhcmlhYmxlIChyYWRpbyBidXR0b25zKVxuLy8gUTEgaW5mbyAtPiBDb2NrdGFpbERCIGJhc2Vcbi8vICAgICAtIGZpbHRlciBjb2NrdGFpbCBkYXRhIGJhc2VkIG9uIG1haW4gaW5ncmVkaWVudFxuLy8gUTIgaW5mbyAtPiBNb3ZpZXNEQiBnZW5yZVxuLy8gICAgIC0gY3JlYXRlIGFycmF5IG9mIHJldHVybmVkIGRhdGFcbi8vIFEzIGluZm8gLT4gTW92aWVzREIgcmF0aW5nc1xuLy8gICAgIC0gZmlsdGVyIG1vdmllIGFycmF5IGJhc2VkIG9uIHJhdGluZ3Ncbi8vIFE0IGluZm8gLT4gQ29ja3RhaWxEQiBhbGNob2xpYy9ub24tYWxjb2hvbGljXG4vLyAgICAgLSBjcmVhdGUgYXJyYXkgb2YgcmV0dXJuZWQgZGF0YVxuLy8gVXNlIHJhbmRvbSBmdW5jdGlvbiB0byBnZW5lcmF0ZSByZXN1bHRzIGZyb20gdGhlIG1vdmllcyBhbmQgdGhlIGNvY2t0YWlsIGFycmF5XG4vLyBEaXNwbGF5IGluZm9ybWF0aW9uIG9uIHBhZ2Ugd2l0aCBqcXVlcnlcbi8vIE9uIGNsaWNrIG9mIFwiZ2VuZXJhdGUgYW5vdGhlclwiLCB1c2UgcmFuZG9tIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIG5ldyByZXN1bHRcbi8vIE9uIGNsaWNrIG9mIFwiZ2VuZXJhdGUgbmV3IGRhdGVcIiB0YWtlIHVzZXIgYmFjayB0byBxdWVzdGlvbnMgcGFnZVxuXG4vLyBtYWluIGFwcCBvYmplY3RcbmNvbnN0IGFwcCA9IHt9O1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNBUElLZXkgPSAnMGYwNzQ5ODJmMGU2YTk5OWQ1OTg2NWRmZjIxODRlODYnO1xuXG4vLyBhcHAuZ2V0TW92aWVzKHVzZXJHZW5yZSwgdXNlclJhdGluZyk7XG4vLyByZXF1ZXN0aW5nIG1vdmllIGluZm8gZnJvbSBtb3ZpZXNEQiBBUElcbmFwcC5nZXRNb3ZpZXMgPSAodXNlckdlbnJlLCB1c2VyUmF0aW5nKSA9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICBzb3J0X2J5OiAndm90ZV9hdmVyYWdlLmRlc2MnLFxuICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UubHRlJzogdXNlclJhdGluZyAvLyByYXRpbmcgPTwgdXNlclJhdGluZ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vdmllT2JqZWN0cyA9IHJlcy5yZXN1bHRzO1xuICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZU9iamVjdHMpO1xuICAgIH0pXG59O1xuXG5cbmFwcC5nZXRDb2NrdGFpbCA9IChzZWFyY2gpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYGh0dHBzOi8vd3d3LnRoZWNvY2t0YWlsZGIuY29tL2FwaS9qc29uL3YxLzEvJHtzZWFyY2h9YCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcyk9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIFxuICAgIH0pXG59XG5cbi8vIGluaXQgZnVuY3Rpb25cbmFwcC5pbml0ID0gKCkgPT4ge1xuICAgIC8vIHRlc3RpbmcgZ2VucmU6IGFjdGlvbiBhbmQgdXNlclJhdGluZzogOCBhbmQgYmVsb3dcbiAgICBhcHAuZ2V0TW92aWVzKDI4LCA4KTtcbiAgICAvLyB0aGVyZSBhcmUgc3BlY2lmaWMgZmlsdGVycyhlbmQgcG9pbnRzKSBkZXBlbmRpbmcgb24gaW5ncmVkaWVudHMvZXRjXG4gICAgYXBwLmdldENvY2t0YWlsKCdmaWx0ZXIucGhwP2k9Vm9ka2EnKTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
