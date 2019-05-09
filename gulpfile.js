const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

function style() {
    var plugins = [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano()
    ];
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./public/dist'))
        .pipe(browserSync.stream());
}

function js() {
    return gulp.src('./assets/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('/map'))
        .pipe(gulp.dest('./dist'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./assets/scss/**/*scss', style);
    gulp.watch('./src/js/**/*js').on('change', gulp.series(js, browserSync.reload));
}


exports.js = js;
exports.style = style;
exports.watch = watch;
exports.default = watch;