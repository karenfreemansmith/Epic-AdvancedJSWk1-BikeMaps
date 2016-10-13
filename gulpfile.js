var gulp = require('gulp');
var minimize = require('gulp-uglify');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var util = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var pages = require('gulp-gh-pages');
var sync = require('browser-sync').create();
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

var productionBuild = util.env.production;

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(pages());
});

gulp.task('serve', function() {
  sync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html"
    }
  });
  gulp.watch(['src/js/*.js'],['jsBuild']);
  gulp.watch(['bower.json'],['bowerBuild']);
  gulp.watch(['src/*.html'],['htmlBuild']);
  gulp.watch(['src/css/*.css'],['cssBuild']);
  gulp.watch(['src/scss/*.scss'],['scssBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function() {
  sync.reload();
});

gulp.task('bowerBuid', ['bower'], function() {
  sync.reload();
});

gulp.task('htmlBuild', ['staticHTML'], function() {
  sync.reload();
});

gulp.task('cssBuild', ['staticCSS'], function() {
  sync.reload();
});

gulp.task('scssBuild', ['sassCSS'], function() {
  sync.reload();
});

gulp.task('staticHTML', function() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('staticCSS', function() {
  return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sassCSS', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(minimize())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jshint', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
  return del(['dist', 'tmp']);
});

gulp.task('build', ['clean'], function() {
  if(productionBuild) {
    gulp.start('jsMin');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('staticHTML');
  gulp.start('staticCSS');
  gulp.start('sassCSS');
});

gulp.task('jsConcat', function() {
  return gulp.src(['./src/js/*.js'])
   .pipe(concat('allConcat.js'))
   .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['jsConcat'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('jsMin', ['jsBrowserify'], function() {
  return gulp.src('./dist/js/app.js')
    .pipe(minimize())
    .pipe(gulp.dest('./dist/js'));
});
