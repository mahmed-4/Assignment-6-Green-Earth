//  remove active button 
const removeActive = () => {
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
};

//  Categories section 
const getCategories = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button id="category-${category.id}" 
        onclick="loadCategoryBasedPlants('${category.id}')"
        class="category-btn px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
        ${category.category_name}
      </button>
    `;
    categoryContainer.appendChild(div);
  });
};
getCategories();

//  Load category-based plants 
const loadCategoryBasedPlants = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickedBtn = document.getElementById(`category-${id}`);
      clickedBtn.classList.add("active");
      displayCategoryBasedPlants(data.plants);
    });
};

const displayCategoryBasedPlants = (categoryPlants) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  categoryPlants.forEach((plant) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="bg-white rounded-lg shadow hover:bg-gray-100 p-3">
        <img src="${plant.image}" class="rounded-md w-full h-40 object-cover"/>
        <h2 onclick="loadPlantsDetails(${plant.id})" 
          class="font-bold mt-2 cursor-pointer hover:underline">${plant.name}</h2>
        <p class="text-sm text-gray-600">${plant.description}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="bg-green-200 text-green-700 px-2 py-1 rounded">${plant.category}</span>
          <span><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plant.price}</span>
        </div>
        <button onclick="loadAddToCardBtns(${plant.id}, ${plant.price}, '${plant.name}')"
          class="mt-3 w-full bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800">
          Add to Cart
        </button>
      </div>
    `;
    cardContainer.appendChild(div);
  });
  manageSpinner(false);
};

//  Show all plants by default 
const loadAllPlants = () => {
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => showAllPlants(data.plants));
};
const showAllPlants = (plants) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  plants.forEach((plant) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="bg-white rounded-lg shadow hover:bg-gray-100 p-3">
        <img src="${plant.image}" class="rounded-md w-full h-40 object-cover"/>
        <h2 onclick="loadPlantsDetails(${plant.id})" 
          class="font-bold mt-2 cursor-pointer hover:underline">${plant.name}</h2>
        <p class="text-sm text-gray-600">${plant.description}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="bg-green-200 text-green-700 px-2 py-1 rounded">${plant.category}</span>
          <span><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plant.price}</span>
        </div>
        <button onclick="loadAddToCardBtns(${plant.id}, ${plant.price}, '${plant.name}')"
          class="mt-3 w-full bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800">
          Add to Cart
        </button>
      </div>
    `;
    cardContainer.appendChild(div);
  });
};
loadAllPlants();

//  Modal 
const loadPlantsDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayPlantDetails(data.plants));
};

const displayPlantDetails = (plantsInfo) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
    <h3 class="text-2xl font-bold">${plantsInfo.name}</h3>
    <img src="${plantsInfo.image}" class="w-full my-3"/>
    <p><b>Category:</b> ${plantsInfo.category}</p>
    <p><b>Price:</b> ${plantsInfo.price}</p>
    <p class="mt-2"><b>Description:</b> ${plantsInfo.description}</p>
  `;
  document.getElementById("my_modal").classList.remove("hidden");
};

//  Spinner 
const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("card-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("card-container").classList.remove("hidden");
  }
};

//  Add to Cart 
const loadAddToCardBtns = (plantId, plantPrice, plantName) => {
  const addToCartContainer = document.getElementById("add-to-card-container");
  const totalBill = document.getElementById("total-Bill");
  let totalBillNumber = parseFloat(totalBill.innerText);

  // Create unique cart item ID
  const cartItemId = `cart-item-${plantId}`;

  const div = document.createElement("div");
  div.id = cartItemId;
  div.className = "flex justify-between items-center bg-green-100 m-2 rounded p-3";

  div.innerHTML = `
    <div>
      <h3 class="font-bold">${plantName}</h3>
      <p><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plantPrice}</p>
    </div>
    <button onclick="cancelOrder('${cartItemId}', ${plantPrice})" 
      class="text-red-600 font-bold text-lg">❌</button>
  `;

  totalBillNumber += plantPrice;
  totalBill.innerText = totalBillNumber;

  addToCartContainer.appendChild(div);
};

const cancelOrder = (cartItemId, plantPrice) => {
  const totalBill = document.getElementById("total-Bill");
  let totalBillNumber = parseFloat(totalBill.innerText);

  // Remove the item from DOM
  const cartItem = document.getElementById(cartItemId);
  if (cartItem) {
    cartItem.remove();
  }

  // Update total bill
  totalBillNumber -= plantPrice;
  if (totalBillNumber < 0) totalBillNumber = 0;
  totalBill.innerText = totalBillNumber;
};
