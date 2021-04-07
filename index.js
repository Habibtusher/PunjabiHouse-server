const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const objectId =require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avdod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("PunjabiHouse").collection("product");
const buyProductCollection = client.db("PunjabiHouse").collection("buyProduct")

app.post('/buyList',(req, res)=>{

const newData = {
  name: req.body.name,
  email: req.body.email,
  price: req.body.price,
  productId: req.body._id
}

  const newBuy= req.body;
  // const newData = {...newBuy,productId:newBuy._id}
  console.log(newBuy,newData);
  buyProductCollection.insertOne(newData)

  .then(result => {
    res.send(result.insertedCount > 0);
  })
  .catch(err =>console.log(err))


})

app.get("/products",(req, res) => {
  productCollection.find()
  .toArray((err,items) => {
    res.send(items);
    // console.log('from db',items);
  })
})

 app.post('/addProduct',(req, res)=>{
     const newProduct = req.body;
     console.log('adding new product',newProduct);
     productCollection.insertOne(newProduct)
     .then(result => {
       console.log('in',result.insertedCount);
       res.send(result.insertedCount > 0 )
     })
 })



app.get('/viewOrder',(req, res)=>{
  buyProductCollection.find({email: req.query.email})
  .toArray((err, documents) => {
    res.status(200).send(documents)
  })
})

app.delete('/deleteProduct/:id', (req, res) => {
  const id = objectId(req.params.id);
  console.log('delete this',id);
  productCollection.findOneAndDelete({_id: id})
  .then(documents => {res.send(documents)})
 .catch(err =>console.log(err))
 })

  // client.close();
});







app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})