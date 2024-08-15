let bagItems = []; // Initialize bagItems to avoid undefined errors
onLoad();


document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  
  onLoad();

  const bagElement = document.querySelector('#bag');
  console.log('bagElement:', bagElement); // Added logging for debugging
  if (bagElement) {
    bagElement.addEventListener('click', function() {
      console.log('bag clicked');
      window.location.href = './pages/bag.html'; // Ensure the path is correct
    });
  } else {
    console.error('Bag element not found');
  }
});

function onLoad() {
  console.log('onLoad called');
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  displayItemsOnHomePage();
  displayBagIcon();
}

function addToBag(itemId) {
  console.log(`Adding item ${itemId} to bag`);
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
}

function displayBagIcon() {
  console.log('displayBagIcon called');
  let bagItemCountElement = document.querySelector('.bag-item-count');
  console.log('bagItemCountElement:', bagItemCountElement); // Added logging for debugging
  if (bagItemCountElement) {
    if (bagItems.length > 0) {
      console.log('I am here');
      bagItemCountElement.style.visibility = 'visible';
      bagItemCountElement.innerText = bagItems.length;
    } else {
      bagItemCountElement.style.visibility = 'hidden';
    }
  } else {
    console.error('Bag item count element not found');
  }
}

function displayItemsOnHomePage() {
  console.log('displayItemsOnHomePage called');
  let itemsContainerElement = document.querySelector('.items-container');
  if (!itemsContainerElement) {
    console.error('Items container element not found');
    return;
  }
  let innerHtml = '';
  if (typeof items !== 'undefined' && items.length > 0) {
    items.forEach(item => {
      innerHtml += `
      <div class="item-container">
        <img class="item-image" src="${item.image}" alt="item image">
        <div class="rating">
            ${item.rating.stars} ⭐ | ${item.rating.count}
        </div>
        <div class="company-name">${item.company}</div>
        <div class="item-name">${item.item_name}</div>
        <div class="price">
            <span class="current-price">Rs ${item.current_price}</span>
            <span class="original-price">Rs ${item.original_price}</span>
            <span class="discount">(${item.discount_percentage}% OFF)</span>
        </div>
        <button class="btn-add-bag" onclick="addToBag(${item.id})">Add to Bag</button>
      </div>`;
    });
    itemsContainerElement.innerHTML = innerHtml;
  } else {
    console.error('Items are not defined or empty');
  }
}
