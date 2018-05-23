
require.config({
    paths: {
        "monbe": "../src/monbe",
        "jquery": "jquery-1.12.4"
    }
})

define(function (require) {

    var $ = require('jquery');
    var monbe = require('monbe');
    
    monbe.init();

    $('.display').html('开始月份：' + monbe.begin + '  结束月份：' + monbe.end);

    monbe.change(function () {
        $('.display').html('开始月份：' + monbe.begin + '  结束月份：' + monbe.end);
    });
})
