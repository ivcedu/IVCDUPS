////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    // verify copier front desk computer (ip address and Net BIOS Name)
//    var net_bios_name = getClientComputerName();
    // testing ...
//    net_bios_name = "IMAC-0D3D76";
//    if (net_bios_name !== "IMAC-0D3D76") {
//        window.open('Login.html', '_self');
//        return false;
//    }
    $('#logn_error').hide();
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {      
    $('#btn_login').click(function() {
        // ireport.ivc.edu validation //////////////////////////////////////////
        if(location.href.indexOf("ireport.ivc.edu") >= 0 && !ireportValidation()) {
            swal({  title: "Access Denied",
                    text: "This is a Development site. Please talk to Jose or Lionel",
                    type: "error" },
                    function() {
                        sessionStorage.clear();
                        window.open('https://services.ivc.edu/IVCDUPS/LoginFromDC.html', '_self');
                        return false;
                    }
            );
        }
        ////////////////////////////////////////////////////////////////////////
        var login_error = loginInfo();
        if(login_error === "") {
            sessionStorage.setItem('ls_dc_loginFrom', window.location.href);
            var user_type = sessionStorage.getItem('ls_dc_loginType');
            if (user_type === "Staff") {
                window.open('dropOffPrintRequest.html', '_self');
                return false;
            }
            else {
                swal("Error", "You don't have asscee to IVC Duplicating Services", "error");
                return false;
            }
        }
        else {
            $('#error_msg').html(login_error);
            $('#logn_error').show();
            this.blur();
            return false;
        }
    });
    
    $.backstretch(["images/ivcdups_back_web_1.jpg"], {duration: 3000, fade: 750});
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {   
    var result = new Array();
    var username = $('#username').val().toLowerCase();
    var password = $('#password').val();
    var error = loginEmailValidation(username);
    if(error !== "") {
        return error;
    }
    
    var result = new Array();
    var obj_result;
    if (username.indexOf("@ivc.edu") >= 1) {
        username = $.trim(username.replace("@ivc.edu", ""));
        result = getLoginUserInfo("php/login.php", username, password);
        
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student.php", username, password);
        }
        else {
            obj_result = getLDAPUserCostCenter("php/ldap_ivc_getCostCenter.php", username, password);
            var err_ivc_cost_center = updateCostCenterInfoToDB(obj_result);
            if (err_ivc_cost_center !== "") {
                return err_ivc_cost_center;
            }
        }
    }
    else {
        username = $.trim(username.replace("@saddleback.edu", ""));
        result = getLoginUserInfo("php/login_saddleback.php", username, password);
        
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student_saddleback.php", username, password);
        }
        else {
            obj_result = getLDAPUserCostCenter("php/ldap_sd_getCostCenter.php", username, password);
            var err_sd_cost_center = updateCostCenterInfoToDB(obj_result);
            if (err_sd_cost_center !== "") {
                return err_sd_cost_center;
            }
        }
    } 
    
    if (result.length === 0) {
        return "Invalid Email or Password";
    }
    else {
        var display_name = result[0];
        var email = result[1];
        var phone = result[2];
        var loginID = result[3];
        var depart = result[4];
        var login_type = result[5];
        
        if (email === null || typeof email === 'undefined') {
            return "AD Login System Error";
        }
        else {
            localData_login(display_name, email, phone, loginID, depart, login_type);
            return "";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function loginEmailValidation(login_email) {    
    if (login_email.indexOf("@ivc.edu") !== -1 || login_email.indexOf("@saddleback.edu") !== -1) {
        return "";
    }
    else {
        return "Invalid Email";
    }
}

////////////////////////////////////////////////////////////////////////////////
function updateCostCenterInfoToDB(obj_result) {
    var ar_cost_center_list = new Array();
    var ar_user_cost_center = new Array();
    
    if (obj_result === null) {
        return "AD cost center has not been setup yet";
    }
    else {
        for (var i = 0; i < obj_result.count; i++) {
            if (obj_result[i].indexOf("IVC") !==  -1) {
                ar_cost_center_list.push(obj_result[i]);
            }
        } 
    }
    
    if (ar_cost_center_list.length === 0) {
        return "No IVC cost center found";
    }
    else {
        for (var j = 0; j < ar_cost_center_list.length; j++) {
            var ar_descrip = ar_cost_center_list[j].split(":");
            if (ar_descrip.length !== 3) {
                return "Error AD cost center";
            }
            
            var cost_center_code = textReplaceApostrophe($.trim(ar_descrip[0]));
            var cost_center = textReplaceApostrophe($.trim(ar_descrip[1].replace("IVC-", "")));
            var division = textReplaceApostrophe($.trim(ar_descrip[2].replace("IVC-", "")));
            
            var division_id = getDivisionID(cost_center_code, division);
            var cost_center_id = getCostCenterID(division_id, cost_center_code, cost_center);
            
            ar_user_cost_center.push(cost_center_id + ":" + cost_center_code + ":" + cost_center);
        }
        
        sessionStorage.setItem('ls_dc_usr_cost_center_list', JSON.stringify(ar_user_cost_center));
        return "";
    }
}

function getDivisionID(cost_center_code, division) {
    var result = db_getDivisionID(division);
    if (result === null) {
        result = db_insertDivision(cost_center_code, division);
    }
    
    return result;
}

function getCostCenterID(division_id, cost_center_code, cost_center) {
    var result = db_getCostCenterID(cost_center_code);
    if (result === null) {
        result = db_insertCostCenter(division_id, cost_center_code, cost_center);
    }
    
    return result;
}

////////////////////////////////////////////////////////////////////////////////
function ireportValidation() {
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "").replace("@saddleback.edu", "");
    if (ireportDBgetUserAccess(username) !== null) {
        return true;
    }
    else {
        return false;
    }
}