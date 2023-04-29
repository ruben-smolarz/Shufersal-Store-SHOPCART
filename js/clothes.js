if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

let total = 0;

function ready() {
    const removeCartItemButtons = document.getElementsByClassName('btn-danger');
    if (removeCartItemButtons.length > 0) {
        for (var i = 0; i < removeCartItemButtons.length; i++) {
            var button = removeCartItemButtons[i];
            button.addEventListener('click', removeCartItem);
        }
    }

    const quantityInputs = document.getElementsByClassName('cart-quantity-input');
    if (quantityInputs.length > 0) {
        for (var i = 0; i < quantityInputs.length; i++) {
            const input = quantityInputs[i];
            input.addEventListener('change', quantityChanged);
        }
    }

    const addToCartButtons = document.getElementsByClassName('shop-item-button');
    if (addToCartButtons.length > 0) {
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i];
            button.addEventListener('click', addToCartClicked);
        }
    }

    const purchaseButton = document.getElementsByClassName('btn-purchase')[0];
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked);
    }
}

document.addEventListener('DOMContentLoaded', ready);

function purchaseClicked() {
    alert(`Gracias por su compra y su monto total es $${total}`);
    const cartItems = document.querySelector('.cart-items');
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.closest('.shop-item');
    if (!shopItem) {
        throw new Error('No se encontró el elemento "shop-item"');
    }
    const title = shopItem.querySelector('.shop-item-title').innerText;
    const price = shopItem.querySelector('.shop-item-price').innerText;
    const imageSrc = shopItem.querySelector('.shop-item-image').src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.querySelector('.cart-items');
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (const cartItemName of cartItemNames) {
        if (cartItemName.innerText === title) {
            alert('Este artículo ya está agregado al carrito');
            return;
        }
    }
    const cartRowContents = `
      <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
      </div>
      <span class="cart-price cart-column">${price}</span>
      <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    total = 0
    for (const cartRowElement of cartRows) {
        const priceElement = cartRowElement.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRowElement.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total += price * quantity
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = `${total}$`
}
