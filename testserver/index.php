<?php
    if(isset($_GET['testget'])){
        echo '{"message":"ok","method":"get"}';
    }else if(isset($_POST['testpost'])){
        echo '{"message":"ok","method":"post"}';
    }else{
        echo '{"message":"err","method":"err"}';
    }
?>