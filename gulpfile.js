var gulp = require('gulp');
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var es6ify = require('es6ify');

var production = false;

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

mkdirSync("dist");
mkdirSync("dist/js");
mkdirSync("dist/stylesheets");

var sources = {
  html: ['src/html/*.html'],
  js: ['src/js/*.js'],
  css: ['src/style/*.css'],
  content: './src/js/content.js',
  manifest: ['src/manifest.json']
};

var dests = {
  html: 'dist/',
  js: 'dist/js',
  style: 'dist/stylesheets',
  content: 'dist/js/content.js',
  manifest: 'dist',
};

gulp.task('copy', function () {
  gulp.src(sources.html).pipe(gulp.dest(dests.html));
  gulp.src(sources.css).pipe(gulp.dest(dests.style));
  gulp.src(sources.manifest).pipe(gulp.dest(dests.manifest));
});

gulp.task('scripts', function () {
  return browserify({ debug: !production })
    .add(es6ify.runtime)
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .require(require.resolve(sources.content), { entry: true })
    .bundle()
    .pipe(fs.createWriteStream(dests.content));
});

gulp.task('watch', function () {
  gulp.watch([sources.html, sources.js, sources.css, sources.manifest], ['build']);
});

gulp.task('build', ['copy', 'scripts']);
