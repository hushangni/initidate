(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

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
    // add literals
    Non_Alcoholic: {
        first: ['', ''],
        friends: ['Milk', ''],
        relationship: ['Coffee', 'Tea']
    }

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
            sort_by: 'popularity.desc',
            with_genres: userGenre, // genre id
            'vote_average.gte': userRating // rating >= userRating
        }
    }).then(function (res) {
        var totalPages = res.total_pages;
        var topPopular = Math.floor(totalPages * 0.2);
        var newPageNumber = app.getRandNum(topPopular) + 1;

        $.ajax({
            url: app.moviesBaseURL + '/discover/movie',
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
                app.displayDrink(res.drinks[0]);
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
            app.displayDrink(res.drinks[0]);
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

app.displayDrink = function (drink) {
    var name = drink.strDrink;
    var imgUrl = drink.strDrinkThumb;
    $('.drinks-result__container').empty();
    $('.drinks-result__container').append('\n        <h3>' + name + '</h3>\n        <img src="' + imgUrl + '">\n    ');
};

app.generateDrink = function (alcoholic) {
    if (alcoholic === 'Alcoholic') {
        app.getCocktail('filter.php?i=' + app.drinkType);
    } else {
        app.getDrink();
    }
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
        app.alcoholic = $('input[name=alcohol]:checked').val();
        var drinkCategory = $('input[name=category]:checked').val();
        var drinkArray = app.cocktailCategory[app.alcoholic][drinkCategory];
        var drinkNumber = app.getRandNum(drinkArray.length);
        app.drinkType = drinkArray[drinkNumber];
        console.log(app.drinkType);

        app.generateDrink(app.alcoholic);
        // get array of drinks by type - wine/shake/etc
    });

    $('.another-movie').on('click', function (e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    });

    $('.another-drink').on('click', function (e) {
        e.preventDefault();
        app.generateDrink(app.alcoholic);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLElBQU0sTUFBTSxFQUFaO0FBQ0EsSUFBSSxNQUFKLEdBQWEsRUFBRSxTQUFGLENBQWI7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxjQUFKLEdBQXFCLDZCQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsTUFBdkI7QUFDQSxJQUFJLFlBQUosR0FBbUIsa0NBQW5CO0FBQ0EsSUFBSSxTQUFKO0FBQ0EsSUFBSSxjQUFKLEdBQXFCO0FBQ2pCLFdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLElBQVQsQ0FEVTtBQUVqQixZQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsS0FBYixDQUZTO0FBR2pCLGFBQVMsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLEVBQVo7QUFIUSxDQUFyQjs7QUFNQTtBQUNBLElBQUksZUFBSixHQUFzQiw4Q0FBdEI7QUFDQSxJQUFJLGdCQUFKLEdBQXVCO0FBQ25CLGVBQVc7QUFDUCxlQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FEQTtBQUVQLGlCQUFTLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FGRjtBQUdQLHNCQUFjLENBQUMsU0FBRCxFQUFZLEtBQVo7QUFIUCxLQURRO0FBTWY7QUFDSixtQkFBZTtBQUNYLGVBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQURJO0FBRVgsaUJBQVMsQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUZFO0FBR1gsc0JBQWMsQ0FBQyxRQUFELEVBQVcsS0FBWDtBQUhIOztBQVFuQjtBQUNBO0FBaEJ1QixDQUF2QixDQWlCQSxJQUFJLFNBQUosR0FBZ0IsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN2QyxNQUFFLElBQUYs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QUNBLFlBQU0sY0FBYyxJQUFJLFVBQUosQ0FBZSxXQUFXLE1BQTFCLENBQXBCO0FBQ0EsWUFBSSxTQUFKLEdBQWdCLFdBQVcsV0FBWCxDQUFoQjtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxJQUFJLFNBQWhCOztBQUVBLFlBQUksYUFBSixDQUFrQixJQUFJLFNBQXRCO0FBQ0E7QUFDSCxLQXBCRDs7QUFzQkEsTUFBRSxnQkFBRixFQUFvQixFQUFwQixDQUF1QixPQUF2QixFQUFnQyxVQUFTLENBQVQsRUFBWTtBQUN4QyxVQUFFLGNBQUY7QUFDQSxZQUFJLFNBQUosQ0FBYyxJQUFJLFNBQWxCLEVBQTZCLElBQUksVUFBakM7QUFDSCxLQUhEOztBQUtBLE1BQUUsZ0JBQUYsRUFBb0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBUyxDQUFULEVBQVk7QUFDeEMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxhQUFKLENBQWtCLElBQUksU0FBdEI7QUFDSCxLQUhEO0FBSUgsQ0FoQ0Q7O0FBa0NBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBTTtBQUNiOztBQUVBO0FBQ0E7O0FBRUEsUUFBSSxNQUFKO0FBQ0gsQ0FQRDs7QUFTQSxFQUFFLFlBQVc7QUFDVCxZQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsUUFBSSxJQUFKO0FBQ0gsQ0FIRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5hcHAuc3VibWl0ID0gJCgnI3N1Ym1pdCcpO1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNJbWFnZVVSTCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xuYXBwLm1vdmllc0ltYWdlV2lkdGggPSAndzE4NSc7XG5hcHAubW92aWVzQVBJS2V5ID0gJzBmMDc0OTgyZjBlNmE5OTlkNTk4NjVkZmYyMTg0ZTg2JztcbmFwcC5tb3ZpZVBhZ2U7XG5hcHAubW92aWVzR2VucmVJRHMgPSB7XG4gICAgY29udm86IFs4MCwgOTksIDk2NDhdLFxuICAgIGxhdWdoczogWzM1LCAxMiwgMTgsIDEwNzUxXSxcbiAgICBjdWRkbGVzOiBbMjcsIDEwNzQ5LCA1M11cbn07XG5cbi8vIGNvY2t0YWlsIHByb3BlcnRpZXNcbmFwcC5jb2NrdGFpbEJhc2VVUkwgPSAnaHR0cHM6Ly93d3cudGhlY29ja3RhaWxkYi5jb20vYXBpL2pzb24vdjEvMS8nO1xuYXBwLmNvY2t0YWlsQ2F0ZWdvcnkgPSB7XG4gICAgQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJ1dpbmUnLCAnR2luJywgJ0JyYW5keSddLFxuICAgICAgICBmcmllbmRzOiBbJ1RlcXVpbGEnLCAnVm9ka2EnLCAnUnVtJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydXaGlza2V5JywgJ1J1bSddXG4gICAgfSxcbiAgICAgICAgLy8gYWRkIGxpdGVyYWxzXG4gICAgTm9uX0FsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWycnLCAnJ10sXG4gICAgICAgIGZyaWVuZHM6IFsnTWlsaycsICcnXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ0NvZmZlZScsICdUZWEnXVxuICAgIH1cbn1cblxuXG4vLyBhcHAuZ2V0TW92aWVzKHVzZXJHZW5yZSwgdXNlclJhdGluZyk7XG4vLyByZXF1ZXN0aW5nIG1vdmllIGluZm8gZnJvbSBtb3ZpZXNEQiBBUElcbmFwcC5nZXRNb3ZpZXMgPSAodXNlckdlbnJlLCB1c2VyUmF0aW5nKSA9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJyxcbiAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcgLy8gcmF0aW5nID49IHVzZXJSYXRpbmdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbFBhZ2VzID0gcmVzLnRvdGFsX3BhZ2VzO1xuICAgICAgICBjb25zdCB0b3BQb3B1bGFyID0gTWF0aC5mbG9vcih0b3RhbFBhZ2VzICogMC4yKTtcbiAgICAgICAgY29uc3QgbmV3UGFnZU51bWJlciA9IGFwcC5nZXRSYW5kTnVtKHRvcFBvcHVsYXIpKzE7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICAgICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYycsXG4gICAgICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcsIC8vIHJhdGluZyA9PCB1c2VyUmF0aW5nXG4gICAgICAgICAgICAgICAgcGFnZTogbmV3UGFnZU51bWJlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgIC8vIG9uIHJhbmRvbSBwYWdlXG4gICAgICAgICAgICBjb25zdCBtb3ZpZSA9IHJlcy5yZXN1bHRzW2FwcC5nZXRSYW5kTnVtKDIwKV1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcblxuICAgICAgICAgICAgLy8gcHV0IG1vdmllIGludG8gSFRNTFxuICAgICAgICAgICAgYXBwLmRpc3BsYXlNb3ZpZShtb3ZpZSk7XG4gICAgICAgIH0pXG4gICAgfSlcbn07XG5cbmFwcC5nZXRDb2NrdGFpbCA9IChzZWFyY2gpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke3NlYXJjaH1gLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCkpO1xuICAgICAgICBhcHAucmFuZG9tRHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCk7XG5cblxuICAgICAgICBjb25zdCBuZXdTZWFyY2ggPSBgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gO1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZHJpbmtUeXBlKTtcblxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtuZXdTZWFyY2h9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgIC8vIHJhbmRvbSBhcnJheSBmb3IgZHJpbmsgLSBnZXQgSURcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGdldERyaW5rQnlJZCA9IHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtnZXREcmlua0J5SWR9YCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGdyYWIgZHJpbmsgZGF0YVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRyaW5rc1swXSk7XG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlEcmluayhyZXMuZHJpbmtzWzBdKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9KVxufVxuXG5hcHAuZ2V0RHJpbmsgPSAoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9ZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWNgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICBjb25zdCByYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS5sb2cocmFuZG9tRHJpbmtOdW1iZXIpO1xuXG4gICAgICAgIGNvbnN0IGRyaW5rSWQgPSByZXMuZHJpbmtzW3JhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuICAgICAgICBjb25zb2xlLmxvZyhkcmlua0lkKTtcblxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9bG9va3VwLnBocD9pPSR7ZHJpbmtJZH1gLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5RHJpbmsocmVzLmRyaW5rc1swXSk7XG4gICAgICAgIH0pXG5cblxuICAgIH0pXG59XG5cbi8vIHJldHVybiByYW5kb20gbnVtYmVyXG5hcHAuZ2V0UmFuZE51bSA9IChudW0pID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKTtcbn1cblxuYXBwLmRpc3BsYXlNb3ZpZSA9IChtb3ZpZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gbW92aWUudGl0bGU7XG4gICAgY29uc3QgaW1nVXJsID0gbW92aWUucG9zdGVyX3BhdGg7XG4gICAgY29uc3QgcmF0aW5nID0gbW92aWUudm90ZV9hdmVyYWdlO1xuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5lbXB0eSgpO1xuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5hcHBlbmQoYFxuICAgICAgICA8aDM+JHt0aXRsZX08L2gzPlxuICAgICAgICA8aW1nIHNyYz1cIiR7YXBwLm1vdmllc0ltYWdlVVJMICthcHAubW92aWVzSW1hZ2VXaWR0aCArIGltZ1VybH1cIj5cbiAgICAgICAgPHAgY2xhc3M9XCJtb3ZpZS1yYXRpbmdcIj4ke3JhdGluZ308L3A+XG4gICAgYCk7XG59XG5cbmFwcC5kaXNwbGF5RHJpbmsgPSAoZHJpbmspID0+IHtcbiAgICBjb25zdCBuYW1lID0gZHJpbmsuc3RyRHJpbms7XG4gICAgY29uc3QgaW1nVXJsID0gZHJpbmsuc3RyRHJpbmtUaHVtYjtcbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuZW1wdHkoKTtcbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuYXBwZW5kKGBcbiAgICAgICAgPGgzPiR7bmFtZX08L2gzPlxuICAgICAgICA8aW1nIHNyYz1cIiR7aW1nVXJsfVwiPlxuICAgIGApO1xufVxuXG5hcHAuZ2VuZXJhdGVEcmluayA9IChhbGNvaG9saWMpID0+IHtcbiAgICBpZiAoYWxjb2hvbGljID09PSAnQWxjb2hvbGljJykge1xuICAgICAgICBhcHAuZ2V0Q29ja3RhaWwoYGZpbHRlci5waHA/aT0ke2FwcC5kcmlua1R5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXBwLmdldERyaW5rKClcbiAgICB9XG59XG5cbmFwcC5ldmVudHMgPSAoKSA9PiB7XG4gICAgJCgnI3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBnZW5yZUNhdGVnb3J5ID0gJCgnaW5wdXRbbmFtZT1nZW5yZV06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4TWF4ID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleCA9IGFwcC5nZXRSYW5kTnVtKGdlbnJlSW5kZXhNYXgpO1xuXG4gICAgICAgIGFwcC51c2VyR2VucmUgPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV1bZ2VucmVJbmRleF07XG4gICAgICAgIGFwcC51c2VyUmF0aW5nID0gcGFyc2VJbnQoJCgnaW5wdXRbbmFtZT1yYXRpbmddOmNoZWNrZWQnKS52YWwoKSk7XG4gICAgICAgIGFwcC5nZXRNb3ZpZXMoYXBwLnVzZXJHZW5yZSwgYXBwLnVzZXJSYXRpbmcpO1xuXG4gICAgICAgIC8vY29ja3RhaWwgYXBpXG4gICAgICAgIGFwcC5hbGNvaG9saWMgPSAkKCdpbnB1dFtuYW1lPWFsY29ob2xdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Y2F0ZWdvcnldOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZHJpbmtBcnJheSA9IGFwcC5jb2NrdGFpbENhdGVnb3J5W2FwcC5hbGNvaG9saWNdW2RyaW5rQ2F0ZWdvcnldO1xuICAgICAgICBjb25zdCBkcmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKGRyaW5rQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgYXBwLmRyaW5rVHlwZSA9IGRyaW5rQXJyYXlbZHJpbmtOdW1iZXJdO1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZHJpbmtUeXBlKTtcblxuICAgICAgICBhcHAuZ2VuZXJhdGVEcmluayhhcHAuYWxjb2hvbGljKTtcbiAgICAgICAgLy8gZ2V0IGFycmF5IG9mIGRyaW5rcyBieSB0eXBlIC0gd2luZS9zaGFrZS9ldGNcbiAgICB9KTtcblxuICAgICQoJy5hbm90aGVyLW1vdmllJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGFwcC5nZXRNb3ZpZXMoYXBwLnVzZXJHZW5yZSwgYXBwLnVzZXJSYXRpbmcpO1xuICAgIH0pXG5cbiAgICAkKCcuYW5vdGhlci1kcmluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2VuZXJhdGVEcmluayhhcHAuYWxjb2hvbGljKTtcbiAgICB9KVxufTtcblxuLy8gaW5pdCBmdW5jdGlvblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpY2ApO1xuXG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9Q29mZmVlYCk7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBsb29rdXAucGhwP2k9MTI3NzBgKTtcblxuICAgIGFwcC5ldmVudHMoKTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
