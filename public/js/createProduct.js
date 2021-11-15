


const createProduct = (data) => {

    

    let productsContainer = document.querySelector(".products-container")
    productsContainer.innerHTML += `
        <div class="products-card">
            <div class="img-box">
                <img src="${data.images[0] || './img/no image.png'}" alt="${data.name} image">
                ${data.draft ? `<p class="tag">Draft</p>` : ''}
                <button class="card-action-btn edit-btn" onClick="location.href='/addproduct/${data.id}'"><img src="./img/edit.png" alt="button" class="card-action-btn-img"></button>
                <button class="card-action-btn open-btn" onClick="location.href='/products/${data.id}'"><img src="./img/open.png" alt="button" class="card-action-btn-img"></button>
                <button class="card-action-btn delete-popup-btn" onClick="openDeletePopup('${data.id}')"><img src="./img/delete.png" alt="button" class="card-action-btn-img"></button>
            </div>
            <h3 class="brand">${data.name}</h3>
            <p class="brand-desc">${data.shortDesc}</p>
            <div class="price-box">
                <p class="price">$${data.sellPrice}</p>
                <p class="not-price">$${data.actualPrice}</p>
            </div>
        </div>
    `
}

const openDeletePopup = (id) => {
    let deleteAlert = document.querySelector(".delete-alert")
    deleteAlert.style.display = "flex"
    let closeBtn = document.querySelector(".close-btn")
    closeBtn.addEventListener('click', () => deleteAlert.style.display = null)
    let deleteBtn = document.querySelector(".delete-btn")
    deleteBtn.addEventListener('click', () => deleteItem(id))
}

const deleteItem = (id) => {
    fetch('/delete-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: id})
    }).then(res => res.json())
      .then(data => {
          if(data == "success"){
              location.reload()
          } else {
              showAlert("some error occurred while deleting, try again")
          }
      })
}