import Inputmask from "inputmask";
export class Order {
    constructor({ refreshValidation, handlerSubmitOrder }) {
        this._refreshValidation = refreshValidation;
        this._handlerSubmitOrder = handlerSubmitOrder;
        this._lastOrder = JSON.parse(localStorage.getItem("lastOrder")) || {};
        this.data = {};
        this._order = document.querySelector('.order');

        this._userBlock = this._order.querySelector('.form_user-block');
        this._formUserBlock = document.forms["form_user-block"];
        //this._btnBackCart = this._userBlock.querySelector('.form_go-cart'); // кнопка вернуться в корзину
        this._name = this._formUserBlock.elements.name; // имя
        this._phone = this._formUserBlock.elements.phone; // телефон
        this._phoneValidation = this._formUserBlock.elements.phoneValid; // для проверки валидации телефона
        this._btnGoDelivery = this._formUserBlock.form__submit; // кнопка далее про доставку

        this._deliveryBlock = this._order.querySelector('.form_delivery-block');
        this._btnBackUserBlock = this._deliveryBlock.querySelector('.form_go-user-block'); // кнопка вернуться в блок Имя/телефон
        this._formSposob = document.forms["sposob"].elements.sposob; // способ доставки/самовывоз
        this._blockFilial = this._deliveryBlock.querySelector('.form_delivery-block_filial'); // описание вопроса "филиал"
        this._filial = document.forms.filial.elements.filial; // выбор филиала
        this._address = document.forms.address.elements.address; //
        this._btnGoConfirm = document.forms.address.form__submit;

        this._confirmBlock = this._order.querySelector('.form_confirm-block');
        this._btnBackDeliveryBlock = this._confirmBlock.querySelector('.form_go-user-block'); // кнопка вернуться в блок доставки
        this._tableConfirmOrder = this._confirmBlock.querySelector('.order__table'); // таблица с данными заполненными
        this._comment = this._confirmBlock.querySelector('.form__input_comment'); // поле комментарий
        this._btnFinalOrder = this._confirmBlock.querySelector('.form__submit'); // завершить оформление заказа

    }
    putDataLastOrder () {
        if (Object.keys(this._lastOrder).length !== 0) {
            this._name.value = this._lastOrder["Имя"];
            this._phone.value = this._lastOrder["Телефон"];
            this._phoneValidation.value = this._lastOrder["Телефон"];
            this._formSposob.value = this._lastOrder["Способ доставки"];
            console.log(this._formSposob.value);
            if (this._lastOrder["Способ доставки"] === 'самовывоз') {
                this._viewBlock(this._blockFilial);
                this._hideBlock(this._address.parentNode);
                this._address.minLength = 0;
                this._address.required = "";
                this._filial.value = this._lastOrder["Филиал"];
                this._refreshValidation();
            } else if (this._lastOrder["Способ доставки"] === 'доставка') {
                this._hideBlock(this._blockFilial);
                this._viewBlock(this._address.parentNode);
                this._address.value = this._lastOrder["Адрес"];
            } else {
                this._hideBlock(this._address.parentNode);
                this._hideBlock(this._blockFilial);
            }
            this._refreshValidation();
        }
    }
    _validateTelNumber = (maska) => {
        Inputmask({
            mask: '+7 (999) 999-99-99',
            "oncomplete": () => {
                this._phoneValidation.value = this._phone.value.replace(/\D/g, '');
                this._refreshValidation();
            },
            "onincomplete": () => {
                this._phoneValidation.value = "";
                this._refreshValidation();
            }
        },).mask(this._phone);
    };
    resetForm () {
        this._hideBlock(this._deliveryBlock);
        this._hideBlock(this._confirmBlock);
        this._viewBlock(this._userBlock);
    }
    _setListener () {
        this._btnGoDelivery.addEventListener('click', (evt) => {
            evt.PreventDefault;
            this._hideBlock(this._userBlock);
            this._viewBlock(this._deliveryBlock); ``;
        });

        this._btnBackUserBlock.addEventListener('click', (evt) => {
            evt.PreventDefault;
            this._hideBlock(this._deliveryBlock);
            this._viewBlock(this._userBlock);
        });

        this._btnGoConfirm.addEventListener('click', (evt) => {
            evt.PreventDefault;
            this._hideBlock(this._deliveryBlock);
            this._viewBlock(this._confirmBlock);
            this._putConfirmData();
        });

        this._btnBackDeliveryBlock.addEventListener('click', (evt) => {
            evt.PreventDefault;
            this._hideBlock(this._confirmBlock);
            this._viewBlock(this._deliveryBlock);
        });

        document.forms["sposob"].addEventListener('change', () => {
            if (this._formSposob.value === 'самовывоз') {
                this._viewBlock(this._blockFilial);
                this._hideBlock(this._address.parentNode);
                this._address.minLength = 0;
                this._address.required = "";
                this._refreshValidation();
            } else {
                this._hideBlock(this._blockFilial);
                this._viewBlock(this._address.parentNode);
                this._address.minLength = 8;
                this._address.required = "required";
                this._refreshValidation();
            }
        });
        this._btnFinalOrder.addEventListener("click", (evt) => {
            evt.preventDefault();
            this._btnFinalOrder.textContent = "Отправка...";
            this.data["Комментарий"] = this._comment.value;
            this._handlerSubmitOrder(this.data);
            this._saveToLocalStorage();

            setTimeout(() => {
                this.data["Комментарий"] = "";
                this._hideBlock(this._confirmBlock);
                this._viewBlock(this._userBlock);
                this._btnFinalOrder.textContent = "Оформить заказ";
            }, 3000);
        });
    }
    enable () {
        this._validateTelNumber();
        this._setListener("+7(999)999-9999");
    }

