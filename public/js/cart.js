const createSmallCards = (data) => {
    return `
        <div class="sm-product">
            <img src="${data.image}" alt="${data.name} image" class="sm-product-img">
            <div class="sm-text">
                <p class="sm-product-name">${data.name}</p>
                <p class="sm-desc">${data.shortDesc}</p>
            </div>
            <div class="item-counter">
                <button class="counter-btn decrease">-</button>
                <p class="item-count">${data.item}</p>
                <button class="counter-btn increase">+</button>
            </div>
            <p class="sm-price" data-price="${data.sellPrice}">$${data.sellPrice * data.item}</p>
            <button class="sm-delete-btn"><img src="./img/close.png" alt="close button"></button>
        </div>
    `
}

let totalBill = 0

const setProducts = (name) => {
    const element = document.querySelector(`.${name}`)
    let data = JSON.parse(localStorage.getItem(name))
    
    if(data == null) {
        element.innerHTML = `<img src="img/empty-cart.png" alt="empty cart image" class="empty-cart-img">`
    } else {
        for(let i = 0; i < data.length; i++) {
            element.innerHTML += createSmallCards(data[i])
            if(name == "cart") {
                totalBill += Number(data[i].sellPrice * data[i].item)
            }
        }
        updateBill()
    }
    setupEvents(name)
}

const updateBill = () => {
    const billPrice = document.querySelector(".bill")
    billPrice.innerHTML = `$${totalBill}`
}

// counter events
const setupEvents = (name) => {
    const minBtn = document.querySelectorAll(`.${name} .decrease`)
    const plusBtn = document.querySelectorAll(`.${name} .increase`)
    const itemCount = document.querySelectorAll(`.${name} .item-count`)
    const itemPrice = document.querySelectorAll(`.${name} .sm-price`)
    const deleteBtn = document.querySelectorAll(`.${name} .sm-delete-btn`)

    let product = JSON.parse(localStorage.getItem(name))
    
    itemCount.forEach((item, i) => {
        let cost = Number(itemPrice[i].getAttribute("data-price"))

        minBtn[i].addEventListener('click', () => {
            if(item.innerHTML > 1) {
                item.innerHTML--
                totalBill-=cost
                itemPrice[i].innerHTML = `$${item.innerHTML * cost}`
                if(name == "cart") {
                    updateBill()
                }
                product[i].item = item.innerHTML
                localStorage.setItem(name, JSON.stringify(product))
            }
        })

        plusBtn[i].addEventListener('click', () => {
            if(item.innerHTML < 9) {
                item.innerHTML++
                totalBill+=cost
                itemPrice[i].innerHTML = `$${item.innerHTML * cost}`
                if(name == "cart") {
                    updateBill()
                }
                product[i].item = item.innerHTML
                localStorage.setItem(name, JSON.stringify(product))
            }
        })
    })

    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) => index != i)
            localStorage.setItem(name, JSON.stringify(product))
            location.reload()
        })
    })
    
}

setProducts("cart")
setProducts("wishlist")