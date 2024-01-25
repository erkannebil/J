import { getData, cardOlustur } from './index.js';

getData().then((response) => {
  document.querySelector('.cards').append(cardOlustur(response));
});
