/**
 * Created by 延瑞 on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');

router.get('/edithelp',function(req,res){


    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser);
        username = AV.User.current().getUsername();
    }

    res.render('help/edithelp', {
        title: 'Express', user: username, layout: 'share/layout'
    });
});
router.get('/copyright',function (req, res) {
    console.log('获取当前用户: %j', AV.User.current());

    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser);
        username = AV.User.current().getUsername();
    }


    var query = new AV.Query(AV.User);
    var usercount;
    query.count({
        success: function(count) {
            // The count request succeeded. Show the count
            console.log(count);
            usercount=count;
            res.render('help/copyright', {title: 'Express', user: username, usercount:count,layout: 'share/layout'});
        },
        error: function(error) {
            // The request failed
            res.render('index', {title: 'Express', user: username, usercount:0,layout: 'share/layout'});
        }
    });


    //res.render('index', {title: 'Express', user: username, usercount:usercount,layout: 'share/layout'});
});
router.get('/agreement',function (req, res) {
    console.log('获取当前用户: %j', AV.User.current());

    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser);
        username = AV.User.current().getUsername();
    }


    var query = new AV.Query(AV.User);
    var usercount;
    query.count({
        success: function(count) {
            // The count request succeeded. Show the count
            console.log(count);
            usercount=count;
            res.render('help/agreement', {title: 'Express', user: username, usercount:count,layout: 'share/layout'});
        },
        error: function(error) {
            // The request failed
            res.render('index', {title: 'Express', user: username, usercount:0,layout: 'share/layout'});
        }
    });


    //res.render('index', {title: 'Express', user: username, usercount:usercount,layout: 'share/layout'});
});
router.get('/disclaimer',function (req, res) {
    console.log('获取当前用户: %j', AV.User.current());

    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser);
        username = AV.User.current().getUsername();
    }


    var query = new AV.Query(AV.User);
    var usercount;
    query.count({
        success: function(count) {
            // The count request succeeded. Show the count
            console.log(count);
            usercount=count;
            res.render('help/disclaimer', {title: 'Express', user: username, usercount:count,layout: 'share/layout'});
        },
        error: function(error) {
            // The request failed
            res.render('index', {title: 'Express', user: username, usercount:0,layout: 'share/layout'});
        }
    });


    //res.render('index', {title: 'Express', user: username, usercount:usercount,layout: 'share/layout'});
});
router.get('/privacy',function (req, res) {
    console.log('获取当前用户: %j', AV.User.current());

    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser);
        username = AV.User.current().getUsername();
    }


    var query = new AV.Query(AV.User);
    var usercount;
    query.count({
        success: function(count) {
            // The count request succeeded. Show the count
            console.log(count);
            usercount=count;
            res.render('help/privacy', {title: 'Express', user: username, usercount:count,layout: 'share/layout'});
        },
        error: function(error) {
            // The request failed
            res.render('index', {title: 'Express', user: username, usercount:0,layout: 'share/layout'});
        }
    });


    //res.render('index', {title: 'Express', user: username, usercount:usercount,layout: 'share/layout'});
});

module.exports=router;