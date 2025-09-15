var API_BASE = "https://openapi.programming-hero.com/api";

var categoryList = document.getElementById("category-list");
var productList = document.getElementById("product-list");
var cartItemsContainer = document.getElementById("cart-items");
var cartTotal = document.getElementById("cart-total");
var modal = document.getElementById("tree-modal");
var closeModalBtn = document.getElementById("close-modal");
var bottomCloseBtn = document.getElementById("bottom-close");


var modalImage = document.getElementById("modal-image");
var modalName = document.getElementById("modal-name");
var modalDescription = document.getElementById("modal-description");
var modalCategory = document.getElementById("modal-category");
var modalPrice = document.getElementById("modal-price");
var modalAddBtn = document.getElementById("modal-add-to-cart");


var cart = [];
var total = 0;
var currentPlant = null;


function loadCategories() {
  fetch(API_BASE + "/categories")
    .then(function(res){ return res.json(); })
    .then(function(data){
      var categories = (data && data.categories) || [];
      showCategories(categories);
    })
    .catch(function(){ showError("categories"); });
}


function showCategories(categories){
  categoryList.innerHTML = `
    <li>
      <button id="all-trees" class="w-full text-left px-4 py-2 rounded-md bg-green-600 text-white">
        All Trees
      </button>
    </li>
  `;

  categories.forEach(cat => {
    const catId = cat.id; 
    const catName = cat.category || cat.category_name || "Tree"; 
    categoryList.innerHTML += `
      <li>
        <button data-id="${catId}" class="w-full text-left px-4 py-2 rounded-md hover:bg-green-100">
          ${catName}
        </button>
      </li>
    `;
  });

  categoryList.addEventListener("click", function(e){
    if(e.target.tagName !== "BUTTON") return;

    const buttons = categoryList.getElementsByTagName("button");
    for(let j=0;j<buttons.length;j++) buttons[j].classList.remove("bg-[#15803D]","text-white");

    e.target.classList.add("bg-[#15803D]","text-white");

    const id = e.target.getAttribute("data-id");
    if(id) loadPlantsByCategory(id);
    else loadAllPlants();
  });
}


function loadAllPlants(){
  showLoading();
  fetch(API_BASE + "/plants")
    .then(function(res){ return res.json(); })
    .then(function(data){
      var plants = (data && data.plants) || [];
      showPlants(plants);
    })
    .catch(function(){ showError("plants"); });
}


function loadPlantsByCategory(id){
  showLoading();
  fetch(API_BASE + "/category/" + id)
    .then(function(res){ return res.json(); })
    .then(function(data){
      var plants = (data && data.plants) || [];
      if(plants.length>0) showPlants(plants);
      else showEmptyMessage();
    })
    .catch(function(){ showError("plants"); });
}


function showPlants(plants){
  productList.innerHTML = "";
  plants.forEach(tree => {
    const id = tree.id || tree.plant_id || tree.plantId || tree.plantID || "";
    const name = tree.name || tree.plant_name || tree.plantName || tree.title || "Unnamed";
    const category = tree.category || tree.category_name || "Tree";
    const price = Number(tree.price) || 0;
    const img = tree.image || tree.img || tree.thumbnail || tree.photo || "";
    const shortDesc = (tree.description || "").substring(0,80);

    productList.innerHTML += `
      <div class="bg-white p-4 rounded-xl shadow">
        <img data-id="${id}" src="${img}" alt="${name}" class="open-detail w-full h-32 object-cover rounded mb-4">
        <h3 data-id="${id}" class="open-detail font-semibold text-green-700 cursor-pointer hover:underline">${name}</h3>
        <p class="text-sm text-gray-600">${shortDesc ? shortDesc+"..." : ""}</p>
        <span class="text-xs inline-block mt-2 px-2 py-1 text-green-600 rounded">${category}</span>
        <div class="flex justify-between items-center mt-4">
          <span class="font-semibold">৳${price}</span>
          <button data-id="${id}" data-name="${name}" data-price="${price}" class="add-to-cart bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add to Cart</button>
        </div>
      </div>
    `;
  });

  if(plants.length===0) showEmptyMessage();
}


