var gulp = require("gulp");
var embedTemplates = require("gulp-angular-embed-templates");
var inlineNg2Styles = require("gulp-inline-ng2-styles");
var inlineNg2Template = require("gulp-inline-ng2-template");
var rename = require("gulp-rename");

gulp.task("js:build", function () {
  gulp.src("./projects/ngx-aircal/src/lib/_ngx-aircal.component.ts") // also can use *.js files
    .pipe(embedTemplates({sourceType:"ts"}))
    .pipe(inlineNg2Template({ base: "./projects/ngx-aircal/src/lib/" }))
    .pipe(rename({
      basename: "ngx-aircal.component",
    }))
    .pipe(gulp.dest("./projects/ngx-aircal/src/lib/"));
});