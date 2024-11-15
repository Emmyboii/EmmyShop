const port = 4000
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const multer = require("multer")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const path = require("path")

app.use(express.json())
app.use(cors())

//Database Connection
mongoose.connect("mongodb+srv://emmyboi:emmy111@ecluster.jn1aj.mongodb.net/e-commerce")

app.get("/", (req, res) => {
    res.send("Express app running here!")
})

//Image Store Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

//Creating upload Endpoint for images

app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for cresting product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})

app.post('/addproducts', async (req, res) => {
    let products = await Product.find({})
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id + 1
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.send({
        success: true,
        name: req.body.name,
    })
})

//Creating API Endpoint for Deleting products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id })
    console.log("Removed");
    res.send({
        success: true,
        name: req.body.name,
    })
})

//Creating API Endpoint for Getting all products
app.get('allproducts', async (req, res) => {
    let products = await Product.find({})
    console.log(products);
    res.send(products)
})

app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
})