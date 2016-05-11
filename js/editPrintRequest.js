// plotting copier price
var m_bond_cost = 0.00;
var m_glossy_cost = 0.00;
var m_free = false;

// duplicating copier price
var m_s_letter = 0.00;
var m_d_letter = 0.00;
var m_s_letter_color = 0.00;
var m_d_letter_color = 0.00;
var m_s_legal = 0.00;
var m_d_legal = 0.00;
var m_s_legal_color = 0.00;
var m_d_legal_color = 0.00;
var m_s_tabloid = 0.00;
var m_d_tabloid = 0.00;
var m_s_tabloid_color = 0.00;
var m_d_tabloid_color = 0.00;
var m_front_cover = 0.00;
var m_front_cover_color = 0.00;
var m_back_cover = 0.00;
var m_back_cover_color = 0.00;
var m_cut = 0.00;

// pdf file system
var m_file_size = 0;
var m_file_attached = false;
var m_edit_attachment = false;
var m_total_page = 0;

var m_str_dup_cost_info = "";
var m_department_id = "";

var print_request_id = "";
var m_device = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setDefaultOption();
        setAdminOption();
        setUserProfile();
        getLoginInfo();
        
        getURLParameters();
        db_updatePrintRequestLocked(print_request_id, true);
        
        getDeviceType();
        getPaperType();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getPaperSize();
        getDepartment();
        getDuplicatingCopierPrice();
        
        setDeviceDetail();
//        getUserInformation();
        getPrintRequest();
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
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    
    // Bind normal buttons
    $('.ladda-button').ladda('bind');

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // device type change event ////////////////////////////////////////////////
    $('#device_type').change(function() { 
        var device_type_id = $(this).val();
        if (device_type_id === "1") {
            $('#attachment_section').show();
            $('#duplicating_section').hide();
            $('#menu_dup_cost_info').hide();
            $('#plotter_section').show();
        }
        else if (device_type_id === "2") {
            $('#attachment_section').show();
            $('#duplicating_section').show();
            $('#menu_dup_cost_info').show();
            $('#plotter_section').hide();
        }
        else {
            $('#attachment_section').hide();
            $('#duplicating_section').hide();
            $('#menu_dup_cost_info').hide();
            $('#plotter_section').hide();
        }
    });
    
    // file change event ///////////////////////////////////////////////////////
    $('#attachment_file').change(function() { 
        $('#spinner_attachment').show();
        setTimeout(function() {      
            getPDFAttachmentInfo();
            $('#spinner_attachment').hide();
        }, 1000);
    });
    
    // duplicating event ///////////////////////////////////////////////////////
    $('#department').change(function() {
        m_department_id = $(this).val();
    });
    
    $('#quantity').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));     
        $(this).val(input_val);
        calculateDupTotalCost();
    }); 
    
    $('#paper_size').change(function() {
        calculateDupTotalCost();
    });
    
    $('#duplex').change(function() {        
        calculateDupTotalCost();
    });
    
    $('#paper_color').change(function() {
        calculateDupTotalCost();
    });
    
    $('#cover_color').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_color_copy').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_front_cover').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_back_cover').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_confidential').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_three_hole_punch').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_staple').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    $('#ckb_cut').on('ifChanged', function(){
        calculateDupTotalCost();
    });
    
    // plotting event //////////////////////////////////////////////////////////
    $('#paper_type').change(function() { 
        var paper_type_id = $(this).val();
        var size_height = Number($('#size_height').val().replace(/[^0-9\.]/g, ''));
        if (paper_type_id === "1") {
            var plot_total_cost = size_height * m_bond_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else if (paper_type_id === "2") {
            var plot_total_cost = size_height * m_glossy_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else {
            $('#plot_total_cost').val("");
        }
    });
    
    $('#size_height').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, '')); 
        var paper_type_id = $('#paper_type').val();
        if (paper_type_id === "1") {
            var plot_total_cost = input_val * m_bond_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else if (paper_type_id === "2") {
            var plot_total_cost = input_val * m_glossy_cost;
            $('#plot_total_cost').val(formatDollar(plot_total_cost, 2));
        }
        else {
            $('#plot_total_cost').val("");
        }
    });
    
    // duplicationg submit button click ////////////////////////////////////////
    $('#btn_dup_submit').click(function() {
        $('#attachment_file').filestyle('disabled', true);
        $('#btn_dup_cancel').prop('disabled', true);
        
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            uploadPDFAttachment(print_request_id);
            
            addDuplicating(print_request_id);
            db_insertReceipt(print_request_id, m_str_dup_cost_info);
            sendEmailDuplicatingRequestor(print_request_id);
            sendEmailDuplicatingAdmin(print_request_id);
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Request submitted");
            
            $.ladda('stopAll');
            swal({  title: "Success",
                text: "Your duplication request has been submitted successfully",
                type: "success",
                confirmButtonText: "OK" },
                function() {
                    window.open('userHome.html', '_self');
                    return false;
                }
            );
        }, 1000);        
    });
    
    // plotting submit button click ////////////////////////////////////////////
    $('#btn_plot_submit').click(function() {
        $('#attachment_file').filestyle('disabled', true);
        $('#btn_plot_cancel').prop('disabled', true);
        
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            uploadPDFAttachment(print_request_id);
            
            addPlotter(print_request_id);
            sendEmailPlotterRequestor(print_request_id);
            sendEmailPlotterAdmin(print_request_id);
            if (m_free) {
                sendEmailPlotterHonorNotification();
            }
            
            $.ladda('stopAll');
            swal({  title: "Success",
                text: "Your plotting request has been submitted successfully",
                type: "success",
                confirmButtonText: "OK" },
                function() {
                    window.open('userHome.html', '_self');
                    return false;
                }
            );
        }, 1000);
    });
    
    // duplicationg cancel button click ////////////////////////////////////////
    $('#btn_dup_cancel').click(function() {
        window.open('userHome.html', '_self');
        return false;
    });
    
    // duplicationg cancel button click ////////////////////////////////////////
    $('#btn_plot_cancel').click(function() {
        window.open('userHome.html', '_self');
        return false;
    });
    
    // auto size
    $('#dup_note').autosize();
    $('#plot_note').autosize();
    
    // bootstrap datepicker
    $('#date_needed').datepicker({minDate: new Date()});
    
    // timepicker
    $('#time_needed').timepicker();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setDefaultOption() {
    $('#nav_my_profile').hide();
    $('#nav_completed_list').hide();
    $('#nav_copier_report').hide();
    $('#nav_copier_price').hide();
    $('#nav_user_access').hide();
    
    $('#menu_administrator').hide();
    $('#menu_dup_cost_info').hide();
    
    $('#honor_student').hide();
}

