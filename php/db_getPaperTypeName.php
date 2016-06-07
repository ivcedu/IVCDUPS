<?php
    require("config.php");

    $PaperTypeID = filter_input(INPUT_POST, 'PaperTypeID');
    
    $query = "SELECT PaperType FROM [".$dbDatabase."].[dbo].[PaperType] WHERE PaperTypeID = '" . $PaperTypeID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['PaperType']);