var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'), // Подключаем Concat
    uglify       = require('gulp-uglifyjs'), //Подключаем uglifyjs
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename');


    gulp.task('sass', function() { // Создаем таск Sass
        return gulp.src('app/sass/**/*.sass') // Берем источник
            .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
            .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
            .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
    });

    gulp.task('css-libs', ['sass'], function() {
    	return gulp.src('app/css/libs.css') // Выбираем файл для минификации
    		.pipe(cssnano()) // Сжимаем
    		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
    });

    gulp.task('js', function() {
      return gulp.src([
        'app/libs/jquery/dist/jquery.js',
        'app/libs/bootstrap/dist/js/bootstrap.min.js',
          ])
          .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
          .pipe(uglify()) // Сжимаем JS файл
          .pipe(gulp.dest('app/js'));
    });


    gulp.task('imagemin', function() {
    	return gulp.src('app/img/**/*')
      .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
      })))
      .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
    });


    gulp.task('browser-sync', function() { // Создаем таск browser-sync
        browserSync({ // Выполняем browserSync
            server: { // Определяем параметры сервера
                baseDir: 'app' // Директория для сервера - app
            },
            notify: false // Отключаем уведомления
        });
    });


    gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

    	var buildFiles = gulp.src([
    		'app/*.html',
    		'app/.htaccess',
    		]).pipe(gulp.dest('dist'));

    	var buildCss = gulp.src([
    		'app/css/main.css',
        'app/css/libs.min.css'
    		])
    	  .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));

      var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
      	.pipe(gulp.dest('dist/js'))

    	var buildFonts = gulp.src([
    		'app/fonts/**/*',
    		]).pipe(gulp.dest('dist/fonts'));

    });

    gulp.task('removedist', function() { return del.sync('dist'); });
    gulp.task('clearcache', function () { return cache.clearAll(); });

    gulp.task('watch', ['browser-sync', 'css-libs', 'js' ], function() {
        gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами
        // Наблюдение за другими типами файлов
        gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
        gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js

    });
