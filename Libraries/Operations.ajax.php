<?php
session_start();

/* REQUIRES */
$ajax=true;
require_once '../../config/init.php';
require_once INCLUDES.'Localization.php';
require_once INCLUDES.'TemplateManager.php';
require_once INCLUDES.'Auth.php';
require_once INCLUDES.'Contents.php';

/* INITS */
$L->IDE_SetLanguage();
$Auth = new Auth();
$Auth->init();
$C = new Contents();

$out=['result'=>-1,'message'=>''];

if($Auth->isConnected()) {
    
    // LOAD the needed operation script
    if(file_exists(INCLUDES.'Operations/op_'.addslashes($_POST['action']).'.php')){
        include(INCLUDES.'Operations/op_'.addslashes($_POST['action']).'.php');
    }
    // Or throw an error
    else {
        $out['result']='error';
        $out['message']='fail (features doesn\'t exists)';
    }
} else {
    $out['result']='error';
    $out['message']='disconnected';
}

if($out['result']==-1){
    $out['result']='error';
    $out['message']='fail';
}

if( !isset($_POST['manage']) || intval($_POST['manage'])==1 ){
    echo json_encode($out);
}
?>