<?php
    $server = "dc1.saddleback.edu dc2.saddleback.edu dc3.saddleback.edu dc4.saddleback.edu";
    $baseDN = "dc=saddleback,dc=edu";
         
    $username = filter_input(INPUT_POST, 'username');
    $password = filter_input(INPUT_POST, 'password');
    $login = "SADDLEBACK\\".$username;

    $ldapconn = ldap_connect($server);   
    if($ldapconn) {          
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);

        $ldapbind = ldap_bind($ldapconn, $login, $password);  
        if($ldapbind) {            
            $filter = "(&(objectClass=user)(objectCategory=person)(cn=".$username."))";
            $ladp_result = ldap_search($ldapconn, $baseDN, $filter);
            $data = ldap_get_entries($ldapconn, $ladp_result);

            if ($data != null) {
                if (array_key_exists('costcenterdescription', $data[0])) {
                    $result = $data[0]["costcenterdescription"]; 
                }
            }
        }  
        ldap_close($ldapconn);
    }
    echo json_encode($result);