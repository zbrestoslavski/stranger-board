var fs      = require('fs'),
    ini     = require('ini'),
    gulp    = require('gulp'),
    plumber = require('gulp-plumber'),
    path    = require('path'),
    g       = require('gulp-load-plugins')(),
    run     = require('run-sequence'),
    read    = require('readline'),
    qs      = require('querystring');

run.use(gulp);

//==============================================================================

const PORT = g.util.env.port || 3000;
const SRC = __dirname + '/src/';
const WWW = __dirname + '/www/';

//==============================================================================

gulp.task('html', function() {
  return gulp.src([SRC + 'partials/index.ejs'])
    .pipe(g.ejsPages())
    .pipe(gulp.dest(WWW))
    .pipe(g.size({ title : 'partials' }))
    .pipe(g.connect.reload());
});

//------------------------------------------------------------------------------

gulp.task('styles',function(cb) {
  return gulp.src(SRC + 'styles/main.styl')
    .pipe(plumber())
    .pipe(g.stylus({
      'compress'    : true,
      'include css' : true
    }))
    .pipe(g.autoprefixer({
      browsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 6',
        'opera >= 23',
        'ios >= 6',
        'android >= 4.4',
        'bb >= 10'
      ]
    }))
    .pipe(gulp.dest(WWW + 'styles/'))
    .pipe(g.size({ title : 'styles' }))
    .pipe(g.connect.reload());
});

//------------------------------------------------------------------------------

var webpack = require('webpack'),
    wpstream = require('webpack-stream');

gulp.task('scripts', function() {
  return gulp.src(SRC + 'scripts/**/*')
    .pipe(plumber())
    .pipe(wpstream({
      resolve: {
        root : [SRC, __dirname + '/node_modules/'],
        extensions: ['', '.js']
      },
      entry: {
        main  : SRC + 'scripts/main.js'
      },
      output: {
        path: WWW + 'scripts/',
        filename: '[name].js'
      },
      module: {
        loaders: [{
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=es2015'
        }]
      },
      plugins: [
      ]
    }))
//    .pipe(g.uglifyjs())
    .pipe(gulp.dest(WWW + 'scripts/'))
    .pipe(g.size({ title : 'scripts' }))
    .pipe(g.connect.reload());
});

gulp.task('addons', function() {
  return gulp.src([SRC + 'scripts/ffmpeg.js',
                   SRC + 'scripts/thread.js'])
    .pipe(gulp.dest(WWW + 'scripts/'))
    .pipe(g.size({ title : 'addons' }))
    .pipe(g.connect.reload());
})

//------------------------------------------------------------------------------

gulp.task('assets', function(cb) {
  return gulp.src(SRC + 'assets/**/*')
    .pipe(g.size({ title : 'assets' }))
    .pipe(gulp.dest(WWW + 'assets/'))
    .pipe(g.connect.reload());
});

//==============================================================================

gulp.task('serve', function() {
  g.connect.server({
    root: WWW,
    port: PORT,
    livereload: { port: 35729 }
  });
});

gulp.task('watch', function() {
  gulp.watch(SRC + 'partials/*.ejs', ['html']);
  gulp.watch(SRC + 'assets/**/*.js', ['scripts']);
  gulp.watch(SRC + 'scripts/**/*.js', ['scripts']);
  gulp.watch(SRC + 'styles/*.styl', ['styles']);
});

gulp.task('clean', function(cb) {
  return require('del')([WWW + "*"]);
});

gulp.task('build', function(cb) {
  return run('clean', 'html', 'styles', 'scripts', 'addons', 'assets', cb);
});

//==============================================================================

gulp.task('default', function(cb) {
  return run('build', 'serve', 'watch', cb);
});