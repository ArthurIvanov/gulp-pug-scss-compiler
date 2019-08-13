
//variables
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');

const pug = require('gulp-pug');

const less = require('gulp-less');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// compile pug to html
function pughtml() {

    return gulp.src('./src/pug/pages/**/*.pug', {allowEmpty:true})

    .pipe(plumber({
        errorHandler: notify.onError( function(err) {
            return {
                title: 'Html',
                message: err.message
            }
        })
    }))

        .pipe(pug({pretty:true}))

        .pipe(gulp.dest('./build/'))

        .pipe(browserSync.stream());
}

// compile less into css
function style_less() {

    return gulp.src('./src/less/main.less', {allowEmpty:true})

        .pipe(plumber({
            
            errorHandler: notify.onError( function(err) {
                return {
                    title: 'Style_less',
                    message: err.message
                }
            })
        }))

        .pipe(sourcemaps.init())

        .pipe(less())

        .pipe(autoprefixer( {overrideBrowserslist: ['last 3 versions'], cascade: false} ))

        .pipe(sourcemaps.write())

        .pipe(gulp.dest('./build/css/'))

        .pipe(browserSync.stream());
}

// compile scss into css
function style_scss() {

    return gulp.src('./src/scss/main/main.scss', {allowEmpty:true})

        .pipe(plumber({
            
            errorHandler: notify.onError( function(err) {
                return {
                    title: 'Style_scss',
                    message: err.message
                }
            })
        }))

        .pipe(sourcemaps.init())

        .pipe(sass())

        .pipe(autoprefixer( {overrideBrowserslist: ['last 3 versions'], cascade: false} ))

        .pipe(sourcemaps.write())

        .pipe(gulp.dest('./build/css/'))

        .pipe(browserSync.stream());
}

// copy work files in to build folder

function copyIcons () {
    return gulp.src('./src/icons/**/*.*')
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function copyJs () {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function copyLibs () {
    return gulp.src('./src/libs/**/*.*')
        .pipe(gulp.dest('./build/libs'))
        .pipe(browserSync.stream());
}

function copyImgs () {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream());
}
// delete build folder before compile
function cleanBuild () {
    return del('./build');
}


// watch task
function watch() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    gulp.watch('./src/scss/**/*.scss', style_scss);
    gulp.watch('./src/less/**/*.less', style_less);
    gulp.watch('./src/pug/**/*.pug', pughtml);
    gulp.watch('./src/js/**/*.js', copyJs);  
    gulp.watch('./src/libs/**/*.*', copyLibs);
    gulp.watch('./src/img/**/*.*', copyImgs);
    gulp.watch('./src/icons/**/*.*', copyIcons);
    gulp.watch('./src/**/*.html').on('change', browserSync.reload)
    gulp.watch('./src/js/**/*.js').on('change', browserSync.reload)
}

// exports
exports.compile = gulp.series(cleanBuild, copyImgs, copyLibs, copyIcons, pughtml, copyJs, style_less, style_scss, watch);
exports.watch = exports.compile;

