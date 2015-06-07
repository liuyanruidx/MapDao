/**
 * Created by 延瑞 on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');
var url = require('url');
var Point = AV.Object.extend("Point");
var Point_Image = AV.Object.extend("Point_Image");

var url = require('url');


router.post('/pointadd',function (req, res) {



    var point = new Point();

    if (req.body.wenbenis == "true") {
        point.set("Type", "文本");

    }
    else {
        point.set("Type", "站点");

    }
    point.set("RoadId", req.body.RoadId);
    point.set("Title", req.body.InputTitle.trim());
    point.set("Content", req.body.InputContent.trim());
    point.save(null, {
            success: function (point) {
                //res.send('true');
                res.redirect("/roads/details/" + req.body.RoadId);
            },
            error: function (point, error) {
                res.send('添加失败');
            }
        }
    );
});
router.post('/editpointtitle',function (req, res) {

    var query = new AV.Query(Point);
    query.get(req.body.PointID, {
        success: function (point) {
            // The object was retrieved successfully.
            point.set("Title", req.body.Title.trim());
            point.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/editpointcontent',function (req, res) {
    //console.log(req)

    console.log("asdf")
    console.log(req.body)


    var query = new AV.Query(Point);
    query.get(req.body.PointContentEditID.trim(), {
        success: function (point) {
            // The object was retrieved successfully.
            point.set("Content", req.body.PointContentEditContent.trim());
            point.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/editpointcontenttext',function (req, res) {
    //console.log(req)

    console.log("asdf")
    console.log(req.body)


    var query = new AV.Query(Point);
    query.get(req.body.PointID.trim(), {
        success: function (point) {
            // The object was retrieved successfully.
            point.set("Content", req.body.Content.trim());
            point.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/editpointorder',function (req, res) {
    //console.log(req)

    console.log(req.body)


    var query = new AV.Query(Point);
    query.get(req.body.PointID.trim(), {
        success: function (point) {
            // The object was retrieved successfully.
            point.set("Order",parseInt( req.body.Order.trim()));
            point.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/uploadpointimage',function (req, res) {

    // var aaaa=req.query.pointid;
    console.log(req.body.PointID);

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


        var point_img = new Point_Image();
        point_img.set("PointId", req.body.PointID);
        point_img.set("Image", theFile);
        point_img.save();


    }

    //var data=fs.readFileSync(req.files.username.path);
    //console.log(data);
    res.send("true");
});
router.get('/getpointimage/:id',function (req, res) {


    //var imgid=req.params.id;
    var pointimgs = new Array();
    var query = new AV.Query(Point_Image);
    query.equalTo("PointId", req.params.id);
    query.find({
        success: function (results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var pointimage = new Object();
                pointimage.id = object.id;
                pointimage.image = object.get('Image');
                pointimgs.push(pointimage);


                console.log(pointimage.image.url())

            }

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

});
router.get('/getpointfirstimage/:id',function (req, res) {


    var args = url.parse(req.url, true).query;
    var queryimg = new AV.Query(Point_Image);
    queryimg.equalTo("PointId", req.params.id);
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
                imgurl = "/images/img1.png";
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

    var query = new AV.Query(Point_Image);
    query.equalTo("PointId", args.PointID);
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
router.post('/deletepointimage',function (req,res){
    var query = new AV.Query(Point_Image);
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
router.post('/setpositon',function (req, res) {

    console.log(req.body.pointpositionpointid);
    console.log(req.body.pointpositionlongitude);
    console.log(req.body.pointpositionlatitude);
    console.log(req.body.pointpositioninput);

    var query = new AV.Query(Point);
    query.get(req.body.pointpositionpointid, {
        success: function (point) {
            // The object was retrieved successfully.
            console.log(point)
            point.set("Longitude", req.body.pointpositionlongitude);
            point.set("Latitude", req.body.pointpositionlatitude);
            point.set("Address", req.body.pointpositioninput);
            point.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/deletepoint',function (req, res) {
    var query = new AV.Query(Point);
    query.get(req.body.PointID, {
        success: function (point) {
            //console.log(point)
            var query = new AV.Query(Point_Image);
            query.equalTo("PointId", req.body.PointID);
            query.find({
                success: function (pimgresults) {
                    for (var i = 0; i < pimgresults.length; i++) {
                        var pimg = pimgresults[i];
                        var imgfile = pimg.get('Image');
                        imgfile.destroy();
                    }
                    AV.Object.destroyAll(pimgresults);

                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
            point.destroy({
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
router.post('/getdetails',function (req, res) {
    var query = new AV.Query(Point);
    query.get(req.body.id, {
        success: function (point) {

            res.send(point);
        },
        error: function (object, error) {

            res.send('false');
        }
    });
});
router.post('/getpointposition',function (req, res) {
    var query = new AV.Query(Point);
    query.get(req.body.id, {
        success: function (point) {

            res.send(point);
        },
        error: function (object, error) {

            res.send('false');
        }
    });

});
module.exports=router;