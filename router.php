<?php

if ( $_POST['route'] == "saveSettings" ) {
    $module->saveSettings();
} 

else {
    header("HTTP/1.1 400 Bad Request");
    header('Content-Type: application/json; charset=UTF-8');    
    die( json_encode("This route does not exist.") );
}
?>