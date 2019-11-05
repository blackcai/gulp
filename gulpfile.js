const gulp = require('gulp'),
      babel = require('gulp-babel'),
      connect = require('gulp-connect'),
      proxy = require('http-proxy-middleware'),
      buildSass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename')

// 文件目录位置
const javascript = './js/**/*.js',
      html = ['./src/**/*.html', './pack/**/*.htm'],
      css = './src/**/*.css',
      sass = './scss/**/*.scss'

// server端的简单配置
gulp.task('server', () => {
  connect.server({
    root: './src', // 启动的根目录
    port: 3000, // 端口
    livereload: true, // 即时刷新
    middleware: (connect, opt) => {
      /*
      * 简单的反向代理，具体请查看 http-proxy-middleware 插件说明文档
      * 如果觉得太麻烦
      * 将下面的 /api 改为你的请求接口的字段
      * 将下面的 target 改为你的请求接口地址
      */
      return [
        proxy('/api', {
          target: 'http://127.0.0.1',
          changeOrigin: true
        })
      ]
    }
  })
})

// html
gulp.task('html', () => {
  gulp.src(html).pipe(connect.reload())
})

// javascript
// 具体的说明请自行参考 gulp-uglify gulp-rename
gulp.task('javascript', () => {
  gulp.src(javascript)
    // .pipe(uglify({
    //     mangle: {except: ['require', 'exports', 'module', '$']},//是否修改变量名，备注，全局函数混淆。
    //     compress: true,//是否完全压缩
    //     preserveComments: 'all'//保留注释"all"
    // }))
    // .pipe(rename({suffix: '.min'}))
    .pipe(babel())
    .pipe(gulp.dest('./src/js'))
    .pipe(connect.reload())
})

// css
gulp.task('css', () => {
  gulp.src(css).pipe(connect.reload())
})

// 个人喜欢用sass，根据自身情况使用
gulp.task('sass', () => {
  gulp.src(sass)
  .pipe(buildSass())
  .pipe(gulp.dest('./src/css'))
  .pipe(connect.reload())
})

// 列出监听项
gulp.task('watch', () => {
  gulp.watch(html, ['html'])
  gulp.watch(javascript, ['javascript'])
  gulp.watch(css, ['css'])
  gulp.watch(sass, ['sass'])
})
// 默认启动，default为必须的task，可以直接将server中的内容放置其中，形成一个简单的服务
gulp.task('default', ['server', 'watch'])
