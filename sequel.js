//util/database.js
const Sequelize=require('sequelize');
const sequelize=new Sequelize('node_complete','root','kowshika',{
    dialect: 'mysql',
    host: 'localhost'
});
module.exports=sequelize;

//model/product.js

const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Product=sequelize.define('product', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  title : Sequelize.STRING,
  price : {
    type : Sequelize.DOUBLE,
    allowNull : false
  },
  imageUrl : {
    type : Sequelize.STRING,
    allowNull : false
  },
  description : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = Product;


//app.js

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize =require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(res=>{
    app.listen(3000);
})
.catch(err=>console.log(err));


