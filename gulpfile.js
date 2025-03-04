var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglify = require('gulp-uglify-es').default;
var pump = require('pump');
var runSequence = require('gulp4-run-sequence');
var config = {
  entryFile: './build/index.js',
  outputDir: './build/dist/',
  outputFile: 'infinito-wallet.min.js',
};

// clean the output directory
gulp.task('clean', function(cb) {
  rimraf(config.outputDir, cb);
});

var bundler;

function getBundler() {
  if (!bundler) {
    bundler = watchify(
      browserify(config.entryFile, { debug: true, ...watchify.args })
    );
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message);
    })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', gulp.series('clean', function() {
  return bundle();
}));

gulp.task('build', gulp.series('build-persistent', function() {
  process.exit(0);
}));

gulp.task('compress', function(cb) {
  pump([gulp.src('build/dist/*.js'), uglify(), gulp.dest('build/dist')], cb);
});

gulp.task('watch', gulp.series('build-persistent', function() {
  browserSync({
    server: {
      baseDir: './',
    },
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent');
  });
}));

// WEB SERVER
gulp.task('serve', function() {
  Date;
  browserSync({
    server: {
      baseDir: './',
    },
  });
});
gulp.task('build:dist', function(callback) {
  runSequence('build-persistent', 'compress', callback);
});