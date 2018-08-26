(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// main app object
var app = {};
app.submit = $('#submit');

// moviesDB properties
app.moviesBaseURL = 'https://api.themoviedb.org/3';
app.moviesImageURL = 'https://image.tmdb.org/t/p/';
app.moviesImageWidth = 'w780';
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
    var releaseDate = movie.release_date;
    var overview = movie.overview;
    $('.movies-result__container').empty();
    // overview
    // release_date
    $('.movies-result__container').append('\n        <h3 class="result-title">' + title + '</h3>\n\n\n\n        <img src="' + (app.moviesImageURL + app.moviesImageWidth + imgUrl) + '" class="movie-image">\n        <button class="button more-info more-info--movies">more info</button>\n\n\n        <div class="additional-movie-info">\n            <p class="movie-rating">' + rating + '</p>\n            <p class="movie-release-date">' + releaseDate + '</p>\n            <p class="movie-overview">' + overview + '</p>\n        </div>\n    ');

    // $('.movies-result').css('background', `url(${app.moviesImageURL + app.moviesImageWidth + imgUrl})`);
    // $('.movies-result').css('background-repeat', 'no-repeat');
    // $('.movies-result').css('background-size', '100%');
};

app.cleanObject = function (object) {
    for (var propName in object) {
        if (object[propName] === "") {
            delete object[propName];
        }
    }
};

