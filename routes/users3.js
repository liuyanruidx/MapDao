/**
 * Created by 延瑞 on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');



router.get('/users/register', function (req, res) {
    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser.getUsername());
        username = currentUser.getUsername();
    }
    res.render('users/register', {title: 'Express', message: "", user: username, layout: 'share/layout'});
});


router.post('/register', function (req, res) {
    var user = new AV.User();
    user.set("username", req.body.username);
    user.set("password", req.body.password);
    user.set("email", req.body.email);
    user.signUp(null, {
            success: function (user) {
                res.redirect('/');
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                res.render('users/register', {message: error.message});
            }
        }
    );
});

router.get('/logoff', function (req, res) {
    AV.User.logOut();
    res.redirect('/');
});

router.get("/applyforedit", function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();

        console.log(currentUser);
        console.log(currentUser.attributes.UserRoleId);

        var isedit = false;
        if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//普通用户
        {
            isedit = true;
        }


        res.render('users/applyforedit', {

            user: username,
            isedit: isedit,
            layout: 'share/layout'
        });
    }
    else {
        res.redirect('/users/login');
    }
});


router.post("/applyforedit", function (req, res) {


    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();


        var InvitationCode = AV.Object.extend("InvitationCode");
        var invitationquery = new AV.Query(InvitationCode);
        invitationquery.equalTo("Code", req.body.invitationcode);
        invitationquery.equalTo("IsUsed", false);
        invitationquery.first({
            success: function (invitationquery) {

                if (invitationquery != null) {
                    //imgurl = queryimg.get('Image').url();
                    invitationquery.set("IsUsed", true);
                    invitationquery.set("UseUserId", currentUser.id);
                    invitationquery.save();
                    currentUser.set("UserRoleId", "55116417e4b0dbfd5ebdaba2");
                    currentUser.save();
                    res.redirect('/users/info');
                }
                else {
                    res.redirect('/users/applyforedit');

                }


            },
            error: function (error) {
                //alert("Error: " + error.code + " " + error.message);
                res.redirect('/users/info');
            }
        });


    }
    else {
        res.redirect('/users/login');
    }


});

router.get("/users/info", function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();
        var useremail = currentUser.attributes.email;
        console.log(currentUser);

        res.render('users/info', {

            user: username,
            useremail: useremail,
            layout: 'share/layout'
        });
    }
    else {
        res.redirect('/users/login');
    }
});

router.get("/users/pwdreset", function (req, res) {
    console.log(req.params)
    var username = req.query.username;
    res.render('users/pwdreset', {user: username, layout: 'share/layout'});
});
router.post("/users/pwdreset", function (req, res) {
    var username = req.body.username;


    var query = new AV.Query(AV.User);
    query.equalTo("username", username);  // find all the women
    query.first({
        success: function (userinfo) {
            // Do stuff
            console.log(userinfo)

            if (userinfo != null) {

                var useremail = userinfo.attributes.email;
                res.render('users/sendpwdresetemail', {user: username, useremail: useremail, layout: 'share/layout'});

            }
            else {
                //res.send("<script language='javascript'> alert('该用户不存在');</script>")


                res.send("<script language='javascript'>if(confirm('该用户不存在！')){document.location.replace('/users/pwdreset')}else{document.location.replace('/users/pwdreset')};</script>");
            }
        }
    });

});

router.post("/users/sendpwdresetemail", function (req, res) {


    AV.User.requestPasswordReset(req.body.useremail.trim(), {
        success: function () {
            // Password reset request was sent successfully
            res.render('users/sendpwdresetemailresult', {
                user: null,
                resultmessage: "发送重置密码邮件成功！",
                layout: 'share/layout'
            });
        },
        error: function (error) {
            // Show the error message somewhere
            res.render('users/sendpwdresetemailresult', {
                user: null,
                resultmessage: "发送重置密码邮件失败！",
                layout: 'share/layout'
            });
        }
    });
});

router.get("/users/changepassword", function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();

        console.log(currentUser);

        res.render('users/changepassword', {

            user: username,

            layout: 'share/layout'
        });
    }
    else {
        res.redirect('/users/login');
    }
});

router.post("/users/changepassword", function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();

        console.log(currentUser);

        currentUser.updatePassword(req.body.oldpassword.trim(), req.body.newpassword.trim(), {
            success: function () {
                //更新成功

                res.render('users/changepwdresult', {
                    user: username,
                    resultmessage: "密码修改成功！",
                    layout: 'share/layout'
                });

            },
            error: function (err) {
                //更新失败
                // console.dir(err);
                res.render('users/changepwdresult', {
                    user: username,
                    resultmessage: "密码修改失败！",
                    layout: 'share/layout'
                });

            }
        });
    }
    else {
        res.redirect('/users/login');
    }
});
module.exports = router;
