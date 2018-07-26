//const API_KEY = 'fd58e48d';
const API_KEY = '62864a3a'; // это мой ключ
const URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const form = document.forms.search_form;
const idCards = document.getElementById("search-watch");

let radioName;
let value;
let like = [];

if (localStorage.getItem('bgColor') !== null) {
    let bgColor = localStorage.getItem('bgColor');
    document.getElementsByTagName('body')[0].style.background = bgColor;
}

let whoClick = document.querySelectorAll('.bgColorBtn');
whoClick.forEach(function (element) {
    element.addEventListener('click', function (event) { // тут слушаем событие клика мыши на кнопку с классом bgColorBtn
        document.getElementsByTagName('body')[0].style.background = element.id;
        localStorage.setItem('bgColor', element.id);

        if (element.id == 'killLS') {
            localStorage.clear();
        }

        if (element.id == 'like') {

            let list = like.map((elem) =>
                `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${elem.Poster}" alt="Card image cap">
            <div class="card-body">
                <span class="badge badge-warning">${elem.Type}</span>
                <h5 class="card-title">${elem.Title}</h5>
                <p class="card-text"> Year ${elem.Year}</p>
                <a href="https://www.imdb.com/title/${elem.imdbID}" class="btn btn-primary">IMDB PLEASE</a>

                <i class="fas fa-heart" ></i> 

            </div>
        </div>
        `
            ).join('');

            idCards.innerHTML = `${list}`; // выводим кино добавленное в избранное

        }



    })
})

form.addEventListener('submit', (event) => {
    event.preventDefault();
    value = form.nameTitle.value.trim(); // тут записали то что ввел чукча
    radioName = form.radioNameCircle.value; // тут записали значения выбранного кружочка

    if (!value) {
        form.nameTitle.classList.add('error');
        setVisibility(form.querySelector('.error-message'), true);

    } else {

        if (localStorage.getItem(value + radioName) !== null) {
            let data = [];
            data.Search = JSON.parse(localStorage.getItem(value + radioName));
            generateResultCards(data);
        } else {
            fetch(`${URL}&s=${value}`) // ДОМА `http://www.omdbapi.com/?apikey=fd58e48d&i=tt0094712`;
                .then(responseIgor => responseIgor.json())
                .then(generateResultCards);

            form.nameTitle.classList.remove('error');
            setVisibility(form.querySelector('.error-message'), false);
        }

    }
});

function setVisibility(element, isError) {
    isError ?
        element.classList.add('visible1') :
        element.classList.remove('visible');
}

function generateResultCards(data) {

    let list = data.Search.filter(elem => (radioName == 'all' || radioName == elem.Type)).map((elem, i) =>
        `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${elem.Poster}" alt="Card image cap">
            <div class="card-body">
                <span class="badge badge-warning">${elem.Type}</span>
                <h5 class="card-title">${elem.Title}</h5>
                <p class="card-text"> Year ${elem.Year}</p>
                <a href="https://www.imdb.com/title/${elem.imdbID}" class="btn btn-primary">IMDB PLEASE</a>

                <i data-index="${i}" class="fas fa-heart" ></i> 

            </div>
        </div>
        `
    ).join('');

    let searchLS = JSON.stringify(data.Search.filter(elem => (radioName == 'all' || radioName == elem.Type)));
    localStorage.setItem(value + radioName, searchLS);

    idCards.innerHTML = `${list}`;



    document.querySelector('.cards').addEventListener('click', function (elem) { 
        
        // почему при первом поиске в карточке клик СЕРДЕЧКУ вызывает одну сработку, при втором поиске 2 сработки, при третем 3 сработки и результат лайка по сердцу НОМЕР 8, 
        // пушит в лайкМассив 8-ой НОМЕР из 1 2 и 3 поиска... WTF... замыкания замкнули замок? 

        if (elem.target.tagName == 'I') {

            console.log(data.Search[elem.target.getAttribute('data-index')]);

            like.push(data.Search[elem.target.getAttribute('data-index')]);
            //console.log(like);
        }
    }, true);

}