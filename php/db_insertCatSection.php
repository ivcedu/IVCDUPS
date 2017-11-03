<?php
    require("config.php");
    
    $Active = filter_input(INPUT_POST, 'Active');
    $FiscalYear = filter_input(INPUT_POST, 'FiscalYear');
    $SectionName = filter_input(INPUT_POST, 'SectionName');
    $Pages = filter_input(INPUT_POST, 'Pages');
    $Cost = filter_input(INPUT_POST, 'Cost');
    $Options = filter_input(INPUT_POST, 'Options');
    
    $FiscalYear = str_replace("'", "", $FiscalYear);
    $SectionName = str_replace("'", "''", $SectionName);

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[CatSection] (Active, FiscalYear, SectionName, Pages, Cost, Options) "
                ."VALUES ('$Active', '$FiscalYear', '$SectionName', '$Pages', '$Cost', '$Options')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);