app.displayDrink = function (drink) {
    var name = drink.strDrink;
    var imgUrl = drink.strDrinkThumb;

    var ingredients = Object.keys(drink).filter(function (k) {
        return k.indexOf('strIngredient') == 0;
    }).reduce(function (newKey, k) {
        newKey[k] = drink[k].trim();
        return newKey;
    }, {});

    var measurements = Object.keys(drink).filter(function (k) {
        return k.indexOf('strMeasure') == 0;
    }).reduce(function (newKey, k) {
        newKey[k] = drink[k].trim();
        return newKey;
    }, {});

    var instructions = drink.strInstructions;

    app.cleanObject(ingredients);
    app.cleanObject(measurements);

    var measurementsList = $('<ul>').addClass('measurement-list');
    var ingredientList = $('<ul>').addClass('ingredient-list');

    for (var prop in measurements) {
        var li = $('<li>').text(measurements[prop]);
        measurementsList.append(li);
    }

    for (var _prop in ingredients) {
        var _li = $('<li>').text(ingredients[_prop]);
        ingredientList.append(_li);
    }

    $('.drinks-result__container').empty();
    $('.drinks-result__container').append('\n        <h3 class="result-title">' + name + '</h3>\n        \n        <img src="' + imgUrl + '" class="drink-image">\n        <button class="button more-info more-info--drinks">more info</button>\n\n        <div class="additional-drink-info">\n            <div class="ingredients-container">\n            </div>\n        </div>\n    ');

    $('.ingredients-container').append(measurementsList, ingredientList);
    $('.additional-drink-info').append('<p>' + instructions + '</p>');

    // $('.drinks-result').css('background', `url(${imgUrl})`);
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
        $('.section--results').css('display', 'flex');
        console.log('yes');
    });

    $('.another-movie').on('click', function (e) {
        e.preventDefault();
        app.getMovies(app.userGenre, app.userRating);
    });

    $('.another-drink').on('click', function (e) {
        e.preventDefault();
        app.generateDrink(app.alcoholic);
    });

    $('#planAnother').on('click', function (e) {
        e.preventDefault();
        location.reload();
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

// <div className="result__image-container">
//     < img src = "${imgUrl}" class="drink-image" >
//     <button class="button more-info more-info--drinks">more info</button>
// </div>

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLElBQU0sTUFBTSxFQUFaO0FBQ0EsSUFBSSxNQUFKLEdBQWEsRUFBRSxTQUFGLENBQWI7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxjQUFKLEdBQXFCLDZCQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsTUFBdkI7QUFDQSxJQUFJLFlBQUosR0FBbUIsa0NBQW5CO0FBQ0EsSUFBSSxTQUFKO0FBQ0EsSUFBSSxjQUFKLEdBQXFCO0FBQ2pCLFdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLElBQVQsQ0FEVTtBQUVqQixZQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsS0FBYixDQUZTO0FBR2pCLGFBQVMsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLEVBQVo7QUFIUSxDQUFyQjs7QUFNQTtBQUNBLElBQUksZUFBSixHQUFzQiw4Q0FBdEI7QUFDQSxJQUFJLGdCQUFKLEdBQXVCO0FBQ25CLGVBQVc7QUFDUCxlQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FEQTtBQUVQLGlCQUFTLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FGRjtBQUdQLHNCQUFjLENBQUMsU0FBRCxFQUFZLEtBQVo7QUFIUCxLQURRO0FBTWY7QUFDSixtQkFBZTtBQUNYLGVBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQURJO0FBRVgsaUJBQVMsQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUZFO0FBR1gsc0JBQWMsQ0FBQyxRQUFELEVBQVcsS0FBWDtBQUhIOztBQVFuQjtBQUNBO0FBaEJ1QixDQUF2QixDQWlCQSxJQUFJLFNBQUosR0FBZ0IsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN2QyxNQUFFLElBQUYs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QyxVQUFFLGNBQUY7QUFDQSxZQUFJLGFBQUosQ0FBa0IsSUFBSSxTQUF0QjtBQUNILEtBSEQ7O0FBS0EsTUFBRSxjQUFGLEVBQWtCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLFVBQVMsQ0FBVCxFQUFZO0FBQ3RDLFVBQUUsY0FBRjtBQUNBLGlCQUFTLE1BQVQ7QUFDSCxLQUhEO0FBS0gsQ0F6Q0Q7O0FBMkNBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBTTtBQUNiOztBQUVBO0FBQ0E7O0FBRUEsUUFBSSxNQUFKO0FBQ0gsQ0FQRDs7QUFTQSxFQUFFLFlBQVc7QUFDVCxZQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsUUFBSSxJQUFKO0FBQ0gsQ0FIRDs7QUFTSTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1haW4gYXBwIG9iamVjdFxuY29uc3QgYXBwID0ge307XG5hcHAuc3VibWl0ID0gJCgnI3N1Ym1pdCcpO1xuXG4vLyBtb3ZpZXNEQiBwcm9wZXJ0aWVzXG5hcHAubW92aWVzQmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJztcbmFwcC5tb3ZpZXNJbWFnZVVSTCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xuYXBwLm1vdmllc0ltYWdlV2lkdGggPSAndzc4MCc7XG5hcHAubW92aWVzQVBJS2V5ID0gJzBmMDc0OTgyZjBlNmE5OTlkNTk4NjVkZmYyMTg0ZTg2JztcbmFwcC5tb3ZpZVBhZ2U7XG5hcHAubW92aWVzR2VucmVJRHMgPSB7XG4gICAgY29udm86IFs4MCwgOTksIDk2NDhdLFxuICAgIGxhdWdoczogWzM1LCAxMiwgMTgsIDEwNzUxXSxcbiAgICBjdWRkbGVzOiBbMjcsIDEwNzQ5LCA1M11cbn07XG5cbi8vIGNvY2t0YWlsIHByb3BlcnRpZXNcbmFwcC5jb2NrdGFpbEJhc2VVUkwgPSAnaHR0cHM6Ly93d3cudGhlY29ja3RhaWxkYi5jb20vYXBpL2pzb24vdjEvMS8nO1xuYXBwLmNvY2t0YWlsQ2F0ZWdvcnkgPSB7XG4gICAgQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJ1dpbmUnLCAnR2luJywgJ0JyYW5keSddLFxuICAgICAgICBmcmllbmRzOiBbJ1RlcXVpbGEnLCAnVm9ka2EnLCAnUnVtJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydXaGlza2V5JywgJ1J1bSddXG4gICAgfSxcbiAgICAgICAgLy8gYWRkIGxpdGVyYWxzXG4gICAgTm9uX0FsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWycnLCAnJ10sXG4gICAgICAgIGZyaWVuZHM6IFsnTWlsaycsICcnXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ0NvZmZlZScsICdUZWEnXVxuICAgIH1cbn1cblxuXG4vLyBhcHAuZ2V0TW92aWVzKHVzZXJHZW5yZSwgdXNlclJhdGluZyk7XG4vLyByZXF1ZXN0aW5nIG1vdmllIGluZm8gZnJvbSBtb3ZpZXNEQiBBUElcbmFwcC5nZXRNb3ZpZXMgPSAodXNlckdlbnJlLCB1c2VyUmF0aW5nKSA9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJyxcbiAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcgLy8gcmF0aW5nID49IHVzZXJSYXRpbmdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbFBhZ2VzID0gcmVzLnRvdGFsX3BhZ2VzO1xuICAgICAgICBjb25zdCB0b3BQb3B1bGFyID0gTWF0aC5mbG9vcih0b3RhbFBhZ2VzICogMC4yKTtcbiAgICAgICAgY29uc3QgbmV3UGFnZU51bWJlciA9IGFwcC5nZXRSYW5kTnVtKHRvcFBvcHVsYXIpKzE7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgICAgICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYycsXG4gICAgICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICAgICAndm90ZV9hdmVyYWdlLmd0ZSc6IHVzZXJSYXRpbmcsIC8vIHJhdGluZyA9PCB1c2VyUmF0aW5nXG4gICAgICAgICAgICAgICAgcGFnZTogbmV3UGFnZU51bWJlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgIC8vIG9uIHJhbmRvbSBwYWdlXG4gICAgICAgICAgICBjb25zdCBtb3ZpZSA9IHJlcy5yZXN1bHRzW2FwcC5nZXRSYW5kTnVtKDIwKV1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcblxuICAgICAgICAgICAgLy8gcHV0IG1vdmllIGludG8gSFRNTFxuICAgICAgICAgICAgYXBwLmRpc3BsYXlNb3ZpZShtb3ZpZSk7XG4gICAgICAgIH0pXG4gICAgfSlcbn07XG5cbmFwcC5nZXRDb2NrdGFpbCA9IChzZWFyY2gpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke3NlYXJjaH1gLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCkpO1xuICAgICAgICBhcHAucmFuZG9tRHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCk7XG5cblxuICAgICAgICBjb25zdCBuZXdTZWFyY2ggPSBgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gO1xuICAgICAgICBjb25zb2xlLmxvZyhhcHAuZHJpbmtUeXBlKTtcblxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtuZXdTZWFyY2h9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgIC8vIHJhbmRvbSBhcnJheSBmb3IgZHJpbmsgLSBnZXQgSURcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGdldERyaW5rQnlJZCA9IHJlcy5kcmlua3NbYXBwLnJhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtnZXREcmlua0J5SWR9YCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGdyYWIgZHJpbmsgZGF0YVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRyaW5rc1swXSk7XG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlEcmluayhyZXMuZHJpbmtzWzBdKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9KVxufVxuXG5hcHAuZ2V0RHJpbmsgPSAoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9ZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWNgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICBjb25zdCByYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS5sb2cocmFuZG9tRHJpbmtOdW1iZXIpO1xuXG4gICAgICAgIGNvbnN0IGRyaW5rSWQgPSByZXMuZHJpbmtzW3JhbmRvbURyaW5rTnVtYmVyXS5pZERyaW5rO1xuICAgICAgICBjb25zb2xlLmxvZyhkcmlua0lkKTtcblxuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9bG9va3VwLnBocD9pPSR7ZHJpbmtJZH1gLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5RHJpbmsocmVzLmRyaW5rc1swXSk7XG4gICAgICAgIH0pXG5cblxuICAgIH0pXG59XG5cbi8vIHJldHVybiByYW5kb20gbnVtYmVyXG5hcHAuZ2V0UmFuZE51bSA9IChudW0pID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKTtcbn1cblxuYXBwLmRpc3BsYXlNb3ZpZSA9IChtb3ZpZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gbW92aWUudGl0bGU7XG4gICAgY29uc3QgaW1nVXJsID0gbW92aWUucG9zdGVyX3BhdGg7XG4gICAgY29uc3QgcmF0aW5nID0gbW92aWUudm90ZV9hdmVyYWdlO1xuICAgIGNvbnN0IHJlbGVhc2VEYXRlID0gbW92aWUucmVsZWFzZV9kYXRlO1xuICAgIGNvbnN0IG92ZXJ2aWV3ID0gbW92aWUub3ZlcnZpZXc7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgLy8gb3ZlcnZpZXdcbiAgICAvLyByZWxlYXNlX2RhdGVcbiAgICAkKCcubW92aWVzLXJlc3VsdF9fY29udGFpbmVyJykuYXBwZW5kKGBcbiAgICAgICAgPGgzIGNsYXNzPVwicmVzdWx0LXRpdGxlXCI+JHt0aXRsZX08L2gzPlxuXG5cblxuICAgICAgICA8aW1nIHNyYz1cIiR7YXBwLm1vdmllc0ltYWdlVVJMICthcHAubW92aWVzSW1hZ2VXaWR0aCArIGltZ1VybH1cIiBjbGFzcz1cIm1vdmllLWltYWdlXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gbW9yZS1pbmZvIG1vcmUtaW5mby0tbW92aWVzXCI+bW9yZSBpbmZvPC9idXR0b24+XG5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWRkaXRpb25hbC1tb3ZpZS1pbmZvXCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJhdGluZ1wiPiR7cmF0aW5nfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibW92aWUtcmVsZWFzZS1kYXRlXCI+JHtyZWxlYXNlRGF0ZX08L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm1vdmllLW92ZXJ2aWV3XCI+JHtvdmVydmlld308L3A+XG4gICAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgLy8gJCgnLm1vdmllcy1yZXN1bHQnKS5jc3MoJ2JhY2tncm91bmQnLCBgdXJsKCR7YXBwLm1vdmllc0ltYWdlVVJMICsgYXBwLm1vdmllc0ltYWdlV2lkdGggKyBpbWdVcmx9KWApO1xuICAgIC8vICQoJy5tb3ZpZXMtcmVzdWx0JykuY3NzKCdiYWNrZ3JvdW5kLXJlcGVhdCcsICduby1yZXBlYXQnKTtcbiAgICAvLyAkKCcubW92aWVzLXJlc3VsdCcpLmNzcygnYmFja2dyb3VuZC1zaXplJywgJzEwMCUnKTtcbn1cblxuYXBwLmNsZWFuT2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICAgIGZvciAobGV0IHByb3BOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0W3Byb3BOYW1lXSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtwcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFwcC5kaXNwbGF5RHJpbmsgPSAoZHJpbmspID0+IHtcbiAgICBjb25zdCBuYW1lID0gZHJpbmsuc3RyRHJpbms7XG4gICAgY29uc3QgaW1nVXJsID0gZHJpbmsuc3RyRHJpbmtUaHVtYjtcblxuICAgIGNvbnN0IGluZ3JlZGllbnRzID0gT2JqZWN0LmtleXMoZHJpbmspLmZpbHRlcihmdW5jdGlvbihrKSB7XG4gICAgICAgIHJldHVybiBrLmluZGV4T2YoJ3N0ckluZ3JlZGllbnQnKSA9PSAwO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbihuZXdLZXksIGspIHtcbiAgICAgICAgbmV3S2V5W2tdID0gZHJpbmtba10udHJpbSgpO1xuICAgICAgICByZXR1cm4gbmV3S2V5O1xuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IG1lYXN1cmVtZW50cyA9IE9iamVjdC5rZXlzKGRyaW5rKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIGsuaW5kZXhPZignc3RyTWVhc3VyZScpID09IDA7XG4gICAgfSkucmVkdWNlKGZ1bmN0aW9uIChuZXdLZXksIGspIHtcbiAgICAgICAgbmV3S2V5W2tdID0gZHJpbmtba10udHJpbSgpO1xuICAgICAgICByZXR1cm4gbmV3S2V5O1xuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGRyaW5rLnN0ckluc3RydWN0aW9ucztcblxuICAgIGFwcC5jbGVhbk9iamVjdChpbmdyZWRpZW50cyk7XG4gICAgYXBwLmNsZWFuT2JqZWN0KG1lYXN1cmVtZW50cyk7XG5cbiAgICBjb25zdCBtZWFzdXJlbWVudHNMaXN0ID0gJCgnPHVsPicpLmFkZENsYXNzKCdtZWFzdXJlbWVudC1saXN0Jyk7XG4gICAgY29uc3QgaW5ncmVkaWVudExpc3QgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ2luZ3JlZGllbnQtbGlzdCcpO1xuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBtZWFzdXJlbWVudHMpIHtcbiAgICAgICAgY29uc3QgbGkgPSAkKCc8bGk+JykudGV4dChtZWFzdXJlbWVudHNbcHJvcF0pO1xuICAgICAgICBtZWFzdXJlbWVudHNMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBpbmdyZWRpZW50cykge1xuICAgICAgICBjb25zdCBsaSA9ICQoJzxsaT4nKS50ZXh0KGluZ3JlZGllbnRzW3Byb3BdKTtcbiAgICAgICAgaW5ncmVkaWVudExpc3QuYXBwZW5kKGxpKTtcbiAgICB9XG5cblxuICAgICQoJy5kcmlua3MtcmVzdWx0X19jb250YWluZXInKS5lbXB0eSgpO1xuICAgICQoJy5kcmlua3MtcmVzdWx0X19jb250YWluZXInKS5hcHBlbmQoYFxuICAgICAgICA8aDMgY2xhc3M9XCJyZXN1bHQtdGl0bGVcIj4ke25hbWV9PC9oMz5cbiAgICAgICAgXG4gICAgICAgIDxpbWcgc3JjPVwiJHtpbWdVcmx9XCIgY2xhc3M9XCJkcmluay1pbWFnZVwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIG1vcmUtaW5mbyBtb3JlLWluZm8tLWRyaW5rc1wiPm1vcmUgaW5mbzwvYnV0dG9uPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGRpdGlvbmFsLWRyaW5rLWluZm9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmdyZWRpZW50cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgICQoJy5pbmdyZWRpZW50cy1jb250YWluZXInKS5hcHBlbmQobWVhc3VyZW1lbnRzTGlzdCwgaW5ncmVkaWVudExpc3QpO1xuICAgICQoJy5hZGRpdGlvbmFsLWRyaW5rLWluZm8nKS5hcHBlbmQoYDxwPiR7aW5zdHJ1Y3Rpb25zfTwvcD5gKTtcblxuICAgIC8vICQoJy5kcmlua3MtcmVzdWx0JykuY3NzKCdiYWNrZ3JvdW5kJywgYHVybCgke2ltZ1VybH0pYCk7XG59XG5cbmFwcC5nZW5lcmF0ZURyaW5rID0gKGFsY29ob2xpYykgPT4ge1xuICAgIGlmIChhbGNvaG9saWMgPT09ICdBbGNvaG9saWMnKSB7XG4gICAgICAgIGFwcC5nZXRDb2NrdGFpbChgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcHAuZ2V0RHJpbmsoKVxuICAgIH1cbn1cblxuYXBwLmV2ZW50cyA9ICgpID0+IHtcbiAgICAkKCcjc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGdlbnJlQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWdlbnJlXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXhNYXggPSBhcHAubW92aWVzR2VucmVJRHNbZ2VucmVDYXRlZ29yeV0ubGVuZ3RoO1xuICAgICAgICBjb25zdCBnZW5yZUluZGV4ID0gYXBwLmdldFJhbmROdW0oZ2VucmVJbmRleE1heCk7XG5cbiAgICAgICAgYXBwLnVzZXJHZW5yZSA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XVtnZW5yZUluZGV4XTtcbiAgICAgICAgYXBwLnVzZXJSYXRpbmcgPSBwYXJzZUludCgkKCdpbnB1dFtuYW1lPXJhdGluZ106Y2hlY2tlZCcpLnZhbCgpKTtcbiAgICAgICAgYXBwLmdldE1vdmllcyhhcHAudXNlckdlbnJlLCBhcHAudXNlclJhdGluZyk7XG5cbiAgICAgICAgLy9jb2NrdGFpbCBhcGlcbiAgICAgICAgYXBwLmFsY29ob2xpYyA9ICQoJ2lucHV0W25hbWU9YWxjb2hvbF06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBkcmlua0NhdGVnb3J5ID0gJCgnaW5wdXRbbmFtZT1jYXRlZ29yeV06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCBkcmlua0FycmF5ID0gYXBwLmNvY2t0YWlsQ2F0ZWdvcnlbYXBwLmFsY29ob2xpY11bZHJpbmtDYXRlZ29yeV07XG4gICAgICAgIGNvbnN0IGRyaW5rTnVtYmVyID0gYXBwLmdldFJhbmROdW0oZHJpbmtBcnJheS5sZW5ndGgpO1xuICAgICAgICBhcHAuZHJpbmtUeXBlID0gZHJpbmtBcnJheVtkcmlua051bWJlcl07XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcC5kcmlua1R5cGUpO1xuXG4gICAgICAgIGFwcC5nZW5lcmF0ZURyaW5rKGFwcC5hbGNvaG9saWMpO1xuICAgICAgICAvLyBnZXQgYXJyYXkgb2YgZHJpbmtzIGJ5IHR5cGUgLSB3aW5lL3NoYWtlL2V0Y1xuICAgICAgICAkKCcuc2VjdGlvbi0tcmVzdWx0cycpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd5ZXMnKTtcbiAgICAgICAgXG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxuXG4gICAgJCgnLmFub3RoZXItZHJpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgfSlcblxuICAgICQoJyNwbGFuQW5vdGhlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KVxuXG59O1xuXG4vLyBpbml0IGZ1bmN0aW9uXG5hcHAuaW5pdCA9ICgpID0+IHtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoYGZpbHRlci5waHA/YT1Ob25fQWxjb2hvbGljYCk7XG5cbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoYGZpbHRlci5waHA/aT1Db2ZmZWVgKTtcbiAgICAvLyBhcHAuZ2V0Q29ja3RhaWwoYGxvb2t1cC5waHA/aT0xMjc3MGApO1xuXG4gICAgYXBwLmV2ZW50cygpO1xufVxuXG4kKGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVhZHlcIik7XG4gICAgYXBwLmluaXQoKTtcbn0pXG5cblxuXG5cblxuICAgIC8vIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0X19pbWFnZS1jb250YWluZXJcIj5cbiAgICAvLyAgICAgPCBpbWcgc3JjID0gXCIke2ltZ1VybH1cIiBjbGFzcz1cImRyaW5rLWltYWdlXCIgPlxuICAgIC8vICAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIG1vcmUtaW5mbyBtb3JlLWluZm8tLWRyaW5rc1wiPm1vcmUgaW5mbzwvYnV0dG9uPlxuICAgIC8vIDwvZGl2PiJdfQ==
