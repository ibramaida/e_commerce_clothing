// import packages
const express = require('express')
const admin = require('firebase-admin')
const bcrypt = require('bcrypt')
const path = require('path')
const nodemailer = require('nodemailer')

// firebase setup


let serviceAccount = require("./clothing-ecom-2b0d2-firebase-adminsdk-gp5v2-3fe7a89bb3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore()

// AWS config
const aws = require('aws-sdk')
const dotenv = require('dotenv')

dotenv.config()

// AWS parameters
const region = "eu-west-3"
const bucketName = "clothing-e-commerce-website"
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

// init s3
const s3 = new aws.S3()

// generate upload images link
async function generateUrl() {
    let date = new Date()
    let id = parseInt(Math.random() * 10000000000)

    const imageName = `${id}${date.getTime()}.jpg`

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, //ms
        ContentType: 'image/jpeg'
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params)

    return uploadUrl
}

//create static path for public
let staticPath = path.join(__dirname, "public")

// initializing express.js

const app = express()

// related to static path creation
app.use(express.static(staticPath))

// enable form data sharing
app.use(express.json())

// create routes
// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"))
})

// create signup route
app.get("/signup", (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"))
})

app.post('/signup', (req, res) => {
    // console.log(req.body);
    let { name, email, password, phone, terms, receiveOffers } = req.body
    // back-end validation
    if(name.length < 3) {
        return res.json({"alert": "name must be more than 3 letters." })
    }  else if (!email.length) {
        return res.json({"alert": "enter your email address"})
    } else if (password.length < 8) {
        return res.json({"alert": "password should be at least 8 long"})
    } else if (!phone.length) {
        return res.json({"alert": "enter your phone number"})
    }
      else if(!Number(phone) || phone.length < 10) {
        return res.json({"alert": "enter a valid phone number"})

    } else if (!terms) {
        
        return res.json({"alert": "must agree our terms and conditions"})
    } 

    // store user in db
    db.collection("users").doc(email).get()
    .then(user => {
        if(user.exists) {
            return res.json({'alert': 'email already exists'})
        } else {
            // encrypt the password before storing it
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    req.body.password = hash
                    db.collection("users").doc(email).set(req.body)
                    .then(data => {
                        res.json({
                            name: req.body.name,
                            email: req.body.email,
                            seller: req.body.seller,
                        })
                    })
                })
            })
        }
    })
})

// login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, 'login.html'))
})

app.post('/login', (req,res) => {
    let {email, password} = req.body

    if(!email.length || !password.length) {
        return res.json({"alert": "fill all the inputs"})
    } 

    db.collection("users").doc(email).get()
    .then(user => {
        if(!user.exists) {
            return res.json({"alert": "this email does not exist"})
        } else {
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result) {
                    let data = user.data()
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                } else {
                    return res.json({"alert": "the password is incorrect"})
                }
            })
        }
    })
    


})

// create seller route
app.get("/seller", (req, res) => {
    res.sendFile(path.join(staticPath, "/seller.html"))
})

app.post("/seller", (req, res) => {
    let {name, address, about, number, terms, legit, email} = req.body
    if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        return res.json({"alert": "all input field must be filled"})
    } else if(!terms || !legit) {
        return res.json({"alert": "must agree our terms and conditions"})
    } else {
        // update users seller status
        db.collection("sellers").doc(email).set(req.body)
        .then(data => {
            db.collection("users").doc(email).update({
                seller: true
            }).then(data => {
                res.json(true)
            })
        })
    }
})

// create add product route
app.get("/addproduct", (req, res) => {
    res.sendFile(path.join(staticPath, "/addproduct.html"))
})

// add product dynamic id
app.get("/addproduct/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "/addproduct.html"))
})

// create s3 upload route
app.get("/s3url", (req, res) => {
    generateUrl().then(url => res.json(url))
})

