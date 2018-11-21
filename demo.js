 var gulp = require('gulp'),
    babel = require('gulp-babel')
    browserSync = require('browser-sync').create(),
    JScriptPath = ['./www/**/*.js','!./www/**/*.min.js'],
    htmlPath = './www/**/*.html',
    cssPath = './www/**/*.css';
gulp.task('default', ['JScript','html','css'], function () {
    browserSync.init({
        // proxy: 'http://jlb.myweb.com',
        server: {
            baseDir: './www/'
        },
        open: true
    });
    gulp.watch(JScriptPath, ['JScript']);
    gulp.watch(htmlPath, ['html']);
    gulp.watch(cssPath, ['css']);
});
gulp.task('JScript', function () {
    gulp.src(JScriptPath)
    // .pipe(uglify({
    //     mangle: {except: ['require', 'exports', 'module', '$']},//是否修改变量名，备注，全局函数混淆。
    //     compress: true,//是否完全压缩
    //     preserveComments: 'all'//保留注释"all"
    // }))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(gulp.dest('./www/jlb'))
        .pipe(babel())
        .pipe(browserSync.stream());
});
gulp.task('babeljs', function () {
    return gulp.src(JScriptPath)
      .pipe(babel())
      .pipe(browserSync.stream())
})
gulp.task('watch', function () {
    gulp.watch(JScriptPath, ['babeljs'])
})
gulp.task('html', function () {
    return gulp.src(htmlPath)
        .pipe(browserSync.stream())
});
gulp.task('css', function () {
    return gulp.src(cssPath)
        .pipe(browserSync.stream())
});
