////////////////////////////////////////////////////////////////////////////////
function localData_login(loginDisplayName, loginEmail, loginPhone, loginID, loginDepart, loginType) {   
    sessionStorage.setItem('ls_dc_loginDisplayName', objToString(loginDisplayName));
    sessionStorage.setItem('ls_dc_loginEmail', objToString(loginEmail));
    sessionStorage.setItem('ls_dc_loginPhone', objToString(loginPhone));
    sessionStorage.setItem('ls_dc_loginID', objToString(loginID));
    sessionStorage.setItem('ls_dc_loginDepart', objToString(loginDepart));
    sessionStorage.setItem('ls_dc_loginType', objToString(loginType));
}

function objToString(obj) {
    if (obj === null) {
        return "";
    }
    else {
        return obj;
    }
}

////////////////////////////////////////////////////////////////////////////////
function deleteReportSessionItems() {
    sessionStorage.removeItem('ls_dc_pr_start_date');
    sessionStorage.removeItem('ls_dc_pr_end_date');
    sessionStorage.removeItem('ls_dc_pr_depart_id');
    sessionStorage.removeItem('ls_dc_pr_user_id');
    
    sessionStorage.removeItem('ss_dc_cp_start_date');
    sessionStorage.removeItem('ss_dc_cp_end_date');
    sessionStorage.removeItem('ss_dc_cp_division_id');
    sessionStorage.removeItem('ss_dc_cp_cost_center_id');
    sessionStorage.removeItem('ss_dc_cp_user_id');
}

function deleteReportBillingItems() {
    sessionStorage.removeItem('ls_dc_pr_start_date');
    sessionStorage.removeItem('ls_dc_pr_end_date');
    sessionStorage.removeItem('ls_dc_pr_depart_id');
    sessionStorage.removeItem('ls_dc_pr_user_id');
}

function deleteReportCopierCostItems() {
    sessionStorage.removeItem('ss_dc_cp_start_date');
    sessionStorage.removeItem('ss_dc_cp_end_date');
    sessionStorage.removeItem('ss_dc_cp_division_id');
    sessionStorage.removeItem('ss_dc_cp_cost_center_id');
    sessionStorage.removeItem('ss_dc_cp_user_id');
}

////////////////////////////////////////////////////////////////////////////////
function formatDollar(num, digit) {    
    var negative = "";
    var p = num.toFixed(digit).split(".");
    if (p[0].substr(0, 1) === "-") {
        negative = "-";
        p[0] = p[0].substr(1, p[0].length);
    }
    
    var result = p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
    
    if (negative !== "") {
        return "-$" + result;
    }
    else {
        return "$" + result;
    }
}

function revertDollar(amount) {
    var result = 0;
    
    if(amount !== "") {
        amount = amount.replace("$", "");
        amount = amount.replace(/\,/g,'');
        result = parseFloat(amount);
    }
    
    return result;
}

////////////////////////////////////////////////////////////////////////////////
function textTruncate(t_size, t_value) {
    var t_default = t_value.length;
    var tr_text = "";
    
    if (t_default > t_size) {
        tr_text = t_value.substring(0, t_size);
        tr_text += " ...";
    }
    else
        tr_text = t_value;
    
    return tr_text;
}

function textReplaceApostrophe(str_value) {
    return str_value.replace(/'/g, "''");
}

////////////////////////////////////////////////////////////////////////////////
function getFileExtension(file_name) {
    return file_name.substr((file_name.lastIndexOf('.') +1)).toLowerCase();
}

////////////////////////////////////////////////////////////////////////////////
//function isValidPositiveInteger(value) {
//    var pattern = new RegExp(/^[1-9][0-9]*$/g);
//    return pattern.test(value);
//}

//function isValidPositiveRealNumber(value) {
//    var pattern = new RegExp(/^\+?(\d*[1-9]\d*\.?|\d*\.\d*[1-9]\d*)$/g);
//    return pattern.test(value);
//}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

function isValidPhoneNumber(phoneNumber) {
    var pattern = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    return pattern.test(phoneNumber);
}

function isValidNumber(number) {
    var pattern = new RegExp(/^\d+$/);
    return pattern.test(number);
}

////////////////////////////////////////////////////////////////////////////////
function getCurrentFirstDayOfMonth() {
    var cur_date = new Date();
    var dt_firstDay = new Date(cur_date.getFullYear(), cur_date.getMonth(), 1);

    var yrs = dt_firstDay.getFullYear();
    var mon = dt_firstDay.getMonth() + 1;
    var day = dt_firstDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getCurrentLastDayOfMonth() {
    var cur_date = new Date();
    var dt_lastDay = new Date(cur_date.getFullYear(), cur_date.getMonth() + 1, 0);
    
    var yrs = dt_lastDay.getFullYear();
    var mon = dt_lastDay.getMonth() + 1;
    var day = dt_lastDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getFistDayOfMothWithSetMonth(change_month) {
    var cur_date = new Date();
    cur_date.setMonth(cur_date.getMonth() + change_month);
    var dt_firstDay = new Date(cur_date.getFullYear(), cur_date.getMonth(), 1);

    var yrs = dt_firstDay.getFullYear();
    var mon = dt_firstDay.getMonth() + 1;
    var day = dt_firstDay.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

function getToday() {
    var cur_date = new Date();
    
    var yrs = cur_date.getFullYear();
    var mon = cur_date.getMonth() + 1;
    var day = cur_date.getDate();
    
    return mon + "/" + day + "/" + yrs;
}

////////////////////////////////////////////////////////////////////////////////
function convertDBDateTimeToString(date_time) {
    if (date_time === null || date_time === "") {
        return "";
    }
    else {
        var a = date_time.split(" ");
        var d = a[0].split("-");
        var t = a[1].split(":");
        var sel_date_time = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);

        var day = sel_date_time.getDate();
        var mon = sel_date_time.getMonth()+1;
        var yrs = sel_date_time.getFullYear();
        var hrs = sel_date_time.getHours();
        var min = sel_date_time.getMinutes();
        var shift = "AM";
        if (hrs > 12) {
            hrs -= 12;
            shift = "PM";
        }

        if (min < 10) {
            min = "0" + min;
        }

        return mon + "/" + day + "/" + yrs + " " + hrs + ":" + min + " " + shift;
    }
}

function convertDBDateToString(date_time) {
    if (date_time === null || date_time === "") {
        return "";
    }
    else {
        var a = date_time.split(" ");
        var d = a[0].split("-");
        var t = a[1].split(":");
        var sel_date_time = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);

        var day = sel_date_time.getDate();
        var mon = sel_date_time.getMonth()+1;
        var yrs = sel_date_time.getFullYear();

        return mon + "/" + day + "/" + yrs;
    }
}

////////////////////////////////////////////////////////////////////////////////
function b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}