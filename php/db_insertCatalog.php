<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $CatSectionID = filter_input(INPUT_POST, 'CatSectionID');
    $JobStatusDupID = filter_input(INPUT_POST, 'JobStatusDupID');
    $CostCenterID = filter_input(INPUT_POST, 'CostCenterID');
    $Quantity = filter_input(INPUT_POST, 'Quantity');
    $DateNeeded = filter_input(INPUT_POST, 'DateNeeded');
    $TimeNeeded = filter_input(INPUT_POST, 'TimeNeeded');
    $TotalPrint = filter_input(INPUT_POST, 'TotalPrint');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[Catalog] (PrintRequestID, CatSectionID, JobStatusDupID, CostCenterID, Quantity, DateNeeded, TimeNeeded, TotalPrint, TotalCost, Note) "
                . "VALUES ('$PrintRequestID', '$CatSectionID', '$JobStatusDupID', '$CostCenterID', '$Quantity', '$DateNeeded', '$TimeNeeded', '$TotalPrint', '$TotalCost', '$Note')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);