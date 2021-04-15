<?php session_start();?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="styles/style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="socket.js" type="text/javascript" defer></script>
    <!-- <script src="socket.js" type="text/javascript"></script> -->
    <title>Card Game</title>
</head>
<body>
<div class="bg-image"></div>
    <div class="game">
        <p>Card game</p>
        <form method="post" active="">
            <input type="text" name="login" placeholder="Login" id='login' class="login"><br>
            <input type="button" value="Game" name="go_game" id="go_game" onclick="login_game()" class="go_game" >
        </form>
    </div>
        <div id="socket-info"></div>
</body>
</html>
