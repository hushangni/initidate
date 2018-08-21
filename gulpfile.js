const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// run the task method on styles
gulp.task('styles', ()=> {
    // return the src of the styles file from the dev folder
    return gulp.src('./dev/styles/**/*.scss')
        // use the pipe method-sass to check for errors in you sass
        .pipe(sass().on('error', sass.logError))
        // use the concat method to concat your file into a css file
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        // use the gulp method-dest(ination) to save your new css file
        .pipe(gulp.dest('./public/styles'))
        // reload page
        .pipe(reload({ stream: true }));
});

// create a gulp.task method called js
// takes all of our js code and transpiling
gulp.task('js', () => {
    //
    browserify('./dev/scripts/main.js', { debug: true })
        .transform('babelify', {
            sourceMaps: true,
            presets: ['env']
        })
        .bundle()
        // if error, notify
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        // do same thing as above for sass
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/scripts'))
        .pipe(reload({stream: true}));
});

// browser sync
gulp.task('bs', ()=> {
    browserSync.init({
        server: {
            // root directory
            baseDir: './'
        }
    })
})

// create a watch method to watch for any changes
gulp.task('watch', ()=>{
    // watch this path for changes, run these functions - array so you can add more later
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/**/*.js', ['js']);
    gulp.watch('*.html', reload);
});

// start browser sync first, then styles, then js, then use the watch task
gulp.task('default', ['bs', 'styles', 'js', 'watch']);

