<?php 
session_start();

error_reporting(E_ALL);
set_time_limit(0);
ob_implicit_flush();

require 'WebSocketServer.class.php';
$array_user=[];
$server = new WebSocketServer('10.11.9.7', 7777);
$array_buttle=[];
$_SESSION['arr_cards'] = [];
$_SESSION['generated'] = false;
$_SESSION['step'] = 0;
$_SESSION['room'];

// максимальное время работы 100 секунд, выводить сообщения в консоль
$server->settings(1000000, true);
function check_array($arr){
    $a=count($arr);
    print($a);
    if($a>=2){
        foreach ($arr as $key => $element) {
            unset($arr[$key]);
        }
    }
}

function Generate() {
    if (!$_SESSION['generated']) {
        for ($i = 0; $i < 10; $i++) {
            $_SESSION['arr_cards'][$i] = rand(0, 19);
        }
        print_r( $_SESSION['arr_cards']);
        $_SESSION['generated'] = true;
    }
}

// эта функция будет вызвана, когда получено сообщение от клиента
$server->handler = function($connect, $data,$array_server) {
    // полученные от клиента данные отправляем обратно
    
if($data){
    echo $data;
    $arr=explode(' ',$data); 
    // print_r($arr);
    
                    if($arr[0]=='login'){
            
                        $array_server->array_user[$arr[1]] = $connect;
                        // array_push($array_server->array_user,$arr[1]);
                        // else $array_server->array_user[0]=$arr[1];
                        echo("arr1\n");
                        print_r($array_server->array_user);
                        // if(array_count_values($array_server->array_user)>2){
                        //     foreach ($array_server->array_user as $key => $element) {
                        //         unset($array_server->array_user[$key]);
                        //     }
                        // }
                        echo"socket".$connect;
                        WebSocketServer::response($array_server->array_user[$arr[1]],'login');
                    }
                    if ($arr[0] == 'conn') {
                        $array_server->array_user[$arr[1]] = $connect;

                        $_SESSION['room'][count($_SESSION['room'])] = $connect;

                        echo("conn\n");
                        print_r($array_server->array_user);

                        $fst;
                        $snd;
                        $name_enemy=null;
                        foreach($array_server->array_user as $key=>$val){
                            if($key!=$arr[1]){
                                $name_enemy=$key;
                            }
                        }
                        $msg="UserName $arr[1] $name_enemy";
                        WebSocketServer::response($connect,$msg);
                        foreach ($array_server->array_user as $element) {
                            if ($fst == NULL) 
                                $fst = $element;
                            else
                                $snd = $element;
                        }
                        
                        Generate();
                        print_r( $_SESSION['arr_cards']);
                        echo $fst;
                        echo $snd;

                        if ($_SESSION['step'] < 2) {
                            for ($i = 0; $i < 5; $i++) {
                                $mesg1 = "SetFriend ". $_SESSION['arr_cards'][$i + 5 * $_SESSION['step']];
                                $oaoa;
                                WebSocketServer::response($connect,$mesg1);
                                if ($_SESSION['step'] == 0)
                                    $oaoa = 1;
                                else
                                    $oaoa = 0;

                                $mesg2 = "SetEnemy ". $_SESSION['arr_cards'][$i + 5 * $oaoa];
                                WebSocketServer::response($connect,$mesg2);
                            }

                            WebSocketServer::response($connect,'cardsout');
                        }
                        $_SESSION['step'] ++;

                        echo "ROOM COUNT ". count($_SESSION['room']);
                        if (count($_SESSION['room']) == 2) {
                            WebSocketServer::response($_SESSION['room'][rand(0,1)], "NextStep");
                        }
                    }
                    if($arr[0]=='battle'){  
                        $array_server->array_user[$arr[1]] = $connect;

                            // array_push($array_buttle,$connect);
                            $a=count($array_server->array_user);
                            echo $a;
                            $fst;
                            $snd;
                            if($a>=2){
                                 foreach ($array_server->array_user as $element) {
                                    echo "element".$element;
                                    echo $connect;
                                    if ($element == $connect)
                                        echo "\n ITSOK";
                                    else 
                                        echo "\n ITSNOTOK";
                                        
                                    if ($fst == NULL) 
                                        $fst = $element;
                                    else
                                        $snd = $element;
                                    WebSocketServer::response($element,"game_process");
                                    
                                }
                            }
                            // if($a>2){
                            //     $array_server->check_array();
                            // }
                           
                            // foreach ($array_buttle as $key => $element) {
                            //     unset($array_buttle[$key]);
                            // }
                            // check_array($array_server->array_user);
                            echo("arr2\n");
                            print_r($array_server->array_user);
                    }
                    if ($arr[0] == 'Hit') {

                        foreach ($array_server->array_user as $element) {
                            if ($element != $connect) {
                                WebSocketServer::response($element, "Hit $arr[1] $arr[2]");
                            }
                        }
                    } 
                    if ($arr[0] == "NextStep") {
                        foreach ($array_server->array_user as $element) {
                            if ($element != $connect) {
                                WebSocketServer::response($element, "NextStep");
                            }
                        }
                    }
                    if ($arr[0] == "win") {
                        foreach ($array_server->array_user as $key => $element) {
                            unset($array_server->array_user[$key]);

                        }
                        $_SESSION['step']=0;
                    }
                }
            };
$server->startServer();