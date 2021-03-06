import '../../less/toast.less'
import $ from 'jquery'
function toast(msg,time){
    this.msg = msg;
    this.dismissTime = time||1000;
    this.createToast();
    this.showToast();
}
toast.prototype = {
    createToast: function(){
        var tpl = '<div class="toast">'+this.msg+'</div>';
        this.$toast = $(tpl);
        $('body').append(this.$toast);
    },
    showToast:function(){
        var self = this;
        this.$toast.fadeIn('slow',function(){
            setTimeout(function(){
                self.$toast.fadeOut(300,function(){
                    self.$toast.remove();
                });
            },self.dismissTime);
        });
    }
}

export default function(msg,time){
    return new toast(msg,time);
}


