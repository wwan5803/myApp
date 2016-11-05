'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var requestLib = require("request");

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var User = AV.Object.extend('_User');

// 查询 User 列表
router.get('/', function(req, res, next) {
  var query = new AV.Query(User);
  query.descending('createdAt');
  query.find().then(function(results) {
    res.response(results);
  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('todos', {
        title: 'User 列表',
        todos: []
      });
    } else {
      next(err);
    }
  }).catch(next);
});

// 新增 User 项目
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var user = new User();
  user.set('content', content);
  user.save().then(function(user) {
    res.response(user);
  }).catch(next);
});


/**
 * batch update user information
 * author Wesley
 */
router.post('/batchUpdate', function (request, response) {
  var data = {};
  var batchRequest = JSON.parse(Object.keys(request.body)[0]).batchRequest;

  console.log("batchRequest", batchRequest);
  data.requests = batchRequest;

  console.log("data", data);
  requestLib.post({
    url: "https://us-api.leancloud.cn/1.1/batch",
    headers: {
      'X-LC-Id': 'k48icaVY6MwPFvzyLrsUNGL3-MdYXbMMI',
      'X-LC-Key': 'YfdFKxMtyFVvIIlLIQ9yEsDt,master',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }, function (error, res, body) {
    console.log("error", error);
    console.log("body", body);
    if(error == null){
      response.send(body.success);
    }else{
      response.send("error");
    }

  });
});

/**
 *  updateUser
 *  This api support agency, agent and can be extended to support other type of user
 *  userID AND type are compulsory from request
 *  @author Wesley
 */
router.post('/update', function (request, response) {
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
  var ID = JSON.parse(Object.keys(request.body)[0]).ID;
  console.log("0");
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
  console.log("1");

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
  if (ID != undefined) {
    data.ID = ID;
  }
  console.log("data.profileImage", data.ID);
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
router.post('/delete', function (request, response) {
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
    response.send(body.body);

  });
});

/**
 * Query user
 * @author Wesley
 */
router.post('/queryTenant', function (request, response) {
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

module.exports = router;
