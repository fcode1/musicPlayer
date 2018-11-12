var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);

var index = 0;
var songList;
var controlManger;
var audio = new root.audioControl();

function bindClick() {

    $scope.on("play:change", function(e, index, flag) {
        audio.getAudio(songList[index].audio);
        if (audio.status == "play" || flag) {
            audio.play();
            // root.pro.start();
        }
        root.pro.renderAllTime(songList[index].duration)
        root.render(songList[index]);
    })

    $scope.on("click", ".prev-btn", function() {
        // if (index == 0) {
        //     index = songList.length - 1;
        // } else {
        //     index--;
        // }
        var index = controlManger.prev();
        $scope.trigger("play:change", index);
        // root.render(songList[index]);
        if (audio.status == 'play') {
            root.pro.start(0);
        } else {
            root.pro.update(0);
        }
    })
    $scope.on("click", ".next-btn", function() {
        // if (index === songList.length - 1) {
        //     index = 0;
        // } else {
        //     index++;
        // }
        var index = controlManger.next();
        $scope.trigger("play:change", index);
        // root.render(songList[index]);
        if (audio.status == 'play') {
            root.pro.start(0);
        } else {
            root.pro.update(0);
        }
    })
    $scope.on("click", ".play-btn", function() {
        if (audio.status == "play") {
            audio.pause();
            root.pro.stop();
        } else {
            audio.play();
            root.pro.start();
        }
        $(this).toggleClass("pause");
    })
}

function bindTouch() {
    var $slider = $scope.find('.slider-pointer');
    var offset = $('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;

    $slider.on('touchstart', function() {
        root.pro.stop();
    }).on('touchmove', function(e) {
        // console.log(e);
        var x = e.changedTouches[0].clientX; //拖动停止到整个浏览器左端的距离
        var per = (x - left) / width; //整个距离-进度条的左距离
        if (per > 0 && per <= 1) {
            root.pro.update(per);
        }
    }).on('touchend', function(e) {
        var x = e.changedTouches[0].clientX; //拖动停止到整个浏览器左端的距离
        var per = (x - left) / width; //整个距离-进度条的左距离
        if (per > 0 && per <= 1) {
            // root.pro.update(per);
            var curTime = per * songList[controlManger.index].duration;
            audio.playTo(curTime);
            $scope.find('.play-btn').addClass('pause');
            audio.status = 'play';
            root.pro.start(per);
        }
    })
}

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            root.render(data[0]);
            songList = data;
            bindClick();
            bindTouch();
            controlManger = new root.controlManger(data.length);
            // console.log(data);
            $scope.trigger("play:change", 0);
        },
        error: function() {
            console.log('error');
        }
    })
}


getData("../mock/data.json");