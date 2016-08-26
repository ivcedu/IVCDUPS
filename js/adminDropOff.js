var print_request_id = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setAdminOption();
        getLoginInfo();
        
        getURLParameters();
        
        getPrintRequest();
        getTransactionHistory();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function getURLParameters() {
    var searchStr = location.search;
    //var section = location.hash.substring(1,location.hash.length);
    var searchArray = new Array();
    while (searchStr!=='') 
    {
        var name, value;
        // strip off leading ? or &
        if ((searchStr.charAt(0)==='?')||(searchStr.charAt(0)==='&')) 
            searchStr = searchStr.substring(1,searchStr.length);
        // find name
        name = searchStr.substring(0,searchStr.indexOf('='));
        // find value
        if (searchStr.indexOf('&')!==-1) 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.indexOf('&'));
        else 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.length);
        // add pair to an associative array
        value = value.replace("%20", " ");
        searchArray[name] = value;
        // cut first pair from string
        if (searchStr.indexOf('&')!==-1) 
            searchStr =  searchStr.substring(searchStr.indexOf('&')+1,searchStr.length);
        else 
            searchStr = '';
    }
    
    print_request_id = searchArray['print_request_id'];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // icon close button click /////////////////////////////////////////////////
    $('#ico_btn_close').click(function() {
        window.open('administrator.html', '_self');
        return false;
    });
    
    // icon print button click /////////////////////////////////////////////////
    $('#ico_btn_print').click(function() {
        window.open('printingDropOff.html?print_request_id=' + print_request_id, '_blank');
        return false;
    });
    
    // admin save button click /////////////////////////////////////////////////
    $('#btn_admin_save').click(function() {  
        updatePrintStatus();
        statusEmailNotification();
        
        window.open('administrator.html', '_self');
        return false;
    });
    
    // auto size
    $('#admin_msg_note').autosize();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_user_access').show();
            setDeliveryLocation();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            setDeliveryLocation();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setDeliveryLocation() {
    var result = new Array();
    result = db_getDeliveryLocation();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DeliveryLocationID'] + "'>" + result[i]['DeliveryLocation'] + "</option>";
    }
    
    $('#admin_del_loc').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setJobStatusDup() {
    var result = new Array();
    result = db_getJobStatusDup();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['JobStatusDupID'] + "'>" + result[i]['JobStatusDup'] + "</option>";
    }
    
    $('#admin_job_status').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    $('#modified').html(convertDBDateTimeToString(result[0]['DTStamp']));
    if (result.length === 1) {
        setJobStatusDup();
        
        $('#admin_del_loc').val(result[0]['DeliveryLocationID']);
        
        setRequestorInformation(result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        setDropOffJob();
    }
}

function setRequestorInformation(login_id, requestor, email, phone, request_title) {
    $('#requestor').html(requestor);
    $('#email').html(email);
    $('#phone').html(phone);
    $('#login_id').html(login_id);
    $('#request_title').html(request_title);
}

function setDropOffJob() {
    var result = new Array();
    result = db_getDropOffJob(print_request_id);
    
    $('#admin_job_status').val(result[0]['JobStatusDupID']);
    
    $('#job_status').html(db_getJobStatusDupName(result[0]['JobStatusDupID']));
    if (result[0]['DepartmentID'] !== "0") {
        $('#billing_depart').html(db_getDepartmentName(result[0]['DepartmentID']));
    }
    else {
        $('#billing_depart').html(db_getCostCenterName(result[0]['CostCenterID']));
    }
    
    $('#date_needed').html(result[0]['DateNeeded']);
    $('#time_needed').html(result[0]['TimeNeeded']);
    
    for (var i = 1; i <= result.length; i++) {
        setAddJobSectionHTML(i, result[i-1]);
    }
}

