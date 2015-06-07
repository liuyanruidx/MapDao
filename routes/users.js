var router = require('express').Router();
var AV = require('leanengine');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login', function (req, res) {
  //res.send('respond with a resource');
  console.log("sdfasdfdsf")
  var currentUser = AV.User.current();
  var username = null;
  if (currentUser) {
    console.log(currentUser.getUsername());
    username = currentUser.getUsername();
  }
  res.render('users/login', {title: 'Express', user: username, layout: 'share/layout'});
});
router.post('/login', function (req, res) {
  var currentUser = AV.User.current();
  var username = null;
  if (currentUser) {
    console.log(currentUser.getUsername());
    username = currentUser.getUsername();
  }
  AV.User.logIn(req.body.username, req.body.password).then(function () {
    //��¼�ɹ���avosExpressCookieSession���Զ�����¼�û���Ϣ�洢��cookie
    //��ת��profileҳ�档
    console.log(req.body.username + "��½�ɹ�")

    console.log('signin successfully: %j', AV.User.current());
    res.redirect('/');
  }, function (error) {
    //��¼ʧ�ܣ���ת����¼ҳ��
    console.log("��¼ʧ��" + error)
    res.render('index', {message: '��¼ʧ�ܣ������µ�¼', user: username, layout: 'share/layout'});

  });


});

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
    if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//��ͨ�û�
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

router.get("/info", function (req, res) {
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

router.get("/pwdreset", function (req, res) {
  console.log(req.params)
  var username = req.query.username;
  res.render('users/pwdreset', {user: username, layout: 'share/layout'});
});
router.post("/pwdreset", function (req, res) {
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
        //res.send("<script language='javascript'> alert('���û�������');</script>")


        res.send("<script language='javascript'>if(confirm('���û������ڣ�')){document.location.replace('/users/pwdreset')}else{document.location.replace('/users/pwdreset')};</script>");
      }
    }
  });

});

router.post("/sendpwdresetemail", function (req, res) {


  AV.User.requestPasswordReset(req.body.useremail.trim(), {
    success: function () {
      // Password reset request was sent successfully
      res.render('users/sendpwdresetemailresult', {
        user: null,
        resultmessage: "�������������ʼ��ɹ���",
        layout: 'share/layout'
      });
    },
    error: function (error) {
      // Show the error message somewhere
      res.render('users/sendpwdresetemailresult', {
        user: null,
        resultmessage: "�������������ʼ�ʧ�ܣ�",
        layout: 'share/layout'
      });
    }
  });
});

router.get("/changepassword", function (req, res) {
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

router.post("/changepassword", function (req, res) {
  var currentUser = AV.User.current();
  var username;
  if (currentUser) {
    username = currentUser.getUsername();

    console.log(currentUser);

    currentUser.updatePassword(req.body.oldpassword.trim(), req.body.newpassword.trim(), {
      success: function () {
        //���³ɹ�

        res.render('users/changepwdresult', {
          user: username,
          resultmessage: "�����޸ĳɹ���",
          layout: 'share/layout'
        });

      },
      error: function (err) {
        //����ʧ��
        // console.dir(err);
        res.render('users/changepwdresult', {
          user: username,
          resultmessage: "�����޸�ʧ�ܣ�",
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
