/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var api = express();
var requestLib = require("request");
// var ejs = require('ejs'),
//     fs = require('fs'),
//     str = fs.readFileSync("template/inspectionTemplate.ejs", 'utf8');


/**
 * Delete user
 * @author Wesley
 */
api.post('/postInspection', function (request, response) {
  console.log("in api");
  //Get param
  var inspectionId = JSON.parse(Object.keys(request.body)[0]).inspectionId;


  //ejs.render(str, "");
  // console.log("123", ejs.render(str, ""));
  console.log("inspectionId", inspectionId);

  requestLib.get({
    url: "https://us-api.leancloud.cn/1.1/classes/Inspection/" + inspectionId,
    headers: {
      'X-LC-Id': 'k48icaVY6MwPFvzyLrsUNGL3-MdYXbMMI',
      'X-LC-Key': 'FKYaslfsKA91Mip02WhMFI0G'
    }
  }, function (error, response, body) {

    //ejs.render(str, body.purchaseArray[0])
    console.log("error", error);
    console.log("body", body);
    //response.send(body.objectId);

  });
});

/**
 *  updateUser
 *  This api support agency, agent and can be extended to support other type of user
 *  userID AND type are compulsory from request
 *  @author Wesley
 */
api.post('/updateUser', function (request, response) {
  console.log("in api");
  //Get param
  var data = {};
  var userId = JSON.parse(Object.keys(request.body)[0]).userId;
  var status = JSON.parse(Object.keys(request.body)[0]).status;
  var officialName = JSON.parse(Object.keys(request.body)[0]).officialName;
  var mobileNumber = JSON.parse(Object.keys(request.body)[0]).mobileNumber;
  var email = JSON.parse(Object.keys(request.body)[0]).email;
  var password = JSON.parse(Object.keys(request.body)[0]).password;
  var type = JSON.parse(Object.keys(request.body)[0]).type;
  var agentType = JSON.parse(Object.keys(request.body)[0]).agentType;
  var profileImage = JSON.parse(Object.keys(request.body)[0]).profileImage;
  if (type == undefined) {
    response.send(0);
  } else if (type == 1) {
    console.log("in agency");
    var ACN = JSON.parse(Object.keys(request.body)[0]).ACN;
    var contactPerson = JSON.parse(Object.keys(request.body)[0]).contactPerson;
    var address = JSON.parse(Object.keys(request.body)[0]).address;
    if (ACN != undefined) {
      data.ACN = ACN;
    }
    if (contactPerson != undefined) {
      data.contactPerson = contactPerson;
    }
    if (address != undefined) {
      data.address = address;
    }
  } else if (type == 2) {
    var licenceNumber = JSON.parse(Object.keys(request.body)[0]).licenceNumber;
    if (licenceNumber != undefined) {
      data.licenceNumber = licenceNumber;
    }

    if (agentType != undefined) {
      data.agentType = agentType;
    }
  } else if (type == 3) {

  }

  // user.set('liveinBuilding', {"__type":"Pointer","className":"Building","objectId":buildingId});
  if (status != undefined) {
    //user.set('status', status);
    data.status = status;
  }
  if (officialName != undefined) {
    //user.set('officialName', officialName);
    data.officialName = officialName;
  }
  if (mobileNumber != undefined) {
    //user.set('mobileNumber', mobileNumber);
    data.mobileNumber = mobileNumber;
  }
  if (email != undefined) {
    //user.set('email', email);
    data.email = email;
  }
  if (password != undefined) {
    //user.set('licenceNumber', password);
    data.password = password;
  }
  if (profileImage != undefined) {
    //user.set('licenceNumber', password);
    data.profileImage = profileImage;
  }
  console.log("data.profileImage", data.profileImage);
  console.log("data2", JSON.stringify(data));
  console.log("userId", userId);

  requestLib.put({
    url: "https://us-api.leancloud.cn/1.1/users/" + userId,
    headers: {
      'X-LC-Id': 'k48icaVY6MwPFvzyLrsUNGL3-MdYXbMMI',
      'X-LC-Key': 'YfdFKxMtyFVvIIlLIQ9yEsDt,master',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }, function (error, reposne, body) {
    console.log("error", error);
    console.log("body", body);
    response.send(body.objectId);

  });
});


/**
 * Delete user
 * @author Wesley
 */
api.post('/deleteUser', function (request, response) {
  console.log("in api delete");
  //Get param
  var userId = JSON.parse(Object.keys(request.body)[0]).userId;

  console.log("userId", userId);

  requestLib.delete({
    url: "https://us-api.leancloud.cn/1.1/users/" + userId,
    headers: {
      'X-LC-Id': 'k48icaVY6MwPFvzyLrsUNGL3-MdYXbMMI',
      'X-LC-Key': 'YfdFKxMtyFVvIIlLIQ9yEsDt,master',
      "Content-Type": "application/json"
    }
  }, function (error, reposne, body) {
    console.log("error", error);
    console.log("body", body);
    //response.send(body.objectId);

  });
});


/**
 * Query user
 * @author Wesley
 */
api.post('/queryTenant', function (request, response) {
  console.log("in api queryTenant");
  //Get param
  var phone = JSON.parse(Object.keys(request.body)[0]).phone;
  console.log("phone", phone);

  requestLib.get({
    url: 'https://us-api.leancloud.cn/1.1/classes/_User?where={"mobileNumber":' + '"' + phone + '"' + '}',
    headers: {
      'X-LC-Id': 'k48icaVY6MwPFvzyLrsUNGL3-MdYXbMMI',
      'X-LC-Key': 'FKYaslfsKA91Mip02WhMFI0G',
      'Content-Type': "application/json"
    }
  }, function (error, reposne, body) {
    //THis is important
    var body = JSON.parse(body);

    response.send(body);


  });
});

//api.post('/delete', function (request, response) {
//    console.log("in api delete");
//    //Get param
//    var userId = JSON.parse(Object.keys(request.body)[0]).userId;
//
//    console.log("userId", userId);
//    AV.Cloud.useMasterKey();
//
//    var user = AV.User.createWithoutData('_User', userId);
//
//    user.destroy().then(function (success) {
//        // 删除成功
//        response.send(success);
//        console.log("delete success!")
//    }, function (error) {
//        // 删除失败
//        console.log("not ok!")
//    });
//
//});

api.post('/uploadFile', function (request, response) {
  //Get param

  var file = JSON.parse(Object.keys(request.body)[0]).file;
  console.log("in api", file);


  AV.Cloud.useMasterKey();
  //Set objects value
  //var user = AV.User.createWithoutData('_User', userId);
  //user.save(null, {
  //  success:function(user)  {
  //    //Building assign successful
  //    console.log('User save successful');
  //    response.send(user);
  //    // response.success();
  //  },
  //  error:function(user, error) {
  //    //Building assign error
  //    console.log('error', error.message);
  //    // response.error(error);
  //  }
  //});

});

module.exports = api;