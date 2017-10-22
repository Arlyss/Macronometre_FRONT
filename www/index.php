<?php
session_start();
$ajax=0;
require_once '../config/init.php';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="fr-FR">
	<head>
		<title>Macron-o-mètre</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<meta name="description" content="Notre président est venu sans programme? Décryptons-le quand même!" />
		<meta name="author" content="Un Insoumis" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="shortcut icon" href="./design/macronometre.ico" />
		<!-- CSS -->
		<link rel="stylesheet" href="./css/loading.css?r=<?=rand(0,9999)?>" />
		<link rel="stylesheet" href="./css/macronometre_desk.css?r=<?=rand(0,9999)?>" />
		<!-- JS -->
		<script src="./js/jquery-3.2.0.min.js"></script>
		<script src="./js/_loading.js"></script>
		<script src="./js/macronometre_2.class.js?r=<?=rand(0,9999)?>"></script>
		<script src="./js/macronometre_2.main.js?r=<?=rand(0,9999)?>"></script>
	</head>
	<body>

		<!-- TOP -->
		<div id="top">
		</div>

		<!-- MAIN AREA -->
		<div id="center">
		
			<!-- The Ground -->
			<div id="RealGround"></div>

			<!-- MACRON -->
			<div id="MACRON"></div>
			
			<!-- EMPTY SPACE -->
			<div id="emptySpace"></div>
			
			<!-- CONTENT -->
			<div id="content">
				
				<div id="mesures">
					<?php
					/*
					require_once('content.php');
					$m=1;
					foreach($M as $mesure){
						$validated=false;
						if( isset($mesure['BADGES']) ){
							foreach($mesure['BADGES'] as $badge){
								if($badge['VALIDATED']==true){
									$validated=true;
									break;
								}
							}
						}
						?>
						
						<div id="mesure_<?=$m?>" class="mesure <?= ($validated ? 'validated' : 'waiting' ) ?>">
							<div class="icon_box">
								<div class="rotateValidation"></div>
								<div class="icon ico_<?=$mesure['TYPE']?>"></div>
							</div>
							<div class="title"><?=$mesure['NAME']?></div>
							<div class="details">
								<div id="achievement_<?=$m?>" class="achievements">
									<?php
									$b=1;
									if( isset($mesure['BADGES']) ){
										foreach($mesure['BADGES'] as $badge){
											?><div id="badge_<?=$m.'_'.$b?>" class="badge <?= ($badge['VALIDATED'] ? 'validated' : 'waiting' ).' '.( isset($badge['LAEC_TEXT']) || isset($badge['LAEC_LINK']) ? '' : 'disabled') ?>">
												<div class="info_date">[<?=$badge['DATE']?>]</div>
												<div class="info_text"><?=$badge['TEXT']?></div>
												<div class="laec_title"><?= isset($badge['TEXT']) ? $badge['TEXT'] : ''?></div>
												<div class="laec_text"><?= isset($badge['LAEC_TEXT']) ? $badge['LAEC_TEXT'] : ''?></div>
												<div class="laec_link"><?= isset($badge['LAEC_LINK']) ? $badge['LAEC_LINK'] : ''?></div>
											</div><?php
											$b++;
										}
									}
									?>
								</div>
								<div class="details_quoteA">
									<div class="details_quoteB">
										<div class="details_text">
											<?=$mesure['TEXT']?>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<?php
						$m++;
					}*/
					?>
				</div>
				
			</div>
			
			<!-- MACRON HAND(S) -->
			<div id="handLeft"></div>
		</div>
		
		<div id="modal_screen" class="">
			<div class="modal_window">
				<div class="laec_title"></div>
				<div class="laec_text_label">Que nous propose l'avenir en commun ?</div>
				<div class="laec_text"></div>
				<div class="laec_link ico_laec">Voir les détails</div>
				<div class="modal_close">X</div>
			</div>
		</div>

		<!-- HEADER (FI) -->
		<div id="header">

			<!-- MENU CENTERED AREA -->
			<div class="center_menu">
				<!-- MENU -->
				<div id="userMenu">
					<div id="Schemes">
						<?php
							require_once LIBRARIES.'content.class.php';
							$C = new Content();
							$usedSchemes = $C->Get_UsedSchemes();
							foreach($usedSchemes as $scheme){
								echo '<div class="scheme ico_'.$scheme['T_TYPE_CODE'].'" rel="'.$scheme['T_ID'].'" title="'.$scheme['T_TYPE_CODE'].'">'.
										ucfirst(preg_replace('/(?!^)([[:upper:]][[:lower:]]+)/',' $0',$scheme['T_TYPE_NAME'])).' ('.$scheme['MCOUNT'].')'.
									 '</div>';
							}
						?>
						<div class="scheme allSchemes" rel="*">Tous</div>
					</div>
				</div>
				<!-- MENU BUTTON -->
				<div id="userMenuButton" class="ico_menuA">Choix du thème</div>
			</div>

			<!-- MAIN CENTERED AREA -->
			<div class="center">
				<!-- LOGO -->
				<div class="logo"></div>
				<!-- DISCORD -->
				<div class="discord">
					<div class="discord_line1">supporté par</div>
					<div class="discord_line2">Discord Insoumis</div>
				</div>
				<input type="button" value="DEBUG: reset session" style="position:absolute; top:20px; left:50%; width:160px; margin:0 0 0 -80px;" onclick="javascript:xp.resetSession();"/>
			</div>
		</div>
		
		<!-- FOOTER (FI) -->
		<div id="footer">
			<div class="center">
				<div id="XP_bar">
					<div id="XP_line">
						<!--<div id="cursorNOW" class="cursor"></div>-->
					</div>
					<?php
					$WPamount = 8;
					for($w=1; $w<=$WPamount; $w++){
						echo'<div class="cursor waypoint" style="left:'.(100/$WPamount*$w).'%;"></div>';
					}
					?>
				</div>
			</div>
		</div>

		<!-- Badges TOOLTIP -->
		<div id="badge_info">
			<span class="info_date"></span><br/>
			<span class="info_text"></span>
		</div>

		<!-- LOADING SCENE -->
		<div id="loadingPanel">

			<!-- PYRAMIDE -->
			<div id="loadingPyramide">
				<input type="button" value="DEBUG: SKIP" onClick="javascript:loadSite.LoadingIsDone();"/>
			</div>

			<!-- MACRON -->
			<div id="loadingMacron"></div>

			<!-- GROUND -->
			<div id="loadingGround"></div>

			<!-- PUPITRE -->
			<div id="loadingPupitre"></div>

			<!-- LOADING ANIM -->
			<div id="loadingAnim">
				<div class="loadingAnimDot lad1"></div>
				<div class="loadingAnimDot lad2"></div>
				<div class="loadingAnimDot lad3"></div>
				<div class="loadingAnimDot lad4"></div>
				<div class="loadingAnimDot lad5"></div>
				<div class="loadingAnimDot lad6"></div>
				<div class="loadingAnimDot lad7"></div>
				<div class="loadingAnimDot lad8"></div>
			</div>

		</div>

	</body>
</html>
<?php

function getUserIP() {
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];
    if(filter_var($client, FILTER_VALIDATE_IP)){
        $ip = $client;
    }elseif(filter_var($forward, FILTER_VALIDATE_IP)){
        $ip = $forward;
    }else{
        $ip = $remote;
    }
    return $ip;
}

$ip = getUserIP();
if($ip!='109.190.220.12') {
	$file = 'log.txt';
	// Open the file to get existing content
	$current = file_get_contents($file);
	// Append a new person to the file
	$current .= date('Y-m-d H:i:s')." New visit (".$ip.")\n";
	// Write the contents back to the file
	file_put_contents($file, $current);
}
?>