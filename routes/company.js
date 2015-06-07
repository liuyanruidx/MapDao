/**
 * Created by ���� on 2015/6/7.
 */
var router = require('express').Router();

router.get('/about',function(req,res){
    res.render('company/about', {
        layout: null
    });
});

module.exports=router;