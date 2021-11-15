const setupSlidingEffect = () => {
    const productsContainers = document.querySelectorAll('.products-container')
    const nxtBtn = document.querySelectorAll('.nxt-btn')
    const preBtn = document.querySelectorAll('.pre-btn')
    
    productsContainers.forEach((item, index) => {
        let containerDimensions = item.getBoundingClientRect()
        let containerWidth = containerDimensions.width
    
        nxtBtn[index].addEventListener('click', () => {
            item.scrollLeft += containerWidth
        })
    
        preBtn[index].addEventListener('click', () => {
            item.scrollLeft -= containerWidth
        })
    })
}

// fetch product cards related to tags

const getProducts = (tag) => {
    return fetch("/get-products", {
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({tag: tag})
    }).then(res => res.json())
    .then(data => {
        return data
    })
}

// create dynamic products slider
const createProductSlider = (data, parent, title) => {
    let sliderContainer = document.querySelector(`${parent}`) 

    sliderContainer.innerHTML += `
    <section class="products">
        <div class="container"><h2 class="products-title">${title}</h2></div>
        <button class="pre-btn"><img src="../img/arrow.png" alt=""></button>
        <button class="nxt-btn"><img src="../img/arrow.png" alt=""></button>
        ${createProductCards(data)}
    </section>
    `

    setupSlidingEffect()
}

const createProductCards = (data, parent) => {
    // parent is for search functionality
    let start = '<div class="container"><div class="products-container"><div class="row">'
    let middle = '' // here goes the card
    let end = '</div></div></div>'

    for(let i = 0; i < data.length; i++) {
        if(data[i].id != decodeURI(location.pathname.split("/").pop())){
            middle += `
                <div class="products-card">
                    <div class="img-box">
                        <img src="${data[i].images[0]}" alt="card1 image" onclick="location.href = '/products/${data[i].id}'">
                        <p class="sale">${data[i].discount}% off</p>
                    </div>
                    <h3 class="brand">${data[i].name}</h3>
                    <p class="brand-desc">${data[i].shortDesc}</p>
                    <div class="price-box">
                        <p class="price">$${data[i].sellPrice}</p>
                        <p class="not-price">$${data[i].actualPrice}</p>
                    </div>
                </div>
            `

        }
    }
    if(parent) {
        let cardContainer = document.querySelector(parent)
        cardContainer.innerHTML = start + middle + end
    } else {
        return start + middle + end
    }
}

// cart and wishlist functionality

const addToCartOrWishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type))

    if(data == null) {
        data = []
    }

    product = {
        item: 1,
        name: product.name,
        sellPrice: product.sellPrice,
        size: size || null,
        shortDesc: product.shortDesc,
        image: product.images[0]
    }

    data.push(product)
    // console.log(data)
    localStorage.setItem(type, JSON.stringify(data))

    return "added"
}
