<?php
    require("config.php");
    
    $query = "SELECT prrq.*, dvtp.DeviceType, jstp.JobStatusPlot, pltt.TotalCost AS PlotTotalCost "
            . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq LEFT JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "LEFT JOIN [".$dbDatabase."].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
            . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
            . "WHERE prrq.DeviceTypeID = '1' AND jstp.JobStatusPlotID = '4'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);