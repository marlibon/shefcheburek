export class Product {
  constructor(item, selector, handleProductClick, handleAddCart, base) {
    this._item = item; // объект с данными продукта
    this._templateSelector = "#template-" + selector; // селектор шаблона
    this._selectorProduct = selector; // селектор для типа продукта (product или productPopular)
    this._handleProductClick = handleProductClick; // функция обработки клика
    this._handleAddCart = handleAddCart;
    this._base = base;
    this._addListenerRenderContentPopup = this._renderContentPopup.bind(this);
    this._sumSupplements = 0;
    this._addCart = this._addCart.bind(this);
  }

  /* ГЕНЕРАЦИЯ ДЛЯ ОСНОВНОЙ СТРАНИЦЫ */
  _getTemplate () {
    const templateElement = document
      .querySelector(this._templateSelector)
      .content.cloneNode(true);
    return templateElement;
  }

  _generateElement () {
    this._elementId = this._element.querySelector("[data-id]"); // id
    this._elementImg = this._element.querySelector(
      `.${this._selectorProduct}__img`
    ); // картинка
    this._elementTitle = this._element.querySelector(
      `.${this._selectorProduct}__title`
    ); // заголовок
    this._elementDescription = this._element.querySelector(
      `.${this._selectorProduct}__description`
    ); // описание
    this._elementPrice = this._element.querySelector(
      `.${this._selectorProduct}__price`
    ); // цена

    this._elementId.setAttribute("title", this._item.title);
    this._elementImg.src = this._item.img;
    this._elementImg.alt = `${this._item.type} ${this._item.title} - ${this._item.description} `;

    if (this._item.description && this._elementDescription) {
      this._elementDescription.textContent = this._item.description;
      this._elementDescription.classList.add('page_visibility');
    }
    this._elementTitle.textContent = this._item.title;
    this._elementPrice.textContent = `${this._getMinCost(this._item, true)} ₽`;
  }

  _getMinCost (product, prefix) {
    // функция проверяет продукт на наличие вложенных свойств и вычисляет самую минимальную цену
    this._arrCost = [];
    if (product.properties) {
      Object.keys(product.properties).forEach((item) => {
        this._arrCost.push(product.properties[item].cost);
      });
      const text = prefix ? "от " : "";
      return `${text}${Math.min(...this._arrCost)}`;
    } else {
      return product.cost;
    }
  }

  _getMinWeight (product) {
    // функция проверяет продукт на наличие вложенных свойств и выдыает мин вес
    this._arrWeight = [];
    if (product.properties) {
      Object.keys(product.properties).forEach((item) => {
        this._arrWeight.push(product.properties[item].weight);
      });
      return this._arrWeight[0];
    } else {
      return product.weight;
    }
  }

  _setEventListeners () {
    this._elementId.addEventListener("click", () => {
      this._createValuesForPopup();
      this._handleProductClick(this);
    });
  }

  renderCard () {
    this._element = this._getTemplate();
    this._generateElement();
    this._setEventListeners();
    return this._element;
  }

  /* ГЕНЕРАЦИЯ КОНТЕНТА ДЛЯ ПОПАПА */

  _renderContentPopup = () => {
    this._selectedProducts = {}; // подготовленные (выбранные товары) для добавления в корзину
    let { id, img, title, description, cost, type, weight, properties } =
      this._item;
    let valueProperties;
    if (weight) weight = `${weight}`;
    this._quontity = Number(this._popupQuantityInput.value);

    if (properties) {
      valueProperties =
        document.forms.properties.elements.properties.value;
      weight = `${properties[valueProperties].weight} (${properties[valueProperties].name})`;
      cost = properties[valueProperties].cost;
    }
    this._popupImg.src = img;
    this._popupImg.alt = description;
    this._popupImgMob.src = img;
    this._popupImgMob.alt = description;
    this._popupTitle.textContent = title;
    description
      ? this._popupDescription.textContent = description
      : this._popupDescription.textContent = '';
    this._popupWeight.textContent = weight;
    cost = (+cost + +this._sumSupplements) * this._quontity;
    this._nameSupplements = this._nameSupplements === undefined ? "" : this._nameSupplements;
    weight = weight + this._nameSupplements;
    this._popupAddCard.textContent = `Добавить в корзину за ${cost}₽`;
    this._selectedProducts = { id, img, title, description, cost, type, weight, quantity: this._quontity };
  };


  _createFormProperties () {
    this._formChangeProperties.classList.add('page_visibility');
    this._formChangeProperties.innerHTML = "";
    Object.keys(this._item.properties).forEach((item, id) => {
      let checked = "";
      id == 1 && (checked = "checked");
      const element = `
      <label
      for="${item}"
      class="input-radio_label"
      >
      <input
        type="radio"
        name="properties"
        id="${item}"
        class="input-radio_radio"
        value="${item}"
        ${checked}
      />
      <span class="input-radio_text">${this._item.properties[item].name}</span>
      </label>
    `;
      this._formChangeProperties.innerHTML += element;
    });
  }
  _createSupplements () {
    this._addedSupplements = [];
    if (this._item['supplements']) {
      this._supplementsContainer.closest('.popup-product__container').classList.add('popup-product__container_mobile');
      this._supplements = this._base.filter((obj) => obj.type === this._item['supplements']);
      this._titleSupplements = document.createElement('h3');
      this._titleSupplements.className = "product__title";
      this._titleSupplements.innerText = "Вкусные добавки:";
      this._titleSupplements = this._supplementsContainer.parentNode.insertBefore(this._titleSupplements, this._supplementsContainer);

      this._supplements.forEach((item) => {
        const cost = this._getMinCost(item);
        const li = document.createElement('li');
        li.className = "supplement";

        const img = document.createElement('img');
        img.className = "supplement__img";
        img.src = item.img;
        img.alt = item.title;
        li.append(img);
        const title = document.createElement('h3');
        title.innerText = item.title;
        title.className = "supplement__title";
        li.append(title);
        const price = document.createElement('p');
        price.innerText = cost + 'р.';
        price.className = "supplement__price";
        li.append(price);
        console.log(item);
        console.log(item.properties);
        const supplement = {
          title: item.title,
          cost: this._getMinCost(item) + 'р.',
          weight: this._getMinWeight(item),
        };
        li.addEventListener("click", () => {
          li.classList.toggle("supplement_active");
          this._addedSupplements.includes(supplement) ? this._addedSupplements.splice(this._addedSupplements.indexOf(supplement), 1) : this._addedSupplements.push(supplement);
          if (this._addedSupplements.length == 0) {
            this._nameSupplements = "";
            this._sumSupplements = 0;
          } else {
            this._sumSupplements = this._addedSupplements.reduce((acc, item) => acc + parseInt(item.cost, 10), 0);
            this._nameSupplements = this._addedSupplements.reduce((acc, item) => acc + item.title + ' ' + item.weight + "; ", ". Добавки: ");
          }
          this._renderContentPopup();

        });

        this._supplementsContainer.append(li);


      });

    }
    else {
      this._supplementsContainer.closest('.popup-product__container').classList.remove('popup-product__container_mobile');

    }
  }
  _addCart (evt) {
    this._handleAddCart(evt, this._selectedProducts, this);
    this._renderContentPopup();
    this._popupQuantityMinus.disabled = 'disabled';
  }

  _plusQuontity = (evt) => {
    evt.preventDefault();
    ++this._popupQuantityInput.value;
    this._popupQuantityMinus.disabled = '';
    this._renderContentPopup();

  };
  _minusQuontity = (evt) => {
    evt.preventDefault();
    --this._popupQuantityInput.value;
    this._popupQuantityInput.value >= 2
      ? this._popupQuantityMinus.disabled = ''
      : this._popupQuantityMinus.disabled = 'disabled';
    this._renderContentPopup();

  };


  removeListeners () {
    this._popupAddCard.removeEventListener('click', this._addCart);
    this._popupQuantityMinus.removeEventListener('click', this._minusQuontity);
    this._popupQuantityPlus.removeEventListener('click', this._plusQuontity);
    this._formChangeProperties.removeEventListener("change", this._addListenerRenderContentPopup);

    // очистка
    this._addedSupplements = [];
    this._supplementsContainer.innerHTML = "";
    this._nameSupplements = "";
    this._sumSupplements = 0;
    this._titleSupplements?.remove();
  }

  _createValuesForPopup = () => {
    // поиск элементов
    this._popupContainer = document.querySelector(".popup-product__container");
    this._popupImg = this._popupContainer.querySelector(".popup-product__img");
    this._popupImgMob = this._popupContainer.querySelector(".popup-product__img-mob");
    this._popupTitle = this._popupContainer.querySelector(
      ".popup-product__title"
    );
    this._popupWeight = this._popupContainer.querySelector(
      ".popup-product__weight"
    );
    this._popupDescription = this._popupContainer.querySelector(
      ".popup-product__opisanie"
    );
    this._formChangeProperties = this._popupContainer.querySelector(
      ".input-radio"
    );
    this._formInputQuontity = this._popupContainer.querySelector(
      ".popup-product__quantity"
    );
    this._supplementsContainer = this._popupContainer.querySelector(".popup-product__supplements");
    this._popupAddCard = this._popupContainer.querySelector(
      ".popup-product__add-cart"
    );
    this._popupQuantityMinus = this._formInputQuontity.querySelector(
      ".quantity__btn_minus"
    );
    this._popupQuantityPlus = this._formInputQuontity.querySelector(
      ".quantity__btn_plus"
    );
    this._popupQuantityInput = this._formInputQuontity.querySelector(
      ".quantity__input"
    );
    this._quontity = Number(this._popupQuantityInput.value);

    this._formInputQuontity.reset();
    this._popupQuantityMinus.disabled = 'disabled'; // обнуляем счетчик и дизейблим кнопку

    //проверка на наличие свойств properties
    if (this._item.properties) {
      this._createFormProperties();
      this._formChangeProperties.addEventListener("change", this._addListenerRenderContentPopup);
      this._formChangeProperties.classList.add('page_visibility');
    } else {
      this._formChangeProperties.classList.remove('page_visibility');
    }

    // установка слушателя на кнопку добавления в корзину
    this._popupAddCard.addEventListener('click', this._addCart);
    // установка слушателя на редактирование количества
    this._popupQuantityMinus.addEventListener('click', this._minusQuontity);
    this._popupQuantityPlus.addEventListener('click', this._plusQuontity);

    this._renderContentPopup();
    this._createSupplements();


  };
  addToCart (cart) {
    cart.addProduct(this);
  }

}
