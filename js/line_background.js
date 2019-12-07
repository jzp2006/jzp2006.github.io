! function() {
    function n(n, e, t) {
        return n.getAttribute(e) || t // 如果有无属性就返回 t, 否则返回此属性
    }

    function e(n) {
        return document.getElementsByTagName(n) // 返回带有该标签的集合
    }

    function t() {
        var t = e("script"),
            o = t.length,
            i = t[o - 1];
        return {
            l: o, // 长度: script 的数量
            z: n(i, "zIndex", -1), // 堆叠优先级: -1 (貌似 -2147483584 也可以, 但是为了保险还是用 -1)
            o: n(i, "opacity", 1), // 透明度: 100%
            c: n(i, "color", "53,66,252"), // 颜色: 深蓝
            n: n(i, "count", 200) // 点的数量: 200
        }
    }
    var a, c, u, m = document.createElement("canvas"), // 画布
        r = m.getContext("2d"), // 画布
        d = t(), // script 属性
        l = "c_n" + d.l, // 画布编号
        x = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame || 
            function(n) {
                window.setTimeout(n, 1e3 / 60)
            }, // 延时执行函数
        w = Math.random, // 随机数
        y = {
            x: null,
            y: null,
            max: 2e4
        };

    m.id = l, 
    m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o, 
    e("body")[0].appendChild(m); 

    function o() {
        a = m.width = window.innerWidth || 
                      document.documentElement.clientWidth || 
                      document.body.clientWidth, // 窗口宽度
        c = m.height = window.innerHeight || 
                       document.documentElement.clientHeight || 
                       document.body.clientHeight // 窗口高度
    } 
    o(), 
    window.onresize = o, // 页面长宽变动
    window.onmousemove = function(n) {
        n = n || window.event, y.x = n.clientX, y.y = n.clientY
    }, // 鼠标移动
    window.onmouseout = function() {
        y.x = null, y.y = null
    }; // 鼠标移出范围, 坐标清空
    for(var s = [], f = 0; d.n > f; f++) {
        var h = w() * a,
            g = w() * c,
            v = 2 * w() - 1,
            p = 2 * w() - 1; // 随机坐标与移动速度
        s.push({
            x: h,
            y: g,
            xa: v,
            ya: p,
            max: 6e3
        })
    }
    u = s.concat(y); 
    function i() {
        r.clearRect(0, 0, a, c); // 清空画布
        var n, e, t, o, m, l;
        s.forEach(function(i, x) {
            for(i.x += i.xa, i.y += i.ya, 
                i.xa *= i.x > a || i.x < 0 ? -1 : 1, 
                i.ya *= i.y > c || i.y < 0 ? -1 : 1, 
                r.fillRect(i.x - .5, i.y - .5, 1, 1), 
                e = x + 1; e < u.length; e++) 
                n = u[e], 
                null !== n.x && null !== n.y && 
                (o = i.x - n.x, m = i.y - n.y, l = o * o + m * m, 
                    l < n.max && (n === y && l >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * m), // 相当于一堆 if 嵌套, 最终执行的是 "i.x -= .03 * o, i.y -= .03 * m" 语句
                 t = (n.max - l) / n.max, 
                 r.beginPath(), r.lineWidth = t / 2, // 线宽, 越远越细
                 r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", // 样式, 灰色, 越远越透明
                 r.moveTo(i.x, i.y), 
                 r.lineTo(n.x, n.y), r.stroke()))
        }), x(i)
    }
    setTimeout(function() {
        i()
    }, 50)
}();