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
    convo: [80, 99, 9648], // crime, documentary, mystery
    laughs: [35, 12, 18, 10751], // comedy, adventure, drama, family
    cuddles: [27, 10749, 53] // horror, romance, thriller
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

            // put movie into HTML
            app.displayMovie(movie);
        });
    });
};

// app.getCocktail(cocktailID);
// requesting cocktail(alcoholic) information from cocktailDB
app.getCocktail = function (search) {
    $.ajax({
        url: '' + app.cocktailBaseURL + search,
        method: 'GET',
        dataType: 'json',
        data: {
            key: '1'
        }
    }).then(function (res) {
        app.randomDrinkNumber = app.getRandNum(res.drinks.length);
        var newSearch = 'filter.php?i=' + app.drinkType;

        $.ajax({
            url: '' + app.cocktailBaseURL + newSearch,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then(function (res) {
            var getDrinkById = res.drinks[app.randomDrinkNumber].idDrink;

            $.ajax({
                url: app.cocktailBaseURL + 'lookup.php?i=' + getDrinkById,
                method: 'GET',
                dataType: 'json',
                data: {
                    key: '1'
                }
            }).then(function (res) {
                app.displayDrink(res.drinks[0]);
            });
        });
    });
};

// app.getDrink();
// requesting drink(non-alcoholic) information from cocktailDB
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
        var drinkId = res.drinks[randomDrinkNumber].idDrink;

        $.ajax({
            url: app.cocktailBaseURL + 'lookup.php?i=' + drinkId,
            method: 'GET',
            dataType: 'json',
            data: {
                key: '1'
            }
        }).then(function (res) {
            app.displayDrink(res.drinks[0]);
        });
    });
};

// app.getRandNum(num);
// returns a random number from 0 up to num (exclusive)
app.getRandNum = function (num) {
    return Math.floor(Math.random() * num);
};

// app.displayMovie(movie)
// puts movie information on to html
app.displayMovie = function (movie) {
    var title = movie.title;
    var imgUrl = movie.poster_path;
    var rating = movie.vote_average;
    var releaseDate = movie.release_date;
    var overview = movie.overview;
    $('.movies-result__container').empty();
    $('.movies-result__container').append('\n        <h3 class="result-title">' + title + '</h3>\n\n        <button class="button more-info more-info--movies">i</button>\n\n        <div class="results__image-container">\n            <img src="images/ticket.svg" class="ticket-svg">\n            <img src="' + (app.moviesImageURL + app.moviesImageWidth + imgUrl) + '" class="movie-image">\n        </div>\n\n\n        <div class="additional-movie-info">\n            <i class="fas fa-times"></i>\n            <h3>' + title + '</h3>\n            <p class="movie-rating">' + rating + '</p>\n            <p class="movie-release-date">' + releaseDate + '</p>\n            <p class="movie-overview">' + overview + '</p>\n        </div>\n    ');
};

// app.cleanObject(object);
// removes property names with no significant value from object
app.cleanObject = function (object) {
    for (var propName in object) {
        if (object[propName] === "") {
            delete object[propName];
        }
    }
};

