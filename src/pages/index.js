/*
TODO
1. переписать замечания с телеги
2. исправить замечания
3. вынести обращение к серверу в отдельный класс
4. переписать renderable чтобы не было много экземпляров
5. автоматическая подгрузка контента для компьютерной версии
6. сокращенная версия для мобил (показать еще)
7. раздел контакты - может попап?
8. раздел про доставку и оплату
9. отзывы?
10. промо раздел?
11. раздел заказы
12. при добавлении в корзину анимация
13. фича увеличения картинки при наведении - зум


*/


// импорт стилей для вебпака
import "./index.css";

import {
  nameCompany,
  selectorProduct,
  selectorProductPopular,
  titleFilteredProducts,
  containerProductPopular,
  containerFilteredProducts,
  containerProduct,
  selectorPopupProduct,
  selectorPopupMessage,
  selectorPopupCart,
  selectorPopupOrder,
  selectorPopupOrderCompleted,
  selectorPopupOrderNonCompleted,
  selectorButtonCart,
  buttonsCartQuontity,
  buttonsCatalog,
  buttonGoCatalog,
  buttonGoCart,
  buttonCloseMessagePopup,
  buttonGoOrder,
  buttonBackCart,

} from "../utils/const.js";
import { base } from "../utils/data.js";
import { Product } from "../components/Product.js";
import { Slider } from "../components/Slider.js";
import { Popup } from "../components/Popup.js";
import { Renderable } from "../components/Renderable.js";
import { Cart } from "../components/Cart.js";
import { Order } from "../components/Order.js";
import { FormValidator, configValidator } from "../components/FormValidator.js";
import { Api } from "../components/Api.js";

// функция создания карточки продукта
// item - объект с данными, templateSelector - селектор шаблона, который надо использовать как образец, popularSelector - селектор продукта, в зависимости от места вставки
const createCard = (item, selector) => {
  const newElement = new Product(item, selector, handleProductClick, handleAddCart, base);
  return newElement.renderCard();
};

const generateArrayCard = (array) => {
  return array.map((item) => createCard(item, selectorProduct));
};

// функция обработки клика по карточке продукта (открытие попапа)
const handleProductClick = (that) => {
  productPopup.open(that);
};

// фукнция обработки добавления товара в корзину
const handleAddCart = (evt, item, that) => {
  cart.addItem(item);
  cart.renderCartQuantity();
  productPopup.close();
  that.removeListeners();
  messagePopup.open();
};


/*
1 объявл функцию (названиеКатегории, количество)
фильтруем
*/
const containterProductRenderable = new Renderable(
  {},
  containerProduct
);

const viewFirstProducts = (filterCategory, count) => {
  const div = document.createElement('div');
  div.className = "products__items";

  const title = document.createElement('h2');
  title.innerText = filterCategory;
  title.className = "products__title";
  title.id = filterCategory;
  div.append(title);
  const filterProductsCategory = base.filter((obj) => obj.type === filterCategory); // фильтруем
  function render (array) {
    generateArrayCard(array).forEach((item) => div.append(item));
  }
  render(filterProductsCategory.splice(0, count));
  containterProductRenderable.addItem(div);

  if (filterProductsCategory.length > 0) {
    const button = document.createElement('button');
    button.className = "product__button";
    button.style = "display: inline-block";
    button.innerText = `показать еще (${filterProductsCategory.length})`;
    //div.append(button);

    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      render(filterProductsCategory);
      //title.scrollIntoView({ block: "start", inline: "start", behavior: "smooth" });
      button.remove();
    });
    containterProductRenderable.addItem(button);
  }

};
let countProducts;
if (window.innerWidth > 1190) { countProducts = 4; }
else if (window.innerWidth > 900) { countProducts = 3; }
else if (window.innerWidth > 400) { countProducts = 2; }
else { countProducts = 3; }

viewFirstProducts('Чебуреки с мясом', countProducts);
viewFirstProducts('Миничебуреки 5шт.', countProducts);
viewFirstProducts('Чебуреки с картофелем', countProducts);
viewFirstProducts('Чебуреки с сыром', countProducts);
viewFirstProducts('Сладкие чебуреки', countProducts);
viewFirstProducts('Снеки', countProducts);
viewFirstProducts('Пельмени, вареники', countProducts);
viewFirstProducts('Горячие напитки', countProducts);
viewFirstProducts('Холодные напитки', countProducts);


// ЧАСТО ЗАКАЗЫВАЮТ: создание экземпляра Renderable - вставка текста в контейнер. Внутри - процесс генерации карточек
const filterProductPopular = base.filter((obj) => obj.often === true); // фильтруем только объекты c популярными товарами

const productPopular = new Renderable(
  {
    items: filterProductPopular,
    renderer: (item) => {
      const newCard = createCard(item, selectorProductPopular);
      productPopular.addItem(newCard);
    },
  },
  containerProductPopular
);
productPopular.renderItems(); // запуск генерации

// создание экземпляра Слайдер и его включение
const slider = new Slider();
slider.enable();

// создание экземпляра попапа для продукта
const productPopup = new Popup(selectorPopupProduct);

// создание экземпляра попапа для корзины
const cartPopup = new Popup(selectorPopupCart);

// создание экземпляра попапа для подтверждения
const messagePopup = new Popup(selectorPopupMessage);