function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
            $('#nav_copier_report').show();
        }
    }
}

function setUserProfile() {
    if (sessionStorage.getItem('ls_dc_loginType') !== "Student") {
        $('#nav_my_profile').show();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDeviceType() {
    var result = new Array();
    result = db_getDeviceType();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DeviceTypeID'] + "'>" + result[i]['DeviceType'] + "</option>";
    }
    
    $('#device_type').append(html);
}

function getPaperType() {
    var result = new Array();
    result = db_getPaperType();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperTypeID'] + "'>" + result[i]['PaperType'] + "</option>";
        
        switch(result[i]['PaperTypeID']) {
            case "1":
                m_bond_cost = Number(result[i]['PaperCost']);
                break;
            case "2":
                m_glossy_cost = Number(result[i]['PaperCost']);
                break;
            default:
                break;
        }
    }
    
    $('#paper_type').append(html);
}

function getDuplex() {
    var result = new Array();
    result = db_getDuplex();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DuplexID'] + "'>" + result[i]['Duplex'] + "</option>";
    }
    
    $('#duplex').append(html);
}

function getPaperColor() {
    var result = new Array();
    result = db_getPaperColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperColorID'] + "'>" + result[i]['PaperColor'] + "</option>";
    }
    
    $('#paper_color').append(html);
}

function getCoverColor() {
    var result = new Array();
    result = db_getCoverColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['CoverColorID'] + "'>" + result[i]['CoverColor'] + "</option>";
    }
    
    $('#cover_color').append(html);
}

function getPaperSize() {
    var result = new Array();
    result = db_getPaperSize();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperSizeID'] + "'>" + result[i]['PaperSize'] + "</option>";
    }
    
    $('#paper_size').append(html);
}

