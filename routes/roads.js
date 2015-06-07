/**
 * Created by 延瑞 on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');
var Road = AV.Object.extend("Road");
var Point = AV.Object.extend("Point");
var Road_Image = AV.Object.extend("Road_Image");
var Point_Image = AV.Object.extend("Point_Image");
var Favorite = AV.Object.extend("Favorite");
var url = require('url');

router.get('/edit/:id',function (req, res) {
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();
        var isedit = false;
        if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//��ͨ�û�
        {
            isedit = true;
        }


        var query = new AV.Query(Road);
        query.get(req.params.id, {
            success: function (road) {
                var title = road.get("Title");
                var content = road.get("Content");

                var points = new Array();


                var query = new AV.Query(Point);
                query.equalTo("RoadId", req.params.id);
                query.ascending("Order");
                query.find({
                    success: function (results) {
                        //alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned AV.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];

                            var point = new Object();
                            point.id = object.id;
                            point.type = object.get('Type');
                            point.title = object.get('Title');
                            point.content = object.get('Content');
                            points.push(point);
                            //console.log(points);


                        }
                        res.render('roads/edit', {
                            title: title,
                            user: username,
                            content: content,
                            isedit: isedit,
                            roadid: req.params.id,
                            points: points,
                            layout: 'share/layout'
                        });
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            },
            error: function (object, error) {
            }
        });
    }
    else {
        res.redirect('/users/login');
    }


});
router.get('/pointlistpart/:id',function (req, res) {
    var query = new AV.Query(Road);
    query.get(req.params.id, {
        success: function (road) {
            var title = road.get("Title");
            var content = road.get("Content");

            var points = new Array();

            var query = new AV.Query(Point);
            query.equalTo("RoadId", req.params.id);
            query.ascending("Order");
            query.find({
                success: function (results) {
                    //alert("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned AV.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        var point = new Object();
                        point.id = object.id;
                        point.type = object.get('Type');
                        point.title = object.get('Title');
                        point.content = object.get('Content').replace(/<\/?.+?>/g, "");
                        points.push(point);
                        //console.log(points);


                    }
                    res.render('roads/pointlistpart', {
                        points: points,
                        layout: null
                    });
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        error: function (object, error) {
        }
    });
});
router.get('/roadtitleadd',function (req, res) {
    var road = new Road();
    road.set("RoadTitle", req.body.title.trim());
    road.save(null, {
            success: function (road) {
                res.send('true');
            },
            error: function (road, error) {
                res.send('���ʧ��');
            }
        }
    );
});
router.post('/roadadd',function (req, res) {
    var road = new Road();
    road.set("Title", req.body.InputTitle.trim());
    road.set("Content", req.body.InputContent.trim());
    road.save(null, {
            success: function (road) {
                //res.send('true');
                res.redirect("/roads/list");
            },
            error: function (road, error) {
                res.send('���ʧ��');
            }
        }
    );
});
router.post('/editroadtitle',function (req, res) {
    var query = new AV.Query(Road);
    query.get(req.body.RoadID, {
        success: function (road) {
            // The object was retrieved successfully.
            road.set("Title", req.body.Title.trim());
            road.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/editroadcontent',function (req, res) {

    var query = new AV.Query(Road);
    query.get(req.body.RoadID, {
        success: function (road) {
            // The object was retrieved successfully.
            road.set("Content", req.body.Content.trim());
            road.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/uploadroadimage',function (req, res) {


    console.log(req.body.RoadID);

    var files = [].concat(req.files);

    // console.log(files[0].file.path);


    for (var i = 0; i < files.length; i++) {
        var file = files[i].file;

        var data = fs.readFileSync(file.path);
        // console.log(data);
        //var base64Data = data.toString('base64');
        //var theFile = new AV.File(file.originalFilename, {base64: base64Data});
        var theFile = new AV.File(file.originalFilename, data);


        theFile.save();

        var road_img = new Road_Image();
        road_img.set("RoadId", req.body.RoadID);
        road_img.set("Image", theFile);
        road_img.save();


    }

    //var data=fs.readFileSync(req.files.username.path);
    //console.log(data);
    res.send("true");
});
router.get('/getroadfirstimage/:id',function (req, res) {

    var args = url.parse(req.url, true).query;
    var queryimg = new AV.Query(Road_Image);
    queryimg.equalTo("RoadId", req.params.id);
    queryimg.first({
        success: function (queryimg) {
            //console.log(point.id)

            if (queryimg != null) {
                //imgurl = queryimg.get('Image').url();
                if (args.w != null && args.h != null) {
                    //imgurl = queryimg.get('Image').thumbnailURL(args.w, args.h)+"?watermark/1/image/aHR0cDovL2FjLXdhYnBzYTZ5LmNsb3VkZG4uY29tL1RFd1RxV2Q2S0NyYmlVb0lnV0I0andNaTlmd1JDUnZhMXZyNXBNZncucG5n";
                    //imgurl = queryimg.get('Image').url()+"?imageView/1/w/"+args.w+"/h/"+args.h+"|watermark/1/image/aHR0cDovL2FjLXdhYnBzYTZ5LmNsb3VkZG4uY29tL0hjUThtaW1henM5aU83YUNPdmVZcFk4eGM2emduYkVLZ3lUazc2b0MucG5n/dissolve/70";
                    imgurl = queryimg.get('Image').thumbnailURL(args.w, args.h);
                }
                else {
                    imgurl = queryimg.get('Image').url();
                    //imgurl = queryimg.get('Image').url()+"?watermark/1/image/aHR0cDovL2FjLXdhYnBzYTZ5LmNsb3VkZG4uY29tL1RFd1RxV2Q2S0NyYmlVb0lnV0I0andNaTlmd1JDUnZhMXZyNXBNZncucG5n";
                    //imgurl = queryimg.get('Image').url()+"?watermark/1/image/aHR0cDovL2FjLXdhYnBzYTZ5LmNsb3VkZG4uY29tL0hjUThtaW1henM5aU83YUNPdmVZcFk4eGM2emduYkVLZ3lUazc2b0MucG5n/dissolve/70";
                }

            }
            else {
                imgurl = "/images/default.jpg";
            }

            res.redirect(imgurl);

            // Successfully retrieved the object.
            //var pointimage=queryimg.get('Image');
            //point.url= pointimage.url();


        },
        error: function (error) {
            //alert("Error: " + error.code + " " + error.message);
        }
    });

});
router.get('/getallimages',function (req,res){


    var args = url.parse(req.url, true).query;

    var query = new AV.Query(Road_Image);
    query.equalTo("RoadId", args.RoadID);
    query.ascending("createdAt");
    query.find({
        success: function (results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned AV.Object values

            var imgs=new Array();

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var img = new Object();
                img.id = object.id;
                img.imageurl = object.get('Image').thumbnailURL(150, 150);

                imgs.push(img);
                //console.log(points);
            }
            res.send(imgs);
        },
        error: function (error) {
            // alert("Error: " + error.code + " " + error.message);
            res.send('false');

        }
    });
});
router.post('/deleteroadimage',function (req,res){
    var query = new AV.Query(Road_Image);
    query.get(req.body.ImageID, {
        success: function (img) {
            //console.log(point)

            img.destroy({
                success: function (myObject) {
                    res.send('true');
                },
                error: function (myObject, error) {
                    res.send('false');
                }
            });

        },
        error: function (object, error) {

            res.send('false');
        }
    });
});
router.get('/pointorder/:id',function (req,res){
    var currentUser = AV.User.current();
    var username;
    if (currentUser) {
        username = currentUser.getUsername();
        var isedit = false;
        if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//��ͨ�û�
        {
            isedit = true;
        }

        var query = new AV.Query(Road);
        query.get(req.params.id, {
            success: function (road) {
                var title = road.get("Title");
                var content = road.get("Content");

                var points = new Array();

                var query = new AV.Query(Point);
                query.equalTo("RoadId", req.params.id);
                query.ascending("Order");
                query.find({
                    success: function (results) {
                        //alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned AV.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];

                            var point = new Object();
                            point.id = object.id;
                            point.type = object.get('Type');
                            point.title = object.get('Title');
                            point.order=object.get('Order');
                            point.content = object.get('Content').replace(/<\/?.+?>/g, "");

                            if(point.content.length>=40)
                            {
                                point.content=point.content.substr(0,40)+"...";
                            }
                            points.push(point);
                            //console.log(points);


                        }
                        res.render('roads/pointorder', {
                            title: title,
                            user: username,
                            content: content,
                            isedit: isedit,
                            roadid: req.params.id,
                            points: points,
                            layout: 'share/layout'
                        });
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            },
            error: function (object, error) {
            }
        });
    }
    else {
        res.redirect('/users/login');
    }
});
router.post('/deleteroad',function (req, res) {

    //ɾ��·ͼƬ��ͼƬ�ļ�

    var queryrimg = new AV.Query(Road_Image);
    queryrimg.equalTo("RoadId", req.body.RoadID);
    queryrimg.find({
        success: function (rimgresults) {
            for (var i = 0; i < rimgresults.length; i++) {
                var rimg = rimgresults[i];
                var imgfile = rimg.get('Image');
                imgfile.destroy();
            }
            AV.Object.destroyAll(rimgresults);

        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
    //ɾ��·��վ��

    var querypoint = new AV.Query(Point);
    querypoint.equalTo("RoadId", req.body.RoadID);
    querypoint.find({
        success: function (pointresults) {
            for (var i = 0; i < pointresults.length; i++) {
                var point = pointresults[i];
                var pointid = point.id;


                var querypimg = new AV.Query(Point_Image);
                querypimg.equalTo("PointId", pointid);
                querypimg.find({
                    success: function (pimgresults) {
                        for (var i = 0; i < pimgresults.length; i++) {
                            var pimg = pimgresults[i];
                            var imgfile = pimg.get('Image');
                            imgfile.destroy();
                        }

                        AV.Object.destroyAll(pimgresults);

                    },
                    error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

                point.destroy();
            }
            AV.Object.destroyAll(pointresults);
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

    //ɾ��·
    var queryroad = new AV.Query(Road);
    queryroad.get(req.body.RoadID, {
        success: function (road) {

            road.destroy({
                success: function (myObject) {
                    res.send('true');
                },
                error: function (myObject, error) {
                    res.send('false');
                }
            });
        },
        error: function (object, error) {

            res.send('false');
        }
    });
});
router.post('/getjson',function (req, res) {

    console.info(req.body.roadid)
    var query = new AV.Query(Point);
    query.equalTo("RoadId", req.body.roadid);
    //query.equalTo("RoadId", "54e1ed26e4b01eb12d326495");
    query.find({
        success: function (results) {
            var points = [];
            console.log(results)
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var lon = object.get('Longitude');
                var lat = object.get('Latitude');

                if (lon != null && lat != null) {
                    var point = new Object();
                    point.id = object.id;
                    point.Longitude = lon;
                    point.Latitude = lat;
                    point.title = object.get('Title');
                    point.content = object.get('Content');
                    points.push(point);
                }


                //console.log(points);

            }
            res.send(points);

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

});
router.get('/myroad',function (req,res){
    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser.getUsername());
        username = currentUser.getUsername();

        var isedit = false;
        if (currentUser.attributes.UserRoleId != "551163fde4b0dbfd5ebdaa23")//��ͨ�û�
        {
            isedit = true;
        }
        var roads = new Array();

        var query = new AV.Query(Road);
        query.descending("createdAt");
        //query.equalTo("RoadId",req.params.id);
        query.find({
            success: function (results) {
                //alert("Successfully retrieved " + results.length + " scores.");
                // Do something with the returned AV.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];

                    var road = new Object();
                    road.id = object.id;
                    road.title = object.get('Title');
                    road.content = object.get('Content');
                    roads.push(road);

                }

                res.render('roads/myroad', {roads: roads, user: username, isedit: isedit, layout: 'share/layout'});
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
router.get('/list',function (req, res) {
    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser.id);
        username = currentUser.getUsername();

    }
    var roads = new Array();

    var query = new AV.Query(Road);
    query.descending("createdAt");
    //query.equalTo("RoadId",req.params.id);
    query.find({
        success: function (results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var road = new Object();
                road.id = object.id;
                road.title = object.get('Title');
                road.content = object.get('Content');
                if(road.content.length>100)
                {
                    road.content=road.content.substr(0,100)+"...";
                }
                roads.push(road);

            }

            res.render('roads/list', {roads: roads, user: username, layout: 'share/layout'});
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });



});
router.get('/details/:id',function (req, res) {
    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser.getUsername());
        username = currentUser.getUsername();

    }
    var query = new AV.Query(Road);
    query.get(req.params.id, {
        success: function (road) {
            var title = road.get("Title");
            var content = road.get("Content");

            var points = new Array();

            var query = new AV.Query(Point);
            query.equalTo("RoadId", req.params.id);
            query.ascending("Order");
            query.find({
                success: function (results) {
                    //alert("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned AV.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];



                        //console.log(getimagecount(object.id));


                        var point = new Object();
                        point.id = object.id;
                        point.type = object.get('Type');
                        point.title = object.get('Title');
                        point.content = object.get('Content');
                        points.push(point);
                    }
                    res.render('roads/details', {
                        title: title,
                        user: username,
                        content: content,
                        roadid: req.params.id,
                        points: points,
                        layout: 'share/layout'
                    });
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        error: function (object, error) {
        }
    });



});
router.post('/favorite',function (req,res){
    var result=new Object();
    console.log(req.body.TargetId.trim())
    var currentUser = AV.User.current();
    var username = null;
    if (currentUser) {
        console.log(currentUser.id);
        username = currentUser.getUsername();


        var favorite = new Favorite();
        favorite.set("UserId",currentUser.id);
        favorite.set("TargetId", req.body.TargetId.trim());
        favorite.set("Type", req.body.Type.trim());
        favorite.save(null, {
                success: function (road) {
                    //res.send('true');

                    result.msg="收藏成功";

                    res.send(result)
                },
                error: function (road, error) {
                    result.msg="收藏失败:"+error.message;
                    res.send(result)
                }
            }
        );
    }
    else{
        result.msg="尚未登录用户信息，请先登录！";

        res.send(result)
    }



});

module.exports=router;
