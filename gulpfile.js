var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    htmlmin     = require('gulp-htmlmin'),
    template    = require('gulp-template-compile'),
    uglify      = require('gulp-uglify'),
    clean       = require('gulp-clean'),
    watch       = require('gulp-watch'),
    liveServer  = require('gulp-live-server');

var buildDir    = 'build';
var distDir     = 'dist';

/*
* CSS
* */
gulp.task('css-src', function() {
    return gulp.src([
        // vendors
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/typeahead.js-bootstrap3.less/typeaheadjs.css',
        './bower_components/flag-icon-css/css/flag-icon.min.css',

        // app
        './src/*/css/*.css'
    ])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('css-min', ['css-src'], function() {
    return gulp.src(buildDir + '/*.css')
        .pipe(minifyCSS({
            restructuring: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(distDir + '/css'));
});

/*
* Templates
* */
gulp.task('templates', function() {
    return gulp.src('./src/*/templates/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true
        }))
        .pipe(template())
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('templates-watch', function() {
    // watch many files
    watch('./src/*/templates/*.html', function() {
        gulp.start('templates');
    });
});

/*
* JS
* */
gulp.task('js-src', function() {
    return gulp.src([
            // vendors
            './bower_components/jquery/dist/jquery.js',
            './bower_components/typeahead.js/dist/typeahead.bundle.js',
            './bower_components/bootstrap/dist/js/bootstrap.js',
            './bower_components/underscore/underscore.js',
            './bower_components/backbone/backbone.js',
            './bower_components/backbone.localStorage/backbone.localStorage.js',
            './bower_components/backbone.marionette/lib/backbone.marionette.js',

            // app
            './src/app.js',
            './src/addressBook/components/router.js',

            './src/addressBook/components/models/contactModel.js',
            './src/addressBook/components/models/countryModel.js',
            './src/addressBook/components/collections/contactsCollection.js',
            './src/addressBook/components/collections/countriesCollection.js',

            './src/addressBook/components/views/confirmationView.js',
            './src/addressBook/components/views/contactsEmptyView.js',
            './src/addressBook/components/views/contactItemView.js',
            './src/addressBook/components/views/contactCollectionView.js',
            './src/addressBook/components/views/contactNewView.js',
            './src/addressBook/components/views/contactEditView.js',
            './src/addressBook/components/views/countryInputView.js',

            './src/addressBook/modules/addressBook.js',

            // the rest of app components
            './src/**/*.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('js-min', ['templates', 'js-src'], function(){
    return gulp.src(buildDir + '/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(distDir + '/js'));
});

/*
* JSHint
* */
gulp.task('lint', function() {
    return gulp.src(['./src/*.js', './src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


/*
* Copy files
* */
gulp.task('dist-vendor-fonts', function() {
    return gulp.src(['./bower_components/bootstrap/dist/fonts/**/*'])
        .pipe(gulp.dest(distDir + '/fonts'));
});

gulp.task('dist-vendor-flags', function() {
    return gulp.src(['./bower_components/flag-icon-css/flags/**/*'])
        .pipe(gulp.dest(distDir + '/flags'));
});

gulp.task('dist-vendor-country-list', function() {
    return gulp.src(['./node_modules/country-list/data.json'])
        .pipe(gulp.dest(distDir));
});

// copy and rename index to dist folder
gulp.task('dist-index', function() {
    return gulp.src(['./index.dist'])
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(distDir));
});

gulp.task('dist-files', function() {
    return gulp.src(['./favicon.ico'])
        .pipe(gulp.dest(distDir));
});


/*
* Clean
* */
gulp.task('clean', function () {
    return gulp.src([
        'build',
        'dist',
        'screenshots'
    ], {read: false})
        .pipe(clean());
});

/*
* Live server
* */
gulp.task('serve-dev', ['lint', 'templates'], function() {
    var server = liveServer.static();
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    return gulp.watch(['./**/*.{html,htm,css,js}' ], function (file) {
        server.notify.apply(server, [file]);
    });
});

gulp.task('serve-dist', ['default'], function() {
    // serve at custom port
    var server = liveServer.static('dist', 8888);
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    return gulp.watch(['./dist/**/*.{html,htm,css,js}'], function (file) {
        server.notify.apply(server, [file]);
    });
});

/*
* Tasks
* */
gulp.task('dist', [
    'css-min',
    'js-min',
    'dist-vendor-fonts',
    'dist-vendor-flags',
    'dist-vendor-country-list',
    'dist-index',
    'dist-files'
]);
gulp.task('default', ['lint', 'dist']);