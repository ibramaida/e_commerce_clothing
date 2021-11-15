// redirect to home page if user logged in
window.onload = () => {
    if(sessionStorage.user) {
        user = JSON.parse(sessionStorage.user)
        if (compareToken(user.authToken, user.email)){
            location.replace('/')
        }
    }
}



const loader = document.querySelector('.loader')

const name = document.querySelector('#name') || null
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const phone = document.querySelector('#phone') || null
const terms = document.querySelector('#terms') || null
const receiveOffers = document.querySelector('#receive-offers') || null
const submitBtn = document.querySelector('.submit-btn')

submitBtn.addEventListener('click', () => {
    if(name != null) { // we are on signup page
        if(name.value.length < 3) {
        showAlert('Name must be more than 3 letters.')
    } else if (!email.value) {
        showAlert("enter your email address")
    } else if (password.value.length < 8) {
        showAlert("password should be at least 8 long")
    } else if (!phone.value) {
        showAlert("enter your phone number")
    }
      else if(!Number(phone.value) || phone.value.length < 10) {
        showAlert("enter a valid phone number")

    } else if (!terms.checked) {
        showAlert("must agree our terms and conditions")
    } else { 
        loader.style.display = "block"
        sendData('/signup', {
            name: name.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            terms: terms.checked,
            receiveOffers: receiveOffers.checked,
            seller: false
        })
        }
    } else { // we are on login page
        if(!email.value.length || !password.value.length){
            showAlert('fill all the inputs')
        } else {
            loader.style.display = "block"
            sendData('/login', {
                email: email.value,
                password: password.value,
                
            })
        }
    }
    
})
