const gulp = require('gulp')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')
const buildSass = require('gulp-sass')
// 定义位置
const javascript = './pack/**/*.js'
const html = ['./pack/**/*.html', './pack/**/*.htm']
const css = './pack/**/*.css'
const sass = './sass/**/*.scss'

// server端的简单配置
gulp.task('server', () => {
  connect.server({
    root: './pack', // 根目录
    port: 3000, // 端口
    livereload: true, // 即时刷新
    middleware: function(connect, opt) {
        return [
          proxy('/api', { // 代理
            target: 'http://192.168.1.44:8080',
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
gulp.task('javascript', () => {
  gulp.src(javascript).pipe(connect.reload())
})
// css
gulp.task('css', () => {
  gulp.src(css).pipe(connect.reload())
})
// 个人喜欢用sass，根据自身情况使用
gulp.task('sass', () => {
  gulp.src(sass)
  .pipe(buildSass())
  .pipe(gulp.dest('./pack/css'))
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