// app.displayDrink(drink)
// puts drink information on to html
app.displayDrink = function (drink) {
    var name = drink.strDrink;
    var imgUrl = drink.strDrinkThumb;

    var ingredients = Object.keys(drink).filter(function (k) {
        return k.indexOf('strIngredient') == 0;
    }).reduce(function (newKey, k) {
        if (drink[k] != null) {
            newKey[k] = drink[k].trim();
            return newKey;
        }
    }, {});

    var measurements = Object.keys(drink).filter(function (k) {
        return k.indexOf('strMeasure') == 0;
    }).reduce(function (newKey, k) {
        if (drink[k] != null) {
            newKey[k] = drink[k].trim();
            return newKey;
        }
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
    $('.drinks-result__container').append('\n        <h3 class="result-title">' + name + '</h3>\n        <button class="button more-info more-info--drinks">i</button>\n\n        <div class="results__image-container">\n            <img src="images/cocktail.svg" class="cocktail-svg">\n            <img src="' + imgUrl + '" class="drink-image">\n        </div>\n\n        <div class="additional-drink-info">\n            <i class="fas fa-times"></i>\n            <h3>' + name + '</h3>\n            <div class="ingredients-container">\n            </div>\n        </div>\n    ');

    $('.ingredients-container').append(measurementsList, ingredientList);
    $('.additional-drink-info').append('<p>' + instructions + '</p>');

    // $('.drinks-result').css('background', `url(${imgUrl})`);
};

// app.generateDrink(alcoholic);
// calls appropraite alcoholic/non-alcohlic API request functions
app.generateDrink = function (alcoholic) {
    if (alcoholic === 'Alcoholic') {
        app.getCocktail('filter.php?i=' + app.drinkType);
    } else {
        app.getDrink();
    }
};

// app.events();
// kicks off all event listeners on app
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
        $(window).scrollTop(0);
        location.reload();
    });

    $('body').on('click', '.more-info--drinks', function () {
        $('.additional-drink-info').css('display', 'flex');
    });

    $('body').on('click', '.more-info--movies', function () {
        $('.additional-movie-info').css('display', 'flex');
    });

    $('body').on('click', '.fa-times', function () {
        $('.additional-drink-info').css('display', 'none');
    });

    $('body').on('click', '.fa-times', function () {
        $('.additional-movie-info').css('display', 'none');
    });

    $('.question-button').on('click', function (e) {
        e.preventDefault();
        $('.question-modal').toggleClass('show');
        $('.question-modal').hasClass('show') ? $('.question-button').html("X") : $('.question-button').html("?");
    });

    $(".button--header").click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#section1").offset().top
        }, 1000);
    });

    $('input[name=category]').click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#section2").offset().top
        }, 700);
    });

    $('input[name=genre]').click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#section3").offset().top
        }, 700);
    });

    $('input[name=rating]').click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#section4").offset().top
        }, 700);
    });

    $('input[name=alcohol]').click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#submit").offset().top
        }, 700);
    });

    $("#submit").click(function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#section-results").offset().top
        }, 1000);
    });
};

// init function
app.init = function () {
    app.events();
};

