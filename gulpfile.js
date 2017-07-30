
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var clean = require('gulp-clean');

var paths = {
  styles: {
    src: './app/sass',
    files: './app/sass/**/*.scss',
    dest: './public/css',
  },
  js: {
    src: './app/js',
    files: './app/js/**/*.js',
    dest: './public/js',
  },
  html: {
    src: './app/index.html',
    dest: './public',
  },
}

var displayError = function(error) {
  var errorString = '[' + error.plugin + ']';
  errorString += ' ' + error.message.replace("\n",'');

  if (error.fileName) {
    errorString += ' in ' + error.fileName;
  }
  if (error.lineNumber) {
    errorString += ' on line ' + error.lineNumber;
  }

  console.error(errorString); // eslint-disable-line
}

gulp.task('sass', function (){
  return gulp.src([paths.styles.files])
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: 'map',
      includePaths : [paths.styles.src]
    }))

    .on('error', function(err){
      displayError(err);
    })

    .pipe(prefix(
      'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))

    .pipe(gulp.dest(paths.styles.dest))
});

gulp.task('clean', function () {
  return gulp.src('public', {read: false})
    .pipe(clean());
});

gulp.task('buildJS', function () {
  return gulp.src(paths.js.files)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(paths.js.dest));
});


gulp.task('copyHTML', ['buildJS', 'sass'], function () {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
});

gulp.task('default', ['clean', 'sass', 'buildJS', 'copyHTML'], function() {
  gulp.watch(paths.styles.files, ['sass'])
  gulp.watch(paths.js.files, ['buildJS'])
  gulp.watch(paths.html.src, ['copyHTML'])
});