function getDuplicatingCopierPrice() {
    var result = new Array(); 
    result = db_getCopierPrice();
    
    if (result.length === 1) {
        m_s_letter = Number(result[0]['s_letter']);
        m_d_letter = Number(result[0]['d_letter']);
        m_s_letter_color = Number(result[0]['s_letter_color']);
        m_d_letter_color = Number(result[0]['d_letter_color']);
        m_s_legal = Number(result[0]['s_legal']);
        m_d_legal = Number(result[0]['d_legal']);
        m_s_legal_color = Number(result[0]['s_legal_color']);
        m_d_legal_color = Number(result[0]['d_legal_color']);
        m_s_tabloid = Number(result[0]['s_tabloid']);
        m_d_tabloid = Number(result[0]['d_tabloid']);
        m_s_tabloid_color = Number(result[0]['s_tabloid_color']);
        m_d_tabloid_color = Number(result[0]['d_tabloid_color']);
        m_front_cover = Number(result[0]['front_cover']);
        m_front_cover_color = Number(result[0]['front_cover_color']);
        m_back_cover = Number(result[0]['back_cover']);
        m_back_cover_color = Number(result[0]['back_cover_color']);
        m_cut = Number(result[0]['cut']);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setHonorStudent() {
    var result = new Array();
    result = db_getHonorStudentByEmail(sessionStorage.getItem("ls_dc_loginEmail"));
    
    if (result.length === 1) {
        $('#honor_student').show();
        $('#ckb_waved_proof').attr("disabled", true);
        m_free = true;
    }
}

function setDeviceDetail() {
    if (sessionStorage.getItem('ls_dc_loginType') === "Student") {
        $('#plotter_section').show();
        setHonorStudent();
        
        $('#device_type').val("1");
        $('#device_type').attr('disabled', true);
    }
    else {
        $('#nav_my_profile').show();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDepartment() {
    var result = new Array();
    result = db_getDepartment();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DepartmentID'] + "'>" + result[i]['Department'] + "</option>";
    }
    
    $('#department').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        setRequestorInformation(result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        $('#device_type').val(device_type_id);
        setAttachment();
        
        if (device_type_id === "1") {
            m_device = "Plotter";
            $('#plotter_section').show();
            setPlotter();
        }
        else {
            m_device = "Duplicating";
            $('#dept_section_1').show();
            $('#dept_section_2').show();
            $('#duplicating_section').show();
            setDuplicating();
        }
    }
}

function setRequestorInformation(login_type, login_id, requestor, email, phone, request_title) {
    $('#requestor').val(requestor);
    $('#email').val(email);
    $('#phone').val(phone);
    
    if (login_type === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#login_id').val(login_id);
    $('#request_title').val(request_title);
}

function setAttachment() {
    var result = new Array();
    result = db_getAttachment(print_request_id);
    
    if (result.length === 1) {        
        $('#pdf_file_name').html(result[0]['FileName']);
        m_total_page = result[0]['Pages'];
        $('#previous_pdf_pages').html(m_total_page);
    }
}

function setPlotter() {
    var result = new Array();
    result = db_getPlotter(print_request_id);
    
    if (result.length === 1) {        
        $('#paper_type').val(result[0]['PaperTypeID']);
        $('#paper_type').selectpicker('refresh');
        
        $('#size_height').val(result[0]['SizeHeight']);
        $('#plot_total_cost').val(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").prop('checked', true);
        }
        if (result[0]['Free'] === "0") {
            $('#honor_student').hide();
        }
        
        $('#plot_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setDuplicating() {    
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    
    if (result.length === 1) {        
        m_department_id = result[0]['DepartmentID'];
        if (m_department_id !== "0") {
            $('#department').val(m_department_id);
            $('#department').selectpicker('refresh');
        }
        
        $('#quantity').val(result[0]['Quantity']);
        $('#date_needed').val(result[0]['DateNeeded']);
        $('#date_needed').selectpicker('refresh');
        $('#time_needed').val(result[0]['TimeNeeded']);
        $('#paper_size').val(result[0]['PaperSizeID']);
        $('#paper_size').selectpicker('refresh');
        $('#duplex').val(result[0]['DuplexID']);
        $('#duplex').selectpicker('refresh');
        $('#paper_color').val(result[0]['PaperColorID']);
        $('#paper_color').selectpicker('refresh');
        $('#cover_color').val(result[0]['CoverColorID']);
        $('#cover_color').selectpicker('refresh');
        
        if (result[0]['ColorCopy'] === "1") {
            $("#ckb_color_copy").prop('checked', true);
        }
        if (result[0]['FrontCover'] === "1") {
            $("#ckb_front_cover").prop('checked', true);
        }
        if (result[0]['BackCover'] === "1") {
            $("#ckb_back_cover").prop('checked', true);
        }
        if (result[0]['Confidential'] === "1") {
            $("#ckb_confidential").prop('checked', true);
        }
        if (result[0]['ThreeHolePunch'] === "1") {
            $("#ckb_three_hole_punch").prop('checked', true);
        }
        if (result[0]['Staple'] === "1") {
            $("#ckb_staple").prop('checked', true);
        }
        if (result[0]['Cut'] === "1") {
            $("#ckb_cut").prop('checked', true);
        }
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        $('#dup_note').val(result[0]['Note']);
        
        calculateDupTotalCost();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//function getUserInformation() {
//    if (sessionStorage.getItem('ls_dc_loginType') === "Staff") {
//        $('#login_type').html("Employee ID:");
//        
//        var result = new Array();
//        result = db_getUserProfile(sessionStorage.getItem('ls_dc_loginEmail'));
//        $('#requestor').val(result[0]['UserName']);
//        $('#email').val(result[0]['UserEmail']);
//        $('#phone').val(result[0]['UserPhone']);
//        $('#login_id').val(result[0]['EmployeeID']);
//        m_department_id = result[0]['DepartmentID'];
//        $('#user_depart').val(db_getDepartmentName(m_department_id));
//        $('#department').val(m_department_id);
//    }
//    else {
//        $('#login_type').html("Student ID:");
//        $('#requestor').val(sessionStorage.getItem('ls_dc_loginDisplayName'));
//        $('#email').val(sessionStorage.getItem('ls_dc_loginEmail'));
//        $('#phone').val(sessionStorage.getItem('ls_dc_loginPhone'));
//        $('#phone').attr("readonly", false);
//        $('#login_id').val(sessionStorage.getItem('ls_dc_loginID'));
//    }
//}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    m_file_size = file.size;
    
    if (typeof file !== "undefined") { 
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            alert("Only PDF file can be upload");
            m_file_attached = false;
            $('#attachment_file').filestyle('clear');
            $('#pdf_pages').val("");
            return false;
        } 
        else {   
            if (m_file_size >= 20000000) {
                alert("Attached file size is too big, max. file size allow is 20Mb or less");
                m_file_attached = false;
                $('#attachment_file').filestyle('clear');
                $('#pdf_pages').val("");
                return false;
            }
            else {
                var file_data = new FormData();
                file_data.append("files[]", file, f_name); 
                m_total_page = pdfGetTotalPages(file_data);
                if (m_total_page === 0) {
                    m_file_attached = false;
                    return false;
                }
                else {
                    m_file_attached = true;
                    $('#pdf_pages').val(m_total_page);
                    calculateDupTotalCost();
                    return true;
                }
            }
        }
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculateDupTotalCost() {
    m_str_dup_cost_info = "";
    var paper_cost = 0.0;
    var quantity = Number($('#quantity').val());
    var paper_color = $('#paper_color option:selected').text();
    
    m_str_dup_cost_info += "Original Page: " + m_total_page + "<br/>";
    m_str_dup_cost_info += "Quantity: " + quantity + "<br/>";
    m_str_dup_cost_info += "Paper Color: " + paper_color + "<br/>";
    
    paper_cost = getPrintPaperPrice();
    var front_cover = frontCoverCost();
    var back_cover = backCoverCost();
    
    confidential();
    threeHolePunchCost();
    stapleCost();
    
    var total_cost = paper_cost * quantity * Number(m_total_page);
    total_cost += front_cover + back_cover + cutCost();
    
    m_str_dup_cost_info += "<b>Print Cost: " + formatDollar(paper_cost, 3) + "</b><br>";
    
    $('#dup_cost_info').html(m_str_dup_cost_info.trim());
    $('#dup_total_print').html("<b>Total Print: " + (quantity * Number(m_total_page)) + "</b>");
    $('#dup_total_cost').html("<b>Total Cost: " + formatDollar(total_cost, 2) + "</b>");
}

function getPrintPaperPrice() {
    var cost = 0.0;
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    
    switch(paper_size_id) {
        case "1":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11 Color Copy<br/>";
                if (duplex_id === "1") {
                    cost = m_s_letter_color;
                }
                else {
                    cost = m_d_letter_color;
                }
            }
            else {
                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11<br/>";
                if (duplex_id === "1") {
                    cost = m_s_letter;
                }
                else {
                    cost = m_d_letter;
                }
            }
            break;
        case "2":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14 Color Copy<br/>";
                if (duplex_id === "1") {
                    cost = m_s_legal_color;
                }
                else {
                    cost = m_d_legal_color;
                }
            }
            else {
                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14<br/>";
                if (duplex_id === "1") {
                    cost = m_s_legal;
                }
                else {
                    cost = m_d_legal;
                }
            }
            break;
        case "3":
            if (color_copy) {
                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17 Color Copy<br/>";
                if (duplex_id === "1") {
                    cost = m_s_tabloid_color;
                }
                else {
                    cost = m_d_tabloid_color;
                }
            }
            else {
                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17<br/>";
                if (duplex_id === "1") {
                    cost = m_s_tabloid;
                }
                else {
                    cost = m_d_tabloid;
                }
            }
            break;
        default:
            break;
    }
    
    return cost;
}

function frontCoverCost() {
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    if (front_cover) {
        if (color_cover_id === "1") {
            m_str_dup_cost_info += "Front Cover White : " + formatDollar(m_front_cover, 2) + "<br/>";
            return m_front_cover;
        }
        else {
            m_str_dup_cost_info += "Front Cover " + cover_color + " : " + formatDollar(m_front_cover_color, 2) + "<br/>";
            return m_front_cover_color;
        }
    }
    else {
        return 0.0;
    }
}

function backCoverCost() {
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    if (back_cover) {
        if (color_cover_id === "1") {
            m_str_dup_cost_info += "Back Cover White : " + formatDollar(m_back_cover, 2) + "<br/>";
            return m_back_cover;
        }
        else {
            m_str_dup_cost_info += "Back Cover " + cover_color + " : " + formatDollar(m_back_cover_color, 2) + "<br/>";
            return m_back_cover_color;
        }
    }
    else {
        return 0.0;
    }
}

function confidential() {
    var confidential = ($('#ckb_confidential').is(':checked') ? true : false);
    if (confidential) {
        m_str_dup_cost_info += "Confidential<br/>";
    }
}

function threeHolePunchCost() {
    var three_hole_punch = ($('#ckb_three_hole_punch').is(':checked') ? true : false);
    if (three_hole_punch) {
        m_str_dup_cost_info += "3 Hole Punch<br/>";
    }
}

function stapleCost() {
    var staple = ($('#ckb_staple').is(':checked') ? true : false);
    if (staple) {
        m_str_dup_cost_info += "Staple<br/>";
    }
}

function cutCost() {
    var cut = ($('#ckb_cut').is(':checked') ? true : false);
    if (cut) {
        m_str_dup_cost_info += "Cut : " + formatDollar(m_cut, 2) + "<br/>";
        return m_cut;
    }
    else {
        return 0.0;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailPlotterRequestor(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = $('#requestor').val();
    var email = $('#email').val();
    
    var subject = "Your new plotter request has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your plotter request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + "<br><br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";
    
    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "printRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotterAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = "Copier Center";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "A new plotter request has been created";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new plotter request.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + "<br>";
    message += "Employee Type: " + sessionStorage.getItem('ls_dc_loginType') + "<br><br>";
    
    message += "Please use the link below to open request at anytime.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "printRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotterHonorNotification() {
    var name = "";
    var email = "jrudmann@ivc.edu;kryals@ivc.edu";
    
    var subject = "A new plotter request from honor student has been submitted";
    var message = "Dear Jerry Rudmann/Kay Ryals, <br><br>";
    message += "There is a new plotter request from honor student.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + " <strong>Free of Charge</strong><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDuplicatingRequestor(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = $('#requestor').val();
    var email = $('#email').val();
    
    var subject = "Your new duplicating request has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your duplicating request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#date_needed').val() + " " + $('#time_needed').val() + "<br>";
    message += "Quantity: " + $('#quantity').val() + "<br>";
    message += "Department: " + $('#department').html() + "<br><br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "printRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailDuplicatingAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = "Copier Center";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "A new duplicating request has been created";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new duplicating request.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Email: " + $('#email').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#date_needed').val() + " " + $('#time_needed').val() + "<br>";
    message += "Quantity: " + $('#quantity').val() + "<br><br>";
    
    message += "Please use the link below to open request at anytime.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "printRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}