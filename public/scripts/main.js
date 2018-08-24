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
    $('.movies-result__container').append('\n        <h3 class="result-title">' + title + '</h3>\n        <img src="' + (app.moviesImageURL + app.moviesImageWidth + imgUrl) + '" class="movie-image">\n\n        <div class="additional-movie-info">\n            <p class="movie-rating">' + rating + '</p>\n            <p class="movie-release-date">' + releaseDate + '</p>\n            <p class="movie-overview">' + overview + '</p>\n        </div>\n    ');

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
    $('.drinks-result__container').append('\n        <h3 class="result-title">' + name + '</h3>\n        <img src="' + imgUrl + '" class="drink-image">\n\n        <div class="additional-drink-info">\n            <div class="ingredients-container">\n            </div>\n        </div>\n    ');

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLElBQU0sTUFBTSxFQUFaO0FBQ0EsSUFBSSxNQUFKLEdBQWEsRUFBRSxTQUFGLENBQWI7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxjQUFKLEdBQXFCLDZCQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsTUFBdkI7QUFDQSxJQUFJLFlBQUosR0FBbUIsa0NBQW5CO0FBQ0EsSUFBSSxTQUFKO0FBQ0EsSUFBSSxjQUFKLEdBQXFCO0FBQ2pCLFdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLElBQVQsQ0FEVTtBQUVqQixZQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsS0FBYixDQUZTO0FBR2pCLGFBQVMsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLEVBQVo7QUFIUSxDQUFyQjs7QUFNQTtBQUNBLElBQUksZUFBSixHQUFzQiw4Q0FBdEI7QUFDQSxJQUFJLGdCQUFKLEdBQXVCO0FBQ25CLGVBQVc7QUFDUCxlQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FEQTtBQUVQLGlCQUFTLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FGRjtBQUdQLHNCQUFjLENBQUMsU0FBRCxFQUFZLEtBQVo7QUFIUCxLQURRO0FBTWY7QUFDSixtQkFBZTtBQUNYLGVBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQURJO0FBRVgsaUJBQVMsQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUZFO0FBR1gsc0JBQWMsQ0FBQyxRQUFELEVBQVcsS0FBWDtBQUhIOztBQVFuQjtBQUNBO0FBaEJ1QixDQUF2QixDQWlCQSxJQUFJLFNBQUosR0FBZ0IsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN2QyxNQUFFLElBQUYs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bEIsQ0FBcUIsT0FBckIsRUFBOEIsVUFBUyxDQUFULEVBQVk7QUFDdEMsVUFBRSxjQUFGO0FBQ0EsaUJBQVMsTUFBVDtBQUNILEtBSEQ7QUFJSCxDQXJDRDs7QUF1Q0E7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFNO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQSxRQUFJLE1BQUo7QUFDSCxDQVBEOztBQVNBLEVBQUUsWUFBVztBQUNULFlBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxRQUFJLElBQUo7QUFDSCxDQUhEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbWFpbiBhcHAgb2JqZWN0XG5jb25zdCBhcHAgPSB7fTtcbmFwcC5zdWJtaXQgPSAkKCcjc3VibWl0Jyk7XG5cbi8vIG1vdmllc0RCIHByb3BlcnRpZXNcbmFwcC5tb3ZpZXNCYXNlVVJMID0gJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMnO1xuYXBwLm1vdmllc0ltYWdlVVJMID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wLyc7XG5hcHAubW92aWVzSW1hZ2VXaWR0aCA9ICd3NzgwJztcbmFwcC5tb3ZpZXNBUElLZXkgPSAnMGYwNzQ5ODJmMGU2YTk5OWQ1OTg2NWRmZjIxODRlODYnO1xuYXBwLm1vdmllUGFnZTtcbmFwcC5tb3ZpZXNHZW5yZUlEcyA9IHtcbiAgICBjb252bzogWzgwLCA5OSwgOTY0OF0sXG4gICAgbGF1Z2hzOiBbMzUsIDEyLCAxOCwgMTA3NTFdLFxuICAgIGN1ZGRsZXM6IFsyNywgMTA3NDksIDUzXVxufTtcblxuLy8gY29ja3RhaWwgcHJvcGVydGllc1xuYXBwLmNvY2t0YWlsQmFzZVVSTCA9ICdodHRwczovL3d3dy50aGVjb2NrdGFpbGRiLmNvbS9hcGkvanNvbi92MS8xLyc7XG5hcHAuY29ja3RhaWxDYXRlZ29yeSA9IHtcbiAgICBBbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnV2luZScsICdHaW4nLCAnQnJhbmR5J10sXG4gICAgICAgIGZyaWVuZHM6IFsnVGVxdWlsYScsICdWb2RrYScsICdSdW0nXSxcbiAgICAgICAgcmVsYXRpb25zaGlwOiBbJ1doaXNrZXknLCAnUnVtJ11cbiAgICB9LFxuICAgICAgICAvLyBhZGQgbGl0ZXJhbHNcbiAgICBOb25fQWxjb2hvbGljOiB7XG4gICAgICAgIGZpcnN0OiBbJycsICcnXSxcbiAgICAgICAgZnJpZW5kczogWydNaWxrJywgJyddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnQ29mZmVlJywgJ1RlYSddXG4gICAgfVxufVxuXG5cbi8vIGFwcC5nZXRNb3ZpZXModXNlckdlbnJlLCB1c2VyUmF0aW5nKTtcbi8vIHJlcXVlc3RpbmcgbW92aWUgaW5mbyBmcm9tIG1vdmllc0RCIEFQSVxuYXBwLmdldE1vdmllcyA9ICh1c2VyR2VucmUsIHVzZXJSYXRpbmcpID0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnLFxuICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZyAvLyByYXRpbmcgPj0gdXNlclJhdGluZ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdGFsUGFnZXMgPSByZXMudG90YWxfcGFnZXM7XG4gICAgICAgIGNvbnN0IHRvcFBvcHVsYXIgPSBNYXRoLmZsb29yKHRvdGFsUGFnZXMgKiAwLjIpO1xuICAgICAgICBjb25zdCBuZXdQYWdlTnVtYmVyID0gYXBwLmdldFJhbmROdW0odG9wUG9wdWxhcikrMTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgICAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJyxcbiAgICAgICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZywgLy8gcmF0aW5nID08IHVzZXJSYXRpbmdcbiAgICAgICAgICAgICAgICBwYWdlOiBuZXdQYWdlTnVtYmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gb24gcmFuZG9tIHBhZ2VcbiAgICAgICAgICAgIGNvbnN0IG1vdmllID0gcmVzLnJlc3VsdHNbYXBwLmdldFJhbmROdW0oMjApXVxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuXG4gICAgICAgICAgICAvLyBwdXQgbW92aWUgaW50byBIVE1MXG4gICAgICAgICAgICBhcHAuZGlzcGxheU1vdmllKG1vdmllKTtcbiAgICAgICAgfSlcbiAgICB9KVxufTtcblxuYXBwLmdldENvY2t0YWlsID0gKHNlYXJjaCk9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfSR7c2VhcmNofWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKSk7XG4gICAgICAgIGFwcC5yYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcblxuXG4gICAgICAgIGNvbnN0IG5ld1NlYXJjaCA9IGBmaWx0ZXIucGhwP2k9JHthcHAuZHJpbmtUeXBlfWA7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcC5kcmlua1R5cGUpO1xuXG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke25ld1NlYXJjaH1gLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgLy8gcmFuZG9tIGFycmF5IGZvciBkcmluayAtIGdldCBJRFxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRyaW5rc1thcHAucmFuZG9tRHJpbmtOdW1iZXJdLmlkRHJpbmspO1xuICAgICAgICAgICAgY29uc3QgZ2V0RHJpbmtCeUlkID0gcmVzLmRyaW5rc1thcHAucmFuZG9tRHJpbmtOdW1iZXJdLmlkRHJpbms7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfWxvb2t1cC5waHA/aT0ke2dldERyaW5rQnlJZH1gLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiBkcmluayBkYXRhXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZHJpbmtzWzBdKTtcbiAgICAgICAgICAgICAgICBhcHAuZGlzcGxheURyaW5rKHJlcy5kcmlua3NbMF0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH0pXG59XG5cbmFwcC5nZXREcmluayA9ICgpPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1maWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpY2AsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgIGNvbnN0IHJhbmRvbURyaW5rTnVtYmVyID0gYXBwLmdldFJhbmROdW0ocmVzLmRyaW5rcy5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLmxvZyhyYW5kb21Ecmlua051bWJlcik7XG5cbiAgICAgICAgY29uc3QgZHJpbmtJZCA9IHJlcy5kcmlua3NbcmFuZG9tRHJpbmtOdW1iZXJdLmlkRHJpbms7XG4gICAgICAgIGNvbnNvbGUubG9nKGRyaW5rSWQpO1xuXG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtkcmlua0lkfWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgYXBwLmRpc3BsYXlEcmluayhyZXMuZHJpbmtzWzBdKTtcbiAgICAgICAgfSlcblxuXG4gICAgfSlcbn1cblxuLy8gcmV0dXJuIHJhbmRvbSBudW1iZXJcbmFwcC5nZXRSYW5kTnVtID0gKG51bSkgPT4ge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pO1xufVxuXG5hcHAuZGlzcGxheU1vdmllID0gKG1vdmllKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBtb3ZpZS50aXRsZTtcbiAgICBjb25zdCBpbWdVcmwgPSBtb3ZpZS5wb3N0ZXJfcGF0aDtcbiAgICBjb25zdCByYXRpbmcgPSBtb3ZpZS52b3RlX2F2ZXJhZ2U7XG4gICAgY29uc3QgcmVsZWFzZURhdGUgPSBtb3ZpZS5yZWxlYXNlX2RhdGU7XG4gICAgY29uc3Qgb3ZlcnZpZXcgPSBtb3ZpZS5vdmVydmlldztcbiAgICAkKCcubW92aWVzLXJlc3VsdF9fY29udGFpbmVyJykuZW1wdHkoKTtcbiAgICAvLyBvdmVydmlld1xuICAgIC8vIHJlbGVhc2VfZGF0ZVxuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5hcHBlbmQoYFxuICAgICAgICA8aDMgY2xhc3M9XCJyZXN1bHQtdGl0bGVcIj4ke3RpdGxlfTwvaDM+XG4gICAgICAgIDxpbWcgc3JjPVwiJHthcHAubW92aWVzSW1hZ2VVUkwgK2FwcC5tb3ZpZXNJbWFnZVdpZHRoICsgaW1nVXJsfVwiIGNsYXNzPVwibW92aWUtaW1hZ2VcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWRkaXRpb25hbC1tb3ZpZS1pbmZvXCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJhdGluZ1wiPiR7cmF0aW5nfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibW92aWUtcmVsZWFzZS1kYXRlXCI+JHtyZWxlYXNlRGF0ZX08L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm1vdmllLW92ZXJ2aWV3XCI+JHtvdmVydmlld308L3A+XG4gICAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgLy8gJCgnLm1vdmllcy1yZXN1bHQnKS5jc3MoJ2JhY2tncm91bmQnLCBgdXJsKCR7YXBwLm1vdmllc0ltYWdlVVJMICsgYXBwLm1vdmllc0ltYWdlV2lkdGggKyBpbWdVcmx9KWApO1xuICAgIC8vICQoJy5tb3ZpZXMtcmVzdWx0JykuY3NzKCdiYWNrZ3JvdW5kLXJlcGVhdCcsICduby1yZXBlYXQnKTtcbiAgICAvLyAkKCcubW92aWVzLXJlc3VsdCcpLmNzcygnYmFja2dyb3VuZC1zaXplJywgJzEwMCUnKTtcbn1cblxuYXBwLmNsZWFuT2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICAgIGZvciAobGV0IHByb3BOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0W3Byb3BOYW1lXSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtwcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFwcC5kaXNwbGF5RHJpbmsgPSAoZHJpbmspID0+IHtcbiAgICBjb25zdCBuYW1lID0gZHJpbmsuc3RyRHJpbms7XG4gICAgY29uc3QgaW1nVXJsID0gZHJpbmsuc3RyRHJpbmtUaHVtYjtcblxuICAgIGNvbnN0IGluZ3JlZGllbnRzID0gT2JqZWN0LmtleXMoZHJpbmspLmZpbHRlcihmdW5jdGlvbihrKSB7XG4gICAgICAgIHJldHVybiBrLmluZGV4T2YoJ3N0ckluZ3JlZGllbnQnKSA9PSAwO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbihuZXdLZXksIGspIHtcbiAgICAgICAgbmV3S2V5W2tdID0gZHJpbmtba10udHJpbSgpO1xuICAgICAgICByZXR1cm4gbmV3S2V5O1xuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IG1lYXN1cmVtZW50cyA9IE9iamVjdC5rZXlzKGRyaW5rKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIGsuaW5kZXhPZignc3RyTWVhc3VyZScpID09IDA7XG4gICAgfSkucmVkdWNlKGZ1bmN0aW9uIChuZXdLZXksIGspIHtcbiAgICAgICAgbmV3S2V5W2tdID0gZHJpbmtba10udHJpbSgpO1xuICAgICAgICByZXR1cm4gbmV3S2V5O1xuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGRyaW5rLnN0ckluc3RydWN0aW9ucztcblxuICAgIGFwcC5jbGVhbk9iamVjdChpbmdyZWRpZW50cyk7XG4gICAgYXBwLmNsZWFuT2JqZWN0KG1lYXN1cmVtZW50cyk7XG5cbiAgICBjb25zdCBtZWFzdXJlbWVudHNMaXN0ID0gJCgnPHVsPicpLmFkZENsYXNzKCdtZWFzdXJlbWVudC1saXN0Jyk7XG4gICAgY29uc3QgaW5ncmVkaWVudExpc3QgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ2luZ3JlZGllbnQtbGlzdCcpO1xuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBtZWFzdXJlbWVudHMpIHtcbiAgICAgICAgY29uc3QgbGkgPSAkKCc8bGk+JykudGV4dChtZWFzdXJlbWVudHNbcHJvcF0pO1xuICAgICAgICBtZWFzdXJlbWVudHNMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBpbmdyZWRpZW50cykge1xuICAgICAgICBjb25zdCBsaSA9ICQoJzxsaT4nKS50ZXh0KGluZ3JlZGllbnRzW3Byb3BdKTtcbiAgICAgICAgaW5ncmVkaWVudExpc3QuYXBwZW5kKGxpKTtcbiAgICB9XG5cblxuICAgICQoJy5kcmlua3MtcmVzdWx0X19jb250YWluZXInKS5lbXB0eSgpO1xuICAgICQoJy5kcmlua3MtcmVzdWx0X19jb250YWluZXInKS5hcHBlbmQoYFxuICAgICAgICA8aDMgY2xhc3M9XCJyZXN1bHQtdGl0bGVcIj4ke25hbWV9PC9oMz5cbiAgICAgICAgPGltZyBzcmM9XCIke2ltZ1VybH1cIiBjbGFzcz1cImRyaW5rLWltYWdlXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFkZGl0aW9uYWwtZHJpbmstaW5mb1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImluZ3JlZGllbnRzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgJCgnLmluZ3JlZGllbnRzLWNvbnRhaW5lcicpLmFwcGVuZChtZWFzdXJlbWVudHNMaXN0LCBpbmdyZWRpZW50TGlzdCk7XG4gICAgJCgnLmFkZGl0aW9uYWwtZHJpbmstaW5mbycpLmFwcGVuZChgPHA+JHtpbnN0cnVjdGlvbnN9PC9wPmApO1xuXG4gICAgLy8gJCgnLmRyaW5rcy1yZXN1bHQnKS5jc3MoJ2JhY2tncm91bmQnLCBgdXJsKCR7aW1nVXJsfSlgKTtcbn1cblxuYXBwLmdlbmVyYXRlRHJpbmsgPSAoYWxjb2hvbGljKSA9PiB7XG4gICAgaWYgKGFsY29ob2xpYyA9PT0gJ0FsY29ob2xpYycpIHtcbiAgICAgICAgYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9JHthcHAuZHJpbmtUeXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcC5nZXREcmluaygpXG4gICAgfVxufVxuXG5hcHAuZXZlbnRzID0gKCkgPT4ge1xuICAgICQoJyNzdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZ2VucmVDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Z2VucmVdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleE1heCA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXggPSBhcHAuZ2V0UmFuZE51bShnZW5yZUluZGV4TWF4KTtcblxuICAgICAgICBhcHAudXNlckdlbnJlID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldW2dlbnJlSW5kZXhdO1xuICAgICAgICBhcHAudXNlclJhdGluZyA9IHBhcnNlSW50KCQoJ2lucHV0W25hbWU9cmF0aW5nXTpjaGVja2VkJykudmFsKCkpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcblxuICAgICAgICAvL2NvY2t0YWlsIGFwaVxuICAgICAgICBhcHAuYWxjb2hvbGljID0gJCgnaW5wdXRbbmFtZT1hbGNvaG9sXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWNhdGVnb3J5XTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQXJyYXkgPSBhcHAuY29ja3RhaWxDYXRlZ29yeVthcHAuYWxjb2hvbGljXVtkcmlua0NhdGVnb3J5XTtcbiAgICAgICAgY29uc3QgZHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShkcmlua0FycmF5Lmxlbmd0aCk7XG4gICAgICAgIGFwcC5kcmlua1R5cGUgPSBkcmlua0FycmF5W2RyaW5rTnVtYmVyXTtcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmRyaW5rVHlwZSk7XG5cbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgICAgIC8vIGdldCBhcnJheSBvZiBkcmlua3MgYnkgdHlwZSAtIHdpbmUvc2hha2UvZXRjXG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxuXG4gICAgJCgnLmFub3RoZXItZHJpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgfSlcblxuICAgICQoJyNwbGFuQW5vdGhlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KVxufTtcblxuLy8gaW5pdCBmdW5jdGlvblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpY2ApO1xuXG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9Q29mZmVlYCk7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBsb29rdXAucGhwP2k9MTI3NzBgKTtcblxuICAgIGFwcC5ldmVudHMoKTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
