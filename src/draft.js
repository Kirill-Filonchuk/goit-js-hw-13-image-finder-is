import './sass/main.scss';
import '../node_modules/basiclightbox/src/styles/main.scss';
import '../node_modules/@pnotify/core/dist/BrightTheme.css';

import * as basicLightbox from '../node_modules/basiclightbox';

import getRefs from './js/refs';
import ApiServicePixabey from './js/apiService';
import photoCardMarkup from './templates/card.hbs';

import { alert, defaultModules, notice,  error, success} from '../node_modules/@pnotify/core/dist/PNotify.js';
  import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {dir1: 'top', firstpos1: 25});

 alert({
      text: 'Введи Ваш запрос',
       delay: 500,
 });

const apiServicePixabey = new ApiServicePixabey()

const refs = getRefs();

// ///////////// Modal window
let link = '';

refs.cardContainer.addEventListener('click', forModaWindow);

function forModaWindow(e) {
    e.preventDefault();
    
    if (e.target.nodeName !== "IMG")  return;
 
    let a = e.target.parentNode
    
    link=`<img src="${a.getAttribute('href')}" width="800" height="600">`
    const instance = basicLightbox.create(link)
    instance.show(link)
}

// ///////////// Modal window

refs.btnLoad.style.visibility = 'hidden';

//2 Закоментировал - активирован бесконечный скрол
refs.btnLoad.addEventListener('click', onLoadMore)

refs.searchForm.addEventListener('submit', sendSearch);

function sendSearch(e) {
    e.preventDefault();
    
    apiServicePixabey.resetPage();
 const inputData = e.currentTarget;
    apiServicePixabey.request = inputData.elements.query.value;
   
    if (apiServicePixabey.request === ' ' || apiServicePixabey.request === '' ) {
        return error({
  title: 'Ошибка',
    text: 'Вы напечатали пробел или вообще ничего не напечатали! Введите Ваш запрос',
  delay: 1000,
});
        
    }
    apiServicePixabey.getApiCards().then(photo => {
        clearPageOnNewSearch();
        renderPhotoGalery(photo);
        refs.btnLoad.style.visibility = 'visible';
    })
    
}
//3 Закоментировал - активирован бесконечный скрол
function onLoadMore() {
    apiServicePixabey.getApiCards()
        .then(renderPhotoGalery);
     
        //4 .then(() => apiServicePixabey.handleButtonClick())
        // .then(() => setTimeout(() => { apiServicePixabey.handleButtonClick() }, 700))
}
// Закоментировал - активирован бесконечный скрол
// Метод парсит указанную строку как HTML и добавляет результирующие узлы в указанное место DOM-дерева. Не делает повторный рендеринг для существующих элементов внутри элемента-родителя на котором используется
function renderPhotoGalery(photoFromApi) {
    refs.cardContainer.insertAdjacentHTML('beforeend', photoCardMarkup(photoFromApi))
    console.log(photoFromApi);
    if (photoFromApi.length === 0) {
        error({
  title: 'Ошибка',
    text: 'НЕТ КАРТИНОК',
  delay: 2000,
});
    } else {
        success({
  title: 'Супер!',
    text: 'Любуйтесь картинками',
  delay: 1000,
});
    }
}

function clearPageOnNewSearch() {
    refs.cardContainer.innerHTML = '';
}


////////////// infinity scrol

const options = {
    // root: null,
    rootMargin: '50px',
    threshold: 0.1
}

var intersectionObserver = new IntersectionObserver(function(entries) {
  // Если intersectionRatio равен 0, цель вне зоны видимости
  // и нам не нужно ничего делать
    if (entries[0].intersectionRatio <= 0) return;
    if (apiServicePixabey.request === ' ' || apiServicePixabey.request === '') {
        return
    }

//1     apiServicePixabey.resetPage();
//  apiServicePixabey.getApiCards()
//         .then(renderPhotoGalery)
    
   onLoadMore();
  console.log('Loaded new items');
},options);
// начать наблюдение
intersectionObserver.observe(refs.scrolObj);