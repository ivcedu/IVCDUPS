<?php
    $hostname = gethostbyaddr(filter_input(INPUT_SERVER, 'REMOTE_ADDR'));

    echo json_encode($hostname);