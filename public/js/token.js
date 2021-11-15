let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${'`'}{|}~`

const generateToken = (key) => {
    console.log(key.length);
    let token = ''
    for(let i = 0; i < key.length; i++) {
        let index = char.indexOf(key[i]) || char.length / 2
        let randomIndex = Math.floor(Math.random() * index)
        token += char[randomIndex] + char[index - randomIndex]
    }

    console.log(token, key);

    return token
}


const compareToken = (token, key) => {
    let string = ""
    for( let i = 0; i < token.length; i = i+2) {
        let index1 = char.indexOf(token[i])
        let index2 = char.indexOf(token[i+1])
        string += char[index1 + index2]
    }

    if(string === key) {
        return true
    }

    return false
}

// common functions


// alert function

const showAlert = (msg, type) => {
    const msgBox = document.querySelector(".msg-box")
    const errMsg = document.querySelector(".err-msg")
    const errImg = document.querySelector(".err-img")

    errMsg.innerHTML = msg

    if(type == "success") {
        errImg.src = `img/success.png`
        errMsg.style.color = `#0ab50a`
    } else {
        errImg.src = `img/error.png`
        errMsg.style.color = null
    }
    msgBox.classList.add('show')
    setTimeout(() => {
        msgBox.classList.remove('show')
    }, 3000)
    return false
}

// send data function
const sendData = (path, data) => {
    fetch(path, {
        method: "post",
        headers: new Headers({ 'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) => res.json())
      .then((response) => {
          processData(response)
      })
}

// processData  function
const processData = (data) => {
    // console.log(data);
    loader.style.display = null
    if(data.alert) {
        showAlert(data.alert)
    } else if(data.name) {
        // create auth Token
        data.authToken = generateToken(data.email)
        sessionStorage.user = JSON.stringify(data)
        location.replace('/') 
    } else if(data === true) {
        let user = JSON.parse(sessionStorage.user)
        user.seller = true
        sessionStorage.user = JSON.stringify(user)
        location.reload()
    } else if(data.product) {
        location.href = "/seller"
    }
}