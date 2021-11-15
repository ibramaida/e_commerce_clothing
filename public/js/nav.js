const navbar = document.querySelector('.navbar')
const createNavbar = () => {
    navbar.innerHTML = `
        <div class="container">
            <div class="nav-flex">
                <a href="index.html" class="logo"><img src="./img/dark-logo.png" alt="logo image" class="img-logo"></a>
                <div class="nav-items">
                    <div class="search-box">
                        <input type="text" placeholder="search your article ..." class="search-input">
                        <button class="search-btn">Search</button>
                    </div>
                    <a  class="user-profile" id="user-img-btn">
                        <img src="./img/user.png" alt="user profile" >
                        <div class="login-logout-popup hide">
                            <p class="account-info">Log in as, name</p>
                            <button class="user-btn" id="user-btn">Log out</button>
                        </div>
                    </a>
                    <a href="/cart"><img src="./img/cart.png" alt="cart image"></a>
                </div>
            </div>
            </div>
            <div class="categories-items">
                <a href="index.html" class="home">home</a>
                <a href="#" class="home">woman</a>
                <a href="#" class="home">men</a>
                <a href="#" class="home">kids</a>
                <a href="#" class="home">accessories</a>
            </div>
    `
}

createNavbar()

const userImageBtn = document.querySelector("#user-img-btn")
const userLoginBox = document.querySelector(".login-logout-popup")
const userLoginInfo = document.querySelector(".account-info")
const userLoginBtn = document.querySelector("#user-btn") 

userImageBtn.addEventListener('click', () => {
    userLoginBox.classList.toggle('hide')
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null)
    if(user != null) { // user is logged in
        userLoginInfo.innerHTML = `Logged In As, ${user.name}`
        userLoginBtn.innerHTML = "log out"
        userLoginBtn.addEventListener('click', () => {
            sessionStorage.clear()
            location.reload()
        })
    } else { // user is logged out
        userLoginInfo.innerHTML = "log in to place an order"
        userLoginBtn.innerHTML = "log in"
        userLoginBtn.addEventListener('click', () => {
            location.href= "/login"
        })
    }
}

// search functionality
const searchBtn = document.querySelector(".search-btn")
const searchInput = document.querySelector(".search-input")
searchBtn.addEventListener('click', () => {
    if(searchInput.value.length) {
        location.href = `/search/${searchInput.value}`
    }
})
