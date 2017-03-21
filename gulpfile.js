var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function() {
    var tsResult = gulp.src("src/**/*.ts").pipe(tsProject());
    tsResult.js.pipe(gulp.dest('lib'));
    tsResult.dts.pipe(gulp.dest('lib'));
});

