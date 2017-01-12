const gulp = require('gulp')
const commands = require('./commands')
const fetchDocs = require('./lib/fetch-docs')
const markdown = require('gulp-markdown')
const through2 = require('through2')
const { readdirSync, writeFileSync, readFileSync } = require('fs')
const fileList = require('gulp-filelist')
const jsonDirToHtml = require('./lib/json-dir-to-html')
const minify = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const layout = require('gulp-layout')
const browserSync = require('browser-sync').create();
const rimraf = require('rimraf')
const zip = require('gulp-zip')
const runseq = require('run-sequence')


gulp.task('docs:all',function(done){
  runseq('docs:fetch','docs:build','docs:package',done)
})

gulp.task('docs:fetch',function(done) {
  fetchDocs()
  done()
})

gulp.task('public:clean',function(done){
  rimraf('./public/*',done)
})

gulp.task('docs:package',['docs:build'],function(done){
  return gulp.src('public/*')
    .pipe(zip('public-static-pkg.zip'))
    .pipe(gulp.dest('.'));
})
gulp.task('cleanup',function(done){
  rimraf('./.tmpbuild/*',done)
})

gulp.task('docs:build', function(done){
  runseq('public:clean',
    'docs:index:json',
    'docs:index:menu',
    'docs:markdown',
    'assets:css',
    'cleanup',
    done)
})

gulp.task('docs:markdown', function () {
  return gulp.src('./lusa-psd-documentation/**/*.md')
    .pipe(markdown())
    .pipe(layout({
      layout: './templates/layout.pug'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('dev:server',['docs:build'],function(){
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch("./assets/**/*.css",["assets:css"])
    .on('change', browserSync.reload );
})

gulp.task('docs:index:json', function(){
  return gulp.src('./lusa-psd-documentation/**/*.md')
    .pipe(fileList('index.json', { relative: true }))
    .pipe(gulp.dest('./.tmpbuild'))
})

//this could just very well be a promise function
gulp.task('docs:index:menu', function(done){
  let dirArray = JSON.parse(readFileSync('./.tmpbuild/index.json'))
  let html = jsonDirToHtml(dirArray)
  writeFileSync('./.tmpbuild/nav.html',html)
  done()
})


gulp.task('assets:css',function(){
  return gulp.src(['./vendor/markdown.css','./assets/main.css'])
    .pipe(concat('all.css'))
    .pipe(minify())
    .pipe(gulp.dest('./public'));
})

gulp.task('assets:css:sourcemaps',function(){
  return gulp.src(['./vendor/**/*.css','./assets/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.css'))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'));
})
