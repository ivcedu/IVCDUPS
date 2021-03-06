<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $DivisionID = filter_input(INPUT_POST, 'DivisionID');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #BILLINGCOSTCENTER (CostCenterID int, CostCenter nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #BILLINGCOSTCENTER";
    
    $query_duplicating = "INSERT INTO #BILLINGCOSTCENTER "
                        . "SELECT csct.CostCenterID, "
                        . "csct.CostCenterCode + '-' + csct.CostCenter, "
                        . "SUM(dupl.TotalPrint) AS TotalPages, "
                        . "SUM(dupl.TotalCost) AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                        . "AND dvsn.DivisionID = '".$DivisionID."' "
                        . "GROUP BY csct.CostCenterID, csct.CostCenterCode + '-' + csct.CostCenter";
    
    $query_dropoff = "INSERT INTO #BILLINGCOSTCENTER "
                    . "SELECT csct.CostCenterID, "
                    . "csct.CostCenterCode + '-' + csct.CostCenter, "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "AND dvsn.DivisionID = '".$DivisionID."' "
                    . "GROUP BY csct.CostCenterID, csct.CostCenterCode + '-' + csct.CostCenter";
    
    $query_catalog = "INSERT INTO #BILLINGCOSTCENTER "
                    . "SELECT csct.CostCenterID, "
                    . "csct.CostCenterCode + '-' + csct.CostCenter, "
                    . "SUM(ctlg.TotalPrint) AS TotalPages, "
                    . "SUM(ctlg.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "AND dvsn.DivisionID = '".$DivisionID."' "
                    . "GROUP BY csct.CostCenterID, csct.CostCenterCode + '-' + csct.CostCenter";
    
    $query_get_result = "SELECT CostCenterID, CostCenter, SUM(TotalPages) AS TotalPages, SUM(TotalCost) AS TotalCost "
                        . "FROM #BILLINGCOSTCENTER GROUP BY CostCenterID, CostCenter "
                        . "ORDER BY CostCenter ASC";

    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_dropoff);
    $dbConn->query($query_catalog);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);