const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');
const rename = require("gulp-rename");
const cheerio = require('gulp-cheerio');
const svgstore = require('gulp-svgstore');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const del = require("del");

// Clean

const clean = () => {
  return del('build');
}

exports.clean = clean;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/img/**/*.{jpg,png,svg}"
  ], {
    base: "source"
  })
  .pipe(gulp.dest('build'))
}

exports.copy = copy;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const htmlminify = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

exports.htmlminify = htmlminify;

// JS minify

const jsminify = () => {
  return gulp.src(['source/js/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('build/js'))
}

exports.jsminify = jsminify;

// Minify images

const imageMinify = function() {
  return gulp.src('build/img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('build/images'))
}

exports.imageMinify = imageMinify;

// Create WebP
const createWebp = function() {
  return gulp.src('build/img/users-photos/*.{jpg,png}')
  .pipe(webp({quality: 80}))
  .pipe(gulp.dest('build/img/users-photos'))
}

exports.createWebp = createWebp;

// Sprite svg

const createSprite = function() {
  return gulp.src("build/img/icons/*.svg")
  .pipe(cheerio({
    run: function ($) {
      $('[stroke]').removeAttr('stroke');
    },
    parserOptions: {xmlMode: true}
  }))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.createSprite = createSprite;

// Build

const build = gulp.series(
  clean,
  copy,
  imageMinify,
  gulp.parallel(
    styles,
    htmlminify,
    jsminify,
    createWebp,
    createSprite
  )
)

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
    clean,
    copy,
  gulp.parallel(
    styles,
    htmlminify,
    jsminify,
    createWebp,
    createSprite
  ),
  gulp.series(
    styles,
    server,
    watcher
  )
);
