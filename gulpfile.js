const gulp = require('gulp'),
      babel = require('gulp-babel'),
      connect = require('gulp-connect'),
      proxy = require('http-proxy-middleware'),
      buildSass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      util = require('gulp-util')

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
    host: '127.0.0.1', // 运行时的 host
    name: 'Server', // 启动或者停止服务的时候输出的名字
    https: false, // 当 https 开启的时候，可以使用node文档中的任何一个参数，然后在内部使用一些默认的参数
    livereload: { // 是否即时刷新，可以直接设置为true
      port: 3000,
      hostname: '127.0.0.1'
    },
    fallback: '',
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
    },
    debug: false,
    index: true
  })
})

// html
gulp.task('html', () => {
  gulp.src(html).pipe(connect.reload())
})

// javascript
// 具体的说明请自行参考 gulp-babel gulp-uglify gulp-rename gulp-util
gulp.task('javascript', () => {
  gulp.src(javascript)
    .pipe(babel()) // 转换为es-2015
    .pipe(gulp.dest('./src/js')) // 在压缩前先保存一个未压缩的文件
    .pipe(uglify()) // 压缩
    .pipe(rename({suffix: '.min'})) // 重命名
    .on('error', function (err) { // 错误打印
      util.log(util.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('./src/js'))
    .pipe(connect.reload())
})

// css
gulp.task('css', () => {
  gulp.src(css).pipe(connect.reload())
})

// 根据自身情况使用
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