// создание экземпляра попапа для оформления заказа
const orderPopup = new Popup(selectorPopupOrder);

// создание экземпляра попапа успешное оформление заказа
const orderCompleted = new Popup(selectorPopupOrderCompleted);

// создание экземпляра попапа ошибка при оформлении заказа
const orderNonCompleted = new Popup(selectorPopupOrderNonCompleted);
//временное уведомление на странице, что заказы не принимаются

// создание корзины
const cart = new Cart('#template-cart', buttonsCartQuontity);
cart.renderCartQuantity();

// закрытие любого попапа
const closeAllPopup = () => {
  document.querySelector(".popup_opened")?.classlist.remove('.popup_opened');
};
// открытие попапа корзины
const handleClickCart = (evt) => {
  evt.preventDefault();
  cart.renderCart();
  cartPopup.open();
};


// создание экземпляра подключения к серверу телеграмма
const api = new Api({
  headers: {
    "Content-Type": "application/json",
  },
});


//обработка текста для телеграмм

const textForTelegram = (data, number) => {
  //получили текущую дату и время
  const currentDate = new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
  data["date"] = currentDate;

  let contentOrder = `новый заказ ${number} с ${window.location.host} (${currentDate}):%0A%0A`;
  data.data.forEach((item, i) => contentOrder += `${++i}) ${item.title}(${item.weight}): ${item.cost}₽ х ${item.quantity}шт. = ${item.quantity * item.cost}₽%0A`);
  contentOrder += `%0A`;
  Object.keys(data).forEach((item) => {
    item == 'data' || item == 'countCost' || item == 'date'
      ? ""
      : contentOrder += `${item}: ${data[item]} %0A`;
  });

  return contentOrder;
};

const handlerSubmitOrder = (data) => {
  api.sendBackendOrder(data)
    .then(res => {
      console.log(res);
      const contentForTelegram = textForTelegram(data, res);
      api.sendTelegram(contentForTelegram)
        .then((res) => {
          if (!res) {
            return Promise.reject(`Ошибка получения данных`);
          } else {
            orderPopup.close();
            orderCompleted.open();
            cart.clearCart();
          }
        })
        .catch((err) => {
          orderNonCompleted.open();
          console.log(err);
        });
    })
    .catch(error => console.error('Произошла ошибка', error));



};
const order = new Order({ refreshValidation: () => { orderUserBlock.refresh(); address.refresh(); }, handlerSubmitOrder });
order.enable();


/* ВАЛИДАЦИЯ*/
const orderUserBlock = new FormValidator(configValidator, document.querySelector('.form_user-block'));
orderUserBlock.enableValidation();

const address = new FormValidator(configValidator, document.querySelector('.address'));
address.enableValidation();


buttonsCatalog.forEach((item) => {
  item.addEventListener('click', (evt) => {
    evt.preventDefault();

    const type = item.getAttribute('data-type');
    titleFilteredProducts.textContent = type;
    const filter = base.filter((obj) => obj.type === type); // фильтруем только объекты

    // вот тут надо доработать класс Render чтобы не создавался каждый раз новый экземпляр
    const catalog = new Renderable(
      {
        items: filter,
        renderer: (item) => {
          const newCard = createCard(item, selectorProduct);
          catalog.addItem(newCard);
        },
      },
      containerFilteredProducts
    );
    catalog.renderItems(); // запуск генерации

    titleFilteredProducts.scrollIntoView({ block: "start", inline: "start", behavior: "smooth" });

  });
});
//отслеживание клика по кнопке каталог
// buttonGoCatalog.addEventListener('click', (evt) => {
//   evt.preventDefault();
//   closeAllPopup();
//   scrollTo(0,0);
// })
// отслеживание клика по корзине
buttonsCartQuontity.forEach((item) => {
  item.parentNode.addEventListener('click', handleClickCart);
});

buttonGoCart.addEventListener('click', (evt) => {
  evt.preventDefault();
  messagePopup.close();
  cart.renderCart();
  cartPopup.open();
});

buttonCloseMessagePopup.addEventListener('click', (evt) => {
  evt.preventDefault();
  messagePopup.close();
});

buttonGoOrder.addEventListener('click', (evt) => {
  evt.preventDefault();
  order.importData(cart.exportData(), cart.countCost());
  order.putDataLastOrder();
  cartPopup.close();
  orderPopup.open();
});

buttonBackCart.addEventListener('click', (evt) => {
  evt.preventDefault();
  orderPopup.close();
  cart.renderCart();
  cartPopup.open();
})


/*
//функция отслеживания состояния открытых окон
window.addEventListener('hashchange', hashchange);

function hashchange(){
  let hash = location.hash;

  hash == '' && document.querySelectorAll('.popup_opened')?.forEach((item) => {
    item.classList.remove('popup_opened');})
  hash === '#popup-cart' && cartPopup.open();
  hash === '#popup-order' && orderPopup.open();
 if (hash.indexOf('product') ) {
  const filterId = base[hash.split('=')[1]]; // фильтруем только объекты с пиццей
  const card = new Product(filterId, selectorProduct, handleProductClick, handleAddCart);
  card._createValuesForPopup();

  productPopup.open(card);
 }
}
*/
/* do something
вытащить id продукта
сделать экземпляр карточки
 открыть попап карточки*/
