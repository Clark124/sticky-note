import Toast from './toast.js'
import {Note}  from './note.js'
import Event from './event.js'
import $ from 'jquery'

var NoteManager = (function(){
    function load(){
        $.get('./api/notes')
        .done(function(ret){
            if(ret.status ===0 ){
                $.each(ret.data,function(idx,article){
                    new Note({
                        id: article.objectId,
                        context: article.text,
                        avatar:article.avatar,
                        username:article.username
                    });
                });
                Toast('更新')
                Event.fire('waterfall');
            }else{
                Toast(ret.errorMsg);
            }
        })
        .fail(function(){
            Toast('网络异常');
        })
    }
    function add(){
        $.get('/api/note/addnote').done(function(ret){
            if(ret.status===0){
                 new Note({
                     username:ret.data.username,
                     avatar:ret.data.avatar
                 });
                Toast('添加成功')
            }else{
                Toast(ret.errorMsg);
            }
        })
       
    }

    return {
        load: load,
        add: add
    }

})()

export default NoteManager