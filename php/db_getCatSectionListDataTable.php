<?php
    require("config.php");

    $query = "SELECT FiscalYear, SectionName, CASE WHEN Active = 1 THEN 'Yes' ELSE 'No' END AS Active, Pages, '$' + CONVERT(VARCHAR, Cost, 1) AS Cost, Options, "
            . "'<a class=''iconic-color-default'' href=# id=''cat_section_id_' + CONVERT(NVARCHAR(255), CatSectionID) + '''><i class=''iconic iconic-sm iconic-lock-unlocked iconic-color-default''></i></a>' "
            . "FROM [".$dbDatabase."].[dbo].[CatSection] ORDER BY SectionName ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);