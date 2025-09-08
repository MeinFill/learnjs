'use strict'

let chleni = [];
const chlen_key = 'chlen_key'

function loadData() {
    const chleniStr = localStorage.getItem(chlen_key);
    const chleniArray = JSON.parse(chleniStr);
    if (Array.isArray(chleniArray)){
        chleni = chleniArray
    }
}

function saveData() {
    localStorage.setItem(chlen_key, JSON.stringify(chleni));
}

function render(activeChlenId = null){
    renderMenu(activeChlenId);
    for (const chlen of chleni){
            if (Number(activeChlenId) === chlen.id){
                renderHead(chlen);
                renderDays(chlen);
            }
        }
}

function renderMenu(activeChlenId = null) {
    for (const chlen of chleni){
        let existChlen = document.getElementById(`${chlen.id}`)

        if (!existChlen){
            let chlenButton = document.createElement('button');
            chlenButton.id = chlen.id;
            chlenButton.innerHTML = `<img src="/images/${chlen.img}.png" class="icon_left_panel"/>`;
            chlenButton.className = 'leftButton';
            chlenButton.onclick = eventClickPanelButton;

            document.querySelector('.leftPanelButton').appendChild(chlenButton);

            existChlen = chlenButton;
        }
        else{
            if (!chleni.find(chlen => chlen.id == existChlen.getAttribute('id'))){
                console.log('wefewfw');
                existChlen.remove();
            }
        }

        if (Number(activeChlenId) === chlen.id){
            existChlen.classList.add('chooseButton');
        }
        else {
            existChlen.classList.remove('chooseButton');
        }
    }
    document.querySelectorAll('.leftButton').forEach(button => {
        if (!chleni.find(chlen => chlen.id == button.getAttribute('id'))){
            button.remove();
        }
    });
    if (!chleni.find(chlen => chlen.id == activeChlenId)){
        document.querySelector('.main').innerHTML = `<div class="progress_main">
            <p class="name"></p>
            <button class="buttonDeleteChlen" onclick="deleteChlen()">Удалить писюн</button>
            <div class="progress">
                <div class="progress_text">
                    <p></p>
                    <p id="persent"></p>
                </div>
                <div id="white_bar"><div id="blue_bar"></div></div>
            </div>
        </div>
        <div class="comments"></div>`
    }
}

function renderHead (chlen) {
    document.querySelector('.name').innerText = `${chlen.name}`;
    document.getElementById('persent').innerText = `${chlen.days.length / chlen.target * 100}%`;
    document.getElementById('white_bar').classList.add('white_bar');
    document.getElementById('blue_bar').classList.add('blue_bar');
    document.getElementById('blue_bar').style.width = `${chlen.days.length / chlen.target * 100}%`;
    document.querySelector('.buttonDeleteChlen').classList.add('buttonDeleteChlenVisual');
}

function renderDays (chlen){
    document.querySelector('.comments').innerHTML = ''
    let num_of_day = 1;
    for (const day of chlen.days){
        const comment = document.createElement('div')
        comment.classList.add('comment');
        comment.innerHTML = `<div class="day">День ${num_of_day}</div>
                             <div class="commetText">
                                 <p>${day.comment}</p>
                                 <button dayIndex="${num_of_day - 1}" class="delete_button" onclick="deleteDay(event)"><img src="/images/Мусорка.png"/></div>
                             </div>`;
        num_of_day++;
        document.querySelector('.comments').appendChild(comment);
    }
    const comment = document.createElement('div')
    comment.classList.add('comment');
    comment.innerHTML = `<div class="day">День ${num_of_day}</div>
                         <form class="commetText" onsubmit="addDay(event)">
                             <input name="comment" class="comment_input" type="text" placeholder="Комментарий"></input>
                             <button class="create_comment_button" type='submit'>Готово</div>
                         </form>`;
    
    document.querySelector('.comments').appendChild(comment);
    document.querySelector('.comments').setAttribute('id', `${chlen.id}`);
}

function eventClickPanelButton(event){
    render(event.target.id);
}

function addDay(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const chlen = chleni.find(xuy => xuy.id == document.querySelector('.comments').getAttribute('id'));
    chlen.days.push({comment: `${data.get("comment")}`});
    render(document.querySelector('.comments').getAttribute('id'));
    saveData();
}

function deleteDay(event) {
    const chlen = chleni.find(xuy => xuy.id == document.querySelector('.comments').getAttribute('id'));
    chlen.days.splice(event.currentTarget.getAttribute("dayIndex"), 1);
    render(document.querySelector('.comments').getAttribute('id'));
    saveData();
}

function chooseIconNewChlen(event){
    if (document.querySelector('.chooseButtonAdd')){
        document.querySelector('.chooseButtonAdd').classList.remove('chooseButtonAdd');
    }
    event.target.classList.add('chooseButtonAdd');
}

function eventClickAdd(){
    render();
    document.querySelector('.addChlenPanel').classList.remove('kick');
}

function closePanel(){
    document.querySelectorAll('.addChlenInput').forEach(input => input.value = null);
    if (document.querySelector('.chooseButtonAdd')){
        document.querySelector('.chooseButtonAdd').classList.remove('chooseButtonAdd');
    }
    document.querySelector('.addChlenPanel').classList.add('kick');
}

function addChlenButton(event){
    event.preventDefault();
    const chlen = new FormData(event.target);
    if (chlen.get('name') && chlen.get('target')){
        if (document.querySelector('.chooseButtonAdd')){
            chleni.push({
                id: Number(chleni[chleni.length - 1].id + 1),
                img: `${document.querySelector('.chooseButtonAdd').getAttribute("name")}`,
                name: `${chlen.get('name')}`,
                target: Number(chlen.get('target')),
                days: []
            });
            saveData();
            render();
            closePanel();
        }
    }
}

function deleteChlen(){
    chleni = chleni.filter(chlen => chlen.id != document.querySelector('.comments').getAttribute('id'));
    render();
    saveData();
    loadData();
}

(() => {
    loadData();
    render();
})()