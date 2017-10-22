<?php
    // Simplify data accessing
    $P = $_POST;
    // If articleID is an INT
    if(isset($P['articleID']) && (string)(int)$P['articleID']==$P['articleID']) {
        
        $can = $C->CanEditArticle(intval($P['articleID']));
        if($can['READONLY']==0 && $can['OWNED']==1) {

            // UPDATE BASICS
            if( isset($P['ART_STATUS']) ){
                $STA = ($P['ART_STATUS']!=null ? $P['ART_STATUS'] : null );
                $C->Article_UpdateBasics(intval($P['articleID']), $STA);
            }

            // UPDATE LOCALIZED CONTENT
            $ULC=[];
            foreach($P as $pKey => $pValue){
                if(substr($pKey,0,10)=='ART_TITLE_'){
                    $ULC[substr($pKey,10)*1]['TITLE']=$pValue;
                }
                if(substr($pKey,0,12)=='ART_CONTENT_'){
                    $ULC[substr($pKey,12)*1]['TEXT']=nl2br($pValue);
                    //$ULC[substr($pKey,12)*1]['TEXT']=replace("\n",'<br/>',$pValue);
                }
                if(substr($pKey,0,9)=='ART_ILLU_'){
                    $ULC[substr($pKey,9)*1]['ILLU']=($pValue!='x'?$pValue:'');
                }
            }
            if(sizeof($ULC)>0){
                $C->Article_UpdateLocalized(intval($P['articleID']), $ULC);
            }

            $out['result'] = 'success';
        } else {
            $out['result'] = 'error';
            if($can['READONLY']!=0)     $out['message'] .= L('PermissionsNotSufficient');
            elseif($can['OWNED']!=1)    $out['message'] .= L('BelongArticle');
            else                        $out['message'] .= 'Unexpected error !';
        }
    }
    // If articleID isn't an INT
    else {
        $out['result'] = 'error';
        $out['message'] = 'This ArticleID is null or not a valid number';
    }
?>