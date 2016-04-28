<?php
    require("config.php");

    $Email = filter_input(INPUT_POST, 'Email');
    
    $query = "SELECT '<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
            . "dvtp.DeviceType, "
            . "CASE WHEN prrq.DeviceTypeID = 1 THEN jstp.JobStatusPlot ELSE jstd.JobStatusDup END AS JobStatus, "
            . "CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
            . "'$' + convert(varchar, CASE WHEN prrq.DeviceTypeID = 1 THEN pltt.TotalCost ELSE dupl.TotalCost END, 1) AS TotalCost, "
            . "CASE WHEN (prrq.DeviceTypeID = 1 AND (pltt.JobStatusPlotID = 1 OR pltt.JobStatusPlotID = 2)) OR (prrq.DeviceTypeID = 2 AND dupl.JobStatusDupID = 1) "
            . "THEN '<a class=''iconic-color-default'' href=# id=''edit_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''><i class=''fa fa-edit''></i></a>' "
            . "ELSE '' END AS EditButton "
            . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq LEFT JOIN [IVCDCENTER].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
            . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
            . "WHERE ((jstp.JobStatusPlotID <> '8' AND jstp.JobStatusPlotID <> '9') OR (jstd.JobStatusDupID <> '5' AND jstd.JobStatusDupID <> '6')) AND prrq.Email = '" . $Email . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);