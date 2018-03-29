var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var es = require('event-stream');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css'); //mesmo que o css min, apenas mudou de nome
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('clean', function() {
  return gulp.src('dist/')
    .pipe(clean());
});

// validar os arquivos js (semantica)
gulp.task('jshint', function() {
  //readble stream, leva os js para o jshint
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default')); //renderiza um report
});

// clean diz q antes de executar o uglify temos que executar o clean, tipo um requirement
// gulp.task('uglify', ['clean'], function() {  //linha retirada apos a configuração do runsequence
gulp.task('uglify', function() {
  /* resumo, ele pega os arquivos do angular que ja estao miminicados + os arquivos da libs  (vao minificar, somente eses) e depois joga tudo em um all.min.js */
  /* usou o event-stream pois nao precisa uglificar as libs do angular, ja são tudo min */
  return es.merge([
      gulp.src(['bower_components/angular/angular.min.js', 'bower_components/angular-route/angular-route.min.js', 'bower_components/angular-messages/angular-messages.min.js']),
      gulp.src(['lib/**/*.js', 'js/**/*.js']).pipe(concat('scripts.js')).pipe(uglify())
    ]) //fim es.merge
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('dist/js'));

  /*  
  .pipe(uglify()) //tira eespaços e joga tudo na mesma linha
  .pipe(concat('all.min.js')) // concatena os arquivos em um so, all.min.js
  .pipe(gulp.dest('dist/js')); //Direitório destino para onde vai o arquivo depois de finalizado
    */
});

gulp.task('htmlmin', function() {
  return gulp.src('view/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/view'));
});

gulp.task('cssmin', function() {
  return gulp.src(['bower_componments/bootstrap/dist/css/bootstrap.css', 'css/**/*.css'])
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function() {
  return gulp.src('index-prod.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/'));
});

// not using runSequence
//gulp.task('default', ['jshint', 'uglify', 'htmlmin', 'cssmin', 'copy']);

gulp.task('prod', function(callbackk) {
  return runSequence('clean', ['jshint', 'uglify', 'htmlmin', 'cssmin', 'copy'], callbackk);
});