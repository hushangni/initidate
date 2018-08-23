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
    var releaseDate = movie.release_date;
    var overview = movie.overview;
    $('.movies-result__container').empty();
    // overview
    // release_date
    $('.movies-result__container').append('\n        <h3 class="result-title">' + title + '</h3>\n        <img src="' + (app.moviesImageURL + app.moviesImageWidth + imgUrl) + '" class="movie-image">\n\n        <div class="additional-movie-info">\n            <p class="movie-rating">' + rating + '</p>\n            <p class="movie-release-date">' + releaseDate + '</p>\n            <p class="movie-overview">' + overview + '</p>\n        </div>\n    ');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLElBQU0sTUFBTSxFQUFaO0FBQ0EsSUFBSSxNQUFKLEdBQWEsRUFBRSxTQUFGLENBQWI7O0FBRUE7QUFDQSxJQUFJLGFBQUosR0FBb0IsOEJBQXBCO0FBQ0EsSUFBSSxjQUFKLEdBQXFCLDZCQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsTUFBdkI7QUFDQSxJQUFJLFlBQUosR0FBbUIsa0NBQW5CO0FBQ0EsSUFBSSxTQUFKO0FBQ0EsSUFBSSxjQUFKLEdBQXFCO0FBQ2pCLFdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLElBQVQsQ0FEVTtBQUVqQixZQUFRLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsS0FBYixDQUZTO0FBR2pCLGFBQVMsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLEVBQVo7QUFIUSxDQUFyQjs7QUFNQTtBQUNBLElBQUksZUFBSixHQUFzQiw4Q0FBdEI7QUFDQSxJQUFJLGdCQUFKLEdBQXVCO0FBQ25CLGVBQVc7QUFDUCxlQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FEQTtBQUVQLGlCQUFTLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FGRjtBQUdQLHNCQUFjLENBQUMsU0FBRCxFQUFZLEtBQVo7QUFIUCxLQURRO0FBTWY7QUFDSixtQkFBZTtBQUNYLGVBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQURJO0FBRVgsaUJBQVMsQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUZFO0FBR1gsc0JBQWMsQ0FBQyxRQUFELEVBQVcsS0FBWDtBQUhIOztBQVFuQjtBQUNBO0FBaEJ1QixDQUF2QixDQWlCQSxJQUFJLFNBQUosR0FBZ0IsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN2QyxNQUFFLElBQUYs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QUFTLENBQVQsRUFBWTtBQUN0QyxVQUFFLGNBQUY7QUFDQSxpQkFBUyxNQUFUO0FBQ0gsS0FIRDtBQUlILENBckNEOztBQXVDQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQU07QUFDYjs7QUFFQTtBQUNBOztBQUVBLFFBQUksTUFBSjtBQUNILENBUEQ7O0FBU0EsRUFBRSxZQUFXO0FBQ1QsWUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUksSUFBSjtBQUNILENBSEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtYWluIGFwcCBvYmplY3RcbmNvbnN0IGFwcCA9IHt9O1xuYXBwLnN1Ym1pdCA9ICQoJyNzdWJtaXQnKTtcblxuLy8gbW92aWVzREIgcHJvcGVydGllc1xuYXBwLm1vdmllc0Jhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMyc7XG5hcHAubW92aWVzSW1hZ2VVUkwgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvJztcbmFwcC5tb3ZpZXNJbWFnZVdpZHRoID0gJ3cxODUnO1xuYXBwLm1vdmllc0FQSUtleSA9ICcwZjA3NDk4MmYwZTZhOTk5ZDU5ODY1ZGZmMjE4NGU4Nic7XG5hcHAubW92aWVQYWdlO1xuYXBwLm1vdmllc0dlbnJlSURzID0ge1xuICAgIGNvbnZvOiBbODAsIDk5LCA5NjQ4XSxcbiAgICBsYXVnaHM6IFszNSwgMTIsIDE4LCAxMDc1MV0sXG4gICAgY3VkZGxlczogWzI3LCAxMDc0OSwgNTNdXG59O1xuXG4vLyBjb2NrdGFpbCBwcm9wZXJ0aWVzXG5hcHAuY29ja3RhaWxCYXNlVVJMID0gJ2h0dHBzOi8vd3d3LnRoZWNvY2t0YWlsZGIuY29tL2FwaS9qc29uL3YxLzEvJztcbmFwcC5jb2NrdGFpbENhdGVnb3J5ID0ge1xuICAgIEFsY29ob2xpYzoge1xuICAgICAgICBmaXJzdDogWydXaW5lJywgJ0dpbicsICdCcmFuZHknXSxcbiAgICAgICAgZnJpZW5kczogWydUZXF1aWxhJywgJ1ZvZGthJywgJ1J1bSddLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFsnV2hpc2tleScsICdSdW0nXVxuICAgIH0sXG4gICAgICAgIC8vIGFkZCBsaXRlcmFsc1xuICAgIE5vbl9BbGNvaG9saWM6IHtcbiAgICAgICAgZmlyc3Q6IFsnJywgJyddLFxuICAgICAgICBmcmllbmRzOiBbJ01pbGsnLCAnJ10sXG4gICAgICAgIHJlbGF0aW9uc2hpcDogWydDb2ZmZWUnLCAnVGVhJ11cbiAgICB9XG59XG5cblxuLy8gYXBwLmdldE1vdmllcyh1c2VyR2VucmUsIHVzZXJSYXRpbmcpO1xuLy8gcmVxdWVzdGluZyBtb3ZpZSBpbmZvIGZyb20gbW92aWVzREIgQVBJXG5hcHAuZ2V0TW92aWVzID0gKHVzZXJHZW5yZSwgdXNlclJhdGluZykgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYCR7YXBwLm1vdmllc0Jhc2VVUkx9L2Rpc2NvdmVyL21vdmllYCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXBpX2tleTogYXBwLm1vdmllc0FQSUtleSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYycsXG4gICAgICAgICAgICB3aXRoX2dlbnJlczogdXNlckdlbnJlLCAvLyBnZW5yZSBpZFxuICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nIC8vIHJhdGluZyA+PSB1c2VyUmF0aW5nXG4gICAgICAgIH1cbiAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgdG90YWxQYWdlcyA9IHJlcy50b3RhbF9wYWdlcztcbiAgICAgICAgY29uc3QgdG9wUG9wdWxhciA9IE1hdGguZmxvb3IodG90YWxQYWdlcyAqIDAuMik7XG4gICAgICAgIGNvbnN0IG5ld1BhZ2VOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bSh0b3BQb3B1bGFyKSsxO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGAke2FwcC5tb3ZpZXNCYXNlVVJMfS9kaXNjb3Zlci9tb3ZpZWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcHAubW92aWVzQVBJS2V5LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgICAgICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnLFxuICAgICAgICAgICAgICAgIHdpdGhfZ2VucmVzOiB1c2VyR2VucmUsIC8vIGdlbnJlIGlkXG4gICAgICAgICAgICAgICAgJ3ZvdGVfYXZlcmFnZS5ndGUnOiB1c2VyUmF0aW5nLCAvLyByYXRpbmcgPTwgdXNlclJhdGluZ1xuICAgICAgICAgICAgICAgIHBhZ2U6IG5ld1BhZ2VOdW1iZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBvbiByYW5kb20gcGFnZVxuICAgICAgICAgICAgY29uc3QgbW92aWUgPSByZXMucmVzdWx0c1thcHAuZ2V0UmFuZE51bSgyMCldXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XG5cbiAgICAgICAgICAgIC8vIHB1dCBtb3ZpZSBpbnRvIEhUTUxcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5TW92aWUobW92aWUpO1xuICAgICAgICB9KVxuICAgIH0pXG59O1xuXG5hcHAuZ2V0Q29ja3RhaWwgPSAoc2VhcmNoKT0+IHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9JHtzZWFyY2h9YCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcyk9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYXBwLmdldFJhbmROdW0ocmVzLmRyaW5rcy5sZW5ndGgpKTtcbiAgICAgICAgYXBwLnJhbmRvbURyaW5rTnVtYmVyID0gYXBwLmdldFJhbmROdW0ocmVzLmRyaW5rcy5sZW5ndGgpO1xuXG5cbiAgICAgICAgY29uc3QgbmV3U2VhcmNoID0gYGZpbHRlci5waHA/aT0ke2FwcC5kcmlua1R5cGV9YDtcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmRyaW5rVHlwZSk7XG5cblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfSR7bmV3U2VhcmNofWAsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAvLyByYW5kb20gYXJyYXkgZm9yIGRyaW5rIC0gZ2V0IElEXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZHJpbmtzW2FwcC5yYW5kb21Ecmlua051bWJlcl0uaWREcmluayk7XG4gICAgICAgICAgICBjb25zdCBnZXREcmlua0J5SWQgPSByZXMuZHJpbmtzW2FwcC5yYW5kb21Ecmlua051bWJlcl0uaWREcmluaztcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGAke2FwcC5jb2NrdGFpbEJhc2VVUkx9bG9va3VwLnBocD9pPSR7Z2V0RHJpbmtCeUlkfWAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGRyaW5rIGRhdGFcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kcmlua3NbMF0pO1xuICAgICAgICAgICAgICAgIGFwcC5kaXNwbGF5RHJpbmsocmVzLmRyaW5rc1swXSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXG4gICAgfSlcbn1cblxuYXBwLmdldERyaW5rID0gKCk9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfWZpbHRlci5waHA/YT1Ob25fQWxjb2hvbGljYCxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiAnMSdcbiAgICAgICAgfVxuICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgY29uc3QgcmFuZG9tRHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShyZXMuZHJpbmtzLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJhbmRvbURyaW5rTnVtYmVyKTtcblxuICAgICAgICBjb25zdCBkcmlua0lkID0gcmVzLmRyaW5rc1tyYW5kb21Ecmlua051bWJlcl0uaWREcmluaztcbiAgICAgICAgY29uc29sZS5sb2coZHJpbmtJZCk7XG5cblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHthcHAuY29ja3RhaWxCYXNlVVJMfWxvb2t1cC5waHA/aT0ke2RyaW5rSWR9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGtleTogJzEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBhcHAuZGlzcGxheURyaW5rKHJlcy5kcmlua3NbMF0pO1xuICAgICAgICB9KVxuXG5cbiAgICB9KVxufVxuXG4vLyByZXR1cm4gcmFuZG9tIG51bWJlclxuYXBwLmdldFJhbmROdW0gPSAobnVtKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSk7XG59XG5cbmFwcC5kaXNwbGF5TW92aWUgPSAobW92aWUpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IG1vdmllLnRpdGxlO1xuICAgIGNvbnN0IGltZ1VybCA9IG1vdmllLnBvc3Rlcl9wYXRoO1xuICAgIGNvbnN0IHJhdGluZyA9IG1vdmllLnZvdGVfYXZlcmFnZTtcbiAgICBjb25zdCByZWxlYXNlRGF0ZSA9IG1vdmllLnJlbGVhc2VfZGF0ZTtcbiAgICBjb25zdCBvdmVydmlldyA9IG1vdmllLm92ZXJ2aWV3O1xuICAgICQoJy5tb3ZpZXMtcmVzdWx0X19jb250YWluZXInKS5lbXB0eSgpO1xuICAgIC8vIG92ZXJ2aWV3XG4gICAgLy8gcmVsZWFzZV9kYXRlXG4gICAgJCgnLm1vdmllcy1yZXN1bHRfX2NvbnRhaW5lcicpLmFwcGVuZChgXG4gICAgICAgIDxoMyBjbGFzcz1cInJlc3VsdC10aXRsZVwiPiR7dGl0bGV9PC9oMz5cbiAgICAgICAgPGltZyBzcmM9XCIke2FwcC5tb3ZpZXNJbWFnZVVSTCArYXBwLm1vdmllc0ltYWdlV2lkdGggKyBpbWdVcmx9XCIgY2xhc3M9XCJtb3ZpZS1pbWFnZVwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGRpdGlvbmFsLW1vdmllLWluZm9cIj5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibW92aWUtcmF0aW5nXCI+JHtyYXRpbmd9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJtb3ZpZS1yZWxlYXNlLWRhdGVcIj4ke3JlbGVhc2VEYXRlfTwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibW92aWUtb3ZlcnZpZXdcIj4ke292ZXJ2aWV3fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCk7XG59XG5cbmFwcC5jbGVhbk9iamVjdCA9IChvYmplY3QpID0+IHtcbiAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdFtwcm9wTmFtZV0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hcHAuZGlzcGxheURyaW5rID0gKGRyaW5rKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGRyaW5rLnN0ckRyaW5rO1xuICAgIGNvbnN0IGltZ1VybCA9IGRyaW5rLnN0ckRyaW5rVGh1bWI7XG5cbiAgICBjb25zdCBpbmdyZWRpZW50cyA9IE9iamVjdC5rZXlzKGRyaW5rKS5maWx0ZXIoZnVuY3Rpb24oaykge1xuICAgICAgICByZXR1cm4gay5pbmRleE9mKCdzdHJJbmdyZWRpZW50JykgPT0gMDtcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24obmV3S2V5LCBrKSB7XG4gICAgICAgIG5ld0tleVtrXSA9IGRyaW5rW2tdLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIG5ld0tleTtcbiAgICB9LCB7fSk7XG5cbiAgICBjb25zdCBtZWFzdXJlbWVudHMgPSBPYmplY3Qua2V5cyhkcmluaykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHJldHVybiBrLmluZGV4T2YoJ3N0ck1lYXN1cmUnKSA9PSAwO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbiAobmV3S2V5LCBrKSB7XG4gICAgICAgIG5ld0tleVtrXSA9IGRyaW5rW2tdLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIG5ld0tleTtcbiAgICB9LCB7fSk7XG5cbiAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBkcmluay5zdHJJbnN0cnVjdGlvbnM7XG5cbiAgICBhcHAuY2xlYW5PYmplY3QoaW5ncmVkaWVudHMpO1xuICAgIGFwcC5jbGVhbk9iamVjdChtZWFzdXJlbWVudHMpO1xuXG4gICAgY29uc3QgbWVhc3VyZW1lbnRzTGlzdCA9ICQoJzx1bD4nKS5hZGRDbGFzcygnbWVhc3VyZW1lbnQtbGlzdCcpO1xuICAgIGNvbnN0IGluZ3JlZGllbnRMaXN0ID0gJCgnPHVsPicpLmFkZENsYXNzKCdpbmdyZWRpZW50LWxpc3QnKTtcblxuICAgIGZvciAobGV0IHByb3AgaW4gbWVhc3VyZW1lbnRzKSB7XG4gICAgICAgIGNvbnN0IGxpID0gJCgnPGxpPicpLnRleHQobWVhc3VyZW1lbnRzW3Byb3BdKTtcbiAgICAgICAgbWVhc3VyZW1lbnRzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHByb3AgaW4gaW5ncmVkaWVudHMpIHtcbiAgICAgICAgY29uc3QgbGkgPSAkKCc8bGk+JykudGV4dChpbmdyZWRpZW50c1twcm9wXSk7XG4gICAgICAgIGluZ3JlZGllbnRMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuXG5cbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuZW1wdHkoKTtcbiAgICAkKCcuZHJpbmtzLXJlc3VsdF9fY29udGFpbmVyJykuYXBwZW5kKGBcbiAgICAgICAgPGgzIGNsYXNzPVwicmVzdWx0LXRpdGxlXCI+JHtuYW1lfTwvaDM+XG4gICAgICAgIDxpbWcgc3JjPVwiJHtpbWdVcmx9XCIgY2xhc3M9XCJkcmluay1pbWFnZVwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGRpdGlvbmFsLWRyaW5rLWluZm9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmdyZWRpZW50cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgICQoJy5pbmdyZWRpZW50cy1jb250YWluZXInKS5hcHBlbmQobWVhc3VyZW1lbnRzTGlzdCwgaW5ncmVkaWVudExpc3QpO1xuICAgICQoJy5hZGRpdGlvbmFsLWRyaW5rLWluZm8nKS5hcHBlbmQoYDxwPiR7aW5zdHJ1Y3Rpb25zfTwvcD5gKTtcbn1cblxuYXBwLmdlbmVyYXRlRHJpbmsgPSAoYWxjb2hvbGljKSA9PiB7XG4gICAgaWYgKGFsY29ob2xpYyA9PT0gJ0FsY29ob2xpYycpIHtcbiAgICAgICAgYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9JHthcHAuZHJpbmtUeXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcC5nZXREcmluaygpXG4gICAgfVxufVxuXG5hcHAuZXZlbnRzID0gKCkgPT4ge1xuICAgICQoJyNzdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZ2VucmVDYXRlZ29yeSA9ICQoJ2lucHV0W25hbWU9Z2VucmVdOmNoZWNrZWQnKS52YWwoKTtcbiAgICAgICAgY29uc3QgZ2VucmVJbmRleE1heCA9IGFwcC5tb3ZpZXNHZW5yZUlEc1tnZW5yZUNhdGVnb3J5XS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGdlbnJlSW5kZXggPSBhcHAuZ2V0UmFuZE51bShnZW5yZUluZGV4TWF4KTtcblxuICAgICAgICBhcHAudXNlckdlbnJlID0gYXBwLm1vdmllc0dlbnJlSURzW2dlbnJlQ2F0ZWdvcnldW2dlbnJlSW5kZXhdO1xuICAgICAgICBhcHAudXNlclJhdGluZyA9IHBhcnNlSW50KCQoJ2lucHV0W25hbWU9cmF0aW5nXTpjaGVja2VkJykudmFsKCkpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcblxuICAgICAgICAvL2NvY2t0YWlsIGFwaVxuICAgICAgICBhcHAuYWxjb2hvbGljID0gJCgnaW5wdXRbbmFtZT1hbGNvaG9sXTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQ2F0ZWdvcnkgPSAkKCdpbnB1dFtuYW1lPWNhdGVnb3J5XTpjaGVja2VkJykudmFsKCk7XG4gICAgICAgIGNvbnN0IGRyaW5rQXJyYXkgPSBhcHAuY29ja3RhaWxDYXRlZ29yeVthcHAuYWxjb2hvbGljXVtkcmlua0NhdGVnb3J5XTtcbiAgICAgICAgY29uc3QgZHJpbmtOdW1iZXIgPSBhcHAuZ2V0UmFuZE51bShkcmlua0FycmF5Lmxlbmd0aCk7XG4gICAgICAgIGFwcC5kcmlua1R5cGUgPSBkcmlua0FycmF5W2RyaW5rTnVtYmVyXTtcbiAgICAgICAgY29uc29sZS5sb2coYXBwLmRyaW5rVHlwZSk7XG5cbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgICAgIC8vIGdldCBhcnJheSBvZiBkcmlua3MgYnkgdHlwZSAtIHdpbmUvc2hha2UvZXRjXG4gICAgfSk7XG5cbiAgICAkKCcuYW5vdGhlci1tb3ZpZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuZ2V0TW92aWVzKGFwcC51c2VyR2VucmUsIGFwcC51c2VyUmF0aW5nKTtcbiAgICB9KVxuXG4gICAgJCgnLmFub3RoZXItZHJpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXBwLmdlbmVyYXRlRHJpbmsoYXBwLmFsY29ob2xpYyk7XG4gICAgfSlcblxuICAgICQoJyNwbGFuQW5vdGhlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KVxufTtcblxuLy8gaW5pdCBmdW5jdGlvblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2E9Tm9uX0FsY29ob2xpY2ApO1xuXG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBmaWx0ZXIucGhwP2k9Q29mZmVlYCk7XG4gICAgLy8gYXBwLmdldENvY2t0YWlsKGBsb29rdXAucGhwP2k9MTI3NzBgKTtcblxuICAgIGFwcC5ldmVudHMoKTtcbn1cblxuJChmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlYWR5XCIpO1xuICAgIGFwcC5pbml0KCk7XG59KSJdfQ==
