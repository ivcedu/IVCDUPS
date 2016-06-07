<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #BILLINGDEPART (DepartmentID int, Department nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #BILLINGDEPART";
    
    $query_duplicating = "INSERT INTO #BILLINGDEPART "
                        . "SELECT dprt.DepartmentID, "
                        . "dprt.Department, "
                        . "SUM(dupl.TotalPrint) AS TotalPages, "
                        . "SUM(dupl.TotalCost) AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Department] AS dprt ON dupl.DepartmentID = dprt.DepartmentID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND CONVERT(VARCHAR(10), prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                        . "GROUP BY dprt.DepartmentID, dprt.Department";
    
    $query_dropoff = "INSERT INTO #BILLINGDEPART "
                    . "SELECT dprt.DepartmentID, "
                    . "dprt.Department, "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[Department] AS dprt ON droj.DepartmentID = dprt.DepartmentID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND CONVERT(VARCHAR(10), prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "GROUP BY dprt.DepartmentID, dprt.Department";
    
    $query_get_result = "SELECT DepartmentID, Department, SUM(TotalPages) AS TotalPages, SUM(TotalCost) AS TotalCost "
                        . "FROM #BILLINGDEPART GROUP BY DepartmentID, Department "
                        . "ORDER BY Department ASC";

    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_dropoff);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);