import '@testing-library/jest-dom/extend-expect';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { getData, cardOlustur } from './index.js';

let dom, container, getDataFuncStr, cardOlusturFuncStr;

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, './index.js'), 'utf8');
//comment;
beforeAll(async () => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  container = dom.window.document;

  /*  let scriptElement = dom.window.document.createElement('script');
  scriptElement.textContent = script;
  scriptElement.setAttribute('type', 'module');


  dom.window.document.head.appendChild(scriptElement); */
  let scriptElement = dom.window.document.createElement('script');
  scriptElement.textContent =
    cardOlustur.toString() +
    `document.querySelector(".cards").append(cardOlustur({"sorgu": "176.88.139.130","durum": "OK","kıta": "Asia","ülke": "Türkiye","ülkeKodu": "TR","ülkebayrağı": "https://apis.ergineer.com/ulkebayraklari/TR","bölge": "34","bölgeAdı": "Istanbul","şehir": "Istanbul","zip": "34096","enlem": 41.0145,"boylam": 28.9533,"saatdilimi": "Europe/Istanbul","parabirimi": "TRY","isp": "SUPERONLINE","organizasyon": "","as": "AS34984 Superonline Iletisim Hizmetleri A.S."}))`;
  dom.window.document.head.appendChild(scriptElement);

  await new Promise((resolve) => dom.window.addEventListener('load', resolve));
  getDataFuncStr = getData
    .toString()
    .replaceAll(' ', '')
    .replaceAll('\n', '')
    .toLowerCase();
  cardOlusturFuncStr = cardOlustur
    .toString()
    .replaceAll(' ', '')
    .replaceAll('\n', '')
    .toLowerCase();
});

test('Challenge 1.1: Axios isteğinde ip adresi ipAdresimiAl fonksiyonu ile dinamik alınıyor.', async () => {
  const result =
    getDataFuncStr.includes('awaitipadresimial') ||
    getDataFuncStr.includes('ipadresimial().then');
  expect(result).toBe(true);
});

test('Challenge 1.2: Axios ile ip adresi sorgusu doğru şekilde atılıyor ve doğru formatta bir obje dönüyor.', async () => {
  const data = await getData();

  expect(data).toHaveProperty('boylam');
  expect(data).toHaveProperty('enlem');
  expect(data).toHaveProperty('şehir');
});

test('Challenge 2.1: card oluştur fonksiyonuna div.card eklenmiş', async () => {
  expect(dom.window.document.querySelector('.cards').firstChild).toBe(
    dom.window.document.querySelector('.card')
  );
});

test('Challenge 2.2: div.card a child olarak ülke bayrağı doğru şekilde eklenmiş', async () => {
  const element = dom.window.document.querySelector('.card img');
  expect(element.src).toBe(
    'https://flaglog.com/codes/standardized-rectangle-120px/TR.png'
  );
});

test('Challenge 2.3: div.card içine div.card-info eklenmiş', async () => {
  const element = dom.window.document.querySelector(
    '.card>.card-info:nth-child(2)'
  );
  const expected = dom.window.document.querySelector('.card div.card-info');
  expect(element).not.toBeNull();
expect(element).toBe(expected);
});

test('Challenge 2.4: div.card-info içine ip adresi doğru şekilde, h3 tagi ile eklenmiş', async () => {
  const element = dom.window.document.querySelector('.card-info h3');
  expect(element.classList.contains('ip')).toBe(true);
  expect(element).toHaveTextContent('176.88.139.130');
});

test('Challenge 2.5: div.card-info içine ülke bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[0].classList.contains('ulke')).toBe(true);
  expect(elements[0]).toHaveTextContent('Türkiye (TR)');
});

test('Challenge 2.6: div.card-info içine enlem ve boylam bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[1]).toHaveTextContent('Enlem: 41.0145 Boylam:28.9533');
});

test('Challenge 2.7: div.card-info içine şehir bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[2]).toHaveTextContent('Şehir: Istanbul');
});

test('Challenge 2.8: div.card-info içine saat dilimi bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[3]).toHaveTextContent('Saat dilimi: Europe/Istanbul');
});

test('Challenge 2.9: div.card-info içine para birimi bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[4]).toHaveTextContent('Para birimi: TRY');
});

test('Challenge 2.10: div.card-info içine ISP(İnternet Servis Sağlayıcı) bilgisi doğru şekilde, p tagi ile doğru sırada eklenmiş', async () => {
  const elements = dom.window.document.querySelectorAll('.card-info p');
  expect(elements[5]).toHaveTextContent('ISP: SUPERONLINE');
});