// add product post
app.post("/addproduct", (req, res) => {
    let {name, shortDesc, description, images, sizes, actualPrice, discount, sellPrice, stock, tags, terms, email, draft, id} = req.body
    
    if(!draft) {
        // back-end form validation
        if(!name.length) {
            return res.json({"alert":"enter product name"})
        } else if(shortDesc.length > 100 || shortDesc.length < 10) {
            return res.json({"alert":"short description must be between 10 and 100 characters"})
        } else if(!description.length) {
            return res.json({"alert":"enter good description about the product"})
        } else if (!images.length){
            return res.json({"alert":"upload at least one image for the product"})
        } else if (!sizes.length){
            return res.json({"alert":"select at least one size"})
        } else if(!actualPrice.length || !discount.length || !sellPrice.length) {
            return res.json({"alert":"you must add pricing"})
        } else if(stock < 20) {
            return res.json({"alert":"you should have at least 20 items in stock"})
        } else if (!tags.length) {
            return res.json({"alert":"add some tags to help ranking your product in search"})
        } else if(!terms) {
            return res.json({"alert":"you must agree to our terms an conditions"})
        }
    }

    //  add product
    let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}` : id
    db.collection('products').doc(docName).set(req.body)
    .then(data => {
        res.json({ 'product': name})
    })
    .catch(err => {
        return res.json({ "alert": "some errors occurred, try again"})
    })
})

// create get products route
app.post("/get-products", (req, res) => {
    let { email, id, tag } = req.body
     

    if(id){
        docRef = db.collection('products').doc(id)
    } else if(tag) {
        docRef = db.collection('products').where('tags', 'array-contains', tag)
    } else {
        docRef = db.collection('products').where('email', '==', email)
    }

    docRef.get()
    .then(products => {
        if(products.empty) {
            return res.json("no products")
        }
        let productArr = []
        if(id) {
            return res.json(products.data())
        }
        products.forEach(item => {
            let data = item.data()
            data.id = item.id
            productArr.push(data)
        })
        res.json(productArr)
    })
})

// delete product
app.post('/delete-product', (req, res) => {
    let { id } = req.body
    db.collection('products').doc(id).delete()
    .then(data => {
        res.json("success")
    }).catch(err => {
        res.json("err")
    })
})

// products route
app.get("/products/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"))
})

// search route
app.get("/search/:key", (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"))
})

// cart route
app.get("/cart", (req, res) => {
    res.sendFile(path.join(staticPath, "cart.html"))
})

// checkout route
app.get("/checkout", (req, res) => {
    res.sendFile(path.join(staticPath, "checkout.html"))
})

// order post
app.post("/order", (req, res) => {
    const { order, email, add} = req.body

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOption = {
        from: 'bmpcbob@gmail.com',
        to: email,
        subject: 'Clothing : Order Placed',
        html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Clothing / Confirmation</title>
                </head>
                <style>
                    body{
                        min-height: 90vh;
                        background-color: #f5f5f5;
                        font-family: sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .heading {
                        display: block;
                        width: 50%;
                        text-align: center;
                        font-size: 40px;
                        margin: 30px auto 60px;
                        line-height: 50px;
                        text-transform: capitalize;
                    }
                    .heading span{
                        font-weight:lighter;
                    }
                    .btn{
                        display: block;
                        width: 200px;
                        height: 50px;
                        line-height: 50px;
                        font-size: 18px;
                        background-color: #3f3f3f;
                        color: #fff;
                        border-radius: 5px;
                        text-transform: capitalize;
                        margin: auto;
                        outline: none;
                        border: none;
                    }
                </style>
                <body>

                    <div>
                        <h1 class="heading">dear ${email.split("@")[0]}, <span>your order is successfully placed</span></h1>
                        <button class="btn">check status</button>
                    </div>
                    
                </body>
            </html>
        `
    }

    let docName = email + Math.floor(Math.random() * 128725678278445)
    db.collection('orders').doc(docName).set(req.body)
    .then(data => {
            transporter.sendMail(mailOption, (err, info) => {
                if(err){
                    res.json({"alert": "OOPS! it seems like some error occurred, please try again"})
                } else {
                    res.json({"alert": "Super! your order is placed"})
                } 
                    
            })

    })
})


// create 404 route
app.get("/404", (req, res) => {
    res.sendFile(path.join(staticPath, "/404.html"))
})

app.use((req, res) => {
    res.redirect('/404')
})




// listing server
app.listen(3000, () => {
    console.log("listing on port 3000 .......");
})