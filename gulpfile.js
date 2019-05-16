'use strict';

var gulp = require('gulp'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'), //minify css
    imagemin = require('gulp-imagemin'),
    svgSprite = require('gulp-svg-sprite'), // create svg sprite
    svgmin = require('gulp-svgmin'), //minify svg
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'), //minify js
    clean = require('gulp-clean'), //remove files and folders
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;


gulp.task('serve', function() {
    browserSync.init({
      server: "./content"
    });

    gulp.watch("./develop/**/*.scss", gulp.series('styles'));
    gulp.watch("./develop/*.html").on('change', browserSync.reload);
  });

//css
gulp.task('styles', function() {
    return gulp.src([
        './node_modules/animate.css/animate.min.css',
        './develop/**/*.scss'
    ])
    .pipe(sass())
	.pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(concat('./styles/styles.min.css'))
    .pipe(cleanCSS())
	.pipe(gulp.dest('./content'))
	.pipe(browserSync.stream());
});


//images
gulp.task('images', function() {
    return gulp.src('./develop/images/**/*.*')
    .pipe(cache(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('./content/images'))
    .pipe(reload({ stream: true }));
});

//html
gulp.task('html', function() {
    return gulp.src('./develop/*.html')
    .pipe(gulp.dest('./content'));
});

//concatenate & minify
gulp.task('scripts', function() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js' ,
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        './node_modules/wowjs/dist/wow.min.js',
        './node_modules/jquery-match-height/jquery.matchHeight.js',
        './develop/scripts/scripts.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./content/scripts'))
    .pipe(uglify())
    .pipe(gulp.dest('./content/scripts'));
});



//svg sprite
gulp.task('svgSprite', function () {
    return gulp.src('./develop/images/icons/*.svg') // svg files for sprite
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"  //sprite file name
                }
            },
        }
        ))
        .pipe(svgmin({
            plugins: [{
                removeComments: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }],
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('./content/images/'));
});

//clean
gulp.task('clean', function() {
    return gulp.src(['./content/'], {read: false, allowEmpty: true})
      .pipe(clean());
  });

//watch
gulp.task('watch', function(){
    gulp.watch('./develop/**/.scss', gulp.series('styles'));
    gulp.watch('./develop/*.html', gulp.series('html'));
    gulp.watch('./develop/images/**/*.*', gulp.series('images'));
    gulp.watch('./develop/scripts/**/*.*', gulp.series('scripts'));
    gulp.watch('./develop/images/icons/*.svg', gulp.series('svgSprite'));
});


gulp.task('default', gulp.series('clean', gulp.parallel('html', 'styles', 'images', 'svgSprite', 'scripts', 'watch', 'serve')));

