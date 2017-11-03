<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    $SortOption = filter_input(INPUT_POST, 'SortOption');
    
    $sql_select = "";
    if ($SortOption === "TotalPages") {
        $sql_select = "SUM(TotalPages) AS TotalPages ";
    }
    else if ($SortOption === "TotalCost") {
        $sql_select = "SUM(TotalCost)AS TotalCost ";
    }
    else if ($SortOption === "MoneyFormat") {
        $sql_select = "FORMAT(SUM(TotalCost), 'C', 'en-us') AS TotalCost ";
        $SortOption = "TotalCost";
    }
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #REPORTS (Division nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #REPORTS";
    
    $query_duplicating = "INSERT INTO #REPORTS "
                        . "SELECT dvsn.Division, "
                        . "SUM(dupl.TotalPrint) AS TotalPages, "
                        . "SUM(dupl.TotalCost) AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                        . "GROUP BY dvsn.Division";
    
    $query_catalog = "INSERT INTO #REPORTS "
                        . "SELECT dvsn.Division, "
                        . "SUM(ctlg.TotalPrint) AS TotalPages, "
                        . "SUM(ctlg.TotalCost) AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Catalog] AS dupl ON prrq.PrintRequestID = ctlg.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                        . "GROUP BY dvsn.Division";
    
    $query_dropoff = "INSERT INTO #REPORTS "
                    . "SELECT dvsn.Division, "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "GROUP BY dvsn.Division";
    
    $query_get_result = "SELECT Division, ".$sql_select
                        . "FROM #REPORTS "
                        . "GROUP BY Division "
                        . "ORDER BY ".$SortOption." DESC";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_catalog);
    $dbConn->query($query_dropoff);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);