<?php
    require("config.php");
    
    $CopierPriceID = filter_input(INPUT_POST, 'CopierPriceID');
    $s_letter = filter_input(INPUT_POST, 's_letter');
    $d_letter = filter_input(INPUT_POST, 'd_letter');
    $s_letter_color = filter_input(INPUT_POST, 's_letter_color');
    $d_letter_color = filter_input(INPUT_POST, 'd_letter_color');
    $s_legal = filter_input(INPUT_POST, 's_legal');
    $d_legal = filter_input(INPUT_POST, 'd_legal');
    $s_legal_color = filter_input(INPUT_POST, 's_legal_color');
    $d_legal_color = filter_input(INPUT_POST, 'd_legal_color');
    $s_tabloid = filter_input(INPUT_POST, 's_tabloid');
    $d_tabloid = filter_input(INPUT_POST, 'd_tabloid');
    $s_tabloid_color = filter_input(INPUT_POST, 's_tabloid_color');
    $d_tabloid_color = filter_input(INPUT_POST, 'd_tabloid_color');
    $s_letter_80 = filter_input(INPUT_POST, 's_letter_80');
    $d_letter_80 = filter_input(INPUT_POST, 'd_letter_80');
    $s_letter_color_80 = filter_input(INPUT_POST, 's_letter_color_80');
    $d_letter_color_80 = filter_input(INPUT_POST, 'd_letter_color_80');
    $front_cover = filter_input(INPUT_POST, 'front_cover');
    $front_cover_color = filter_input(INPUT_POST, 'front_cover_color');
    $back_cover = filter_input(INPUT_POST, 'back_cover');
    $back_cover_color = filter_input(INPUT_POST, 'back_cover_color');
    $cut = filter_input(INPUT_POST, 'cut');
    $coil_binding = filter_input(INPUT_POST, 'coil_binding');
    $comb_binding = filter_input(INPUT_POST, 'comb_binding');
    $booklet = filter_input(INPUT_POST, 'booklet');

    $query = "UPDATE [".$dbDatabase."].[dbo].[CopierPrice] "
                . "SET s_letter = '".$s_letter."', d_letter = '".$d_letter."', s_letter_color = '".$s_letter_color."', d_letter_color = '".$d_letter_color."', "
                . "s_legal = '".$s_legal."', d_legal = '".$d_legal."', s_legal_color = '".$s_legal_color."', d_legal_color = '".$d_legal_color."', "
                . "s_tabloid = '".$s_tabloid."', d_tabloid = '".$d_tabloid."', s_tabloid_color = '".$s_tabloid_color."', d_tabloid_color = '".$d_tabloid_color."', "
                . "s_letter_80 = '".$s_letter_80."', d_letter_80 = '".$d_letter_80."', s_letter_color_80 = '".$s_letter_color_80."', d_letter_color_80 = '".$d_letter_color_80."', "
                . "front_cover = '".$front_cover."', front_cover_color = '".$front_cover_color."', back_cover = '".$back_cover."', back_cover_color = '".$back_cover_color."', "
                . "cut = '".$cut."', coil_binding = '".$coil_binding."', comb_binding = '".$comb_binding."', booklet = '".$booklet."' "
                . "WHERE CopierPriceID = '".$CopierPriceID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);