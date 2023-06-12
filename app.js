//app.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize =require('./util/database');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors);

app.use('/', adminRoutes);

sequelize.sync()
.then(()=>{
  console.log('sequel');
  app.listen(3000);
})
.catch(err=>console.log(err));


//admin.js/routes
const path = require('path');
const express = require('express');

const adminController = require('../controller/admin');

const router = express.Router();

router.get('/getData', adminController.getProducts);

router.post('/postData', adminController.postProducts);

module.exports = router;
//admin.js/controllers
const Details = require('../model/adminmodel');

exports.getProducts =(req, res, next) => {
    Details.findAll()
    .then(data=>{      
      console.log(data.name);
      res.render('user-list', {
        userDetail : data
      });
    })
    .catch(err=>console.log(err));
      
};

exports.postProducts = async (req, res, next) => {  
  console.log("ierujweitfhns");
  console.log(req.body.name);
  const name = req.body.name;
  const phonenumber = req.body.phonenumber;
  const emailid = req.body.emailid;
  await Details.create({
    name : name,
    phonenumber : phonenumber,
    emailid : emailid
  })
  .then((data)=>{
    console.log("Data added");
    res.render('post-product',{
      userDetail : data
    })
  })
  .catch(Err=>console.log(Err));
  
};
//user-list.ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form id="form" method="post" action="/postData">
        <h1>Form</h1>
        <div class="div"></div>
        <div>
            <label for="name1"> Name : </label><br>
            <input type="text"name="name"><br>
        </div>
        <div>
            <label for="phonenumber" > phonenumber : </label><br>
            <input type="number" name="phonenumber"><br>
        </div>
        <div>
            <label for="emailid" > email id : </label><br>
            <input type="text" name="emailid"><br><br>
        </div>
        <div>
            <input class="button"type="Submit" value="Submit">
        </div>
    </form>
    <div id="output">
        <% for (let user of userDetail) { %>
     <h3><%= user.name %> - <%= user.phonenumber %> - <%= user.emailid %></h3>
     <% } %>
    </div>
        </body>
</html>
//database.js
                                         
const Sequelize = require("sequelize");
const sequelize=new Sequelize(
    'node_complete',
    'root',
    'kowshika',
    {
    dialect: 'mysql',
    host: 'localhost'
    }
);
module.exports=sequelize;
//adminmodel.js
const path = require('path');
const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Details=sequelize.define('details', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  name : {
    type : Sequelize.STRING,
    allowNull : false
  },
  phonenumber : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  emailid : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = Details;
