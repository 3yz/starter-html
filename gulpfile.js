var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    compass = require('gulp-compass'),
    livereload = require('gulp-livereload'),
    minifyCss = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch');


gulp.task('imagemin', function () {
    return gulp.src('app/assets/img/*/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('app/assets/img'));
});

gulp.task('stream', function () {
    gulp.src('app/assets/css/**/*.css')
        .pipe(watch('app/assets/css/**/*.css'))
        .pipe(gulp.dest('build'));
});

gulp.task('minify-css', function() {
  return gulp.src('app/assets/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/assets/css/'));
});

gulp.task('js', function () {
    return gulp.src('app/assets/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/assets/js')); 
});

gulp.task('compass', function() {
  gulp.src('./app/assets/scss/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      css: 'app/assets/css',
      sass: 'app/assets/scss',
      image: 'app/assets/img',
      style: 'expanded'
    }))
    .on('error', function(err) {
      // Would like to catch the error here 
    })
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(imagemin())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('app/assets/scss/**/*.scss', ['compass']);
});

gulp.task('default', ['watch','compass', 'imagemin', 'js']);
