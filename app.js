// --- PRODUCT DATA (from localStorage or default) ---
let products = JSON.parse(localStorage.getItem("products")) || [
  {id:1, name:"Artistic Lamp", price:150, img:"https://picsum.photos/200?1", desc:"Modern artistic lamp for home or office."},
  {id:2, name:"Wooden Chair", price:220, img:"https://picsum.photos/200?2", desc:"Handcrafted wooden chair, stylish and comfortable."},
  {id:3, name:"Canvas Painting", price:180, img:"https://picsum.photos/200?3", desc:"Beautiful modern wall canvas painting."},
  {id:4, name:"Ceramic Vase", price:90, img:"https://picsum.photos/200?4", desc:"Elegant ceramic vase for flowers or decoration."},
  {id:5, name:"Desk Organizer", price:70, img:"https://picsum.photos/200?5", desc:"Keep your desk neat with this organizer."},
  {id:6, name:"Table Lamp", price:130, img:"https://picsum.photos/200?6", desc:"LED table lamp with artistic design."}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- RENDER PRODUCTS ON SHOP PAGE ---
if(document.getElementById("product-list")){
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="" onclick="viewProduct(${p.id})">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");

  // Apply modern styling
  document.querySelectorAll('.card').forEach(card => {
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "12px";
    card.style.padding = "15px";
    card.style.margin = "10px";
    card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    card.style.textAlign = "center";
    card.style.transition = "transform 0.2s";
    card.style.background = "#fff";
    
    card.onmouseover = () => card.style.transform = "scale(1.03)";
    card.onmouseout = () => card.style.transform = "scale(1)";
  });

  document.querySelectorAll('.card img').forEach(img => {
    img.style.width = "100%";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";
    img.style.objectFit = "cover";
  });

  document.querySelectorAll('.card button').forEach(btn => {
    btn.style.background = "black";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "50px";
    btn.style.padding = "10px 20px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
  });
}
// --- VIEW PRODUCT DETAIL ---
function viewProduct(id){
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

if(document.getElementById("product-detail")){
  const id = localStorage.getItem("selectedProduct");
  const p = products.find(pr => pr.id == id);
  document.getElementById("product-detail").innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.img}" width="300">
    <p>${p.desc}</p>
    <p><b>Price:</b> $${p.price}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  `;
}

// --- CART & CHECKOUT ---
function addToCart(id){
  const p = products.find(pr => pr.id == id);
  cart.push(p);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

if(document.getElementById("cart-list")){
  const cartContainer = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");

  let total = 0;
  cartContainer.innerHTML = cart.map((p, i) => {
    total += p.price;
    return `<div>${p.name} - $${p.price}</div>`;
  }).join("");
  totalPriceEl.textContent = total;
}

if(document.getElementById("checkout-form")){
  emailjs.init("MAsKapl9NLIa9Myuf");

  document.getElementById("checkout-form").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    let orderDetails = cart.map(p => `${p.name} - $${p.price}`).join("\n");
    orderDetails += `\nTotal: BDT${cart.reduce((sum,p)=>sum+p.price,0)}\nPayment: Cash on Delivery`;

    // Send order to your email
    emailjs.send("service_qp6t5zj", "template_10u6rjp", {
      name: name,
      email: email,
      phone: phone,
      address: address,
      cart: orderDetails
    }).then(() => {
      // Show invoice
      const invoice = document.getElementById("invoice");
      invoice.style.display = "block";
      invoice.innerHTML = `
        <h2>Invoice</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address}</p>
        <h3>Products:</h3>
        <pre>${orderDetails}</pre>
        <p>Payment: Cash on Delivery</p>
        <p>Thank you for your order!</p>
      `;

      // Clear cart
      localStorage.removeItem("cart");
      cart = [];
      document.getElementById("cart-list").innerHTML = "";
      document.getElementById("total-price").textContent = "0";

    }).catch(err => {
      alert("❌ Failed to send order: " + JSON.stringify(err));
    });
  });
}

// --- ADMIN PANEL ---
if(document.getElementById("add-product-form")){
  const form = document.getElementById("add-product-form");
  const list = document.getElementById("admin-product-list");

  function renderAdminProducts(){
    list.innerHTML = products.map((p,i)=>`
      <div>
        ${p.name} - $${p.price}
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `).join("");
  }
  renderAdminProducts();

  form.addEventListener("submit", e=>{
    e.preventDefault();
    const newProd = {
      id: Date.now(),
      name: document.getElementById("product-name").value,
      price: document.getElementById("product-price").value,
      img: document.getElementById("product-img").value,
      desc: document.getElementById("product-desc").value,
    };
    products.push(newProd);
    localStorage.setItem("products", JSON.stringify(products));
    renderAdminProducts();
    form.reset();
  });
}

function deleteProduct(index){
  products.splice(index,1);
  localStorage.setItem("products", JSON.stringify(products));
  location.reload();
        }
