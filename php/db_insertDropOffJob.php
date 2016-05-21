<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $JobStatusDupID = filter_input(INPUT_POST, 'JobStatusDupID');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');
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
    $TotalPrint = filter_input(INPUT_POST, 'TotalPrint');
    $TotalCost = filter_input(INPUT_POST, 'TotalCost');
    $Note = filter_input(INPUT_POST, 'Note');

    $query = "INSERT INTO [IVCDCENTER].[dbo].[DropOffJob] (PrintRequestID, JobStatusDupID, DepartmentID, JobName, Pages, Quantity, DateNeeded, TimeNeeded, "
                . "PaperSizeID, DuplexID, PaperColorID, CoverColorID, ColorCopy, FrontCover, BackCover, Confidential, ThreeHolePunch, Staple, Cut, TotalPrint, TotalCost, Note) "
                . "VALUES ('$PrintRequestID', '$JobStatusDupID', '$DepartmentID', '$JobName', '$Pages', '$Quantity', '$DateNeeded', '$TimeNeeded', "
                . "'$PaperSizeID', '$DuplexID', '$PaperColorID', '$CoverColorID', '$ColorCopy', '$FrontCover', '$BackCover', '$Confidential', '$ThreeHolePunch', '$Staple', '$Cut', '$TotalPrint', '$TotalCost', '$Note')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);