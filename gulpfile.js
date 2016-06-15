var pkg = require('./package');

var gulp = require('gulp');

// 下面的模块才有`DefinePlugin`
var webpack = require('webpack');

// https://github.com/shama/webpack-stream
var webpackStream = require('webpack-stream');

// https://www.npmjs.com/package/gulp-rename/
var rename = require("gulp-rename");

// https://www.npmjs.com/package/gulp-uglify/
var uglify = require('gulp-uglify');

// https://www.npmjs.com/package/del
var del = require('del');

// http://browsersync.io/
var browserSync = require('browser-sync');

gulp.task('delete-dist-dir', function (cb) {
    del(['dist']).then(function () {
        cb();
    });
});

function pack(isFallback) {
    var indexFile = isFallback ? 'src/index.pc.js' : 'src/index.js';

    return gulp.src(indexFile).pipe(webpackStream({
        output: {
            // 不要配置path，会报错
            //path: 'dist',
            filename: !isFallback ? 'natty-storage.js' : 'natty-storage.pc.js',
            sourceMapFilename: !isFallback ? 'natty-storage.js.map' : 'natty-storage.pc.js.map',
            sourcePrefix: '',

            // 下面三个配置项说明`webpack`的最佳实战是: 只设置唯一的`entry`, 正好和`gulp`的约定完美对接
            // NOTE: 如果需要构建`umd`模块，则这三个配置项必须同时使用：library, libraryTarget, umdNamedDefine
            library: 'NattyStorage',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        // 这个配置要和 output.sourceMapFilename 一起使用
        devtool: '#source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader?stage=1'
                }
            ]
        },
        externals: {},
        plugins: [
            new webpack.DefinePlugin({
                __BUILD_VERSION__: 'VERSION = "' + pkg.version + '"',
                __BUILD_FALLBACK__: isFallback
            })
        ]
    })).pipe(gulp.dest('./dist'));
}

// pack natty-db.node.js
// function packNodeVersion(isPc) {
//     var indexFile = isPc ? 'src/index.pc.js' : 'src/index.js';
//
//     return gulp.src(indexFile).pipe(webpackStream({
//         output: {
//             // 不要配置path，会报错
//             //path: 'dist',
//             filename: isPc ? 'natty-storage.pc.node.js' : 'natty-storage.node.js',
//             sourcePrefix: '',
//             libraryTarget: 'commonjs'
//         },
//         // 这个配置要和 output.sourceMapFilename 一起使用
//         module: {
//             loaders: [
//                 {
//                     test: /\.js$/,
//                     exclude: /node_modules/,
//                     loader: 'babel-loader?stage=1'
//                 }
//             ]
//         },
//         externals:  {},
//         plugins: [
//             new webpack.DefinePlugin({
//                 __BUILD_VERSION__: 'VERSION = "' + pkg.version + '"',
//                 __BUILD_FALLBACK__: isPc
//             }),
//         ]
//     })).pipe(gulp.dest('./dist'));
// }

gulp.task('pack', function() {
    return pack(false);
});

// gulp.task('pack-commonjs', ['pack'], function() {
//     packNodeVersion(false);
// });

gulp.task('test-pack', ['del-test-dist'], function() {
    return gulp.src('./test-src/index.spec.js').pipe(webpackStream({
        output: {
            // 不要配置path，会报错
            //path: 'dist',
            filename: 'test.js',
            sourceMapFilename: 'test.js.map',
            sourcePrefix: ''
        },
        // 这个配置要和 output.sourceMapFilename 一起使用
        devtool: '#source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader?stage=1'
                },{
                    test: /test-src\/[a-zA-Z0-9]+\.spec\.js/,
                    loaders: ['mocha', 'babel-loader?stage=1'] // mocha必须写在babel之前 没想通
                }
            ]
        },
        externals:  {
            'natty-storage': 'var NattyStorage' // 相当于 modules.export = NattyStorage;
        },
        plugins: [
            new webpack.DefinePlugin({
                __BUILD_VERSION__: 'VERSION = "' + pkg.version + '"'
            })
        ]
    })).pipe(gulp.dest('./test-dist'));
});

gulp.task('del-test-dist', function (done) {
    del(['test-dist']).then(function () {
        done();
    });
});

gulp.task('min', function () {
    return gulp.src([
        'dist/natty-storage.js',
        // 'dist/natty-db.pc.js',
        // 'dist/natty-db.node.js',
        // 'dist/natty-db.pc.node.js'
    ]).pipe(uglify()).pipe(rename(function (path) {
        console.log(path);
        path.basename += '.min';
    })).pipe(gulp.dest('./dist'));
});

gulp.task('reload-by-src', ['pack'], function () {
    browserSync.reload();
});

gulp.task('reload-by-test', ['test-pack'], function () {
    browserSync.reload();
});

// 启动监听
gulp.task('watch', ['pack', 'test-pack'], function () {
    browserSync({
        // port: 8008,
        server: {
            baseDir: './'
        },
        notify: false,
        open: 'external'
    });

    gulp.watch([
        'src/**/*.js'
    ], ['reload-by-src']);

    gulp.watch([
        'test-src/**/*.js'
    ], ['reload-by-test']);
});
