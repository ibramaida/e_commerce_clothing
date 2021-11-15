let user = JSON.parse(sessionStorage.user || null)
let loader = document.querySelector(".loader")

// check if user logged in on load
window.onload = () => {
    if(user) {
        if(!compareToken(user.authToken, user.email)) {
            location.replace("/login")
        }
    } else {
        location.replace("/login")
    }
}

// price inputs
const actualPrice = document.querySelector(".actual-price")
const discountPercent = document.querySelector(".discount")
const sellPrice = document.querySelector(".sell-price")



discountPercent.addEventListener('input', () => {
    if(discountPercent.value > 100) {
        discountPercent.value = 90
    } else {
        let discount = actualPrice.value * discountPercent.value / 100
        sellPrice.value = actualPrice.value - discount
    }
})

sellPrice.addEventListener('input', () => {
    let discount = (sellPrice.value / actualPrice.value) * 100
    discountPercent.value = discount
})

// upload images

const uploadImgs = document.querySelectorAll('.file-upload')
let imagesPaths = [] // to store all images paths

// install these npm packages aws-sdk , dotenv and perform all server side configuration

// fetch('/s3url').then(res => res.json())
// .then(url => console.log(url))

uploadImgs.forEach((fileUpload, index) => {
    fileUpload.addEventListener('change', () => {
        const file = fileUpload.files[0]
        let imageUrl
        if(file.type.includes('image')){
            // user upload an image
            fetch('/s3url').then(res => res.json())
            .then(url => {
                fetch(url, {
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'multipart/form-data'}),
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0]
                    imagesPaths[index] = imageUrl
                    let label = document.querySelector(`label[for=${fileUpload.id}]`)
                    label.style.backgroundImage = `url(${imageUrl})`
                    let productImage = document.querySelector(".product-img")
                    productImage.style.backgroundImage = `url(${imageUrl})`
                })
            })
        } else {
            showAlert("upload images only")
        }
    })
})

// submit the product form

const productName = document.querySelector("#product-name")
const shortDesc = document.querySelector("#short-desc")
const productDesc = document.querySelector("#product-desc")

let sizes = []

const stock = document.querySelector("#stock")
const tags = document.querySelector("#tags")
const terms = document.querySelector("#terms")

const addBtn = document.querySelector("#add-btn")
const saveBtn = document.querySelector("#save-btn")

// store sizes function
const storeSizes = () => {
    sizes = []
    const sizeCheckBoxes = document.querySelectorAll(".size-checkbox")
    sizeCheckBoxes.forEach(item => {
        if(item.checked) {
            sizes.push(item.value)
        }
    })
}

const formValidate = () => {
    if(!productName.value.length) {
       return showAlert("enter product name")
    } else if(shortDesc.value.length > 100 || shortDesc.value.length < 10) {
        return showAlert("short description must be between 10 and 100 characters")
    } else if(!productDesc.value.length) {
        return showAlert("enter good description about the product")
    } else if (!imagesPaths.length){
        return showAlert("upload at least one image for the product")
    } else if (!sizes.length){
        return showAlert("select at least one size")
    } else if(!actualPrice.value.length || !discountPercent.value.length || !sellPrice.value.length) {
        return showAlert("you must add pricing")
    } else if(stock.value < 20) {
        return showAlert("you should have at least 20 items in stock")
    } else if (!tags.value.length) {
        return showAlert("add some tags to help ranking your product in search")
    } else if(!terms.checked) {
        return showAlert("you must agree to our terms an conditions")
    }
    return true
}

// product data function
const productData = () => {

    let tagArr = tags.value.split(",")
    tagArr.forEach((item, i) => {
        tagArr[i] = tagArr[i].trim()
    })
    return data = {
        name: productName.value,
        shortDesc: shortDesc.value,
        description: productDesc.value,
        images: imagesPaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercent.value,
        sellPrice: sellPrice.value,
        stock: stock.value,
        tags: tagArr,
        terms: terms.checked,
        email: user.email
    }
}



addBtn.addEventListener('click', () => {
    storeSizes()
    if(formValidate()) { // form validate function return true or false
        loader.style.display = "block"
        let data = productData()
        if(productId) {
            data.id = productId
        }
        sendData("/addproduct", data)
    }
})

// save draft
saveBtn.addEventListener('click', () => {
    storeSizes()
    if(!productName.value.length) { // in save draft we validate only product name
        showAlert("add product name")
    } else { // don't validate the form
        let data = productData()
        data.draft = true
        if(productId) {
            data.id = productId
        }
        sendData("/addproduct", data)
    }
})

const setFormsData = (data) => {
    productName.value = data.name
    shortDesc.value = data.shortDesc
    productDesc.value = data.description
    actualPrice.value = data.actualPrice
    discountPercent.value = data.discount
    sellPrice.value = data.sellPrice
    stock.value = data.stock
    tags.value = data.tags
    // terms.checked = data.terms

    // setup images
    imagesPath = data.images //an array of images
    imagesPath.forEach((url, i) => {
        let label = document.querySelector(`label[for=${uploadImgs[i].id}]`)
        label.style.backgroundImage = `url(${url})`
        let productImage = document.querySelector(".product-img")
        productImage.style.backgroundImage = `url(${url})`
    })

    //setup sizes
    sizes = data.sizes
    sizeCheckBoxes = document.querySelectorAll('.size-checkbox')
    sizeCheckBoxes.forEach(item => {
        if(sizes.includes(item.value)){
            item.setAttribute("checked", "")
        }
    })
}


const fetchProductData = () => {
    fetch("/get-products", {
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({email: user.email, id: productId})
    }).then(res => res.json())
    .then(data => {
        setFormsData(data)
    }).catch(err => {
        console.log(err);
        // location.replace("/seller")
    })
}

//  existing product handle (enter the product from browser address bar)
let productId = null
if(location.pathname != "/addproduct") {
    productId = decodeURI(location.pathname.split("/").pop())  
    // location.pathname return an array and .pop() return the last item from that array, we stored in productId
    //decodeUTI return good format for the required path

    let productDetails = JSON.parse(sessionStorage.tempProduct || null)

    fetchProductData()

}






