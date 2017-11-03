<?php
    require("config.php");
    
    $CatSectionID = filter_input(INPUT_POST, 'CatSectionID');
    $Active = filter_input(INPUT_POST, 'Active');
    $FiscalYear = filter_input(INPUT_POST, 'FiscalYear');
    $SectionName = filter_input(INPUT_POST, 'SectionName');
    $Pages = filter_input(INPUT_POST, 'Pages');
    $Cost = filter_input(INPUT_POST, 'Cost');
    $Options = filter_input(INPUT_POST, 'Options');
    
    $FiscalYear = str_replace("'", "", $FiscalYear);
    $SectionName = str_replace("'", "''", $SectionName);
    $Options = str_replace("'", "''", $Options);

    $query = "UPDATE [".$dbDatabase."].[dbo].[CatSection] "
                ."SET Active = '".$Active."', FiscalYear = '".$FiscalYear."', SectionName = '".$SectionName."', Pages = '".$Pages."', Cost = '".$Cost."', Options = '".$Options."' "
                ."WHERE CatSectionID = '".$CatSectionID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);