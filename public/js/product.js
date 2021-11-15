const productImg = document.querySelector('.product-img')
const images = document.querySelectorAll('.product-images img')

const sizeBtns = document.querySelectorAll('.size-radio-box')

// console.log(images[0]);

let activeImg = 0

images.forEach((item, index) => {
    item.addEventListener('click', () => {
        images[activeImg].classList.remove('active')
        item.classList.add('active')
        productImg.style.backgroundImage = `url('${item.src}')`
        activeImg = index
    })
})


let activeSizeBtn = 0
let size
sizeBtns.forEach((item, index) => {
    item.addEventListener('click', () => {
        sizeBtns[activeSizeBtn].classList.remove('checked')
        item.classList.add('checked')
        activeSizeBtn = index
        size = item.innerHTML
    })
})

// dynamic product / get product from data base

// set data
const setData = (data) => {
    // set the title (in the title bar)
    let title = document.querySelector('title')
    title.innerHTML += data.name

    // setup images
    images.forEach((img, i) => {
        if(data.images[i]) {
            img.src = data.images[i]
        } else {
            img.style.display = "none"
        }
        images[0].click()
    })

    // setup sizes
    sizeBtns.forEach(item => {
        
        if(!data.sizes.includes(item.innerHTML)){
            item.style.display = "none"
        }
    })

    // setup texts
    const name = document.querySelector(".product-title")
    const shortDesc = document.querySelector(".product-desc")
    const desc = document.querySelector(".desc")
    name.innerHTML = data.name
    shortDesc.innerHTML = data.shortDesc
    desc.innerHTML = data.description

    // setup prices
    const sellPrice = document.querySelector(".product-price")
    const actualPrice = document.querySelector(".product-actual")
    const discount = document.querySelector(".product-discount")

    sellPrice.innerHTML = `$${data.sellPrice}`
    actualPrice.innerHTML = `$${data.actualPrice}`
    discount.innerHTML = `( ${data.discount}% off )`

    // setup cart and wishlist
    const addToCart = document.querySelector(".buy")
    addToCart.addEventListener('click', () => {
        addToCart.innerHTML = addToCartOrWishlist("cart", data)
    })

    const addToWishlist = document.querySelector(".wishlist")
    addToWishlist.addEventListener('click', () => {
        addToWishlist.innerHTML = addToCartOrWishlist("wishlist", data)
    })
}

// fetch data
const fetchProductData = () => {
    fetch("/get-products", {
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({id: productId})
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        setData(data)
        getProducts(data.tags[0]).then(data => createProductSlider(data, ".container-for-slider", "similar products"))
    })
    .catch(err => {
        location.replace("/404")
        console.log(err)
    })
}

let productId = null
if(location.pathname != "/products") {
    productId = decodeURI(location.pathname.split("/").pop())
    // console.log(productId)
    fetchProductData()
}