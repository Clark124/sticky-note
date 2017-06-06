import $ from 'jquery'
var Waterfall = (function(){
    function init($ct,$item){
        waterfall($ct,$item);
        $(window).resize(function(){
            waterfall($ct,$item)
        })
    }
    function waterfall($ct,$item){
        var colLength = parseInt($ct.width()/$item.width());
        var arr = [];
        for(var i=0;i<colLength;i++){
            arr[i] = 0;
        }

        $item.each(function(){
            var minValue = Math.min.apply(null,arr);
            var minIndex = arr.indexOf(minValue);

            $(this).css({
                top: arr[minIndex],
                left: $(this).outerWidth(true)*minIndex
            });
            arr[minIndex] += $(this).outerHeight(true)
        })
    }
    return {
        init:init
    }
})();

export default Waterfall