// ready
$(function () {
    console.log("ready");
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLElBQU0sTUFBTSxFQUFaO0FBQ0EsSUFBSSxNQUFKLEdBQWEsRUFBRSxTQUFGLENBQWI7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxjQUFKLEdBQXFCLDZCQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsTUFBdkI7QUFDQSxJQUFJLFlBQUosR0FBbUIsa0NBQW5CO0FBQ0EsSUFBSSxTQUFKO0FBQ0EsSUFBSSxjQUFKLEdBQXFCO0FBQ2pCLFdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLElBQVQsQ0FEVSxFQUNNO0FBQ3ZCLFlBQVEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxLQUFiLENBRlMsRUFFWTtBQUM3QixhQUFTLENBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxFQUFaLENBSFEsQ0FHUTtBQUhSLENBQXJCOztBQU1BO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLDhDQUF0QjtBQUNBLElBQUksZ0JBQUosR0FBdUI7QUFDbkIsZUFBVztBQUNQLGVBQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixRQUFoQixDQURBO0FBRVAsaUJBQVMsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixLQUFyQixDQUZGO0FBR1Asc0JBQWMsQ0FBQyxTQUFELEVBQVksS0FBWjtBQUhQLEtBRFE7QUFNZjtBQUNKLG1CQUFlO0FBQ1gsZUFBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBREk7QUFFWCxpQkFBUyxDQUFDLE1BQUQsRUFBUyxFQUFULENBRkU7QUFHWCxzQkFBYyxDQUFDLFFBQUQsRUFBVyxLQUFYO0FBSEg7O0FBT25CO0FBQ0E7QUFmdUIsQ0FBdkIsQ0FnQkEsSUFBSSxTQUFKLEdBQWdCLFVBQUMsU0FBRCxFQUFZLFVBQVosRUFB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O0FBR0gsS0FKRDtBQU9ILENBdEdEOztBQXdHQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYixRQUFJLE1BQUo7QUFDSCxDQUZEOztBQUlBO0FBQ0EsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtYWluIGFwcCBvYmplY3RcbmNvbnN0IGFwcCA9IHt9O1xuYXBwLnN1Ym1pdCA9ICQoJyNzdWJtaXQnKTtcblxuLy8gbW92aWVzREIgcHJvcGVydGllc1xuYXBwLm1vdmllc0Jhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMyc7XG5hcHAubW92aWVzSW1hZ2VVUkwgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvJztcbmFwcC5tb3ZpZXNJbWFnZVdpZHRoID0gJ3c3ODAnO1xuYXBwLm1vdmllc0FQSUtleSA9ICcwZjA3NDk4MmYwZTZhOTk5ZDU5ODY1ZGZmMjE4NGU4Nic7XG5hcHAubW92aWVQYWdlO1xuYXBwLm1vdmllc0dlbnJlSURzID0ge1xuICAgIGNvbnZvOiBbODAsIDk5LCA5NjQ4XSwgLy8gY3JpbWUsIGRvY3VtZW50YXJ5LCBteXN0ZXJ5XG4gICAgbGF1Z2hzOiBbMzUsIDEyLCAxOCwgMTA3NTFdLCAvLyBjb21lZHksIGFkdmVudHVyZSwgZHJhbWEsIGZhbWlseVxuICAgIGN1ZGRsZXM6IFsyNywgMTA3NDksIDUzXSAvLyBob3Jyb3IsIHJvbWFuY2UsIHRocmlsbGVyXG59O1xuXG4vLyBjb2NrdGFpbCBwcm9wZXJ0aWVzXG5hcHAuY29ja3RhaWxCYXNlVVJMID0gJ2h0dHBzOi8vd3d3LnRoZWNvY2t0YWlsZGIuY29tL2FwaS9qc29uL3YxLzEvJztcbmFwcC5jb2NrdGFpbENhdGVnb3J5ID0ge1xuICAgIEFsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWydXaW5lJywgJ0dpbicsICdCcmFuZHknXSxcbiAgICAgICAgZnJpZW5kczogWydUZXF1aWxhJywgJ1ZvZGthJywgJ1J1bSddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnV2hpc2tleScsICdSdW0nXVxuICAgIH0sXG4gICAgICAgIC8vIGFkZCBsaXRlcmFsc1xuICAgIE5vbl9BbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnJywgJyddLFxuICAgICAgICBmcmllbmRzOiBbJ01pbGsnLCAnJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydDb2ZmZWUnLCAnVGVhJ11cbiAgICB9XG59XG5cbi8vIGFwcC5nZXRNb3ZpZXModXNlckdlbnJlLCB1c2VyUmF0aW5nKTtcbi8vIHJlcXVlc3RpbmcgbW92aWUgaW5mbyBmcm9tIG1vdmllc0RCIEFQSVxuYXBwLmdldE1vdmllcyA9ICh1c2VyR2VucmUsIHVzZXJSYXRpbmcpID0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwcC5tb3ZpZXNBUElLZXksXG4gICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnLFxuICAgICAgICAgICAgd2l0aF9nZW5yZXM6IHVzZXJHZW5yZSwgLy8gZ2VucmUgaWRcbiAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZyAvLyByYXRpbmcgPj0gdXNlclJhdGluZ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdGFsUGFnZXMgPSByZXMudG90YWxfcGFnZXM7XG4gICAgICAgIGNvbnN0IHRvcFBvcHVsYXIgPSBNYXRoLmZsb29yKHRvdGFsUGFnZXMgKiAwLjIpO1xuICAgICAgICBjb25zdCBuZXdQYWdlTnVtYmVyID0gYXBwLmdldFJhbmROdW0odG9wUG9wdWxhcikrMTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAubW92aWVzQmFzZVVSTH0vZGlzY292ZXIvbW92aWVgLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICAgICAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJyxcbiAgICAgICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgICAgICd2b3RlX2F2ZXJhZ2UuZ3RlJzogdXNlclJhdGluZywgLy8gcmF0aW5nID08IHVzZXJSYXRpbmdcbiAgICAgICAgICAgICAgICBwYWdlOiBuZXdQYWdlTnVtYmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gb24gcmFuZG9tIHBhZ2VcbiAgICAgICAgICAgIGNvbnN0IG1vdmllID0gcmVzLnJlc3VsdHNbYXBwLmdldFJhbmROdW0oMjApXVxuXG4gICAgICAgICAgICAvLyBwdXQgbW92aWUgaW50byBIVE1MXG4gICAgICAgICAgICBhcHAuZGlzcGxheU1vdmllKG1vdmllKTtcbiAgICAgICAgfSlcbiAgICB9KVxufTtcblxuLy8gYXBwLmdldENvY2t0YWlsKGNvY2t0YWlsSUQpO1xuLy8gcmVxdWVzdGluZyBjb2NrdGFpbChhbGNvaG9saWMpIGluZm9ybWF0aW9uIGZyb20gY29ja3RhaWxEQlxuYXBwLmdldENvY2t0YWlsID0gKHNlYXJjaCk9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfSR7c2VhcmNofWAsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpPT4ge1xuICAgICAgICBhcHAucmFuZG9tRHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IG5ld1NlYXJjaCA9IGBmaWx0ZXIucGhwP2k9JHthcHAuZHJpbmtUeXBlfWA7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH0ke25ld1NlYXJjaH1gLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgY29uc3QgZ2V0RHJpbmtCeUlkID0gcmVzLmRyaW5rc1thcHAucmFuZG9tRHJpbmtOdW1iZXJdLmlkRHJpbms7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfWxvb2t1cC5waHA/aT0ke2dldERyaW5rQnlJZH1gLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlEcmluayhyZXMuZHJpbmtzWzBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KVxufVxuXG4vLyBhcHAuZ2V0RHJpbmsoKTtcbi8vIHJlcXVlc3RpbmcgZHJpbmsobm9uLWFsY29ob2xpYykgaW5mb3JtYXRpb24gZnJvbSBjb2NrdGFpbERCXG5hcHAuZ2V0RHJpbmsgPSAoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9ZmlsdGVyLnBocD9hPU5vbl9BbGNvaG9saWNgLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICB9XG4gICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICBjb25zdCByYW5kb21Ecmlua051bWJlciA9IGFwcC5nZXRSYW5kTnVtKHJlcy5kcmlua3MubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgZHJpbmtJZCA9IHJlcy5kcmlua3NbcmFuZG9tRHJpbmtOdW1iZXJdLmlkRHJpbms7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYCR7YXBwLmNvY2t0YWlsQmFzZVVSTH1sb29rdXAucGhwP2k9JHtkcmlua0lkfWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICBhcHAuZGlzcGxheURyaW5rKHJlcy5kcmlua3NbMF0pO1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbi8vIGFwcC5nZXRSYW5kTnVtKG51bSk7XG4vLyByZXR1cm5zIGEgcmFuZG9tIG51bWJlciBmcm9tIDAgdXAgdG8gbnVtIChleGNsdXNpdmUpXG5hcHAuZ2V0UmFuZE51bSA9IChudW0pID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKTtcbn1cblxuLy8gYXBwLmRpc3BsYXlNb3ZpZShtb3ZpZSlcbi8vIHB1dHMgbW92aWUgaW5mb3JtYXRpb24gb24gdG8gaHRtbFxuYXBwLmRpc3BsYXlNb3ZpZSA9IChtb3ZpZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gbW92aWUudGl0bGU7XG4gICAgY29uc3QgaW1nVXJsID0gbW92aWUucG9zdGVyX3BhdGg7XG4gICAgY29uc3QgcmF0aW5nID0gbW92aWUudm90ZV9hdmVyYWdlO1xuICAgIGNvbnN0IHJlbGVhc2VEYXRlID0gbW92aWUucmVsZWFzZV9kYXRlO1xuICAgIGNvbnN0IG92ZXJ2aWV3ID0gbW92aWUub3ZlcnZpZXc7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmFwcGVuZChgXG4gICAgICAgIDxoMyBjbGFzcz1cInJlc3VsdC10aXRsZVwiPiR7dGl0bGV9PC9oMz5cblxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIG1vcmUtaW5mbyBtb3JlLWluZm8tLW1vdmllc1wiPmk8L2J1dHRvbj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwicmVzdWx0c19faW1hZ2UtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cImltYWdlcy90aWNrZXQuc3ZnXCIgY2xhc3M9XCJ0aWNrZXQtc3ZnXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIiR7YXBwLm1vdmllc0ltYWdlVVJMICthcHAubW92aWVzSW1hZ2VXaWR0aCArIGltZ1VybH1cIiBjbGFzcz1cIm1vdmllLWltYWdlXCI+XG4gICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFkZGl0aW9uYWwtbW92aWUtaW5mb1wiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+XG4gICAgICAgICAgICA8aDM+JHt0aXRsZX08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJtb3ZpZS1yYXRpbmdcIj4ke3JhdGluZ308L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cIm1vdmllLXJlbGVhc2UtZGF0ZVwiPiR7cmVsZWFzZURhdGV9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJtb3ZpZS1vdmVydmlld1wiPiR7b3ZlcnZpZXd9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICBgKTtcbn1cblxuLy8gYXBwLmNsZWFuT2JqZWN0KG9iamVjdCk7XG4vLyByZW1vdmVzIHByb3BlcnR5IG5hbWVzIHdpdGggbm8gc2lnbmlmaWNhbnQgdmFsdWUgZnJvbSBvYmplY3RcbmFwcC5jbGVhbk9iamVjdCA9IChvYmplY3QpID0+IHtcbiAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdFtwcm9wTmFtZV0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBhcHAuZGlzcGxheURyaW5rKGRyaW5rKVxuLy8gcHV0cyBkcmluayBpbmZvcm1hdGlvbiBvbiB0byBodG1sXG5hcHAuZGlzcGxheURyaW5rID0gKGRyaW5rKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGRyaW5rLnN0ckRyaW5rO1xuICAgIGNvbnN0IGltZ1VybCA9IGRyaW5rLnN0ckRyaW5rVGh1bWI7XG5cbiAgICBjb25zdCBpbmdyZWRpZW50cyA9IE9iamVjdC5rZXlzKGRyaW5rKS5maWx0ZXIoZnVuY3Rpb24oaykge1xuICAgICAgICByZXR1cm4gay5pbmRleE9mKCdzdHJJbmdyZWRpZW50JykgPT0gMDtcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24obmV3S2V5LCBrKSB7XG4gICAgICAgIGlmIChkcmlua1trXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBuZXdLZXlba10gPSBkcmlua1trXS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3S2V5O1xuICAgICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgY29uc3QgbWVhc3VyZW1lbnRzID0gT2JqZWN0LmtleXMoZHJpbmspLmZpbHRlcihmdW5jdGlvbiAoaykge1xuICAgICAgICByZXR1cm4gay5pbmRleE9mKCdzdHJNZWFzdXJlJykgPT0gMDtcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKG5ld0tleSwgaykge1xuICAgICAgICBpZiAoZHJpbmtba10gIT0gbnVsbCkge1xuICAgICAgICAgICAgbmV3S2V5W2tdID0gZHJpbmtba10udHJpbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld0tleTtcbiAgICAgICAgfVxuICAgIH0sIHt9KTtcblxuICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGRyaW5rLnN0ckluc3RydWN0aW9ucztcblxuICAgIGFwcC5jbGVhbk9iamVjdChpbmdyZWRpZW50cyk7XG4gICAgYXBwLmNsZWFuT2JqZWN0KG1lYXN1cmVtZW50cyk7XG5cbiAgICBjb25zdCBtZWFzdXJlbWVudHNMaXN0ID0gJCgnPHVsPicpLmFkZENsYXNzKCdtZWFzdXJlbWVudC1saXN0Jyk7XG4gICAgY29uc3QgaW5ncmVkaWVudExpc3QgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ2luZ3JlZGllbnQtbGlzdCcpO1xuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBtZWFzdXJlbWVudHMpIHtcbiAgICAgICAgY29uc3QgbGkgPSAkKCc8bGk+JykudGV4dChtZWFzdXJlbWVudHNbcHJvcF0pO1xuICAgICAgICBtZWFzdXJlbWVudHNMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcHJvcCBpbiBpbmdyZWRpZW50cykge1xuICAgICAgICBjb25zdCBsaSA9ICQoJzxsaT4nKS50ZXh0KGluZ3JlZGllbnRzW3Byb3BdKTtcbiAgICAgICAgaW5ncmVkaWVudExpc3QuYXBwZW5kKGxpKTtcbiAgICB9XG5cbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuZW1wdHkoKTtcbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuYXBwZW5kKGBcbiAgICAgICAgPGgzIGNsYXNzPVwicmVzdWx0LXRpdGxlXCI+JHtuYW1lfTwvaDM+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gbW9yZS1pbmZvIG1vcmUtaW5mby0tZHJpbmtzXCI+aTwvYnV0dG9uPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyZXN1bHRzX19pbWFnZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiaW1hZ2VzL2NvY2t0YWlsLnN2Z1wiIGNsYXNzPVwiY29ja3RhaWwtc3ZnXCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIiR7aW1nVXJsfVwiIGNsYXNzPVwiZHJpbmstaW1hZ2VcIj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFkZGl0aW9uYWwtZHJpbmstaW5mb1wiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+XG4gICAgICAgICAgICA8aDM+JHtuYW1lfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5ncmVkaWVudHMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICAkKCcuaW5ncmVkaWVudHMtY29udGFpbmVyJykuYXBwZW5kKG1lYXN1cmVtZW50c0xpc3QsIGluZ3JlZGllbnRMaXN0KTtcbiAgICAkKCcuYWRkaXRpb25hbC1kcmluay1pbmZvJykuYXBwZW5kKGA8cD4ke2luc3RydWN0aW9uc308L3A+YCk7XG5cbiAgICAvLyAkKCcuZHJpbmtzLXJlc3VsdCcpLmNzcygnYmFja2dyb3VuZCcsIGB1cmwoJHtpbWdVcmx9KWApO1xufVxuXG4vLyBhcHAuZ2VuZXJhdGVEcmluayhhbGNvaG9saWMpO1xuLy8gY2FsbHMgYXBwcm9wcmFpdGUgYWxjb2hvbGljL25vbi1hbGNvaGxpYyBBUEkgcmVxdWVzdCBmdW5jdGlvbnNcbmFwcC5nZW5lcmF0ZURyaW5rID0gKGFsY29ob2xpYykgPT4ge1xuICAgIGlmIChhbGNvaG9saWMgPT09ICdBbGNvaG9saWMnKSB7XG4gICAgICAgIGFwcC5nZXRDb2NrdGFpbChgZmlsdGVyLnBocD9pPSR7YXBwLmRyaW5rVHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcHAuZ2V0RHJpbmsoKVxuICAgIH1cbn1cblxuLy8gYXBwLmV2ZW50cygpO1xuLy8ga2lja3Mgb2ZmIGFsbCBldmVudCBsaXN0ZW5lcnMgb24gYXBwXG5hcHAuZXZlbnRzID0gKCkgPT4ge1xuICAgICQoJyNzdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZ2VucmVDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Z2VucmVdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleE1heCA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXggPSBhcHAuZ2V0UmFuZE51bShnZW5yZUluZGV4TWF4KTtcblxuICAgICAgICBhcHAudXNlckdlbnJlID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldW2dlbnJlSW5kZXhdO1xuICAgICAgICBhcHAudXNlclJhdGluZyA9IHBhcnNlSW50KCQoJ2lucHV0W25hbWU9cmF0aW5nXTpjaGVja2VkJykudmFsKCkpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcblxuICAgICAgICAvL2NvY2t0YWlsIGFwaVxuICAgICAgICBhcHAuYWxjb2hvbGljID0gJCgnaW5wdXRbbmFtZT1hbGNvaG9sXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWNhdGVnb3J5XTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQXJyYXkgPSBhcHAuY29ja3RhaWxDYXRlZ29yeVthcHAuYWxjb2hvbGljXVtkcmlua0NhdGVnb3J5XTtcbiAgICAgICAgY29uc3QgZHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShkcmlua0FycmF5Lmxlbmd0aCk7XG4gICAgICAgIGFwcC5kcmlua1R5cGUgPSBkcmlua0FycmF5W2RyaW5rTnVtYmVyXTtcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmRyaW5rVHlwZSk7XG5cbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgICAgIC8vIGdldCBhcnJheSBvZiBkcmlua3MgYnkgdHlwZSAtIHdpbmUvc2hha2UvZXRjXG4gICAgICAgICQoJy5zZWN0aW9uLS1yZXN1bHRzJykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3llcycpO1xuXG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxuXG4gICAgJCgnLmFub3RoZXItZHJpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgfSlcblxuICAgICQoJyNwbGFuQW5vdGhlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KVxuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubW9yZS1pbmZvLS1kcmlua3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5hZGRpdGlvbmFsLWRyaW5rLWluZm8nKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubW9yZS1pbmZvLS1tb3ZpZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5hZGRpdGlvbmFsLW1vdmllLWluZm8nKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuXG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5mYS10aW1lcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmFkZGl0aW9uYWwtZHJpbmstaW5mbycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5mYS10aW1lcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmFkZGl0aW9uYWwtbW92aWUtaW5mbycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSk7XG5cbiAgICAkKCcucXVlc3Rpb24tYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJy5xdWVzdGlvbi1tb2RhbCcpLnRvZ2dsZUNsYXNzKCdzaG93Jyk7XG4gICAgICAgICQoJy5xdWVzdGlvbi1tb2RhbCcpLmhhc0NsYXNzKCdzaG93JykgPyAkKCcucXVlc3Rpb24tYnV0dG9uJykuaHRtbChcIlhcIikgOiAkKCcucXVlc3Rpb24tYnV0dG9uJykuaHRtbChcIj9cIik7XG4gICAgfSlcblxuICAgICQoXCIuYnV0dG9uLS1oZWFkZXJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNzZWN0aW9uMVwiKS5vZmZzZXQoKS50b3BcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG5cbiAgICAkKCdpbnB1dFtuYW1lPWNhdGVnb3J5XScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjc2VjdGlvbjJcIikub2Zmc2V0KCkudG9wXG4gICAgICAgIH0sIDcwMCk7XG4gICAgfSk7XG5cbiAgICAkKCdpbnB1dFtuYW1lPWdlbnJlXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjc2VjdGlvbjNcIikub2Zmc2V0KCkudG9wXG4gICAgICAgIH0sIDcwMCk7XG4gICAgfSk7XG5cbiAgICAkKCdpbnB1dFtuYW1lPXJhdGluZ10nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKFwiI3NlY3Rpb240XCIpLm9mZnNldCgpLnRvcFxuICAgICAgICB9LCA3MDApO1xuICAgIH0pO1xuXG4gICAgJCgnaW5wdXRbbmFtZT1hbGNvaG9sXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjc3VibWl0XCIpLm9mZnNldCgpLnRvcFxuICAgICAgICB9LCA3MDApO1xuICAgIH0pO1xuXG4gICAgJChcIiNzdWJtaXRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNzZWN0aW9uLXJlc3VsdHNcIikub2Zmc2V0KCkudG9wXG4gICAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuXG5cbn07XG5cbi8vIGluaXQgZnVuY3Rpb25cbmFwcC5pbml0ID0gKCkgPT4ge1xuICAgIGFwcC5ldmVudHMoKTtcbn1cblxuLy8gcmVhZHlcbiQoZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJyZWFkeVwiKTtcbiAgICBhcHAuaW5pdCgpO1xufSkiXX0=
