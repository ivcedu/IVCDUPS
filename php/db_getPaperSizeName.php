<?php
    require("config.php");

    $PaperSizeID = filter_input(INPUT_POST, 'PaperSizeID');
    
    $query = "SELECT PaperSize FROM [".$dbDatabase."].[dbo].[PaperSize] WHERE PaperSizeID = '" . $PaperSizeID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['PaperSize']);