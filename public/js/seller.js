const loader = document.querySelector(".loader")
let user = JSON.parse(sessionStorage.user || null) 
const becomeSeller = document.querySelector(".become-seller")
const productList = document.querySelector(".product-list")
const applyForm = document.querySelector(".apply-form")
const sellerBtn = document.querySelector("#seller-btn")


window.onload = () => {
    if(user) {
        if(compareToken(user.authToken, user.email)){
            if(!user.seller) {
                becomeSeller.classList.remove("hide")
            } else {
                // productList.classList.remove("hide")
                loader.style.display = "block"
                setupProducts()
            }
        } else {
        location.replace("/login")
        }
    } else {
        location.replace("/login")
    }
    
}

sellerBtn.addEventListener('click', () => {
    becomeSeller.classList.add("hide")
    applyForm.classList.remove("hide")
})

// submit the form
const businessName = document.querySelector("#business-name")
const businessAddress = document.querySelector("#business-address")
const businessAbout = document.querySelector("#about-business")
const businessNumber = document.querySelector("#business-number")
const terms = document.querySelector("#terms")
const legitInfo = document.querySelector("#legit-info")
const sellerSubmitBtn = document.querySelector("#seller-submit-btn")

sellerSubmitBtn.addEventListener('click' , () => {
    if(!businessName.value.length || !businessAddress.value.length || !businessAbout.value.length || !businessNumber.value.length) {
        showAlert("all fields must be filled")
    } else if(!terms.checked || !legitInfo.checked) {
        showAlert("must agree our terms")
    } else { // submit the form / making server request
        loader.style.display = "block"
        sendData('/seller', {
            name: businessName.value,
            address: businessAddress.value,
            about: businessAbout.value,
            number: businessNumber.value,
            terms: terms.checked,
            legit: legitInfo.checked,
            email: JSON.parse(sessionStorage.user).email // JSON.parse to convert a string to an object and the we can access email value key from that object
        })

    }
})

const setupProducts = () => {
    fetch("/get-products", {
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({email: user.email})
    })
    .then(res => res.json())
    .then(data => {
        loader.style.display = null
        productList.classList.remove("hide")
        if(data == "no products") {
            let emptySvg = document.querySelector(".no-product-img")
            emptySvg.classList.remove("hide")
        } else {
            data.forEach(product => createProduct(product))
        }
    })
}