function setAddJobSectionHTML(job_index, ar_result) {
    var str_html = "<div class='row'>";
    str_html += "<div class='col-sm-12'>";
    str_html += "<div class='ibox float-e-margins'>";
    str_html += "<div class='ibox-content' style='font-size: 14px; color: black;'>";
    
    str_html += "<div class='panel-body'>";
    str_html += "<div class='col-sm-2'><b>JOB # " + job_index + "</b></div>";
    str_html += "<div class='col-sm-2 col-sm-offset-2'>Quantity:</div>";
    str_html += "<div class='col-sm-2'>" + ar_result['Quantity'] + "</div>";
    str_html += "<div class='col-sm-2'>Pages:</div>";
    str_html += "<div class='col-sm-2'>" + ar_result['Pages'] + "</div>";
    str_html += "</div>"; 
    str_html += "<div class='panel-body'>";
    str_html += "<div class='col-sm-2'>Paper Size:</div>";
    str_html += "<div class='col-sm-4'>" + db_getPaperSizeName(ar_result['PaperSizeID']) + "</div>";
    str_html += "<div class='col-sm-2'>Duplex:</div>";
    str_html += "<div class='col-sm-4'>" + db_getDuplexName(ar_result['DuplexID']) + "</div>";
    str_html += "</div>"; 
    str_html += "<div class='panel-body'>";
    str_html += "<div class='col-sm-2'>Paper Color:</div>";
    str_html += "<div class='col-sm-4'>" + db_getPaperColorName(ar_result['PaperColorID']) + "</div>";
    str_html += "<div class='col-sm-2'>Cover Color:</div>";
    str_html += "<div class='col-sm-4'>" + db_getCoverColorName(ar_result['CoverColorID']) + "</div>";
    str_html += "</div>";
    str_html += "<div class='panel-body'>";
    if (ar_result['ColorCopy'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Color Copy</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Color Copy</div>";
    }
    if (ar_result['FrontCover'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Front Cover</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Front Cover</div>";
    }
    if (ar_result['BackCover'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Back Cover</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Back Cover</div>";
    }
    if (ar_result['Confidential'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Confidential</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Confidential</div>";
    }
    str_html += "</div>";
    str_html += "<div class='panel-body'>";
    if (ar_result['ThreeHolePunch'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Three Hole Punch</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Three Hole Punch</div>";
    }
    if (ar_result['Staple'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Staple</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Staple</div>";
    }
    if (ar_result['Cut'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Cut</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Cut</div>";
    }
    str_html += "</div>";
    str_html += "<div class='panel-body'>";
    str_html += "<div class='col-sm-2'>Note:</div>";
    str_html += "<div class='col-sm-10'>" + ar_result['Note'].replace(/\n/g, "<br>") + "</div>";
    str_html += "</div>"; 
    str_html += "<div class='panel-body alert alert-success m-b-sm'>";
    str_html += "<div class='col-sm-2'><b>Total Print:</b></div>";
    str_html += "<div class='col-sm-4'><b>" + ar_result['TotalPrint'] + "</b></div>";
    str_html += "<div class='col-sm-2'><b>Total Cost:</b></div>";
    str_html += "<div class='col-sm-4'><b>" + formatDollar(Number(ar_result['TotalCost']), 2) + "</b></div>";
    str_html += "</div>";
    
    str_html += "</div>"; 
    str_html += "</div>";
    str_html += "</div>";
    str_html += "</div>";

    $('#dropoff_section').append(str_html);
}

////////////////////////////////////////////////////////////////////////////////
function getTransactionHistory() {
    var result = new Array();
    result = db_getTransaction(print_request_id);
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        var dt_stamp = convertDBDateTimeToString(result[i]['DTStamp']);
        var login_name = result[i]['LoginName'];
        var note = result[i]['Note'];
        html += login_name + " : " + dt_stamp + "<br>" + note.replace(/\n/g, "<br>") + "<br><br>";
    }
    
    $("#transaction_history").append(html);
}

////////////////////////////////////////////////////////////////////////////////
function updatePrintStatus() {
    var admin_del_loc_id = $('#admin_del_loc').val();
    var admin_job_status_id = $('#admin_job_status').val();
    var admin_msg_note = textReplaceApostrophe($('#admin_msg_note').val());
    var status_change = "";
    
    db_updateDropOffJob(print_request_id, admin_job_status_id);
    db_updatePrintRequestDelivery(print_request_id, admin_del_loc_id);
    status_change = db_getJobStatusDupName(admin_job_status_id);
    
    if (admin_msg_note !== "") {
        status_change += "\n" + admin_msg_note;
    }
    
    db_updatePrintRequestModified(print_request_id);
    db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Status has been changed to " + status_change);
}

////////////////////////////////////////////////////////////////////////////////
function statusEmailNotification() {
    var admin_job_status_id = $('#admin_job_status').val();
    switch(admin_job_status_id) {
        case "2":
            sendEmailAdditionalInfo();
            break;
        case "3":
            sendEmailInProgress();
            break;
        case "4":
            sendEmailDropOffCompleted();
            break;
        case "5":
            sendEmailDropOffDelivered();
            break;
        case "6":
            sendEmailCancel();
            break;
        default:
            break;
    }
}

function sendEmailAdditionalInfo() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Additional information is needed for your Drop Off request";
    var message = "Dear " + name + ", <br><br>";
    
    message += "We need some information about your Drop Off request titled <b>" + $('#request_title').html() + "</b>. Here is what we need:<br>";
    message += $('#admin_msg_note').val().replace(/\n/g, "<br>") + "<br><br>";
    message += "Please respond to ivcduplicating@ivc.edu<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailInProgress() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your Drop Off request is now in progress";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your Drop Off request titled <b>" + $('#request_title').html() + "</b> is now in progress.<br>";
    message += "You will receive an email when the request is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDropOffCompleted() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your Drop Off request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your Drop Off request titled <b>" + $('#request_title').html() + "</b> has been completed.<br>";
    message += "You will receive an email when the delivery is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDropOffDelivered() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your Drop Off request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your Drop Off request titled <b>" + $('#request_title').html() + "</b> has been delivered.<br>";
    message += "Please come to " + db_getDeliveryLocationName($('#admin_del_loc').val()) + " to pick up your job.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailCancel() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your Drop Off request has been cancel";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your Drop Off request titled <b>" + $('#request_title').html() + "</b> has been CANCEL. The reason for this is:<br>";
    message += $('#admin_msg_note').val().replace(/\n/g, "<br>") + "<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}