productList.addEventListener("click", function(e){
  if(e.target.classList.contains("open-detail")){
    const id = e.target.getAttribute("data-id");
    if(!id){ showToast("Missing plant id for details."); return; }
    handleViewDetails(id);
  }

  if(e.target.classList.contains("add-to-cart")){
    const item = {
      id: e.target.getAttribute("data-id") || null,
      name: e.target.getAttribute("data-name") || "Unnamed",
      price: Number(e.target.getAttribute("data-price")) || 0
    };
    addToCart(item);
  }
});


function handleViewDetails(id) {
  
  modal.classList.remove("hidden");
  modalName.textContent = "";
  modalCategory.textContent = "";
  modalPrice.textContent = "";
  modalImage.src = "";
  modalDescription.innerHTML = `
    <div class="flex justify-center items-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 border-solid"></div>
    </div>
  `;

  // Fetch plant data
  fetch(API_BASE + "/plant/" + id)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var plant = data.plant;

      if (!plant) {
        modalName.textContent = "No data available";
        modalDescription.textContent = "";
        return;
      }

      
      currentPlant = {
        id: plant.id,
        name: plant.name,
        price: plant.price ? Number(plant.price) : 0
      };

      
      modalName.textContent = plant.name ? plant.name : "Unnamed";
      modalImage.src = plant.image ? plant.image : "https://via.placeholder.com/300x200?text=No+Image";
      modalCategory.textContent = plant.category ? plant.category : "Tree";
      modalPrice.textContent = plant.price ? "৳" + plant.price : "৳0";
      modalDescription.textContent = plant.description ? plant.description : "No description available";
    })
    .catch(function() {
      modalName.textContent = "Error loading details";
      modalDescription.textContent = "";
    });
}



if(modalAddBtn){
  modalAddBtn.addEventListener("click", function(){
    if(currentPlant){ addToCart(currentPlant); closeModal(); }
  });
}


function closeModal(){ modal.classList.add("hidden"); }
if(closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if(bottomCloseBtn) bottomCloseBtn.addEventListener("click", closeModal);
if(modal){
  modal.addEventListener("click", function(e){ if(e.target===modal) closeModal(); });
}
document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeModal(); });


function addToCart(item){
  cart.push(item);
  total += item.price || 0;
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  
  cart.forEach(function(item, i) {
    var price = 0;
    if (item.price) {
      price = item.price;
    }

    var li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white p-2 rounded shadow";

    var span = document.createElement("span");
    span.textContent = item.name + " ৳" + price;

    var btn = document.createElement("button");
    btn.setAttribute("data-index", i);
    btn.className = "remove-item text-red-500 font-bold";
    btn.textContent = "×";

    li.appendChild(span);
    li.appendChild(btn);
    cartItemsContainer.appendChild(li);
  });

  cartTotal.textContent = "৳" + total;
}


cartItemsContainer.addEventListener("click", function(e){
  if(e.target.classList.contains("remove-item")){
    const idx = parseInt(e.target.getAttribute("data-index"),10);
    total -= cart[idx].price || 0;
    cart.splice(idx,1);
    updateCart();
  }
});

function showLoading(){
  productList.innerHTML = '<div class="flex justify-center items-center py-10"><div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-solid"></div></div>';
}
function showError(type){ productList.innerHTML = '<div class="bg-red-500 p-3 rounded">Error loading '+type+'!</div>'; }
function showEmptyMessage(){ productList.innerHTML = '<div class="bg-orange-500 p-3 rounded">No items found</div>'; }
function showToast(msg){ console.warn(msg); }

loadCategories();
loadAllPlants();
