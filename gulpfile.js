var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('default', function() {
  return gulp.src(mainBowerFiles({ paths: '.' }), { base: './bower_components' }).pipe(gulp.dest("./lib"));
});
