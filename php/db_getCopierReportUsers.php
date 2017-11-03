<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $CostCenterID = filter_input(INPUT_POST, 'CostCenterID');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #BILLINGUSERS (LoginID nvarchar(255), Requestor nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #BILLINGUSERS";
    
    $query_duplicating = "INSERT INTO #BILLINGUSERS "
                        . "SELECT prrq.LoginID, "
                        . "prrq.Requestor, "
                        . "SUM(dupl.TotalPrint) AS TotalPages, "
                        . "SUM(dupl.TotalCost) AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                        . "AND csct.CostCenterID = '".$CostCenterID."' "
                        . "GROUP BY prrq.LoginID, prrq.Requestor";
    
    $query_dropoff = "INSERT INTO #BILLINGUSERS "
                    . "SELECT prrq.LoginID, "
                    . "prrq.Requestor, "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "AND csct.CostCenterID = '".$CostCenterID."' "
                    . "GROUP BY prrq.LoginID, prrq.Requestor";
    
    $query_catalog = "INSERT INTO #BILLINGUSERS "
                    . "SELECT prrq.LoginID, "
                    . "prrq.Requestor, "
                    . "SUM(ctlg.TotalPrint) AS TotalPages, "
                    . "SUM(ctlg.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "AND csct.CostCenterID = '".$CostCenterID."' "
                    . "GROUP BY prrq.LoginID, prrq.Requestor";
    
    $query_get_result = "SELECT LoginID, Requestor, SUM(TotalPages) AS TotalPages, SUM(TotalCost) AS TotalCost "
                        . "FROM #BILLINGUSERS GROUP BY LoginID, Requestor "
                        . "ORDER BY Requestor ASC";

    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_dropoff);
    $dbConn->query($query_catalog);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);