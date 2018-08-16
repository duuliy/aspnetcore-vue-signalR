/**
 * Created by lovo_bdk on 09-07-18.
 */
!(function(win, doc) {
    function setFontSize() {
        // 获取window 宽度
        // zepto实现 $(window).width()就是这么干的
        var winWidth = window.innerWidth;
        doc.documentElement.style.fontSize = (winWidth / 1080) * 100 + 'px';
    }
    var evt = 'onorientationchange' in win ? 'orientationchange' : 'resize';
    var timer = null;
    win.addEventListener(evt, function() {
        clearTimeout(timer);

        timer = setTimeout(setFontSize, 300);
    }, false);
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) {
            clearTimeout(timer);

            timer = setTimeout(setFontSize, 300);
        }
    }, false);
    //初始化
    setFontSize();
}(window, document));