import '../../less/note.less'
import $ from 'jquery'
import Toast from './toast.js'
import Event from './event.js'

export function Note(opts) {
    this.initOpts(opts);
    this.createNote();
    this.setStyle();
    this.bindEvent();
}
Note.prototype = {
    color: [
        ['#ea9b35', '#efb04e'],
        ['#dd598b', '#e672a2'],
        ['#eee34b', '#f2eb67'],
        ['#c24226', '#d15a39'],
        ['#c1c341', '#d0d24c'],
        ['#3f78c3', '#5591d2']
    ],
    defaultOpts: {
        id: '',
        $ct: $('#content'),
        context: 'input here'
    },

    initOpts: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id;
            this.username = this.opts.username;
            this.avatar = this.opts.avatar;
        } else {
            this.username = this.opts.username;
            this.avatar = this.opts.avatar;
        }
    },

    createNote: function () {
        var tpl = '<div class="note">'
            + '<div class="note-head"><div class="title"><img src=""><span class="username"><span></div><span class="delete">&times;</span></div>'
            + '<div class="note-ct" contenteditable="true"></div>'
            + '</div>';
        this.$note = $(tpl);
        this.$note.find('.note-ct').html(this.opts.context);
        this.$note.find('.title img').attr('src', this.avatar);
        this.$note.find('.title .username').html(this.username)
        this.opts.$ct.append(this.$note);
        if (!this.id) this.$note.css({ top: '80%', left: '50%' });
    },

    setStyle: function () {
        var color = this.color[Math.floor(Math.random() * 6)];
        this.$note.find('.note-head').css('background-color', color[0]);
        this.$note.find('.note-ct').css('background-color', color[1]);
    },
    setLayout: function () {
        var self = this;
        if (self.clk) {
            clearTimeout(self.clk);
        }
        self.clk = setTimeout(function () {
            Event.fire('waterfall');
        }, 100);
    },
    bindEvent: function () {
        var self = this,
            $note = this.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $delete = $note.find('.delete');

        $noteCt.on('focus', function () {
            if ($noteCt.html() == 'input here') $noteCt.html("");
            $noteCt.data('before', $noteCt.html());
        }).on('blur paste', function () {

            if ($noteCt.data('before') != $noteCt.html()) {
                $noteCt.data('before', $noteCt.html());
                if (self.id) {
                    self.edit($noteCt.html())
                } else {
                    self.add($noteCt.html())
                }
            }
        });

        //设置笔记移动
        $noteHead.on('mousedown', function (e) {
            var evtX = e.pageX - $note.offset().left,
                evtY = e.pageY - $note.offset().top;
            $note.addClass('draggable').data('evtPos', { x: evtX, y: evtY });
        }).on('mouseup', function () {
            $note.removeClass('draggable').removeData('evtPos');
        });

        $('body').on('mousemove', function (e) {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y,
                left: e.pageX - $('.draggable').data('evtPos').x
            });
        });

        $delete.on('click', function () {
            self.delete()
        })
    },

    edit: function (msg) {
        var self = this;
        $.post('/api/note/edit', {
            id: this.id,
            note: msg
        }).done(function (ret) {
            if (ret.status === 0) {
                Toast('编辑成功')
            } else {
                Toast(ret.errorMsg)
            }
        })
    },

    add: function (msg) {
        var self = this;
        $.post('/api/note/add', { note: msg })
            .done(function (ret) {
                if (ret.status === 0) {
                    self.id = ret.data.objectId;
                    self.username = ret.data.username;
                    self.avatar = ret.data.avatar;
                    Toast('add success');
                    self.setLayout();
                } else {
                    self.$note.remove();
                    Toast(ret.errorMsg);
                }
            });
    },

    delete: function () {
        var self = this;
        $.post('/api/note/delete', { id: this.id })
            .done(function (ret) {
                if (ret.status === 0) {
                    self.$note.remove();
                    self.setLayout();
                    Toast('delete success');
                } else {
                    Toast(ret.errorMsg);
                }
            })
    }
}

