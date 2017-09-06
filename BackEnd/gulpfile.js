var gulp = require('gulp');

var runSequence = require('run-sequence');
var del = require('del');
var target = __dirname + '/app/dist';

var dest = __dirname + '/public';

gulp.task('copy', (done) => {
  gulp
    .src(`${target}/**/*`)
    .pipe(gulp.dest(`${dest}`));
  done();
})

gulp.task('clean', (done) => {
  del(__dirname + '/public').then(() => {
    done();
  });
});

gulp.task('build', () => {
  runSequence('clean', 'copy')
})

gulp.task('default', ['build']);