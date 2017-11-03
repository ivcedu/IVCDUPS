// plotting copier price
var m_bond_cost = 0.00;
var m_glossy_cost = 0.00;
var m_free = false;

// pdf file system
var m_file_size = 0;
var m_file_attached = false;
var m_edit_attachment = false;
var m_total_page = 0;

var m_str_dup_cost_info = "";
var m_str_cat_cost_info = "";

var m_dup_total_print = 0;
var m_dup_total_cost = 0.00;

var m_cat_total_print = 0;
var m_cat_total_cost = 0.00;

var print_request_id = "";
var m_device = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setAdminOption();
        getLoginInfo();
        
        getURLParameters();
        db_updatePrintRequestLocked(print_request_id, true);
        
        getUserCostCenterList();
        getPaperType();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getPaperSize();
        getBindingList();
        cp_Object.getCopierPriceList();
        getCatSectionList();
        
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
        db_updatePrintRequestLocked(print_request_id, false);
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // catalog section dropdown event //////////////////////////////////////////
    $('#cat_section_list').change(function() { 
        if ($(this).val() === "0") {
            $('#cat_section_pages').val("");
            $('#cat_section_cost').val("");
            $('#cat_section_options').val("");
        }
        else {
            var result = new Array();
            result = db_getCatSectionByID($(this).val());
            $('#cat_section_pages').val(result[0]["Pages"]);
            $('#cat_section_cost').val(formatDollar(Number(result[0]["Cost"]), 2));
            $('#cat_section_options').val(result[0]["Options"]);
            calculateCatTotalCost();
        }
        return false;
    });
    
    // attachement file click event/////////////////////////////////////////////
    $('#view_attachment_file').click(function() {  
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
    
    // edit file button click //////////////////////////////////////////////////
    $('#btn_edit_attachment').click(function() {
        m_edit_attachment = true;
        $('#file_view_section').hide();
        $('#file_edit_section').show();
        return false;
    });
    
    // go back file button click ///////////////////////////////////////////////
    $('#btn_go_back_attachment').click(function() {
        m_edit_attachment = false;
        $('#file_view_section').show();
        $('#file_edit_section').hide();
        return false;
    });
    
    // file change event ///////////////////////////////////////////////////////
    $('#attachment_file').change(function() { 
        $('#spinner_attachment').show();
        setTimeout(function() {      
            getPDFAttachmentInfo();
            $('#spinner_attachment').hide();
        }, 1000);
    });
    
    // catalog event /////////////////////////////////////////////////////////// 
    $('#cat_quantity').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));  
        input_val = Math.abs(input_val);
        input_val = Math.floor(input_val);
        $(this).val(input_val);
        calculateCatTotalCost();
    });
    
    // duplicating event ///////////////////////////////////////////////////////    
    $('#quantity').change(function() {      
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));
        input_val = Math.abs(input_val);
        input_val = Math.floor(input_val);
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
    
    $('#binding').change(function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_color_copy').on('ifChanged', function() {
        if ($('#ckb_color_copy').is(':checked')) {
            $('#ckb_first_pg_color_print').iCheck('uncheck');
            $('#ckb_last_pg_color_print').iCheck('uncheck');
            $('#page_color_option_section').hide();
        }
        else {
            $('#page_color_option_section').show();
        }
        calculateDupTotalCost();
    });
    
    $('#ckb_front_cover').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_back_cover').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_confidential').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_three_hole_punch').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_staple').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_cut').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_booklet').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_first_pg_color_print').on('ifChanged', function() {
        calculateDupTotalCost();
    });
    
    $('#ckb_last_pg_color_print').on('ifChanged', function() {
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
        $(this).val(input_val);
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
    
    // catalog submit button click /////////////////////////////////////////////
    $('#btn_cat_update').click(function() { 
        var err_main = formValidation2();
        var err_catalog = catalogValidation();
        
        if (err_main !== "") {
            $.ladda('stopAll');
            swal("Error", err_main, "error");
            return false;
        }
        if (err_catalog !== "") {
            $.ladda('stopAll');
            swal("Error", err_catalog, "error");
            return false;
        }
        
        $('#btn_cat_delete').prop('disabled', true);
        $('#btn_cat_cancel').prop('disabled', true);
        
        setTimeout(function() {    
            udpateCatalog(print_request_id);
            db_updateReceipt(print_request_id, m_str_cat_cost_info);
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Catalog request has been changed");
            sendEmailUpdateAdmin(print_request_id, "Catalog");
            
            $.ladda('stopAll');
            db_updatePrintRequestLocked(print_request_id, false);
            
            swal({  title: "Updated",
                text: "Your catalog request has been updated successfully",
                type: "success",
                confirmButtonText: "OK" },
                function() {
                    window.open('userHome.html', '_self');
                    return false;
                }
            );
        }, 1000);
    });
    
    // duplicationg submit button click ////////////////////////////////////////
    $('#btn_dup_update').click(function() {     
        var err_main = formValidation();
        var err_duplicating = duplicatingValidation();
        
        if (err_main !== "") {
            $.ladda('stopAll');
            swal("Error", err_main, "error");
            return false;
        }
        if (err_duplicating !== "") {
            $.ladda('stopAll');
            swal("Error", err_duplicating, "error");
            return false;
        }
        
        $('#attachment_file').filestyle('disabled', true);
        $('#btn_edit_attachment').prop('disabled', true);
        $('#btn_go_back_attachment').prop('disabled', true);
        $('#btn_dup_delete').prop('disabled', true);
        $('#btn_dup_cancel').prop('disabled', true);
        
        setTimeout(function() {            
            if (m_edit_attachment) {
                var result = new Array();
                result = db_getAttachment(print_request_id);
                if (result.length === 1) {
                    deleteAttachFile(result[0]['FileLinkName']);
                }
                db_deleteAttachment(print_request_id);
                uploadPDFAttachment(print_request_id);
            }
            
            updateDuplicating(print_request_id);
            db_updateReceipt(print_request_id, m_str_dup_cost_info);
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Duplicating request has been changed");
            sendEmailUpdateAdmin(print_request_id, "Duplicating");
            
            $.ladda('stopAll');
            db_updatePrintRequestLocked(print_request_id, false);
            
            swal({  title: "Updated",
                text: "Your duplication request has been updated successfully",
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
    $('#btn_plot_update').click(function() {
        var err_main = formValidation();
        var err_plotter = plotterValidation();
        
        if (err_main !== "") {
            $.ladda('stopAll');
            swal("Error", err_main, "error");
            return false;
        }
        if (err_plotter !== "") {
            $.ladda('stopAll');
            swal("Error", err_plotter, "error");
            return false;
        }
        
        $('#attachment_file').filestyle('disabled', true);
        $('#btn_edit_attachment').prop('disabled', true);
        $('#btn_go_back_attachment').prop('disabled', true);
        $('#btn_plot_delete').prop('disabled', true);
        $('#btn_plot_cancel').prop('disabled', true);
        
        setTimeout(function() {
            if (m_edit_attachment) {
                var result = new Array();
                result = db_getAttachment(print_request_id);
                if (result.length === 1) {
                    deleteAttachFile(result[0]['FileLinkName']);
                }
                db_deleteAttachment(print_request_id);
                uploadPDFAttachment(print_request_id);
            }
            
            updatePlotter(print_request_id);
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Plotter request has been changed");
            sendEmailUpdateAdmin(print_request_id, "Plotter");
            sendEmailPlotterHonorUpdateNotification("Jerry Rudmann", "jrudmann@ivc.edu");
            sendEmailPlotterHonorUpdateNotification("Kay Ryals", "kryals@ivc.edu");
            
            
            $.ladda('stopAll');
            db_updatePrintRequestLocked(print_request_id, false);
            
            swal({  title: "Updated",
                text: "Your plotting request has been updated successfully",
                type: "success",
                confirmButtonText: "OK" },
                function() {
                    window.open('userHome.html', '_self');
                    return false;
                }
            );
        }, 1000);
    });
    
    // catalog delete button click /////////////////////////////////////////////
    $('#btn_cat_delete').click(function() {
        swal({ title: "Are you sure?", 
               text: "You will not be able to recover this print request",
               type: "warning", 
               showCancelButton: true, 
               confirmButtonColor: "#DD6B55", 
               confirmButtonText: "Yes, delete it",
               cancelButtonText: "No, close",
               closeOnConfirm: false }, 
               function() {                    
                    db_updateCatalogStatus(print_request_id, 6);
                    db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Catalog print request has been deleted");
                    sendEmailAdminPrintRequestDeleted("Duplicating");
            
                    db_updatePrintRequestLocked(print_request_id, false);
                    swal({  title: "Deleted!",
                            text: "Catalog print request has been deleted",
                            type: "success",
                            confirmButtonText: "OK" },
                            function() {
                                window.open('userHome.html', '_self');
                                return false;
                            }
                        );
               }
            );
    });
    
    // duplicationg delete button click ////////////////////////////////////////
    $('#btn_dup_delete').click(function() {
        swal({ title: "Are you sure?", 
               text: "You will not be able to recover this print request",
               type: "warning", 
               showCancelButton: true, 
               confirmButtonColor: "#DD6B55", 
               confirmButtonText: "Yes, delete it",
               cancelButtonText: "No, close",
               closeOnConfirm: false }, 
               function() {                    
                    db_updateDuplicating(print_request_id, 6);
                    db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Duplicating print request has been deleted");
                    sendEmailAdminPrintRequestDeleted("Duplicating");
            
                    db_updatePrintRequestLocked(print_request_id, false);
                    swal({  title: "Deleted!",
                            text: "Duplicating print request has been deleted",
                            type: "success",
                            confirmButtonText: "OK" },
                            function() {
                                window.open('userHome.html', '_self');
                                return false;
                            }
                        );
               }
            );
    });
    
    // plotting delete button click ////////////////////////////////////////////
    $('#btn_plot_delete').click(function() {
        swal({ title: "Are you sure?", 
               text: "You will not be able to recover this print request",
               type: "warning", 
               showCancelButton: true, 
               confirmButtonColor: "#DD6B55", 
               confirmButtonText: "Yes, delete it",
               cancelButtonText: "No, close",
               closeOnConfirm: false }, 
               function() {                    
                    db_updatePlotter(print_request_id, 9);
                    db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Plotter print request has been deleted");
                    sendEmailAdminPrintRequestDeleted("Plotter");
                    
                    db_updatePrintRequestLocked(print_request_id, false);
                    swal({  title: "Deleted!",
                            text: "Plotter print request has been deleted",
                            type: "success",
                            confirmButtonText: "OK" },
                            function() {
                                window.open('userHome.html', '_self');
                                return false;
                            }
                        );
               }
            );
    });
    
    // catalog cancel button click /////////////////////////////////////////////
    $('#btn_cat_cancel').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('userHome.html', '_self');
        return false;
    });
    
    // duplicationg cancel button click ////////////////////////////////////////
    $('#btn_dup_cancel').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('userHome.html', '_self');
        return false;
    });
    
    // plotting cancel button click ////////////////////////////////////////////
    $('#btn_plot_cancel').click(function() {
        db_updatePrintRequestLocked(print_request_id, false);
        window.open('userHome.html', '_self');
        return false;
    });
    
    // auto size
    $('#cat_note').autosize();
    $('#dup_note').autosize();
    $('#plot_note').autosize();
    
    // bootstrap datepicker
    $('#date_needed').datepicker({ minDate: new Date(), beforeShowDay: $.datepicker.noWeekends });
    $('#cat_date_needed').datepicker({ minDate: new Date(), beforeShowDay: $.datepicker.noWeekends });
    
    // timepicker
    $('#time_needed').timepicker();
    $('#cat_time_needed').timepicker();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function formValidation() {
    var err = "";

    if ($('#phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    if ($('#request_title').val().replace(/\s+/g, '') === "") {
        err += "Request title is a required field\n";
    }
    if (m_edit_attachment && !m_file_attached) {
        err += "Attachment is a required field\n";
    }
    if (m_edit_attachment && m_file_attached && m_total_page === 0) {
        m_file_attached = false;
        $('#attachment_file').filestyle('clear');
        $('#edit_pdf_pages').val("");
        err += "Your PDF file are not correctly formatted. please verify your pdf file again\n";
    }
    
    return err;
}

function plotterValidation() {
    var err = "";
    
    if ($('#size_height').val().replace(/\s+/g, '') === "" || $('#size_height').val().replace(/\s+/g, '') === "0") {
        err += "Size is a required field\n";
    }
    if ($('#ckb_terms_condition').is(':checked') === false) {
        err += "Please check Terms and Condition\n";
    }
    
    return err;
}

function duplicatingValidation() {
    var err = "";
    
    if ($('#quantity').val().replace(/\s+/g, '') === "" || $('#quantity').val().replace(/\s+/g, '') === "0") {
        err += "Quantity is a required field\n";
    }
    if ($('#date_needed').val().replace(/\s+/g, '') === "") {
        err += "Date needed is a required field\n";
    }
    if ($('#time_needed').val().replace(/\s+/g, '') === "") {
        err += "Time needed is a required field\n";
    }
    
    return err;
}

function formValidation2() {
    var err = "";

    if ($('#phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    if ($('#request_title').val().replace(/\s+/g, '') === "") {
        err += "Request title is a required field\n";
    }
    if ($('#device_type').val() === "Select...") {
        err += "Divice type is a required field\n";
    }
    return err;
}

function catalogValidation() {
    var err = "";
    
    if ($('#cat_section_list').val() === "0") {
        err += "Catalog section is a required field\n";
    }
    if ($('#cat_quantity').val().replace(/\s+/g, '') === "" || $('#cat_quantity').val().replace(/\s+/g, '') === "0") {
        err += "Quantity is a required field\n";
    }
    if ($('#cat_date_needed').val().replace(/\s+/g, '') === "") {
        err += "Date needed is a required field\n";
    }
    if ($('#cat_time_needed').val().replace(/\s+/g, '') === "") {
        err += "Time needed is a required field\n";
    }
    
    return err;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    
    var html = "<option value='0'>None</option>";
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

function getBindingList() {
    var result = new Array();
    result = db_getBindingList();
    
    var html = "<option value='0'>None</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['BindingID'] + "'>" + result[i]['Binding'] + "</option>";
    }
    
    $('#binding').append(html);
}

function getCatSectionList() {
    var result = new Array(); 
    result = db_getCatSectionList();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['CatSectionID'] + "'>" + result[i]['SectionName'] + "</option>";
    }
    
    $('#cat_section_list').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getUserCostCenterList() {
    var result = new Array();
    result = JSON.parse(sessionStorage.getItem('ls_dc_usr_cost_center_list'));

    var html = "";
    for (var i = 0; i < result.length; i++) {
        var ar_cost_center = result[i].split(":");
        html += "<option value='" + ar_cost_center[0] + "'>" + ar_cost_center[1] + "</option>";
    }
    
    $('#billing_depart').append(html);
    $('#cat_billing_depart').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        setRequestorInformation(result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        $('#device_type').val(db_getDeviceTypeName(device_type_id));
        setAttachment();
        
        if (device_type_id === "1") {
            m_device = "Plotter";
            $('#plotter_section').show();
            setPlotter();
        }
        else if (device_type_id === "2") {
            m_device = "Duplicating";
            $('#duplicating_section').show();
            $('#menu_dup_cost_info').show();
            setDuplicating();
        }
        else if (device_type_id === "4") {
            m_device = "Catalog";
            $('#attachment_section').hide();
            $('#catalog_section').show();
            $('#menu_dup_cost_info').show();
            setCatalog();
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
        $('#view_attachment_file').html(result[0]['FileName']);
        $('#pdf_pages').html(result[0]['Pages']);
        m_total_page = Number(result[0]['Pages']);
        duplexSettingForPages();
    }
}

function setPlotter() {
    var result = new Array();
    result = db_getPlotter(print_request_id);
    
    if (result.length === 1) {        
        $('#paper_type').val(result[0]['PaperTypeID']);
        
        $('#size_height').val(result[0]['SizeHeight']);
        $('#plot_total_cost').val(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").prop('checked', true);
        }
        if (result[0]['Free'] === "1") {
            $('#honor_student').show();
        }
        
        $('#plot_note').val(result[0]['Note']);
    }
}

function setDuplicating() {    
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    
    if (result.length === 1) {          
        $('#billing_depart').val(result[0]['CostCenterID']);
        $('#quantity').val(result[0]['Quantity']);
        $('#date_needed').val(result[0]['DateNeeded']);
        $('#time_needed').val(result[0]['TimeNeeded']);
        $('#paper_size').val(result[0]['PaperSizeID']);
        $('#duplex').val(result[0]['DuplexID']);
        $('#paper_color').val(result[0]['PaperColorID']);
        $('#cover_color').val(result[0]['CoverColorID']);
        $('#binding').val(result[0]['BindingID']);
        
        if (result[0]['ColorCopy'] === "1") {
            $("#ckb_color_copy").iCheck('check');
            $('#page_color_option_section').hide();
        }
        if (result[0]['FrontCover'] === "1") {
            $("#ckb_front_cover").iCheck('check');
        }
        if (result[0]['BackCover'] === "1") {
            $("#ckb_back_cover").iCheck('check');
        }
        if (result[0]['Confidential'] === "1") {
            $("#ckb_confidential").iCheck('check');
        }
        if (result[0]['ThreeHolePunch'] === "1") {
            $("#ckb_three_hole_punch").iCheck('check');
        }
        if (result[0]['Staple'] === "1") {
            $("#ckb_staple").iCheck('check');
        }
        if (result[0]['Cut'] === "1") {
            $("#ckb_cut").iCheck('check');
        }
        if (result[0]['Booklet'] === "1") {
            $("#ckb_booklet").iCheck('check');
        }
        if (result[0]['FirstPgColorPrint'] === "1") {
            $("#ckb_first_pg_color_print").iCheck('check');
        }
        if (result[0]['LastPgColorPrint'] === "1") {
            $("#ckb_last_pg_color_print").iCheck('check');
        }
        
        $('#dup_note').val(result[0]['Note']);
        
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        
        calculateDupTotalCost();
    }
}

function setCatalog() {
    var result = new Array();
    result = db_getCatalogByPrintRequestID(print_request_id);
    
    if (result.length === 1) { 
        var result2 = new Array();
        result2 = db_getCatSectionByID(result[0]['CatSectionID']);
        
        $('#cat_billing_depart').val(result[0]['CostCenterID']);
        $('#cat_fiscal_year').val(result2[0]['FiscalYear']);
        $('#cat_section_options').val(result2[0]["Options"]);
        $('#cat_section_pages').val(result2[0]["Pages"]);
        $('#cat_section_list').val(result2[0]['CatSectionID']);
        $('#cat_section_cost').val(formatDollar(Number(result2[0]["Cost"]), 2));
        $('#cat_quantity').val(result[0]['Quantity']);
        $('#cat_date_needed').val(result[0]['DateNeeded']);
        $('#cat_time_needed').val(result[0]['TimeNeeded']);
        $('#cat_note').val(result[0]['Note']);
        
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        
        calculateCatTotalCost();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    
    if (typeof file !== "undefined") { 
        var f_name = removeIllegalCharacters(file.name);
        f_name = removeDiacritics(f_name);
        m_file_size = file.size;
        var f_extension = getFileExtension(f_name);
        
        if (f_extension !== "pdf") {
            alert("Only PDF file can be upload");
            m_file_attached = false;
            $('#attachment_file').filestyle('clear');
            $('#edit_pdf_pages').val("");
            return false;
        } 
        else {   
            if (m_file_size >= 20000000) {
                alert("Attached file size is too big, max. file size allow is 20Mb or less");
                m_file_attached = false;
                $('#attachment_file').filestyle('clear');
                $('#edit_pdf_pages').val("");
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
                    $('#edit_pdf_pages').val(m_total_page);
                    duplexSettingForPages();
                    calculateDupTotalCost();
                    return true;
                }
            }
        }
    }
    else {
        m_total_page = 0;
        $('#edit_pdf_pages').val("");
        duplexSettingForPages();
        calculateDupTotalCost();
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function duplexSettingForPages() {
    if (m_total_page === 1) {
        $('#duplex').val("1");
        $('#duplex').attr('disabled', true);
    }
    else {
        $('#duplex').attr('disabled', false);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculateCatTotalCost() {
    m_str_cat_cost_info = "";   
    m_str_cat_cost_info += "Pages: " + $('#cat_section_pages').val() + "<br/>";
    m_str_cat_cost_info += "Quantity: " + $('#cat_quantity').val() + "<br/>";
    
    m_cat_total_print = Number($('#cat_quantity').val()) * Number($('#cat_section_pages').val());
    m_cat_total_cost = Number($('#cat_section_cost').val().replace("$", "")) * Number($('#cat_quantity').val());
    
    $('#dup_cost_info').html(m_str_cat_cost_info.trim());
    $('#dup_total_print').html("<b>Total Print: " + m_cat_total_print + "</b>");
    $('#dup_total_cost').html("<b>Total Cost: " + formatDollar(m_cat_total_cost, 2) + "</b>");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculateDupTotalCost() {
    m_str_dup_cost_info = "";
    var quantity = Number($('#quantity').val());
    var paper_color = $('#paper_color option:selected').text();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    
    m_str_dup_cost_info += "Original Page: " + m_total_page + "<br/>";
    m_str_dup_cost_info += "Quantity: " + quantity + "<br/>";
    m_str_dup_cost_info += "Paper Color: " + paper_color + "<br/>";
    
    var print_cost = getPrintPaperPrice(color_copy) * quantity * m_total_page;
    var total_cost = print_cost + bindingCost() + frontCoverCost() + backCoverCost() + cutCost() + bookletCost();
    if (!color_copy) {
        total_cost += getFirstPgColorPrint(quantity);
        total_cost += getLastPgColorPrint(quantity);
    }
    
    confidential();
    threeHolePunchCost();
    stapleCost();
    
    m_str_dup_cost_info += "<b>Print Cost: " + formatDollar(print_cost, 3) + "</b><br>";
    m_dup_total_print = quantity * m_total_page;
    m_dup_total_cost = total_cost;
    
    $('#dup_cost_info').html(m_str_dup_cost_info.trim());
    $('#dup_total_print').html("<b>Total Print: " + (quantity * m_total_page) + "</b>");
    $('#dup_total_cost').html("<b>Total Cost: " + formatDollar(total_cost, 2) + "</b>");
}

function getPrintPaperPrice(color_copy) {
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    
    m_str_dup_cost_info += cp_Object.getPrintPaperPriceText(paper_size_id, color_copy);
    return cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, color_copy);
}

function frontCoverCost() {
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    
    if (front_cover) {
        m_str_dup_cost_info += cp_Object.getFrontCoverPriceText(color_cover_id, cover_color);
        return cp_Object.getFrontCoverPrice(color_cover_id);
    } 
    else {
        return 0.00;
    }
}

function backCoverCost() {
    var color_cover_id = $('#cover_color').val();
    var cover_color = $('#cover_color option:selected').text();
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    
    if (back_cover) {
        m_str_dup_cost_info += cp_Object.getBackCoverPriceText(color_cover_id, cover_color);
        return cp_Object.getBackCoverPrice(color_cover_id);
    }
    else {
        return 0.00;
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
        return 0.00;
    }
}

function bindingCost() {
    var binding_id = $('#binding').val();
    m_str_dup_cost_info += cp_Object.getBindingPriceText(binding_id);
    return cp_Object.getBindingPrice(binding_id);
}

function bookletCost() {
    var booklet = ($('#ckb_booklet').is(':checked') ? true : false);
    if (booklet) {
        m_str_dup_cost_info += "Booklet : " + formatDollar(cp_Object.getBooklet(), 2) + "<br/>";
        return cp_Object.getBooklet();
    }
    else {
        return 0.00;
    }
}

function getFirstPgColorPrint(qty) {
    var first_pg_color_print = ($('#ckb_first_pg_color_print').is(':checked') ? true : false);
    if (first_pg_color_print) {
        var paper_size_id = $('#paper_size').val();
        var duplex_id = $('#duplex').val();
        
        var first_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var first_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        m_str_dup_cost_info += "First Page Color Print: " + formatDollar(first_color_price - first_bw_price, 2) + "<br/>";
        return first_color_price - first_bw_price;
    }
    else {
        return 0.00;
    }
}

function getLastPgColorPrint(qty) {
    var last_pg_color_print = ($('#ckb_last_pg_color_print').is(':checked') ? true : false);
    if (last_pg_color_print) {
        var paper_size_id = $('#paper_size').val();
        var duplex_id = $('#duplex').val();
   
        var last_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var last_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        m_str_dup_cost_info += "Last Page Color Print: " + formatDollar(last_color_price - last_bw_price, 2) + "<br/>";
        return last_color_price - last_bw_price;
    }
    else {
        return 0.00;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function uploadPDFAttachment(print_request_id) {
    var file = $('#attachment_file').get(0).files[0];    
    var file_data = new FormData();  
    var f_name = file.name.replace(/#/g, "").replace(/'/g, "");
    var php_flname = print_request_id + "_fileIndex_" + f_name;
    file_data.append("files[]", file, php_flname); 

    var attachment_id = uploadAttachFile(file_data);
    if (attachment_id === "") {
        return false;
    }
    else {   
        var pages = $('#edit_pdf_pages').val();
        db_updateAttachmentPages(attachment_id, pages);
        return true;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updatePlotter(print_request_id) {
    var paper_type_id = $('#paper_type').val();
    var size_height = textReplaceApostrophe($('#size_height').val());
    var size_width = textReplaceApostrophe($('#size_width').val());
    var plot_total_cost = revertDollar($('#plot_total_cost').val());
    var waved_proof = ($('#ckb_waved_proof').is(':checked') ? true : false);
    var note = textReplaceApostrophe($('#plot_note').val());
    
    return db_updatePlotterRequest(print_request_id, paper_type_id, size_height, size_width, plot_total_cost, waved_proof, note);
}

function updateDuplicating(print_request_id) {
    var cost_center_id = $('#billing_depart').val();
    var quantity = textReplaceApostrophe($('#quantity').val());
    var date_needed = textReplaceApostrophe($('#date_needed').val());
    var time_needed = textReplaceApostrophe($('#time_needed').val());
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    var paper_color_id = $('#paper_color').val();
    var cover_color_id = $('#cover_color').val();
    var color_copy = ($('#ckb_color_copy').is(':checked') ? true : false);
    var front_cover = ($('#ckb_front_cover').is(':checked') ? true : false);
    var back_cover = ($('#ckb_back_cover').is(':checked') ? true : false);
    var confidential = ($('#ckb_confidential').is(':checked') ? true : false);
    var three_hole_punch = ($('#ckb_three_hole_punch').is(':checked') ? true : false);
    var staple = ($('#ckb_staple').is(':checked') ? true : false);
    var cut = ($('#ckb_cut').is(':checked') ? true : false);
    var binding_id = $('#binding').val();
    var booklet = ($('#ckb_booklet').is(':checked') ? true : false);
    var first_pg_color_print = ($('#ckb_first_pg_color_print').is(':checked') ? true : false);
    var last_pg_color_print = ($('#ckb_last_pg_color_print').is(':checked') ? true : false);
    var total_print = m_dup_total_print;
    var dup_total_cost = m_dup_total_cost;
    var note = textReplaceApostrophe($('#dup_note').val());
    
    return db_updateDuplicatingRequest(print_request_id, cost_center_id, quantity, date_needed, time_needed, paper_size_id, duplex_id, paper_color_id, cover_color_id, color_copy, front_cover, back_cover,
                                        confidential, three_hole_punch, staple, cut, binding_id, booklet, first_pg_color_print, last_pg_color_print, total_print, dup_total_cost, note);
}

function udpateCatalog(print_request_id) {
    var cat_section_id = $('#cat_section_list').val();
    var cost_center_id = $('#cat_billing_depart').val();
    var quantity = textReplaceApostrophe($('#cat_quantity').val());
    var date_needed = $('#cat_date_needed').val();
    var time_needed = $('#cat_time_needed').val();
    var total_print = m_cat_total_print;
    var total_cost = m_cat_total_cost;
    var note = textReplaceApostrophe($('#cat_note').val());
    
    return db_updateCatalogRequest(print_request_id, cat_section_id, cost_center_id, quantity, date_needed, time_needed, total_print, total_cost, note);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailPlotterHonorUpdateNotification(name, email) {    
    var subject = "A plotter request from honor student has been updated";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a updated plotter request from honor student. Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Paper Type: " + db_getPaperTypeName($('#paper_type').val()) + "<br>";
    message += "Size: " + $('#size_height').val() + " x " + $('#size_width').val() + "<br>";
    message += "Total Cost: " + $('#plot_total_cost').val() + " <strong>Free of Charge</strong><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailAdminPrintRequestDeleted(device_type) {
    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = device_type + " print request has been canceled";
    var message = "Dear " + name + ", <br><br>";
    message += device_type + " print request, title <strong>" + $('#request_title').val() + "</strong> has been canceled from requestor<br>";    
    message += "Please refresh your admin page.<br><br>";

    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailUpdateAdmin(print_request_id, device_type) {
    var url_param = "adminPrintRequest.html?print_request_id=" + print_request_id;

    var name = "Jose Delgado";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = device_type + " print request has been changed";
    var message = "Dear " + name + ", <br><br>";
    message += device_type + " print request, title <strong>" + $('#request_title').val() + "</strong> has been changed<br>";    
    message += "Please refresh your admin page and use the link below to open request at anytime.<br><br>";
    
    var login_from = sessionStorage.getItem("ls_dc_loginFrom");
    var str_url = login_from.replace("Login.html", url_param);

    message += "<a href='" + str_url + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}