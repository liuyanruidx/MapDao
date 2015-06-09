/**
 * Created by ���� on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');
var dateFormat = require('dateformat');//日期格式化
var crypto = require('crypto');//md5加密


router.get('/index',function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();
        var isedit = false;
        if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//普通用户
        {
            isedit = true;
        }


        var nowdatetime = new Date();
        //dateFormat(nowdatetime, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        var aaa = dateFormat(nowdatetime, "yyyymmddHHMMss");


        //得到自己所有邀请码


        var invitationcodes = new Array();

        var InvitationCode = AV.Object.extend("InvitationCode");
        var query = new AV.Query(InvitationCode);
        query.equalTo("CreateUserId", currentUser.id);
        query.find({
            success: function (results) {
                //alert("Successfully retrieved " + results.length + " scores.");
                // Do something with the returned AV.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];

                    var invitationcode = new Object();
                    invitationcode.id = object.id;
                    invitationcode.code = object.get('Code');
                    invitationcode.isused = object.get('IsUsed');
                    invitationcodes.push(invitationcode);

                }
                res.render('invitation/index', {
                    datetime: aaa,
                    user: username,
                    isedit: isedit,
                    invitationcodes: invitationcodes,

                    layout: 'share/layout'
                });

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    else {
        res.redirect('/users/login');
    }
});
router.get('/add',function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();
        var nowdatetime = new Date();
        //dateFormat(nowdatetime, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        var nowdatestr = dateFormat(nowdatetime, "yyyymmddHHMMss");

        var codestr = username + nowdatestr;

        var md5 = crypto.createHash('md5');
        md5.update(codestr);
        var md5code = md5.digest('hex');
        console.log(codestr);

        console.log(md5code);

        console.log(currentUser.id);
        var InvitationCode = AV.Object.extend("InvitationCode");
        var invitationcode = new InvitationCode();
        invitationcode.set("Code", md5code);
        invitationcode.set("CreateUserId", currentUser.id);
        invitationcode.set("IsUsed", false);
        invitationcode.save(null, {
                success: function (invitationcode) {
                    //res.send('true');
                    //res.redirect('/invitation/index');
                },
                error: function (invitationcode, error) {
                    //res.send('添加失败');
                    // res.redirect('/invitation/index');
                }
            }
        );


        res.redirect('/invitation/index');

    }


});

module.exports=router;