var socket
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
    alert("Searching battle...");
    socket.send('battle '+login);
    count=2
}
function login_game(){
    let cook=document.getElementById('login').value;
    
    // document.cookie("user=".document.getElementById('login').value);
    if(document.getElementById('login').value)
    socket.send('login '+document.getElementById('login').value);
    document.cookie='login= '+cook;
    console.log(document.cookie);
    count=1
}
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
        
        /*
         * четыре функции обратного вызова: одна при получении данных и три – при изменениях в состоянии соединения
         */
        socket.onmessage = function (event) { // при получении данных от сервера
            showMessage('Получено сообщение от сервера: ' + event.data);
            if(event.data=='login'){
                document.location.href  = 'game.html';
                // socket.send('login '+document.cookie);
            }
            // if (event.data='battle'){
            //     socket.send('login '+document.cookie);
            // }
            if(event.data=='game_process'){
                document.location.href  = 'game_process.html';

            }
        }
        socket.onopen = function () { // при установке соединения с сервером
            showMessage('Соединение с сервером установлено');
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