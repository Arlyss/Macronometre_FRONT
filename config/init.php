<?php

// SESSION LIFETIME (6min / ajaxPing = 3min)
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 360)) {
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
}
$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp


// HOSTS
define('HOST','game.jfkfilm.fr:120');
define('HOST_BO','game.jfkfilm.fr:121');

if($ajax==true){
	define('CONFIG','../../config/');
	define('SESSIONS','../../sessions/');
    define('LIBRARIES','../../libraries/');
}else{
    define('CONFIG','../config/');
	define('SESSIONS','../sessions/');
    define('LIBRARIES','../libraries/');
}

?>