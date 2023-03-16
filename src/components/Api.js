import { TOKEN_BACKEND_ORDERS } from "../utils/const";
export class Api {
  constructor(options) {
    this._headers = options.headers;
    // это корректный для шефчебурек. а ниже это питстоп this._serverTelegram = "https://api.telegram.org/bot6128124968:AAEsrI21MpH-C_0qSfrF4eDOcMEBrst3WYQ/sendMessage?chat_id=-1001857657187&parse_mode=html"
    //this._serverTelegram = "https://api.telegram.org/bot5506734715:AAGYKstSIFt0GGWmthQ8_ScDOqHnQmAbVtU/sendMessage?chat_id=-1001698638520&parse_mode=html";
    this._urlBackServerForTelegram = "https://shefcheburek.ru/back/sendMessageTelegram.php"
  }

  sendTelegram = (message) => {
    return fetch(this._urlBackServerForTelegram, {
      method: 'POST',
      body: JSON.stringify({message}),
      headers: {
        "Content-Type": "application/json",
        'Authorization': TOKEN_BACKEND_ORDERS
      },
    })
      .then(data => data.json());

  };


  sendBackendOrder (data) {
    return fetch('https://shefcheburek.ru/back/saveOrder.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${TOKEN_BACKEND_ORDERS}`
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else if (response.status === 401) {
          console.error('Ошибка авторизации');
        } else {
          console.error('Произошла ошибка');
        }
      })

  }
  getBackendOrders (query) {
    fetch(`https://shefcheburek.ru/back/getData.php?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TOKEN_BACKEND_ORDERS,
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  search (searchField, searchQuery) {
    fetch(`https://shefcheburek.ru/back/search.php?query=${searchQuery}&field=${searchField}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TOKEN_BACKEND_ORDERS,
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));

  }

  _getResponseData = res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}