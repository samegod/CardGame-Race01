'use strict';

var socket

let cards=[
	['assets/images/ant-man.png', 2, 4, 2, 'Ant Man'],
	['assets/images/black-cat.png', 1, 1, 2, 'Black Cat'],
	['assets/images/black-panther.png', 3, 2, 3, 'Black Panther'],
	['assets/images/black-widow.png', 4, 2, 4, 'Black Widow'],
	['assets/images/captain-america.png', 2, 6, 3, 'Captain America'],
	['assets/images/captain-marvel.png', 1, 5, 4, 'Captain Marvel'],
	['assets/images/cosmo.png', 5, 1, 1, 'Cosmo'],
	['assets/images/doctor-strange.png', 5, 7, 4, 'Doctor Strange'],
	['assets/images/drax.png', 4, 4, 2, 'Drax'],
	['assets/images/falcon.png', 5, 3, 2, 'Falcon'],
	['assets/images/gamora.png', 6, 1, 3, 'Gamora'],
	['assets/images/groot.png', 4, 2, 3, 'Groot'],
	['assets/images/hawkeye.png', 5, 1, 3, 'Hawkeye'],
	['assets/images/hulk.png', 2, 4, 5, 'Hulk'],
	['assets/images/iron-man.png', 6, 1, 4, 'Iron Man'],
	['assets/images/lockjaw.png', 4, 1, 2, 'Lockjaw'],
	['assets/images/loki.png', 4, 1, 2, 'Loki'],
	['assets/images/mantis.png', 5, 1, 4, 'Mantis'],
	['assets/images/maria-hill.png', 5, 2, 2, 'Maria Hill'],
	['assets/images/nick-fury.png', 4, 1, 2, 'Nick Fury'],
]

let PlayerAttack = true;
let mana = 10;
let enmana = 10;
let friends = [];
let enemies = [];
let array_cards=[];
let items;
let USER;
let ENEMY;
let Timer;
let timer;
let seconds = 30 // Получаем секунды
let enCards = 5;
let plCards = 5;

//---------------Data management----------

Timer = document.getElementById("timer");

function DropStats() {
	for (let i = 0; i < friends.length; i++) {
		if (friends[i].classList.contains("choise")) 
			friends[i].classList.toggle("choise");
	}
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].classList.contains("fear"))
			enemies[i].classList.toggle("fear");
	}
}

function user_data(type, name,mana,hp){
    let user=document.getElementById(type);
    let user_mana = document.createElement("div")
    user_mana.classList.add("user_mana");
    let mananode = document.createTextNode(mana+'/10');
    user_mana.appendChild(mananode);
    let img_container = document.createElement("div")
    img_container.classList.add("user_img");
    let img = new Image();
    img.src = 'assets/images/tippy-toe.png';
    img.setAttribute('id', type + "_img");
    img_container.append(img);
    let user_name = document.createElement("div")
    user_name.classList.add("user_name");
    let namenode = document.createTextNode(name);
    user_name.appendChild(namenode);
    let user_hp = document.createElement("div")
    user_hp.classList.add("user_hp");
    let user_hpnode = document.createTextNode(hp);
    user_hp.appendChild(user_hpnode);
    let user_card = document.createElement("div");
    user_card.classList.add("user_card");
    user_card.appendChild(user_mana);
    user_card.appendChild(img_container);
    user_card.appendChild(user_name);
    user_card.appendChild(user_hp);
    user.appendChild(user_card);

    if (type == "user") {
        USER = user_card;
    }
    if (type == "enemy") {
        ENEMY = user_card;
    }
}

function ChangColor() {
    if (PlayerAttack) {
        document.getElementById("user_img").style.border = "green solid 15px";
        document.getElementById("enemy_img").style.border = "black solid 15px";
    }else {
        document.getElementById("user_img").style.border = "black solid 15px";
        document.getElementById("enemy_img").style.border = "green solid 15px";
    }
}

function NextStep() {
    PlayerAttack = !PlayerAttack;
    enmana = 10;
    for (var i = 0; i < ENEMY.childNodes.length; i++) {
        if (ENEMY.childNodes[i].className == "user_mana") {
          let notes = ENEMY.childNodes[i];
          notes.innerHTML = "10/10";
        }     
   
    }
    
    seconds = 30;
    clearInterval(timer);
    timer = setInterval(function () {
        // Условие если время закончилось то...
        ChangColor();
        if (seconds <= 0) {
            NextStepSend();
        } else { 
            Timer.innerHTML = seconds;
        }
        --seconds; // Уменьшаем таймер
    }, 1000)
}

