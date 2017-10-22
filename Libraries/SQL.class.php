<?php

class SQLManager {
    
    private $conf_base = 'localhost';
    private $conf_datb = 'macronometre';
    private $conf_user = 'root';//'macron_kikoolol';
    private $conf_pass = '';//'macron_98ze7r54fds9ff4';
    private $co = null;
    private $logging = false;
    private $logPath = '';
    private $logFile = 'requests.log';
    public $debugMode = true;
    
    private function OpenConnection() {
        try {
            $this->co = new PDO('mysql:host='.$this->conf_base.';dbname='.$this->conf_datb, $this->conf_user, $this->conf_pass);
            $this->co->exec('SET NAMES utf8');
            $this->co->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e) {
            $this->co = null;
            echo "Database connection failed: ". $e->getMessage();
        }
    }
    
    public function GetLink() {
        if($this->co == null)
            $this->OpenConnection();
        return $this->co;
    }
    
    public function Request($request,$fetching='Fetch') {
        if($this->co == null)
            $this->OpenConnection();
        if($this->co != null){
            // log requests
            if($this->logging){
                $this->logRequest($request);
            }
            // query
            $query = $this->co->query($request);
            $res='';
            if($fetching=='LastInsertID'){
                if($query!=false)
                    $res = $this->co->query('SELECT LAST_INSERT_ID();')->Fetch(PDO::FETCH_ASSOC)['LAST_INSERT_ID()'];
                    $this->logRequest('----> Last Inserted ID: '.$res);
            } else {
                switch($fetching) {
                    case'FetchAll':     $res=$query->FetchAll(PDO::FETCH_ASSOC);    break;
                    case'Fetch':        $res=$query->Fetch(PDO::FETCH_ASSOC);       break;
                    case'RowCount':     $res=$query->RowCount();                    break;
                    case'Result':       $res=($query==false ? false : true);        break;
                }
            }
            return $res;
        } else {
            echo '<br/>BDD Connection not established !<br/>';
            return null;
        }
    }
    
    public function GetLogPath(){
        if($this->logPath==''){
            $expPath = explode('/',$_SERVER['DOCUMENT_ROOT']);
            array_pop($expPath);
            $this->logPath = implode( '/', $expPath ).'/log/';
        }
        return $this->logPath;
    }
    
    public function logRequest($r){
        $log=fopen($this->GetLogPath().str_replace('.','_'.date('Y-m-d').'.',$this->logFile),"a+b");
        fwrite($log, '['.date('Y-m-d_h:i:s').'] '.$r."\n");
        fclose($log);
    }
    
}

?>