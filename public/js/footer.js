const footer = document.querySelector('footer')

const createFooter = () => {
    footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <img src="../img/light-logo.png" alt="light logo" class="footer-logo">
                    <div class="footer-ul-container">
                        <ul class="category">
                            <li class="category-title">women</li>
                            <li><a href="#" class="category-link">link1</a></li>
                            <li><a href="#" class="category-link">link2</a></li>
                            <li><a href="#" class="category-link">link3</a></li>
                            <li><a href="#" class="category-link">link4</a></li>
                            <li><a href="#" class="category-link">link5</a></li>
                            <li><a href="#" class="category-link">link6</a></li>
                            <li><a href="#" class="category-link">link7</a></li>
                            <li><a href="#" class="category-link">link8</a></li>
                        </ul>
                        <ul class="category">
                            <li class="category-title">men</li>
                            <li><a href="#" class="category-link">link1</a></li>
                            <li><a href="#" class="category-link">link2</a></li>
                            <li><a href="#" class="category-link">link3</a></li>
                            <li><a href="#" class="category-link">link4</a></li>
                            <li><a href="#" class="category-link">link5</a></li>
                            <li><a href="#" class="category-link">link6</a></li>
                            <li><a href="#" class="category-link">link7</a></li>
                            <li><a href="#" class="category-link">link8</a></li>
                        </ul>
                    </div>
                </div>
                
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores quibusdam aut eveniet similique minus repellat corrupti eius, animi illo quia adipisci distinctio nobis rerum exercitationem saepe soluta veniam possimus repellendus, ad laborum, dicta tenetur vel repudiandae. Facilis earum consectetur corrupti ab aperiam inventore nulla voluptate officia, odio quos ipsum exercitationem sequi totam fugit.</p>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores quibusdam aut eveniet similique minus repellat corrupti eius, animi illo quia adipisci distinctio nobis rerum exercitationem saepe soluta veniam possimus repellendus, ad laborum, dicta tenetur vel repudiandae. Facilis earum consectetur corrupti ab aperiam inventore nulla voluptate officia, odio quos ipsum exercitationem sequi totam fugit.</p>
                <div class="social-container">
                    <div>
                        <a href="#">privacy term</a>
                        <a href="#">privacy term</a>
                    </div>
                    <div>
                        <a href="">instagram</a>
                        <a href="">facebook</a>
                        <a href="">twitter</a>
                    </div>
                </div>
            </div>
            <div class="footer-cridet">
                <p >Lorem, ipsum dolor sit amet consectetur adipisicing.</p>
            </div>
    `
}

createFooter()