function NextStepSend() {
    mana = 10;
    if (PlayerAttack) {
        PlayerAttack = !PlayerAttack;
        socket.send("NextStep");
    
        for (var i = 0; i < USER.childNodes.length; i++) {
            if (USER.childNodes[i].className == "user_mana") {
              let notes = USER.childNodes[i];
              notes.innerHTML = "10/10";
              break;
            }        
        }
    
        for (let i = 0; i < 5; i++) {
            friends[i].canAttack = true;
        }
    }
    seconds = 30;
    clearInterval(timer);
    timer = setInterval(function () {
        
        ChangColor();
        Timer.innerHTML = seconds;
        
        --seconds; // Уменьшаем таймер
        console.log(seconds);
    }, 1000)

    DropStats();
}

timer = setInterval(function () {
    // Условие если время закончилось то...
    if (seconds <= 0) {
        clearInterval(timer);
        NextStepSend();
    } else { 
        Timer.innerHTML = seconds;
    }
    console.log(seconds);
    --seconds; // Уменьшаем таймер
}, 1000)

function ChangeHP(id, hp) {
    for (var i = 0; i < items[id].childNodes.length; i++) {
        if (items[id].childNodes[i].className == "hp") {
          let notes = items[id].childNodes[i];
          notes.innerHTML = hp;
          break;
        }        
    }
}

function SetCardsEn(i) {
	console.log(i)
        var card = document.createElement("div")
        card.classList.add("card");
        card.classList.add("bl");
        let mana = document.createElement("div")
        mana.classList.add("mana");
        let mananode = document.createTextNode(cards[i][1]);
        mana.appendChild(mananode);
        let img_container = document.createElement("div")
        img_container.classList.add("card_img");
        let img = new Image();
        img.src = cards[i][0];
        img_container.append(img);
        let name = document.createElement("div")
        name.classList.add("name");
        let namenode = document.createTextNode(cards[i][4]);
        name.appendChild(namenode);
        let attack = document.createElement("div")
        attack.classList.add("attack");
        let attacknode = document.createTextNode(cards[i][3]);
        attack.appendChild(attacknode);
        let hp = document.createElement("div")
        hp.classList.add("hp");
        let hpnode = document.createTextNode(cards[i][2]);
        hp.appendChild(hpnode);
        card.appendChild(mana);
        card.appendChild(img_container);
        card.appendChild(name);
        card.appendChild(attack);
        card.appendChild(hp);

		let card_container = document.getElementById("enemy_cards");
        console.log(card_container)
        card_container.appendChild(card);
}

function SetCardsFr(i) {
	console.log(i)
        var card = document.createElement("div")
        card.classList.add("card");
        card.classList.add("bl");
        card.classList.add("friend");
        let mana = document.createElement("div")
        mana.classList.add("mana");
        let mananode = document.createTextNode(cards[i][1]);
        mana.appendChild(mananode);
        let img_container = document.createElement("div")
        img_container.classList.add("card_img");
        let img = new Image();
        img.src = cards[i][0];
        img_container.append(img);
        let name = document.createElement("div")
        name.classList.add("name");
        let namenode = document.createTextNode(cards[i][4]);
        name.appendChild(namenode);
        let attack = document.createElement("div")
        attack.classList.add("attack");
        let attacknode = document.createTextNode(cards[i][3]);
        attack.appendChild(attacknode);
        let hp = document.createElement("div")
        hp.classList.add("hp");
        let hpnode = document.createTextNode(cards[i][2]);
        hp.appendChild(hpnode);
        card.appendChild(mana);
        card.appendChild(img_container);
        card.appendChild(name);
        card.appendChild(attack);
        card.appendChild(hp);

		let card_container = document.getElementById("user_cards");
        console.log(card_container)
        card_container.appendChild(card);
}

function ToArrays(item) {
	if (item.classList.contains("friend")) {
		item.friend = true;
		friends.push(item);
	}else {
		enemies.push(item);
	}
}

function AddData(item, id) {
	item.friend = false;
	item.canAttack = true;
    item.id = id;

    for (var i = 0; i < items[id].childNodes.length; i++) {
        if (items[id].childNodes[i].className == "hp") {
          let notes = items[id].childNodes[i];
          item.health = notes.innerHTML;
        }   
        if (items[id].childNodes[i].className == "mana") {
          let notes = items[id].childNodes[i];
          item.mana = notes.innerHTML;
        }   
        if (items[id].childNodes[i].className == "attack") {
            let notes = items[id].childNodes[i];
            item.damage = notes.innerHTML;
        }      
    }
}

function GetDamage(item) {
	let killer = GetChosen();
	if (mana >= friends[killer].mana) {
		mana -= friends[killer].mana;
		console.log(friends[killer]);
		item.health -= friends[killer].damage
		
        ChangeHP(item.id, item.health);

		

		friends[killer].canAttack = false;
        let mesg = "Hit " + friends[killer].id + ' ' + item.id;
        socket.send(mesg);

        if (item.health <= 0) {
			item.style.display = "none";
            enCards--;
            if (enCards == 0) {
                alert("YOU WIN!");
                socket.send("win")

                document.location.href  = 'main.php';
            }
        }

        for (var i = 0; i < USER.childNodes.length; i++) {
            if (USER.childNodes[i].className == "user_mana") {
              let notes = USER.childNodes[i];
              notes.innerHTML = mana + "/10";
              break;
            }        
        }
	}
}

