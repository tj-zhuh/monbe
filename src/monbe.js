
; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) {
            var jquery = require('jquery');
            return factory(jquery);
        })
    }
    else {
        root.monbe = factory(root.$)
    }
}(this, function ($) {

    if (typeof $ !== 'function')
        throw new Error('模块$获取失败');

    var manager = (function ($) {
        return {
            privates: [],
            instances: [],
            ctor: null,
            create: function () {
                if (typeof ctor !== 'function')
                    throw new Error('ctor不是函数');

                var obj = new ctor();
                this.privates.push({});
                this.instances.push(obj);
                return obj;

            },
            getp: function (obj, key) {
                if (!obj || typeof key !== 'string')
                    throw new Error('getp函数参数不正确');

                for (var i = 0; i < this.instances.length; i++) {
                    if (this.instances[i] === obj) {
                        return this.privates[i][key];
                    }
                }

            },
            setp: function (obj, key, value) {

                if (!obj || typeof key !== 'string')
                    throw new Error('getp函数参数不正确');

                for (var i = 0; i < this.instances.length; i++) {
                    if (this.instances[i] === obj) {
                        this.privates[i][key] = value;
                    }
                }
            },
            fac: function (ctor) {
                var that = this;
                this.ctor = ctor;
                var dfObj = this.create();
                function ret() {
                    return that.create();
                };
                $.extend(ret, dfObj);
                ret.version = typeof version === 'string' ? version : undefined;
                this.instances[0] = ret;
                return ret;
            }
        };
    })($); 

    var defOptions = {
        selector: '.monbe',    // 容器的选择器  
    };

    function ctor() {
        this.options = defOptions;
        this.element;   // 容器 
        this.elementBar;    // 横条，是begin、end和step的容器
        this.elementBegin;  // 开始月份
        this.elementEnd;    // 结束月份
        this.elementStep;   // 开始、结束之间的带状横条
        this.changeHandler; // 修改事件处理

        this.begin = 1;  // 当前选择的开始月份
        this.end = 1;    // 当前选择的结束月份
    }

    ctor.prototype.config = function (_options) {
        this.options = $.extend(true, {}, this.options, _options);
    } 

    ctor.prototype.init = function () {

        var that = this;

        // 容器
        var element = $(this.options.selector);

        var bar = $("<div class='monbe-bar'></div>");
        var begin = $("<div class='monbe-begin'></div>");
        var end = $("<div class='monbe-end'></div>");
        var step = $("<div class='monbe-step'></div>");

        element.append(bar);
        bar.append(begin);
        bar.append(end);
        bar.append(step);

        this.elementBar = bar;
        this.elementBegin = begin;
        this.elementEnd = end;
        this.elementStep = step;

        begin.mousedown(mousedownHandler);
        end.mousedown(mousedownHandler);

        var max = bar[0].offsetWidth;

        function mousedownHandler(e) {
            var point = $(this);

            var x = e.clientX;
            var l = point[0].offsetLeft;

            document.onmousemove = function (e) {
                var thisX = (e || window.event).clientX;
                var to = Math.min(max, Math.max(0, l + thisX - x));
                point.css('left', to + 'px');

                var minX = Math.min(begin[0].offsetLeft, end[0].offsetLeft);
                var maxX = Math.max(begin[0].offsetLeft, end[0].offsetLeft);
                step.css('left', minX + 'px');
                step.css('width', (maxX - minX) + 'px');

                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }

            document.onmouseup = function (e) {
                
                var left = point[0].offsetLeft;

                var month = 1 + Math.round(left * 11 / max);

                setPos(point, month);

                var month1 = begin.attr('data-month');
                var month2 = end.attr('data-month');
                that.begin = Math.min(month1, month2);
                that.end = Math.max(month1, month2);

                if (typeof that.changeHandler === 'function') {                   
                    that.changeHandler(that.begin, that.end);
                }

                document.onmousemove = null;
            }
        }

        function setPos(point, month) {

            var to = (month - 1) * max / 11;
            point.css('left', to + 'px');
            point.attr('data-month', month)

            var minX = Math.min(begin[0].offsetLeft, end[0].offsetLeft);
            var maxX = Math.max(begin[0].offsetLeft, end[0].offsetLeft);
            step.css('left', minX + 'px');
            step.css('width', (maxX - minX) + 'px');
        }


        var now = new Date()
        var month = now.getMonth() + 1;

        setPos(begin, 1);
        setPos(end, month);

        this.begin = 1;
        this.end = month;
    } 

    ctor.prototype.change = function (func) {
        this.changeHandler = func;
    } 

    return manager.fac(ctor);
}))




 