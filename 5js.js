//const API_KEY = 'fd58e48d';
const API_KEY = '62864a3a'; // это мой ключ
const URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const form = document.forms.search_form;
const idCards = document.getElementById("search-watch");

let radioName;
let value;
let like = [];

let globalArr = [];

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

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            globalArr = like.slice();

            let list = like.map((elem, i) =>
                `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${elem.Poster}" alt="Card image cap">
            <div class="card-body">
                <span class="badge badge-warning">${elem.Type}</span>
                <h5 class="card-title">${elem.Title}</h5>
                <p class="card-text"> Year ${elem.Year}</p>
                <a href="https://www.imdb.com/title/${elem.imdbID}" class="btn btn-primary">IMDB PLEASE</a>

                <i data-index="${i}" data-imdbid="${elem.imdbID}"  class="fas fa-heart redHeart" ></i> 

            </div>
        </div>
        `
            ).join('');

            idCards.innerHTML = `${list}`; // выводим кино добавленное в избранное


            for (let Jindex = 0; Jindex < globalArr.length; Jindex++) {

                for (let index = 0; index < like.length; index++) {

                    //console.log(like[index].imdbID);

                    if (like[index].imdbID == globalArr[Jindex].imdbID) {

                        document.querySelectorAll('.fas.fa-heart')[Jindex].classList.add('redHeart');

                    }
                }

            }



            console.log('вывел из локалСторедж');



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

    globalArr = data.Search.slice();



    let list = data.Search.filter(elem => (radioName == 'all' || radioName == elem.Type)).map((elem, i) =>
        `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${elem.Poster}" alt="Card image cap">
            <div class="card-body">
                <span class="badge badge-warning">${elem.Type}</span>
                <h5 class="card-title">${elem.Title}</h5>
                <p class="card-text"> Year ${elem.Year}</p>
                <a href="https://www.imdb.com/title/${elem.imdbID}" class="btn btn-primary">IMDB PLEASE</a>

                <i data-index="${i}" data-imdbid="${elem.imdbID}" class="fas fa-heart" ></i> 

            </div>
        </div>
        `
    ).join('');

    let searchLS = JSON.stringify(data.Search.filter(elem => (radioName == 'all' || radioName == elem.Type)));
    localStorage.setItem(value + radioName, searchLS);

    // тут надо понять - есть ли НА ВЫДАЧУ лайкнутые




    ////////////////////

    idCards.innerHTML = `${list}`;
    //console.dir(globalArr);

    for (let Jindex = 0; Jindex < globalArr.length; Jindex++) {

        for (let index = 0; index < like.length; index++) {

            //console.log(like[index].imdbID);

            if (like[index].imdbID == globalArr[Jindex].imdbID) {

                document.querySelectorAll('.fas.fa-heart')[Jindex].classList.add('redHeart');

            }
        }

    }

    console.log('сделал поиск');

    ///////////////
}


document.querySelector('.cards').addEventListener('click', elem => {

    if (elem.target.tagName == 'I') {


        if (document.querySelectorAll('.fas.fa-heart')[elem.target.getAttribute('data-index')].classList.item(2)) {

            document.querySelectorAll('.fas.fa-heart')[elem.target.getAttribute('data-index')].classList.remove('redHeart');
            // тут жаxнуть функцию сравнения не добавлен ли

            //like.splice(globalArr[elem.target.getAttribute('data-index')],1);

            //console.log(globalArr[elem.target.getAttribute('data-index')].imdbID);

            for (let index = 0; index < like.length; index++) {

                //console.log(like[index].imdbID);

                if (like[index].imdbID == globalArr[elem.target.getAttribute('data-index')].imdbID) {
                    console.dir(like[index].imdbID + ' = ' + globalArr[elem.target.getAttribute('data-index')].imdbID);
                    like.splice(index, 1);
                }
            }

            // console.log('**********************');


        } else {
            document.querySelectorAll('.fas.fa-heart')[elem.target.getAttribute('data-index')].classList.add('redHeart');
            like.push(globalArr[elem.target.getAttribute('data-index')]);
        }



        //console.log(document.querySelectorAll('.fas.fa-heart.redHeart')[elem.target.getAttribute('data-index')]);

        //console.log(like);


    }
}, true);