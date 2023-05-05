//product-list.ejs

<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/product.css">
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>

            <main>
                <% if (prods.length > 0) { %>
                    <div class="grid">
                        <% for (let product of prods) { %>
                            <article class="card product-item">
                                <header class="card__header">
                                    <h1 class="product__title">
                                        <%= product.title %>
                                    </h1>
                                </header>
                                <div class="card__image">
                                    <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
                                </div>
                                <div class="card__content">
                                    <h2 class="product__price">$
                                        <%= product.price %>
                                    </h2>
                                    <p class="product__description">
                                        <%= product.description %>
                                    </p>
                                </div>
                                <div class="card__actions">
                                    <a href="/products/<%= product.id %>" class="btn">Details</a>
                                    <%- include('../includes/addtocart.ejs',{product:product}) %>
                                </div>
                            </article>
                            <% } %>
                    </div>
                    <% } else { %>
                        <h1>No Products Found!</h1>
                        <% } %>
            </main>
            <%- include('../includes/end.ejs') %>
                         
                          
//product-details.ejs
                          
<%- include('../includes/head.ejs') %>
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main class="centered">
            <h1><%= product.title %></h1>
            <hr>
            <div>
                <img src="<%= product.imageUrl %>" alt="<%= product.title%>">
            </div>
            <h2>$<%= product.price %></h2>
            <p><%= product.description %></p>
            <%- include('../includes/addtocart.ejs') %>
        </main>
        <%- include('../includes/end.ejs') %>
//addtocart.ejs
<form action="/cart" method="post">
    <button class="btn" type="submit">Add to Cart</button>
    <input type="hidden" name="productId" value="<%=product.id %>">
</form>
//shop.js /routes
const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart' , shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
//shop.js /controller
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findById(prodId , product=>{
    res.render('shop/product-detail' , {
      product: product , 
      pageTitle: product.title , 
      path: '/products'
    });
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.postCart=(req,res,next)=>{
  const prodId=req.body.productId;
  Product.findById(prodId , (product)=>{
    Cart.addProduct(prodId , product.price);
  });
  res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
//cart.js/models
const { log } = require('console');
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports=class Cart{
    static addProduct(id , productPrice){
        fs.readFile(p, (err,fileContent)=>{
            let cart={products:[],totalPrice:0};
            if(!err){
                cart=JSON.parse(fileContent);
            }
            let updatedProduct;
            const existingProductIndex=cart.products.findIndex(prod=>prod.id===id);
            const existingProduct=cart.products[existingProductIndex];
            if(existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products=[...cart.products];
                cart.products[existingProductIndex]=updatedProduct;
            }else{
                updatedProduct={id: id ,qty: 1};
                cart.products=[...cart.products,updatedProduct];
            }
            cart.totalPrice=cart.totalPrice+ +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err=>{
                console.log(err);
            });
        })
    }
}                               
