<?php

use ExternalModules\ExternalModules;

if( isset($_POST['prefix']) && $_POST['prefix']=="default_form_status" ) {
    $pid = $_POST['pid'];
    $prefix = $_POST['prefix'];
    $form = $_POST['form'];
    $note = $_POST['note'];
    $select = $_POST['select'];
    $hide = $_POST['hide'];

    $json = ExternalModules::getProjectSetting($prefix, $pid, 'json');
    $json = !empty($json) ? (array)json_decode($json) : [];
    $json[$form] = ["note"=>$note,"select"=>$select,"hide"=>$hide];
    ExternalModules::setProjectSetting($prefix, $pid, 'json', json_encode($json));
    
    echo "Saved default form status";
} else {
    echo "Unexpected post";
}

?>