var print_request_id = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {        
        getURLParameters();
        getPrintRequest();
        getTransactionHistory();
        setTimeout(function () {
            window.print();  
        }, 1500);
    }
    else {
        window.open('LoginFromDC.html', '_self');
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

function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    $('#modified').html(convertDBDateTimeToString(result[0]['DTStamp']));
    if (result.length === 1) {
        setRequestorInformation(result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        setDropOffJob();
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
    str_html += "<div class='row'>";
    str_html += "<div class='col-sm-2'><b style='font-size: 16px;'>JOB # " + job_index + "</b></div>";
    str_html += "</div>"; 
    str_html += "<br>";
    str_html += "<div class='row'>";
    str_html += "<div class='col-sm-2'>Paper Size:</div>";
    str_html += "<div class='col-sm-4'>" + db_getPaperSizeName(ar_result['PaperSizeID']) + "</div>";
    str_html += "<div class='col-sm-2'>Quantity:</div>";
    str_html += "<div class='col-sm-1'>" + ar_result['Quantity'] + "</div>";
    str_html += "<div class='col-sm-2'>Pages:</div>";
    str_html += "<div class='col-sm-1'>" + ar_result['Pages'] + "</div>";
    str_html += "</div>"; 
    str_html += "<br>";
    str_html += "<div class='row'>";
    str_html += "<div class='col-sm-2'>Paper Color:</div>";
    str_html += "<div class='col-sm-4'>" + db_getPaperColorName(ar_result['PaperColorID']) + "</div>";
    str_html += "<div class='col-sm-2'>Duplex:</div>";
    str_html += "<div class='col-sm-4'>" + db_getDuplexName(ar_result['DuplexID']) + "</div>";
    str_html += "</div>";
    str_html += "<br>";
    str_html += "<div class='row'>";
    str_html += "<div class='col-sm-2'>Binding:</div>";
    str_html += "<div class='col-sm-4'>" + (db_getBindingName(ar_result['BindingID']) === null ? "" : db_getBindingName(ar_result['BindingID'])) + "</div>";
    str_html += "<div class='col-sm-2'>Cover Sheet:</div>";
    str_html += "<div class='col-sm-4'>" + db_getCoverColorName(ar_result['CoverColorID']) + "</div>";
    str_html += "</div>";
    str_html += "<br>";
    str_html += "<div class='row'>";
    if (ar_result['ColorCopy'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Color Print</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Color Print</div>";
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
    str_html += "<br>";
    str_html += "<div class='row'>";
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
    if (ar_result['Booklet'] === "1") {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Booklet</div>";
    }
    else {
        str_html += "<div class='col-sm-3'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Booklet</div>";
    }
    str_html += "</div>";
    str_html += "<br>";
    
    if (ar_result['ColorCopy'] === "0") {
        str_html += "<div class='row'>";
        if (ar_result['FirstPgColorPrint'] === "1") {
            str_html += "<div class='col-sm-4'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;First Page Color Print</div>";
        }
        else {
            str_html += "<div class='col-sm-4'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;First Page Color Print</div>";
        }
        if (ar_result['LastPgColorPrint'] === "1") {
            str_html += "<div class='col-sm-4'><span><i class='fa fa-check-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Last Page Color Print</div>";
        }
        else {
            str_html += "<div class='col-sm-4'><span><i class='fa fa-square-o fa-lg'></i></span>&nbsp;&nbsp;&nbsp;Last Page Color Print</div>";
        }   
        str_html += "</div>";
    }
    str_html += "<br>";
    
    str_html += "<div class='row'>";
    str_html += "<div class='col-sm-2'>Note:</div>";
    str_html += "<div class='col-sm-10'>" + ar_result['Note'].replace(/\n/g, "<br>") + "</div>";
    str_html += "</div>"; 
    str_html += "<br>";
    str_html += "<div class='row well'>";
    str_html += "<div class='col-sm-2'><b>Total Print:</b></div>";
    str_html += "<div class='col-sm-4'><b>" + ar_result['TotalPrint'] + "</b></div>";
    str_html += "<div class='col-sm-2'><b>Total Cost:</b></div>";
    str_html += "<div class='col-sm-4'><b>" + formatDollar(Number(ar_result['TotalCost']), 2) + "</b></div>";
    str_html += "</div>";
    str_html += "<div class='row'><div class='col-sm-12'><hr></div></div>";
    
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