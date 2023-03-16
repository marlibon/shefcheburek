export class Cart {
  constructor(templateSelector, buttonsCartQuontity) {
    this._templateSelector = templateSelector;
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this._cart = document.querySelector(".cart");
    this._cartTitle = this._cart.querySelector(".cart__title");
    this._cartTable = this._cart.querySelector(".cart__table");
    this._totalPrice = document.querySelector(".cart__total-price");

    this.buttonsCartQuontity = buttonsCartQuontity;
    this._cartTableLineMain = this._cart.querySelector(".cart__line_main"); // заголовок таблицы
    this._cartTableLineTotal = this._cart.querySelector(".cart__line_total"); //итоговая строчка
    this._cartEmptyImg = this._cart.querySelector('.cart__empty');
    // this.removeItem = this.removeItem.bind(this);
    this.remove = this.removeItem.bind(this);
  }

  // добавление товара в корзину
  addItem(item) {
    let existingItem = this.items.find(
      (i) => i.id === item.id && i.weight === item.weight
    );
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.saveToLocalStorage();
    this.renderCart();
  }

  // удаление товара из корзины
  removeItem = (productJson, evt) => {
    this.items = this.items.filter(
      (item) => JSON.stringify(item) != productJson
    );
    //evt.target.closest("tr").remove();
    this.saveToLocalStorage();
    this.renderCartQuantity();
    this.renderCart();
  };
  // очистка корзины
  clearCart = () => {
    this.items = [];
    this.totalPrice = 0;
    this.saveToLocalStorage();
    this.renderCartQuantity();
    this.renderCart();
  };
  // подсчет количества товаров в корзине
  countQuantity() {
    let quantity = 0;
    this.items.forEach((item) => {
      quantity += item.quantity;
    });
    return quantity;
  }

  // Подсчет общей стоимости товаров в корзине
  countCost() {
    let cost = 0;
    this.items.forEach((item) => {
      cost += item.cost * item.quantity;
    });
    return cost;
  }

  // Сохранение корзины в LocalStorage
  saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  // установка слушателей
  setEventListenersClearTable() {
    //this._cartTable.addEventListener("click", this.handleClickTableCart);
    this._cart
      .querySelector(".cart__clear-btn")
      .addEventListener("click", this.clearCart);
  }
  _setEventListenersQuontityAndTrashButtons = () => {
    // изменение количества товара
    this._cartProductQuantityPlus.addEventListener("click", (evt) => {
      ++this.items[evt.currentTarget.id].quantity;
      this.saveToLocalStorage();
      this.renderCartQuantity();
      this.renderCart();
    });
    this._cartProductQuantityMinus.addEventListener("click", (evt) => {
      --this.items[evt.currentTarget.id].quantity;
      this.saveToLocalStorage();
      this.renderCartQuantity();
      this.renderCart();
    });

    // удаление товара из списка
    this._cartProductTrashButton.addEventListener("click", (evt) => {
      this.items.splice([evt.currentTarget.id], 1)
      this.saveToLocalStorage();
      this.renderCartQuantity();
      this.renderCart();
    });
  };
  //
  handleClickTableCart = (evt) => {
    this.removeItem(evt.target.getAttribute("data-obj"), evt);
  };

  _getTemplate() {
    const templateElement = document
      .querySelector(this._templateSelector)
      .content.cloneNode(true);
    return templateElement;
  }

  // генерация таблицы корзины
  renderCart = () => {
    this._cartTable.innerHTML = ""; // очистили старый контент
    if (this.countCost()) {
      this._cartCost = this._cartTableLineTotal.querySelector(
        ".cart__product-text_big"
      ); // общая стоимость

      this._cartCost.textContent = `${this.countCost()} ₽`;
      this._cartTitle.classList.add("page_visibility");
      this._cartEmptyImg.classList.remove("page_visibility");
      this._cartTableLineMain.classList.add("cart__line_visible");

      //this._cartTable.append(this._cartTableLineMain);

      this.items.forEach((item, id) => {
        const { img, title, cost, quantity, weight } = item;
        this._cartTableLineProduct = this._getTemplate();
        this._cartProductImg =
          this._cartTableLineProduct.querySelector(".cart__product-img");
        this._cartProductTitle = this._cartTableLineProduct.querySelector(
          ".cart__product-title"
        );
        this._cartProductWeight = this._cartTableLineProduct.querySelector(
          ".cart__product-weight"
        );
        this._cartProductPrice = this._cartTableLineProduct.querySelector(
          ".cart__product-text_price"
        );
        this._cartProductQuantityInput =
          this._cartTableLineProduct.querySelector(".quantity__input");
        this._cartProductQuantityPlus =
          this._cartTableLineProduct.querySelector(".quantity__btn_plus");
        this._cartProductQuantityMinus =
          this._cartTableLineProduct.querySelector(".quantity__btn_minus");
        this._cartProductCost = this._cartTableLineProduct.querySelector(
          ".cart__product-text_cost"
        );
        this._cartProductTrashButton = this._cartTableLineProduct.querySelector(
          ".cart__product-trash"
        );

        this._cartProductImg.src = img;
        this._cartProductImg.alt = title;
        this._cartProductTitle.textContent = title;
        this._cartProductWeight.textContent = weight;
        this._cartProductPrice.textContent = cost;
        this._cartProductQuantityInput.value = quantity;
        this._cartProductQuantityPlus.id = id;
        if (quantity <= 1) {
          this._cartProductQuantityMinus.disabled = "disabled";
        }
        this._cartProductQuantityMinus.id = id;
        this._cartProductTrashButton.id = id;
        this._cartProductCost.textContent = cost * quantity;
        this._setEventListenersQuontityAndTrashButtons();
        this._cartTable.append(this._cartTableLineProduct);
      });
      //this._cartTable.append(this._cartTableLineTotal);
      this._cartTableLineTotal.classList.add("cart__line_visible");

      this.setEventListenersClearTable();
    } else {
      this._cartTitle.classList.remove("page_visibility");
      this._cartEmptyImg.classList.add("page_visibility");
      this._cartTableLineMain.classList.remove("cart__line_visible");
      this._cartTableLineTotal.classList.remove("cart__line_visible");
    }
  };
  renderCartQuantity() {
    this._count = this.countQuantity();
    this.buttonsCartQuontity.forEach((item) => {
      if (this._count) {
        item.parentNode.classList.add("header__cart_active");
        item.textContent = this.countQuantity();
        item.classList.add("page_visibility");
      } else {
        item.parentNode.classList.remove("header__cart_active");
        item.classList.remove("page_visibility");
      }
    
    
    
    })
    
  }
  exportData() {
    return this.items;
  }
}
