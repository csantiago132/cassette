var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
 
gulp.task('browserify', function() {
  return browserify('./src/js/index.js')
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', [
  'styles:main',
  'styles:audioplayer'
]);

gulp.task('styles:audioplayer', function () {
  return gulp.src('./node_modules/react-responsive-audio-player/dist/audioplayer.css')
    .pipe(plumber())
    .pipe(minifyCSS())
    .pipe(rename('audioplayer.css'))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('styles:main', function () {
  return gulp.src('*.css', { cwd: 'src/css/' })
    .pipe(plumber())
    .pipe(concat('all.css'))
    .pipe(autoprefixer({ browsers: ['> 2%'] }))
    .pipe(minifyCSS())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/'), { cwd: '../../' });
});

gulp.task('watch', ['default'], function () {
  gulp.watch('src/css/*.css', ['styles:main']);
  gulp.watch([
    'node_modules/react-responsive-audio-player/dist/*.css'
  ], ['styles:audioplayer']);
  gulp.watch([
    'src/js/**/*.js',
    'node_modules/react-responsive-audio-player/dist/*.js'
  ], ['browserify']);
});

gulp.task('default', ['browserify', 'styles']);
