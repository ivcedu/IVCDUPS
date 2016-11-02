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

window.onbeforeunload = function (event) {
    db_updatePrintRequestLocked(print_request_id, false);
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
        db_updatePrintRequestLocked(print_request_id, false);
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // icon close button click /////////////////////////////////////////////////
    $('#ico_btn_close').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('administrator.html', '_self');
        return false;
    });
    
    // icon print button click /////////////////////////////////////////////////
    $('#ico_btn_print').click(function() {
        window.open('printingPR.html?print_request_id=' + print_request_id, '_blank');
        return false;
    });
    
    // attach file click event /////////////////////////////////////////////////
    $('#attachment_file').click(function() {  
        var result = new Array();
        result = db_getAttachment(print_request_id);
        
        if (result.length === 1) {
            var url_pdf = "attach_files/" + result[0]['FileLinkName'];
            var login_from = sessionStorage.getItem("ls_dc_loginFrom");
            url_pdf = login_from.replace("IVCDUPS", "DCenter").replace("ivcdups", "DCenter").replace("Login.html", "") + url_pdf;
            window.open(url_pdf, '_blank');
            return false;
        }
    });
    
    // admin save button click /////////////////////////////////////////////////
    $('#btn_admin_save').click(function() {        
        updatePrintStatus();
        statusEmailNotification();
        
        db_updatePrintRequestLocked(print_request_id, false);
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
function setJobStatusPlot() {
    var result = new Array();
    result = db_getJobStatusPlot();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {        
        html += "<option value='" + result[i]['JobStatusPlotID'] + "'>" + result[i]['JobStatusPlot'] + "</option>";
    }
    
    $('#admin_job_status').append(html);
}

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
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        var del_loc_id = result[0]['DeliveryLocationID'];        
        $('#admin_del_loc').val(del_loc_id);
        
        setRequestorInformation(device_type_id, result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        setAttachment();
        
        if (device_type_id === "1") {
            setJobStatusPlot();
            $('#plotter_section').show();
            setPlotter(device_type_id, result[0]['DTStamp'], result[0]['Modified']);
        }
        else {
            setJobStatusDup();
            $('#duplicating_section').show();
            setDuplicating(device_type_id, result[0]['DTStamp'], result[0]['Modified']);
        }
    }
}

function getUserDepartName(email) {
    var result = new Array();
    result = db_getUserProfile(email);
    var department_id = result[0]['DepartmentID'];
    
    if (department_id !== "") {
        return db_getUserDepartName(department_id);
    }
    else {
        return "";
    }
}

function setRequestorInformation(device_type_id, login_type, login_id, requestor, email, phone, request_title) {
    $('#requestor').html(requestor);
    $('#email').html(email);
    $('#phone').html(phone);
    
    if (login_type === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#login_id').html(login_id);
    $('#request_title').html(request_title);
    $('#device_type').html(db_getDeviceTypeName(device_type_id));
}

function setAttachment() {
    var result = new Array();
    result = db_getAttachment(print_request_id);
    
    if (result.length === 1) {        
        $('#attachment_file').html(result[0]['FileName']);
        $('#pdf_pages').html(result[0]['Pages']);
    }
}

function setPlotter(device_type_id, dtstamp, modified) { 
    $('#admin_del_loc').attr("disabled", "disabled");
    
    var result = new Array();
    result = db_getPlotter(print_request_id);
    if (result.length === 1) {
        var job_status_plot_id = result[0]['JobStatusPlotID'];
        if (job_status_plot_id === "1" || job_status_plot_id === "2") {
            db_updatePrintRequestLocked(print_request_id, true);
        }
        
        $('#admin_job_status').val(job_status_plot_id);
        
        $('#job_status').html(db_getJobStatusPlotName(result[0]['JobStatusPlotID']));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        $('#paper_type').html(db_getPaperTypeName(result[0]['PaperTypeID']));
        $('#size_height').html(result[0]['SizeHeight']);
        $('#plot_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_waved_proof").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Free'] === "1") {
            $('#honor_student').show();
        }
        
        $('#plot_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setDuplicating(device_type_id, dtstamp, modified) {
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    if (result.length === 1) {  
        var job_status_dup_id = result[0]['JobStatusDupID'];
        if (job_status_dup_id === "1") {
            db_updatePrintRequestLocked(print_request_id, true);
        }
        
        $('#admin_job_status').val(job_status_dup_id);
        
        $('#job_status').html(db_getJobStatusDupName(result[0]['JobStatusDupID']));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        if (result[0]['DepartmentID'] !== "0") {
            $('#billing_depart').html(db_getDepartmentName(result[0]['DepartmentID']));
        }
        else {
            $('#billing_depart').html(db_getCostCenterName(result[0]['CostCenterID']));
        }
        
        $('#quantity').html(result[0]['Quantity']);
        $('#date_needed').html(result[0]['DateNeeded']);
        $('#time_needed').html(result[0]['TimeNeeded']);
        $('#paper_size').html(db_getPaperSizeName(result[0]['PaperSizeID']));
        $('#duplex').html(db_getDuplexName(result[0]['DuplexID']));
        $('#paper_color').html(db_getPaperColorName(result[0]['PaperColorID']));
        $('#cover_color').html(db_getCoverColorName(result[0]['CoverColorID']));
        if (result[0]['ColorCopy'] === "1") {
            $("#ckb_color_copy").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_color_copy").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['FrontCover'] === "1") {
            $("#ckb_front_cover").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_front_cover").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['BackCover'] === "1") {
            $("#ckb_back_cover").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_back_cover").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Confidential'] === "1") {
            $("#ckb_confidential").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_confidential").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['ThreeHolePunch'] === "1") {
            $("#ckb_three_hole_punch").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_three_hole_punch").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Staple'] === "1") {
            $("#ckb_staple").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_staple").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Cut'] === "1") {
            $("#ckb_cut").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
           $("#ckb_cut").append("<i class='fa fa-square-o fa-lg'></i>"); 
        }
        $('#dup_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
        
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
    }
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
    
    if ($('#device_type').html() === "Duplicating") {
        db_updateDuplicating(print_request_id, admin_job_status_id);
        db_updatePrintRequestDelivery(print_request_id, admin_del_loc_id);
        status_change = db_getJobStatusDupName(admin_job_status_id);
    }
    else {
        db_updatePlotter(print_request_id, admin_job_status_id);
        status_change = db_getJobStatusPlotName(admin_job_status_id);
    }
    
    if (admin_msg_note !== "") {
        status_change += "\n" + admin_msg_note;
    }
    
    db_updatePrintRequestModified(print_request_id);
    db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Status has been changed to " + status_change);
}

////////////////////////////////////////////////////////////////////////////////
function statusEmailNotification() {
    var admin_job_status_id = $('#admin_job_status').val();
    var device_type = $('#device_type').html();
    
    if (device_type === "Plotter") {
        switch(admin_job_status_id) {
            case "2":
                sendEmailNeedsProof();
                break;
            case "3":
                sendEmailProofReady();
                break;
            case "4":
                sendEmailWaitingForPayment();
                break;
            case "5":
                sendEmailReadyForPrinting();
                break;
            case "6":
                sendEmailAdditionalInfo();
                break;
            case "7":
                sendEmailInProgress();
                break;
            case "8":
                sendEmailPlotCompleted();
                break;
            case "9":
                sendEmailCancel();
                break;
            default:
                break;
        }
    }
    else {
        switch(admin_job_status_id) {
            case "2":
                sendEmailAdditionalInfo();
                break;
            case "3":
                sendEmailInProgress();
                break;
            case "4":
                sendEmailDupCompleted();
                break;
            case "5":
                sendEmailDupDelivered();
                break;
            case "6":
                sendEmailCancel();
                break;
            default:
                break;
        }
    }
}

function sendEmailNeedsProof() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your new plotter request";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Thank you for your plotter request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').html() + "<br>";
    message += "Request Title: " + $('#request_title').html() + "<br>";
    message += "Paper Type: " + $('#paper_type').html() + "<br>";
    message += "Size: " + $('#size_height').html() + " x 36<br>";
    message += "Total Cost: " + $('#plot_total_cost').html() + "<br><br>";
    
    message += "You will receive an email when your proof is ready to be reviewed.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailProofReady() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your plotter proof is now ready for review";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your proof for the request titled <b>" + $('#request_title').html() + "</b> is now ready for review.<br>";
    message += "Please come to the IVC Duplicating Center to approve your proof.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailWaitingForPayment() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your plotter request is ready for payment";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your plotter request titled <b>" + $('#request_title').html() + "</b> is now ready for payment.<br>";
    message += "Please take this email and go to the Bursars Office and pay " + $('#plot_total_cost').html() + " for this job.<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailReadyForPrinting() {
    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "Plotter request " + $('#request_title').html() + " has been PAID";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Plotter request titled <b>" + $('#request_title').html() + "</b> has been PAID.<br><br>";
    
    message += "Should you have any questions, please contact the Bursars's Office.<br><br>"; 
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailCancel() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been cancel";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b> has been CANCEL. The reason for this is:<br>";
    message += $('#admin_msg_note').val().replace(/\n/g, "<br>") + "<br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailAdditionalInfo() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Additional information is needed for your " + $('#device_type').html() + " request";
    var message = "Dear " + name + ", <br><br>";
    
    message += "We need some information about your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b>. Here is what we need:<br>";
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
    
    var subject = "Your " + $('#device_type').html() + " request is now in progress";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b> is now in progress.<br>";
    message += "You will receive an email when the request is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotCompleted() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b> has been completed.<br>";
    message += "Please come to " + db_getDeliveryLocationName($('#admin_del_loc').val()) + " to pick up your job.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDupCompleted() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b> has been completed.<br>";
    message += "You will receive an email when the delivery is complete.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDupDelivered() {
    var name = $('#requestor').html();
    var email = $('#email').html();
    
    var subject = "Your " + $('#device_type').html() + " request has been completed";
    var message = "Dear " + name + ", <br><br>";
    
    message += "Your " + $('#device_type').html() + " request titled <b>" + $('#request_title').html() + "</b> has been delivered.<br>";
    message += "Please come to " + db_getDeliveryLocationName($('#admin_del_loc').val()) + " to pick up your job.<br><br>";

    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br><br>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}