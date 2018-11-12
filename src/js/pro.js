//进度条控制
(function($, root) {
    //1.渲染总时间

    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var lastPer = 0;
    var startTime;

    function renderAllTime(time) {
        // 253s-- > 04:13
        curDuration = time;
        time = formatTime(time);
        $scope.find('.all-time').html(time);
    }

    //时间格式转换
    // 253s-- > 04:13
    function formatTime(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time - m * 60;
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }
    //开始时间
    function start(per) {
        cancelAnimationFrame(frameId);
        lastPer = per == undefined ? lastPer : per;
        startTime = new Date().getTime();

        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPer + (curTime - startTime) / (curDuration * 1000) //进度条占整首歌的百分比
            update(percent);
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    //暂停时间变化
    function stop() {
        cancelAnimationFrame(frameId);
        //每次暂停时，记录当前时间，开始时继续从当前时间播放
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000)
    }
    //更新时间
    function update(per) {
        var time = per * curDuration;
        time = formatTime(time);
        $scope.find('.cur-time').html(time);

        //进度条圆点移动
        var perX = (per - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    }

    //暴露方法
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        update: update,
        stop: stop
    }

})(window.Zepto, (window.player || window.player == {}))