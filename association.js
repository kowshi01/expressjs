//app.js
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product=require('./models/product');
const User=require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
User.findByPk(1)
.then(user=>{
    req.user=user;
    next();
})
.catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints : true ,onDelete : 'CASCADE'});
User.hasMany(Product);

sequelize
.sync()
.then(res=>{
    return User.findByPk(1);
})
.then(user=>{
    if(!user){
        return User.create({name: 'ABC' , emailid:'ABC@gmail.com'});
    }
    return user;
})
.then((user)=>{
    app.listen(3000);
})
.catch(err=>console.log(err));


//admin.js/controller
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(()=>{
    res.redirect('/admin/products');
    console.log("product created")
  })
  .catch(Err => console.log(Err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id : prodId}})
 // Product.findByPk(prodId)
    .then(products => {
      const product=products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedtitle = req.body.title;
  const updatedimageUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedtitle;
      product.price = updatedprice;
      product.imageUrl = updatedimageUrl;
      product.description = updateddescription;
      return product.save();
    }).then(() => {
      console.log("updated Product");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product=>{
      return product.destroy();
    })
    .then(() => {
      console.log("Delete Product");
      res.redirect('/admin/products');
    })
    .catch(Err => console.log(Err));
}

//user.js/model

const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define('user', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  name :   Sequelize.STRING,
  emailid : Sequelize.STRING
   
});

module.exports = User;
