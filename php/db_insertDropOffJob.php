<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $JobStatusDupID = filter_input(INPUT_POST, 'JobStatusDupID');
    $CostCenterID = filter_input(INPUT_POST, 'CostCenterID');
    $JobName = filter_input(INPUT_POST, 'JobName');
    $Pages = filter_input(INPUT_POST, 'Pages');
    $Quantity = filter_input(INPUT_POST, 'Quantity');
    $DateNeeded = filter_input(INPUT_POST, 'DateNeeded');
    $TimeNeeded = filter_input(INPUT_POST, 'TimeNeeded');
    $PaperSizeID = filter_input(INPUT_POST, 'PaperSizeID');
    $DuplexID = filter_input(INPUT_POST, 'DuplexID');
    $PaperColorID = filter_input(INPUT_POST, 'PaperColorID');
    $CoverColorID = filter_input(INPUT_POST, 'CoverColorID');
    $ColorCopy = filter_input(INPUT_POST, 'ColorCopy');
    $FrontCover = filter_input(INPUT_POST, 'FrontCover');
    $BackCover = filter_input(INPUT_POST, 'BackCover');
    $Confidential = filter_input(INPUT_POST, 'Confidential');
    $ThreeHolePunch = filter_input(INPUT_POST, 'ThreeHolePunch');
    $Staple = filter_input(INPUT_POST, 'Staple');
    $Cut = filter_input(INPUT_POST, 'Cut');
    $BindingID = filter_input(INPUT_POST, 'BindingID');
    $Booklet = filter_input(INPUT_POST, 'Booklet');
    $FirstPgColorPrint = filter_input(INPUT_POST, 'FirstPgColorPrint');
    $LastPgColorPrint = filter_input(INPUT_POST, 'LastPgColorPrint');
    $TotalPrint = filter_input(INPUT_POST, 'TotalPrint');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[DropOffJob] (PrintRequestID, JobStatusDupID, CostCenterID, JobName, Pages, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID, "
                . "ColorCopy, FrontCover, BackCover, Confidential, ThreeHolePunch, Staple, Cut, BindingID, Booklet, FirstPgColorPrint, LastPgColorPrint, TotalPrint, TotalCost, Note) "
                . "VALUES ('$PrintRequestID', '$JobStatusDupID', '$CostCenterID', '$JobName', '$Pages', '$Quantity', '$DateNeeded', '$TimeNeeded', '$PaperSizeID', '$DuplexID', '$PaperColorID', '$CoverColorID', "
                . "'$ColorCopy', '$FrontCover', '$BackCover', '$Confidential', '$ThreeHolePunch', '$Staple', '$Cut', '$BindingID', '$Booklet', '$FirstPgColorPrint', '$LastPgColorPrint', '$TotalPrint', '$TotalCost', '$Note')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);