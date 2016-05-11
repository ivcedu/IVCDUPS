////////////////////////////////////////////////////////////////////////////////
window.onload = function() {  
    $('#logn_error').hide();
    var curBrowser = bowser.name;
    var curVersion = Number(bowser.version);
    
    switch (curBrowser) {
        case "Safari":
            if (curVersion < 6)
                window.open('browser_not_support.html', '_self');
            break;
        case "Chrome":
            if (curVersion < 7)
                window.open('browser_not_support.html', '_self');
            break;
        case "Firefox":
            if (curVersion < 22)
                window.open('browser_not_support.html', '_self');
            break;
        case "Internet Explorer":
            if (curVersion < 11)
                window.open('browser_not_support.html', '_self');
            break;
        default:     
            break;
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {      
    $('#btn_login').click(function() { 
        var login_error = loginInfo();
        if(login_error === "") {
            sessionStorage.setItem('ls_dc_loginFrom', window.location.href);
            var user_type = sessionStorage.getItem('ls_dc_loginType');
            if (user_type === "Staff") {
                var result = new Array();
                result = db_getUserProfile(sessionStorage.getItem('ls_dc_loginEmail'));

                if (result.length === 0) {
                    window.open('userProfile.html', '_self');
                    return false;
                }
                else {
                    window.open('userHome.html', '_self');
                    return false;
                }
            }
            else {
                var result2 = new Array();
                result2 = db_getHonorStudentByEmail(sessionStorage.getItem('ls_dc_loginEmail'));
                
                if (result2.length === 0) {
                    swal("Error", "You don't have asscee to IVC Duplication Services", "error");
                    return false;
                }
                else {
                    window.open('userHome.html', '_self');
                    return false;
                }
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
    if (username.indexOf("@ivc.edu") >= 1) {
        username = username.replace("@ivc.edu", "");
        result = getLoginUserInfo("php/login.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student.php", username, password);
        }
    }
    else {
        username = username.replace("@saddleback.edu", "");
        result = getLoginUserInfo("php/login_saddleback.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student_saddleback.php", username, password);
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