    _saveToLocalStorage () {
        localStorage.setItem("lastOrder", JSON.stringify(this.data));
    }

    _hideBlock (block) {
        block.style.display = "none";
    }

    _viewBlock (block) {
        block.style.display = "block";
    }
    _deliveryCost () {
        if (this.data['countCost'] >= 700 && this.data["Способ доставки"] == 'доставка') {
            this._deliveryCostRub = 0;
            return 'доставка бесплатная';
        } else if (this.data['countCost'] < 700 && this.data["Способ доставки"] == 'доставка') {
            this._deliveryCostRub = 100;
            return '100 ₽';
        }
        else {
            this._deliveryCostRub = 0;
            return 'самовывоз - 0 ₽';
        }


    }

    _sumQuantity () {
        console.log(this.data['data']);
        return this.data['data'].reduce((sum, item) => item.quantity + sum, 0)
    }
    _putConfirmData () {
        this.data["Имя"] = this._name.value;
        this.data["Телефон"] = this._phone.value;
        this.data["Способ доставки"] = this._formSposob.value;
        this.data["Адрес"] = this.data["Способ доставки"] === 'самовывоз' ? this._filial.value : this._address.value;
        this.data["Заказ"] = `${this._sumQuantity()} шт. за ${this.data['countCost']} ₽`;
        this.data["Стоимость доставки"] = this._deliveryCost();
        this.data["Всего к оплате"] = (this.data['countCost'] + this._deliveryCostRub) + ' ₽';

        this._confirmData = `
        <li class="order__item">Имя: ${this.data["Имя"]}</li>
        <li class="order__item">Телефон: ${this.data["Телефон"]}</li>
        <li class="order__item">Заказ: ${this.data["Заказ"]}</li>
        <li class="order__item">Способ доставки: ${this.data["Способ доставки"]}</li>
        <li class="order__item">Адрес: ${this.data["Адрес"]}</li>
        <li class="order__item">Стоимость доставки: ${this.data["Стоимость доставки"]}</li>
        <li class="order__item">Всего к оплате: ${this.data["Всего к оплате"]}</li>
        `;
        this._tableConfirmOrder.innerHTML = this._confirmData;

    }
    importData (data, countCost) {
        this.data['data'] = data;
        this.data['countCost'] = countCost;

    }
}
/*
надо передать 2 функции на ордер
1 при переходе в оформление заказа, чтобы передались актуальные данные с корзины
2. после завершения корзины открылось еще одно модальное окно об успешном выполнении и очистке корзины
3. создать АПИ, которое отправит заказ в телегу, и результат об успешности будет показаан клиенту только после реальной отправки - фетч промисы
*/