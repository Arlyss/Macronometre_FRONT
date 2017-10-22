<?php
session_start();

$ajax=true;
require_once '../../config/init.php';

require_once LIBRARIES.'content.class.php';
$C = new Content();

// If SQL is needed
if($_POST['sql']==true){
	require_once LIBRARIES.'SQL.class.php';
	$SQL = new SQLManager();
}

// Default JSON output
$ouput=['success'=>false];

// Reaction depending on action
switch($_POST['action']){

	case'IncrementValidatedBadgesAmount':
		$validated = $C->Increment_ValidatedBadges();
		if($validated==1){
			$ouput['success']=true;
		}else{
			$ouput['success']=true;
			$ouput['message']='session created';
		}
	break;

	case'GetValidatedBadges':
		$badgesAmount = $C->Get_ValidatedBadges();
		$validatedBadges = $C->Get_MyValidatedBadges();
		if($badgesAmount!=null){
			$ouput['success']=true;
        	$ouput['amount']=$badgesAmount;
        	$ouput['validatedBadges']=$validatedBadges;
		}else{
			$ouput['success']=false;
			$ouput['amount']=0;
        	$ouput['message']='SQL error';
		}
	break;

	case'CallCollection':
		$collection = $C->GetCollection($_POST['scheme'],$_POST['page']);
        if($collection!=null){
        	foreach($collection as &$mesure){
        		$validated=false;
        		$badges = $C->GetBadgesOfMesure($mesure['MES_ID']);
        		if($badges!=null){
        			$mesure['BADGES']=$badges;
        			foreach($badges as $badge){
	        			if($badge['B_STATUS']==1){
	        				$validated=true;
	        				break;
	        			}
	        		}
        		} else {
        			$mesure['BADGES']=null;
        		}
        		$mesure['VALIDATED']=$validated;
        	}
        	$ouput['success']=true;
        	$ouput['mesures']=$collection;
        }else{
        	$ouput['success']=false;
        	$ouput['message']='SQL error';
        }
	break;

	case'ResetSession':
		$C->ResetSession();
		$ouput['success']=true;
	break;

}

// Ouputs the ouput
header("Content-type: text/json; Charset: UTF-8");
echo json_encode($ouput);
?>