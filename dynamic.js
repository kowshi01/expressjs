//product-list.ejs
<div class="card__actions">
                                    <a href="/products/<%=product.id%>"class="btn">Details</a>
                                    <form action="/add-to-cart" method="POST">
                                        <button class="btn">Add to Cart</button>
                                    </form>
                                </div>
//products.json
[{"id":"1233424","title":"A Book","imageUrl":"https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg","description":"This is an awesome book!","price":"19"},{"title":"flower","imageUrl":"https://as1.ftcdn.net/v2/jpg/01/13/21/42/1000_F_113214267_9PMxesAZGc6NoB1pFUFUx8ycavsxQT4Q.jpg","description":"flower","price":"70","id":"0.9478590989002331"}]
//shop.js routes

router.get('/products/:productId',shopController.getProduct);
//shop.js controller
exports.getProduct = (req, res, next) => {
  const prodId=req.params.productId;
  Product.findById(prodId,product=>{
    res.render('shop/product-detail',{product:product , pageTitle:product.title , path:'/products'});
  })  
};
//product-detail.ejs
<main class="centered">
            <h1><%= product.title%></h1>
            <hr>
            <div>
                <img src="<%=product.imageUrl%>" alt="<%=product.title%>">
            </div>
            <h2><%=product.price%></h2>
            <p><%=product.description%></p>
            <form action="/cart" method="post">
                <button class="btn" type="submit">Add to Cart</button>
            </form>
        </main>
//main.css
.centered{
  text-align: center;
}
//product.js
save() {
    getProductsFromFile(products => {
      this.id=Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }
  static findById(id,cb){
    getProductsFromFile(products=>{
      const product=products.find(p=> p.id===id);
      cb(product);
    })
  }
