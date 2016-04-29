var m_user_profile_id = "";
var m_login_from_DC_front_desk = false;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {    
    if (sessionStorage.key(0) !== null) {        
        m_login_from_DC_front_desk = getLoginLocation();
        getDepartment();
        setUserInfomation();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $('#btn_register').click(function() {
        var err = formValidation();
        if (err !== "") {
            alert(err);
            return false;
        }
        
        updateUserProfile();
        if (m_login_from_DC_front_desk) {
            window.open('dropOffPrintRequest.html', '_self');
            return false;
        }
        else {
            window.open('userHome.html', '_self');
            return false;
        }
    });
    
    $('#btn_close').click(function() {
        if (m_user_profile_id === "") {
            sessionStorage.clear();
            if (m_login_from_DC_front_desk) {
                window.open('LoginFromDC.html', '_self');
                return false;
            }
            else {
                window.open('Login.html', '_self');
                return false;
            }
        }
        else {
            if (m_login_from_DC_front_desk) {
                window.open('dropOffPrintRequest.html', '_self');
                return false;
            }
            else {
                window.open('userHome.html', '_self');
                return false;
            }
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLoginLocation() {
    var login_from = sessionStorage.getItem('ls_dc_loginFrom');
    if (login_from.indexOf("LoginFromDC.html") > 0) {
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function formValidation() {
    var err = "";

    if ($('#up_phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    else {
        if (!isValidPhoneNumber($.trim($('#up_phone').val()))) {
            err += "Phone number is an INVALID please use sample format (949-451-5696)\n";
        }
    }
    if ($('#up_department').val() === "0") {
        err += "Department is a required field\n";
    }

    return err;
}

////////////////////////////////////////////////////////////////////////////////
function setUserInfomation() {
    var result = new Array();
    result = db_getUserProfile(sessionStorage.getItem('ls_dc_loginEmail'));
    
    if (result.length === 0) {
        $('#up_name').val(sessionStorage.getItem('ls_dc_loginDisplayName'));
        $('#up_email').val(sessionStorage.getItem('ls_dc_loginEmail'));
        $('#up_phone').val(sessionStorage.getItem('ls_dc_loginPhone'));
        $('#up_employee_id').val(sessionStorage.getItem('ls_dc_loginID'));
    }
    else {
        m_user_profile_id = result[0]['UserProfileID'];
        $('#up_name').val(result[0]['UserName']);
        $('#up_email').val(result[0]['UserEmail']);
        $('#up_phone').val(result[0]['UserPhone']);
        $('#up_employee_id').val(result[0]['EmployeeID']);        
        $('#up_department').val(result[0]['DepartmentID']);
    }
}

////////////////////////////////////////////////////////////////////////////////
function getDepartment() {
    var result = new Array();
    result = db_getDepartment();
    
    $('#up_department').empty();
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DepartmentID'] + "'>" + result[i]['Department'] + "</option>";
    }
    
    $('#up_department').append(html);
}

////////////////////////////////////////////////////////////////////////////////
function updateUserProfile() {
    var name = textReplaceApostrophe($('#up_name').val());
    var email = textReplaceApostrophe($('#up_email').val());
    var phone = textReplaceApostrophe($('#up_phone').val());
    var employee_id = textReplaceApostrophe($('#up_employee_id').val());
    var depart_id = $('#up_department').val();
    
    if (m_user_profile_id === "") {
        db_insertUserProfile(name, email, phone, employee_id, depart_id);
    }
    else {
        db_updateUserProfile(m_user_profile_id, name, email, phone, employee_id, depart_id);
    }
}