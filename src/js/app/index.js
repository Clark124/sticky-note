import '../../less/index.less';
import $ from 'jquery'
import Event from '../mod/event.js'
import NoteManager from '../mod/note-manager.js'
import WaterFall from '../mod/waterfall.js'

NoteManager.load();
$('.add-note').on('click',function(e){
    e.preventDefault;
    NoteManager.add();
})

Event.on('waterfall',function(){
    WaterFall.init($('#content'),$('.note'));
})
