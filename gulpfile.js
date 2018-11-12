var gulp = require("gulp");
var htmlclean = require("gulp-htmlclean"); //压缩html
var imagemin = require("gulp-imagemin"); //压缩image
var uglify = require("gulp-uglify"); //压缩js
var stripdebug = require("gulp-strip-debug"); //压缩之后去掉打印与debug
var concat = require("gulp-concat"); //将所有js文件压缩到一个文件中
var less = require("gulp-less"); //将less文件转为css文件
var postcss = require("gulp-postcss"); //执行下边两个插件
var autoprefixer = require("autoprefixer"); //自动添加css前缀'-weblit-
var cssnano = require("cssnano"); //压缩前缀的css
var connect = require("gulp-connect"); //开启一个本地服务

//export NODE_ENV=development 先将模式设置为开发环境
var devMode = process.env.NODE_ENV == "development"; //看当前是开发环境还是生产环境。开发环境便不压缩代码
console.log(devMode);
// gulp.src()//读文件
// gulp.dest()//写文件
// gulp.task()//创建任务
// gulp.watch()//监听

var folder = {
    src: "./src/", //开发目录文件夹
    dist: "./dist/" //压缩打包目录文件夹
}

gulp.task("html", function() {
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload()) //自动刷新
    if (!devMode) { //只在不是发开模式下进行压缩代码
        page.pipe(htmlclean())
    }

    page.pipe(gulp.dest(folder.dist + "html"))
})

gulp.task("images", function() {
    gulp.src(folder.src + "images/*")
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images"))
})

gulp.task("js", function() {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload()) //自动刷新
    if (!devMode) {
        page.pipe(stripdebug())
            // .pipe(concat("main.js"))//合并到一个js文件中
        page.pipe(uglify())
    }

    page.pipe(gulp.dest(folder.dist + "js"))
})

gulp.task("css", function() {
    var options = [autoprefixer(), cssnano()];
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload()) //自动刷新
        .pipe(less())
    if (!devMode) {
        page.pipe(postcss(options))
    }

    page.pipe(gulp.dest(folder.dist + "css"))
})

//监听
gulp.task("watch", function() {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "images/*", ["images"]);
})

//服务
gulp.task("server", function() {
    connect.server({
        port: "8090",
        livereload: true //浏览器自动刷新-->.pipe(connect.reload()) //自动刷新
    })
})


//执行
gulp.task("default", ["html", "images", "js", "css", "watch", "server"], function() {

})