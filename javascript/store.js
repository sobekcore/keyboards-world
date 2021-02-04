// Contentful
const client = contentful.createClient(
  {
    space: env.CONTENTFUL_SPACE_ID,
    accessToken: env.CONTENTFUL_ACCES_TOKEN
  }
);

// Variables
const cartButton = document.querySelector("#cart-button");
const cartClose = document.querySelector("#cart-close");
const cartClear = document.querySelector("#cart-clean");
const Purchase = document.querySelector("#purchase");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartContent = document.querySelector("#cart-content");
const productsDOM = document.querySelector("#products-center");

// Cart item array
let cart = [];

// Buttons
let buttonsDOM = [];

// Getting products
class Products
{
  async getProducts()
  {
    try
    {
      let contentful = await client.getEntries(
      { content_type: "keyboardsWorldProducts", order: "sys.createdAt" });

      /* Fetching data from JSON file
      let result = await fetch("../store/products.json");
      let data = await result.json(); */

      let products = contentful.items;
      products = products.map(item =>
        {
          const { title, price } = item.fields;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, price, id, image };
        }
      );

      return products;
    }
    catch(error) { console.log(error); }
  }
}

// Displaying products
class UI
{
  displayProducts(products)
  {
    let result = "";
    products.forEach(product =>
      {
        result +=
        `
        <!-- Single Product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
          <button class="bag-btn" data-id=${product.id}>
            Add to Cart
          </button>
        </article>
        `
      }
    );

    productsDOM.innerHTML = result;
  }

  getBagButtons()
  {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach(button =>
      {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if(inCart)
        {
          button.innerText = "In Cart";
          button.disabled = true;
        }

        button.addEventListener("click", (event) =>
          {
            setTimeout(() => { event.target.innerText = "In Cart"; }, 140);
            event.target.disabled = true;

            // Get product from products
            let cartItem = { ...Storage.getProduct(id), amount: 1 };

            // Add product to the cart
            cart = [...cart, cartItem];

            // Save cart in local storage
            Storage.saveCart(cart);

            // Set cart values
            this.setCartValues(cart);

            // Display cart item
            this.addCartItem(cartItem);
          }
        );
      }
    );
  }

  setCartValues(cart)
  {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item =>
      {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
      }
    );

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item)
  {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML =
    `
      <!-- Cart Item -->
      <img class="cart-image" src=${item.image} alt="Product" />
      <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
      </div>
        <div>
          <img class="amount-up" src="../graphics/svg/up-down.svg" data-id=${item.id} />
          <p class="item-amount">${item.amount}</p>
          <img class="amount-down" src="../graphics/svg/up-down.svg" data-id=${item.id} />
        </div>
      </div>
    `

    cartContent.appendChild(div);
  }

  showCart()
  {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart()
  {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  setupApp()
  {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartButton.addEventListener("click", this.showCart);
    cartClose.addEventListener("click", this.hideCart);
  }

  populateCart(cart)
  { cart.forEach(item => this.addCartItem(item)); }

  cartLogic()
  {
    // Purchase cart button
    Purchase.addEventListener("click", () => { this.purchaseCart() })

    // Clear cart button
    cartClear.addEventListener("click", () => { this.clearCart() })

    // Cart functionality
    cartContent.addEventListener("click", event =>
      {
        if(event.target.classList.contains("remove-item"))
        {
          let removeItem = event.target;
          let id = removeItem.dataset.id;
          cartContent.removeChild(removeItem.parentElement.parentElement);
          this.removeItem(id);
        }
        else if(event.target.classList.contains("amount-up"))
        {
          let amountUp = event.target;
          let id = amountUp.dataset.id;
          let tempItem = cart.find(item => item.id === id);
          tempItem.amount = tempItem.amount + 1;
          Storage.saveCart(cart);
          this.setCartValues(cart);
          amountUp.nextElementSibling.innerText = tempItem.amount;
        }
        else if(event.target.classList.contains("amount-down"))
        {
          let amountDown = event.target;
          let id = amountDown.dataset.id;
          let tempItem = cart.find(item => item.id === id);
          tempItem.amount = tempItem.amount - 1;
          if(tempItem.amount > 0)
          {
            Storage.saveCart(cart);
            this.setCartValues(cart);
            amountDown.previousElementSibling.innerText = tempItem.amount;
          }
          else
          {
            cartContent.removeChild(amountDown.parentElement.parentElement);
            this.removeItem(id);
          }
        }
      }
    );
  }

  purchaseCart()
  {
    // Purchased animation
    var h1 = document.createElement("h1");
    h1.innerHTML = "Thank you for purchase";
    document.getElementById("purchased").style.display = "block";
    document.getElementById("purchased").appendChild(h1);

    // Return do display none
    setTimeout(function()
    { document.getElementById("purchased").style.display = "none"; }, 6500);

    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length > 0)
    { cartContent.removeChild(cartContent.children[0]); }

    this.hideCart();
  }

  clearCart()
  {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length > 0)
    { cartContent.removeChild(cartContent.children[0]); }

    this.hideCart();
  }

  removeItem(id)
  {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    setTimeout(() => { button.innerHTML = "Add to Cart"; }, 250);
  }

  getSingleButton(id)
  { return buttonsDOM.find(button => button.dataset.id === id); }
}

// Local storage
class Storage
{
  static saveProducts(products)
  { localStorage.setItem("products", JSON.stringify(products)); }

  static getProduct(id)
  {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }

  static saveCart(cart)
  { localStorage.setItem("cart", JSON.stringify(cart)); }

  static getCart()
  { return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")):[]; }
}

document.addEventListener("DOMContentLoaded", () =>
  {
    const ui = new UI();
    const products = new Products();

    // Setup app
    ui.setupApp();

    // Get all products
    products.getProducts().then(products =>
      {
        ui.displayProducts(products)
        Storage.saveProducts(products)
      }
    ).then(() =>
      {
        ui.getBagButtons();
        ui.cartLogic();
      }
    );
  }
);
