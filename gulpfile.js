var gulp = require('gulp');
var gulpBowerFiles = require('gulp-bower-files');

gulp.task('default', function() {
  gulpBowerFiles().pipe(gulp.dest("./lib"));
});