function SetClick() {
    items = document.getElementsByClassName("bl");

    for (let i = 0; i < items.length; i++) {
        AddData(items[i], i);
        ToArrays(items[i]);
    }

    for (let i = 0; i < friends.length; i++) {
        friends[i].addEventListener('mousedown', (event) => {
            console.log(PlayerAttack);
            if (PlayerAttack) {
                if (friends[i].classList.contains("choise")) {
                    DropStats();
                }else {
                    if (friends[i].canAttack) {
                        DropStats();
                        friends[i].classList.toggle("choise");
                        AttackStart();
                    }
                }
            }
        });
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].addEventListener('mousedown', (event) => {
            if (enemies[i].classList.contains("fear")) {
                GetDamage(enemies[i]);
                DropStats();
            }
        });
    }
}

//---------------On click-------------------

//-------------------Private functions-------------------- 

function GetChosen() {
	for (let i = 0; i < friends.length; i++) {
		if (friends[i].classList.contains("choise")) 
			return i;
	}
	return 0;
}

//----------------Visual--------------------------



function AttackStart() {
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].classList.toggle("fear");
	}
}

function GotHit(one, two) {
    let killer = parseInt(one, 10) - 5;
    let getter = parseInt(two, 10) + 5;

    console.log("HIT" + killer + "   " + getter); 
	console.log(items[killer]);
	items[getter].health -= items[killer].damage
		
    ChangeHP(getter, items[getter].health);

	if (items[getter].health <= 0) {

		items[getter].style.display = "none";
        plCards--;
        if (plCards == 0) {
            alert("YOU LOSE!");
            socket.send("win")

            document.location.href  = 'main.php';

        }
    }
        
    enmana = enmana - items[killer].mana;
    for (var i = 0; i < ENEMY.childNodes.length; i++) {
        if (ENEMY.childNodes[i].className == "user_mana") {
            let notes = ENEMY.childNodes[i];
            notes.innerHTML = enmana + "/10";
            break;
        }        
    }
}

function battle_game() {
    var str=document.cookie;
    let arr=str.split(';');
    let login=null;
    for(let i =0; i<arr.length; i++){
       let temp = arr[i].split('=');
       if(temp[0]=="login"){
        login=temp[1];
        break;
       }
    }
    // socket.send('login '+arr[2]);
    // alert("Searching battle...");
    socket.send('battle '+login);
}

function log() {
	var str=document.cookie;
    let arr=str.split(';');
    let login=null;
    for(let i =0; i<arr.length; i++){
       let temp = arr[i].split('=');
       if(temp[0]=="login"){
        login=temp[1];
        break;
       }
    }
    // socket.send('login '+arr[2]);
    // alert("Searching battle...");
    socket.send('conn '+login);
}

//-----------------Connection------------------

window.addEventListener('DOMContentLoaded', function () {
    var ip='10.11.9.7:7777'
    socket=socket = new WebSocket('ws://10.11.9.7:7777');
    var count=0
    var name_user1;//номер страницы
    // показать сообщение в #socket-info
    function showMessage(message) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(message));
        document.getElementById('socket-info').appendChild(div);
    }

        socket.onmessage = function (event) { // при получении данных от сервера
            showMessage('Получено сообщение от сервера: ' + event.data);
			let arr = event.data.split(' ');
			console.log(event.data);
            if(arr[0]=="UserName"){
                user_data("user", arr[1], 10, 2);
                user_data("enemy", arr[2], 10, 2);
            }
            if(arr[0] == 'SetFriend'){
                SetCardsFr(arr[1]);
            }
			if(arr[0] == 'SetEnemy'){
                SetCardsEn(arr[1]);
            }
            if (arr[0] == 'cardsout') {
                SetClick();
            }
            if (arr[0] == 'Hit') {
                console.log(arr);
                GotHit(arr[1], arr[2]) 
            }
            if (arr[0] == 'NextStep') {
                NextStep();
            }
           
        }
        socket.onopen = function () { // при установке соединения с сервером
            //showMessage('Соединение с сервером установлено');
			log();
            // socket.send('login '+document.cookie);

        }
        socket.onerror = function(error) { // если произошла какая-то ошибка
            showMessage('Произошла ошибка: ' + error.message);
        };
        socket.onclose = function(event) { // при закрытии соединения с сервером
            showMessage('Соединение с сервером закрыто');
            if (event.wasClean) {
                showMessage('Соединение закрыто чисто');
            } else {
                showMessage('Обрыв соединения'); // например, «убит» процесс сервера
            }
            showMessage('Код: ' + event.code + ', причина: ' + event.reason);
        };
    // };

});
