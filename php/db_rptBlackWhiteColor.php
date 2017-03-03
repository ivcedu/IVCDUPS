<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (ColorCopy int, TotalPages int)";
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_duplicating = "INSERT INTO #REPORTS "
                        . "SELECT dupl.ColorCopy AS ColorCopy, "
                        . "dupl.TotalPrint AS TotalPages "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_dropoff = "INSERT INTO #REPORTS "
                    . "SELECT droj.ColorCopy AS ColorCopy, "
                    . "droj.TotalPrint AS TotalPages "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE jstd.JobStatusDupID = '5' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT CASE WHEN ColorCopy = 1 THEN 'Color' ELSE 'B/W' END ColorCopy, SUM(TotalPages) AS TotalPages "
                        . "FROM #REPORTS "
                        . "GROUP BY ColorCopy";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_dropoff);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);