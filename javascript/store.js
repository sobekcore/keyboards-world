// Variables
const cartButton = document.querySelector("#navbar-cart img");
const cartClose = document.querySelector("#cart-close");
const cartClear = document.querySelector("#cart-clean");
const cartDOM = document.querySelector("#cart");
const cartOverlay = document.querySelector("#cart-overlay");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartContent = document.querySelector("#cart-content");
const productsDOM = document.querySelector("#products-center");

// Cart item array
let cart = [];

// Getting products
class Products
{
  async getProducts()
  {
    try
    {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
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
        <article id="product">
          <div id="img-container">
            <img
              src=${product.image}
              alt="product"
              id="product-img"
            />
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
          <button id="bag-btn" data-id=${product.id}>
            <i id="fas fa-shopping-cart"></i>
            Add to Bag
          </button>
        </article>
        `
      }
    );

    productsDOM.innerHTML = result;
  }

  getBagButtons()
  {
    const buttons = [...document.querySelectorAll("#bag-btn")];

    buttons.forEach(button =>
      {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if(inCart)
        {
          button.innerText = "In Cart";
          button.disabled = true;
        }
        else
        {
          button.addEventListener("click", (event) =>
            {
              setTimeout(() => { event.target.innerText = "In Cart"; }, 140);
              event.target.disabled = true;
              event.target.display = "block";
            }
          );
        }
      }
    );
  }
}

// Local storage
class Storage
{
  static saveProducts(products)
  {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () =>
  {
    const ui = new UI();
    const products = new Products();

    // Get all products
    products.getProducts().then(products =>
      {
        ui.displayProducts(products)
        Storage.saveProducts(products)
      }
    ).then(() =>
      {
        ui.getBagButtons();
      }
    );
  }
);
