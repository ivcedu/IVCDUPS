<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $CatSectionID = filter_input(INPUT_POST, 'CatSectionID');
    $CostCenterID = filter_input(INPUT_POST, 'CostCenterID');
    $Quantity = filter_input(INPUT_POST, 'Quantity');
    $DateNeeded = filter_input(INPUT_POST, 'DateNeeded');
    $TimeNeeded = filter_input(INPUT_POST, 'TimeNeeded');
    $TotalPrint = filter_input(INPUT_POST, 'TotalPrint');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "UPDATE [".$dbDatabase."].[dbo].[Catalog] "
                ."SET CatSectionID = '".$CatSectionID."', "
                . "CostCenterID = '".$CostCenterID."', "
                . "Quantity = '".$Quantity."', "
                . "DateNeeded = '".$DateNeeded."', "
                . "TimeNeeded = '".$TimeNeeded."', "
                . "TotalPrint = '".$TotalPrint."', "
                . "TotalCost = '".$TotalCost."', "
                . "Note = '".$Note."' "
                . "WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);