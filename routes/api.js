var express = require('express');
var router = express.Router();
// var Note = require('../model/note')
var AV = require('leanengine');
var Note = AV.Object.extend('Note');
/*
1.获取所有的 note: GET  /api/notes  req:{}  res: {status:0, data:[{},{}]}  {status:1, errorMsg:errorMsg}
2. 创建一个 note: POST: /api/note/create req:{note:'hello world'} res: {status:0} {status:1 errorMsg:errorMsg}
3. 修改一个 note: POST: /api/note/edit req:{note:'new note' id:100}
4. 删除一个 note: POST: /api/note/delete req:{id:100}

*/

/* GET users listing. */
router.get('/notes', function (req, res, next) {
  var query = new AV.Query('Note')
  query.find().then((ret) => {
    res.send({ status: 0, data: ret })
  })
});

router.get('/note/addnote', function (req, res) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }
  var username = req.session.user.username;
  var avatar = req.session.user.avatar;
  res.send({ status: 0, data: { username: username, avatar: avatar } })
})

router.post('/note/add', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }

  var uid = req.session.user.id;
  var avatar = req.session.user.avatar;
  var username = req.session.user.username;
  var notes = req.body.note//创建新的数据
  var note = new Note();
  note.set("myId", uid);
  note.set("text", notes);
  note.set('username', username);
  note.set('avatar', avatar);
  note.save().then(function (ret) {
    res.send({ status: 0, data: ret })
  }, function (err) {
    res.send({ status: 1, errorMsg: "数据库出错" })
  })

});

router.post('/note/edit', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }
  var uid = req.session.user.id
  let query = new AV.Query('Note')
  query.get(req.body.id).then(function (ret) {
    if (ret.attributes.myId !== uid) {
      res.send({ errorMsg: '你没有权限操作' })
      return;
    } else {
      let update = AV.Object.createWithoutData('Note', req.body.id);
      update.set('text', req.body.note)
      update.save().then(function () {
        res.send({ status: 0 })
      }, function () {
        res.send({ status: 1, errorMsg: '数据库出错' })
      })
    }
  })
})

router.post('/note/delete', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }
  var uid = req.session.user.id
  let query = new AV.Query('Note')
  query.get(req.body.id).then(function (ret) {
    if (ret.attributes.myId !== uid) {
      res.send({ errorMsg: '你没有权限操作' })
      return;
    } else {
      let deleteNote = AV.Object.createWithoutData('Note', req.body.id)
      deleteNote.destroy().then(function () {
        res.send({ status: 0 })
      }, function () {
        res.send({ status: 1, errorMsg: '删除失败' })
      })
    }
  })
})

module.exports = router;
