<?php

/* REQUIRES */
require_once LIBRARIES.'SQL.class.php';

class Content {
    
    private $debug = true;
    private $SQL = null;
    private $quantityByPage = 18;
    
    /*
     * 
     * 
     * 
     *
     ***** GET SQL *****
     * 
     * 
     * 
     *
     */
    
    private function getSQL() {
        if($this->SQL==null)
            $this->SQL = new SQLManager();
        return $this->SQL;
    }
    
    
    /*
     * 
     * 
     * 
     *
     ***** USERS *****
     * 
     * 
     * 
     *
     */
    
    public function Get_UsedSchemes(){
        $SQL = $this->getSQL();
        $req='call GET_SCHEMES();';
        try{ $schemes =$SQL->Request($req,"FetchAll");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $schemes;
    }
    
    public function Get_ValidatedBadges(){
        $SQL = $this->getSQL();
        $req='call GET_VALIDATED_BADGES_COUNT();';
        try{ $validAmount =$SQL->Request($req,"Fetch");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $validAmount['AMOUNT'];
    }

    private function ReadSession(){
        
        // CA MERDE POUR LES NOUVELLES SESSIONS / COOKIES

        if( !file_exists(SESSIONS.$_COOKIE['USERID'].'.json') ){
            $json=array();
            $json['validatedBadges']=[];
            $json_enc=json_encode($json);
            $cookieID = '';
            if( !isset($_COOKIE['USERID']) ){
                $cookieID = date('ymdhis').md5(rand(0,9999999));
                setcookie('USERID', date('ymdhis').md5(rand(0,9999999)), time()+3600*24*30*12*10 );
            }else{
                $cookieID = $_COOKIE['USERID'];
            }
            file_put_contents(SESSIONS.$cookieID.'.json', $json_enc);

            return $json;
        }

        $json = file_get_contents(SESSIONS.$_COOKIE['USERID'].'.json');
        return json_decode($json,true);
    }

    public function Get_MyValidatedBadges(){
        $cookie = $this->ReadSession();
        return $cookie['validatedBadges'];
    }

    public function Increment_ValidatedBadges(){
        $cookie = $this->ReadSession();
        if(sizeof($_POST['add'])>0){
            foreach($_POST['add'] as $badgeID){
                if(!in_array($badgeID,$cookie['validatedBadges']))
                    $cookie['validatedBadges'][]=$badgeID;
            }
            $cookie = json_encode($cookie);
            file_put_contents(SESSIONS.$_COOKIE['USERID'].'.json', $cookie);
            return 1;
        }else{
            return 0;
        }
    }

    public function ResetSession(){
        $cookie = $this->ReadSession();
        $cookie=array();
        $cookie['validatedBadges']=[];
        $cookie=json_encode($cookie);
        file_put_contents(SESSIONS.$_COOKIE['USERID'].'.json', $cookie);
        return 1;
    }

    public function GetCollection($schemeID,$page){
        if($schemeID==0)    return $this->GetDefaultCollection($page);
        elseif($schemeID<0) return $this->GetCompleteCollection($page);
        else                return $this->GetSpecificCollection($schemeID,$page);
    }

    public function GetDefaultCollection($page){
        $SQL = $this->getSQL();
        $req='call GET_COLLECTION_DEFAULT('.(intval($page)-1)*$this->quantityByPage.','.$this->quantityByPage.');';
        try{ $collection =$SQL->Request($req,"FetchAll");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $collection;
    }

    public function GetCompleteCollection($page){
        $SQL = $this->getSQL();
        $req='call GET_COLLECTION_ALL('.(intval($page)-1)*$this->quantityByPage.','.$this->quantityByPage.');';
        try{ $collection =$SQL->Request($req,"FetchAll");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $collection;
    }

    public function GetSpecificCollection($schemeID,$page){
        $SQL = $this->getSQL();
        $req='call GET_COLLECTION_SCHEMED('.intval($schemeID).','.(intval($page)-1)*$this->quantityByPage.','.$this->quantityByPage.');';
        try{ $collection =$SQL->Request($req,"FetchAll");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $collection;
    }

    public function GetBadgesOfMesure($mesureID){
        $SQL = $this->getSQL();
        $req='call GET_BADGES('.intval($mesureID).');';
        try{ $badges =$SQL->Request($req,"FetchAll");}catch(Exception $e){echo'[ERROR] in '.basename(__FILE__).' with '.__FUNCTION__.'() @ '.__LINE__.':'."<br/>\n";if($SQL->debugMode){echo'<pre>'.($e.message).'</pre>';}return false;}
        return $badges;
    }
    
}

function mb_ucfirst($string, $encoding='UTF-8') {
    $strlen = mb_strlen($string, $encoding);
    $firstChar = mb_substr($string, 0, 1, $encoding);
    $then = mb_substr($string, 1, $strlen - 1, $encoding);
    return mb_strtoupper($firstChar, $encoding) . $then;
}

function preg_array_key_exists($pattern, $array) {
    $keys = array_keys($array);    
    return (int) preg_grep($pattern,$keys);
}

?>