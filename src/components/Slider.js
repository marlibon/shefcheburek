export class Slider {
    constructor() {
        this._slider = document.querySelector('.product-popular__slider'); //
        this._container = this._slider.querySelector('.product-popular__container'); //
        this._items = this._container.querySelectorAll('.product-popular__item'); //
        this._buttonNext = this._slider.querySelector('.product-popular__slider-button-next');
        this._buttonPrev = this._slider.querySelector('.product-popular__slider-button-prev');
        this._widthItem = this._items.length > 0 && Math.floor(this._items[0].getBoundingClientRect().width); // фактическ ширину дива item
        this._countItem = 0;
    }

    enable () {
        this._setEventListeners();
    }

    _setEventListeners () {
        this._buttonNext.addEventListener('click', this._countNext);
        this._buttonPrev.addEventListener('click', this._countPrev);
    }

    _countNext = (evt) => {
        evt.preventDefault();
        this._countItem++;
        this._quantityItemsUntilEnd = Math.floor(this._container.getBoundingClientRect().width / this._widthItem) - 1;
        if (this._countItem == this._items.length - this._quantityItemsUntilEnd) this._countItem = 0;
        this._scroll(this._countItem);
    };

    _countPrev = (evt) => {
        evt.preventDefault();
        this._countItem--;
        if (this._countItem < 0) this._countItem = this._items.length;
        this._scroll(this._countItem);
    };

    _scroll = (itemArray) => {
        this._items[itemArray].scrollIntoView({ block: "nearest", inline: "start", behavior: "smooth" });
        this._handleConditionBtnPrev();
    };

    _handleConditionBtnPrev = () => {
        this._countItem == 0
            ? this._buttonPrev.style.display = "none"
            : this._buttonPrev.style.display = "flex";
    };
}