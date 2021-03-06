// generated on 2015-10-23 using generator-quickstarter2 1.0.0
import gulp from 'gulp';
import panini from 'panini';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('css', () => {
  return gulp.src('app/scss/*.scss')
    .pipe($.plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe($.compass({
        config_file: 'config.rb',
        css: './dist/css',
        sass: './app/scss',
        sourcemap: true
      })).on('error', function(){
      console.log(error);
  })
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(reload({stream: true}));
});

gulp.task('cssprod', () => {
  return gulp.src('app/scss/*.scss')
    .pipe($.plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe($.compass({
        config_file: 'config.rb',
        css: './dist/css',
        sass: './app/scss',
      })).on('error', function(){
      console.log(error);
  })
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(reload({stream: true}));
});


function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}


gulp.task('lint', lint('app/src/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js'));

gulp.task('panini', function() {
  gulp.src('app/pages/**/*.hbs')
    .pipe(panini({
      root: 'app/pages',
      layouts: 'app/layouts/',
      partials: 'app/partials/',
      helpers: 'app/helpers/',
      data: 'app/datas'
    })).pipe($.extname())
    .pipe(gulp.dest('dist/'));
});


gulp.task('panini:reset', function() {
  panini.refresh();
  gulp.run('html');
})

<% if (includeModernizr) { %>
gulp.task('modernizr', () => {
    return gulp.src('app/src/**/*.js')
    .pipe($.modernizr())
    .pipe(gulp.dest("dist/js/vendor/"));
});
<% } %>

gulp.task('html', ['css','panini'], () => {
  const assets = $.useref.assets({searchPath: ['dist', '.']});

  return gulp.src('dist/*.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('htmloptimize', ['cssprod','panini'], () => {
  const assets = $.useref.assets({searchPath: ['dist', '.']});

  return gulp.src('dist/*.html')
    .pipe(assets)
    .pipe($.if('**/*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});


gulp.task('images', () => {
  return gulp.src('app/img/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', () => {
  return gulp.src('app/font/**/*')
    .pipe(gulp.dest('dist/font'));
});

gulp.task('customJs', () => {
  return gulp.src('app/src/custom/*.*').pipe(gulp.dest('dist/js'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('serve', ['scripts','customJs','html', 'images', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['app/img/**/*'], ['images']);
  gulp.watch(['app/src/**/*.js'], ['lint', 'scripts', 'customJs']);
  gulp.watch(['app/**/*.hbs'], ['html']);
  gulp.watch(['app/pages/**/*.hbs'], ['html']);
  gulp.watch(['app/{layouts,partials,helpers,data}/**/*'], ['panini:reset']);
  gulp.watch('app/scss/**/*.scss', ['css']);
  gulp.watch('app/font/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch([
    'dist/*.html',
    'app/src/**/*.js',
    'app/img/**/*'
  ]).on('change', reload);
});

gulp.task('scripts', <% if (includeModernizr) { %>['modernizr'],<% } %> () => {
    return gulp.src(['app/src/plugins/**/*.js', 'app/src/plugins.js', 'app/src/main.js'])
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/js': 'dist/js',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/scss/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/css'));

  gulp.src('app/layouts/*.hbs')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'customJs', 'scripts', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('optimize', ['lint', 'customJs', 'scripts', 'htmloptimize', 'images', 'fonts', 'extras'], () => {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
