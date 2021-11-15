window.onload = () => {
    if(!sessionStorage.user) {
        location.replace("/login")
    }
}

const placeOrderBtn = document.querySelector(".place-order")

placeOrderBtn.addEventListener('click', () => {
    let address = getAddress()

    if(address){
        fetch("/order", {
            method: "post",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({
                order: JSON.parse(localStorage.cart),
                email: JSON.parse(sessionStorage.user).email,
                add: address
            })
        }).then(res => res.json())
        .then(data => {
            if(data.alert = "Super! your order is placed"){
                delete localStorage.cart
                showAlert(data.alert, "success")
            } else {
                showAlert(data.alert)
            }

        })
    }
})

const getAddress = () => {
    // validation
    let address = document.querySelector("#address").value
    let street = document.querySelector("#street").value
    let city = document.querySelector("#city").value
    let state = document.querySelector("#state").value
    let postcode = document.querySelector("#postcode").value
    let landmark = document.querySelector("#landmark").value
    
    if(!address.length || !street.length || !city.length || !state.length || !postcode.length || !landmark.length) {
        return showAlert("fill all address input fields")
    } else {
        return {address, street, city, state, postcode, landmark}
    }

}

