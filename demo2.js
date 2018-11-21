const gulp = require('gulp')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')

const any = ['./pack/**/*.*']

gulp.task('server', () => {
  connect.server({
    root: './pack',
    port: 3001,
    livereload: true,
    middleware: function(connect, opt) {
        return [
          proxy('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true
          })
        ]
    }
  })
})
gulp.task('any', () => {
  gulp.src(any).pipe(connect.reload())
})
gulp.task('watch', () => {
  gulp.watch(any, ['any'])
})
gulp.task('default', ['server', 'watch'])