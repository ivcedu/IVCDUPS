// plotting copier price
var m_bond_cost = 0.00;
var m_glossy_cost = 0.00;
var m_free = false;

// duplicating copier price
//var m_s_letter = 0.00;
//var m_d_letter = 0.00;
//var m_s_letter_color = 0.00;
//var m_d_letter_color = 0.00;
//var m_s_legal = 0.00;
//var m_d_legal = 0.00;
//var m_s_legal_color = 0.00;
//var m_d_legal_color = 0.00;
//var m_s_tabloid = 0.00;
//var m_d_tabloid = 0.00;
//var m_s_tabloid_color = 0.00;
//var m_d_tabloid_color = 0.00;
//var m_front_cover = 0.00;
//var m_front_cover_color = 0.00;
//var m_back_cover = 0.00;
//var m_back_cover_color = 0.00;
//var m_cut = 0.00;

// pdf file system
var m_file_size = 0;
var m_file_attached = false;
var m_total_page = 0;

var m_str_dup_cost_info = "";
var m_str_cat_cost_info = "";

var m_dup_total_print = 0;
var m_dup_total_cost = 0.00;

var m_cat_total_print = 0;
var m_cat_total_cost = 0.00;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        deleteReportSessionItems();
        setAdminOption();
        getLoginInfo();
        
        getUserCostCenterList();
        getDeviceType();
        getPaperType();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getPaperSize();
        getBindingList();
//        getDuplicatingCopierPrice();
        cp_Object.getCopierPriceList();
        getCatSectionList();
        getUserInformation();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

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
            $('#catalog_section').hide();
            $('#duplicating_section').hide();
            $('#menu_dup_cost_info').hide();
            $('#plotter_section').show();
        }
        else if (device_type_id === "2") {
            $('#attachment_section').show();
            $('#catalog_section').hide();
            $('#duplicating_section').show();
            $('#menu_dup_cost_info').show();
            $('#plotter_section').hide();
        }
        else if (device_type_id === "4") {
            $('#attachment_section').hide();
            $('#catalog_section').show();
            $('#duplicating_section').hide();
            $('#menu_dup_cost_info').show();
            $('#plotter_section').hide();
        }
        else {
            $('#attachment_section').hide();
            $('#catalog_section').hide();
            $('#duplicating_section').hide();
            $('#menu_dup_cost_info').hide();
            $('#plotter_section').hide();
        }
    });
    
    // catalog section dropdown event //////////////////////////////////////////
    $('#cat_section_list').change(function() { 
        if ($(this).val() === "0") {
            $('#cat_fiscal_year').val("");
            $('#cat_section_options').val("");
            $('#cat_section_pages').val("");
            $('#cat_section_cost').val("");
        }
        else {
            var result = new Array();
            result = db_getCatSectionByID($(this).val());
            $('#cat_fiscal_year').val(result[0]["FiscalYear"]);
            $('#cat_section_options').val(result[0]["Options"]);
            $('#cat_section_pages').val(result[0]["Pages"]);
            $('#cat_section_cost').val(formatDollar(Number(result[0]["Cost"]), 2));
            calculateCatTotalCost();
        }
        return false;
    });
    
    // calalog qty event ///////////////////////////////////////////////////////
    $('#cat_quantity').change(function() {
        calculateCatTotalCost();
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
    $('#btn_cat_submit').click(function() {
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
        
        $('#btn_cat_cancel').prop('disabled', true);
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            addCatalog(print_request_id);
            db_insertReceipt(print_request_id, m_str_cat_cost_info);
            sendEmailCatalogRequestor(print_request_id);
            sendEmailCatalogAdmin(print_request_id);
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
    
    // duplicationg submit button click ////////////////////////////////////////
    $('#btn_dup_submit').click(function() {
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
        $('#btn_dup_cancel').prop('disabled', true);
        
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            if(!uploadPDFAttachment(print_request_id)) {
                db_deletePrintRequest(print_request_id);
                m_file_attached = false;
                $('#attachment_file').filestyle('clear');
                $('#pdf_pages').val("");
                swal("Error", "There was a problem uploading your pdf attachment. Please add your pdf file again and resubmit", "error");
                return false;
            }
            
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
        $('#btn_plot_cancel').prop('disabled', true);
        
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            uploadPDFAttachment(print_request_id);
            
            addPlotter(print_request_id);
            sendEmailPlotterRequestor(print_request_id);
            sendEmailPlotterAdmin(print_request_id);
            if (m_free) {
                sendEmailPlotterHonorNotification("Jerry Rudmann", "jrudmann@ivc.edu");
                sendEmailPlotterHonorNotification("Kay Ryals", "kryals@ivc.edu");
            }
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Request submitted");
            
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
    
    // catalog cancel button click /////////////////////////////////////////////
    $('#btn_cat_cancel').click(function() {
        window.open('userHome.html', '_self');
        return false;
    });
    
    // duplicationg cancel button click ////////////////////////////////////////
    $('#btn_dup_cancel').click(function() {
        window.open('userHome.html', '_self');
        return false;
    });
    
    // plotting cancel button click ////////////////////////////////////////////
    $('#btn_plot_cancel').click(function() {
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
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
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
function getDeviceType() {
    var result = new Array();
    result = db_getDeviceType();
    
    var html = "<option value='0'>Select...</option>";
    for (var i = 0; i < result.length; i++) {
        if (result[i]['CopyDrop'] === "1") {
            continue;
        }
        html += "<option value='" + result[i]['DeviceTypeID'] + "'>" + result[i]['DeviceType'] + "</option>";
    }
    
    $('#device_type').append(html);
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

function getBindingList() {
    var result = new Array();
    result = db_getBindingList();
    
    var html = "<option value='0'>None</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['BindingID'] + "'>" + result[i]['Binding'] + "</option>";
    }
    
    $('#binding').append(html);
}

//function getDuplicatingCopierPrice() {
//    var result = new Array(); 
//    result = db_getCopierPrice();
//    
//    if (result.length === 1) {
//        m_s_letter = Number(result[0]['s_letter']);
//        m_d_letter = Number(result[0]['d_letter']);
//        m_s_letter_color = Number(result[0]['s_letter_color']);
//        m_d_letter_color = Number(result[0]['d_letter_color']);
//        m_s_legal = Number(result[0]['s_legal']);
//        m_d_legal = Number(result[0]['d_legal']);
//        m_s_legal_color = Number(result[0]['s_legal_color']);
//        m_d_legal_color = Number(result[0]['d_legal_color']);
//        m_s_tabloid = Number(result[0]['s_tabloid']);
//        m_d_tabloid = Number(result[0]['d_tabloid']);
//        m_s_tabloid_color = Number(result[0]['s_tabloid_color']);
//        m_d_tabloid_color = Number(result[0]['d_tabloid_color']);
//        m_front_cover = Number(result[0]['front_cover']);
//        m_front_cover_color = Number(result[0]['front_cover_color']);
//        m_back_cover = Number(result[0]['back_cover']);
//        m_back_cover_color = Number(result[0]['back_cover_color']);
//        m_cut = Number(result[0]['cut']);
//    }
//}

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
        html += "<option value='" + ar_cost_center[0] + "'>" + ar_cost_center[1] + "-" + ar_cost_center[2] + "</option>";
    }
    
    $('#billing_depart').append(html);
    $('#cat_billing_depart').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getUserInformation() {
    if (sessionStorage.getItem('ls_dc_loginType') === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#requestor').val(sessionStorage.getItem('ls_dc_loginDisplayName'));
    $('#email').val(sessionStorage.getItem('ls_dc_loginEmail'));
    $('#phone').val(sessionStorage.getItem('ls_dc_loginPhone'));
    $('#phone').attr("readonly", false);
    $('#login_id').val(sessionStorage.getItem('ls_dc_loginID'));
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
                    duplexSettingForPages();
                    calculateDupTotalCost();
                    return true;
                }
            }
        }
    }
    else {
        m_total_page = 0;
        $('#pdf_pages').val("");
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
//    var cost = 0.0;
    var paper_size_id = $('#paper_size').val();
    var duplex_id = $('#duplex').val();
    
    m_str_dup_cost_info += cp_Object.getPrintPaperPriceText(paper_size_id, color_copy);
    return cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, color_copy);
    
//    switch(paper_size_id) {
//        case "1":
//            if (color_copy) {
//                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11 Color Copy<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_letter_color;
//                }
//                else {
//                    cost = m_d_letter_color;
//                }
//            }
//            else {
//                m_str_dup_cost_info += "Paper Size: Letter 8.5 X 11<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_letter;
//                }
//                else {
//                    cost = m_d_letter;
//                }
//            }
//            break;
//        case "2":
//            if (color_copy) {
//                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14 Color Copy<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_legal_color;
//                }
//                else {
//                    cost = m_d_legal_color;
//                }
//            }
//            else {
//                m_str_dup_cost_info += "Paper Size: Legal 8.5 X 14<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_legal;
//                }
//                else {
//                    cost = m_d_legal;
//                }
//            }
//            break;
//        case "3":
//            if (color_copy) {
//                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17 Color Copy<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_tabloid_color;
//                }
//                else {
//                    cost = m_d_tabloid_color;
//                }
//            }
//            else {
//                m_str_dup_cost_info += "Paper Size: Tabloid 11 X 17<br/>";
//                if (duplex_id === "1") {
//                    cost = m_s_tabloid;
//                }
//                else {
//                    cost = m_d_tabloid;
//                }
//            }
//            break;
//        default:
//            break;
//    }
//    
//    return cost;
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

//    if (front_cover) {
//        if (color_cover_id === "1") {
//            m_str_dup_cost_info += "Front Cover White : " + formatDollar(m_front_cover, 2) + "<br/>";
//            return m_front_cover;
//        }
//        else {
//            m_str_dup_cost_info += "Front Cover " + cover_color + " : " + formatDollar(m_front_cover_color, 2) + "<br/>";
//            return m_front_cover_color;
//        }
//    }
//    else {
//        return 0.0;
//    }
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
    
//    if (back_cover) {
//        if (color_cover_id === "1") {
//            m_str_dup_cost_info += "Back Cover White : " + formatDollar(m_back_cover, 2) + "<br/>";
//            return m_back_cover;
//        }
//        else {
//            m_str_dup_cost_info += "Back Cover " + cover_color + " : " + formatDollar(m_back_cover_color, 2) + "<br/>";
//            return m_back_cover_color;
//        }
//    }
//    else {
//        return 0.0;
//    }
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
        m_str_dup_cost_info += "Cut : " + formatDollar(cp_Object.getCut(), 2) + "<br/>";
        return cp_Object.getCut();
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
function formValidation() {
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
    if (!m_file_attached) {
        err += "Attachment is a required field\n";
    }
    if (m_file_attached && m_total_page === 0) {
        m_file_attached = false;
        $('#attachment_file').filestyle('clear');
        $('#pdf_pages').val("");
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
        var pages = $('#pdf_pages').val();
        db_updateAttachmentPages(attachment_id, pages);
        return true;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addPrintRequest() {
    var name = textReplaceApostrophe($('#requestor').val());
    var email = textReplaceApostrophe($('#email').val());
    var phone = textReplaceApostrophe($('#phone').val());
    var login_type = sessionStorage.getItem('ls_dc_loginType');
    var login_id = textReplaceApostrophe($('#login_id').val());
    var request_title = textReplaceApostrophe($('#request_title').val());
    var device_type_id = $('#device_type').val();
    var delivery_location_id = "3";
    if (device_type_id === "2" || device_type_id === "4") {
        delivery_location_id = "1";
    }
    
    return db_insertPrintRequest(device_type_id, delivery_location_id, login_type, login_id, name, email, phone, request_title);
}

function addPlotter(print_request_id) {
    var paper_type_id = $('#paper_type').val();
    var job_status_plot_id = "2";
    var size_height = textReplaceApostrophe($('#size_height').val());
    var size_width = textReplaceApostrophe($('#size_width').val());
    var plot_total_cost = revertDollar($('#plot_total_cost').val());
    var waved_proof = ($('#ckb_waved_proof').is(':checked') ? true : false);
    var note = textReplaceApostrophe($('#plot_note').val());
    if (waved_proof) {
        job_status_plot_id = "1";
    }
    
    return db_insertPlotter(print_request_id, job_status_plot_id, paper_type_id, size_height, size_width, plot_total_cost, waved_proof, m_free, note);
}

function addDuplicating(print_request_id) {
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
    
    return db_insertDuplicating(print_request_id, "1", cost_center_id, quantity, date_needed, time_needed, paper_size_id, duplex_id, paper_color_id, cover_color_id, color_copy, front_cover, back_cover,
                                confidential, three_hole_punch, staple, cut, binding_id, booklet, first_pg_color_print, last_pg_color_print, total_print, dup_total_cost, note);
}

function addCatalog(print_request_id) {
    var cat_section_id = $('#cat_section_list').val();
    var cost_center_id = $('#cat_billing_depart').val();
    var quantity = textReplaceApostrophe($('#cat_quantity').val());
    var date_needed = $('#cat_date_needed').val();
    var time_needed = $('#cat_time_needed').val();
    var total_print = m_cat_total_print;
    var total_cost = m_cat_total_cost;
    var note = textReplaceApostrophe($('#cat_note').val());
     
    return db_insertCatalog(print_request_id, cat_section_id, "1", cost_center_id, quantity, date_needed, time_needed, total_print, total_cost, note);
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
    str_url = str_url.replace("newPrintRequest.html", "viewPrintRequest.html");
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
    str_url = str_url.replace("newPrintRequest.html", "adminPrintRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailPlotterHonorNotification(name, email) {    
    var subject = "A new plotter request from honor student has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new plotter request from honor student. Request details:<br><br>";
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
    message += "Cost Center: " + db_getCostCenterName($('#billing_depart').val()) + "<br><br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "viewPrintRequest.html");
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
    str_url = str_url.replace("newPrintRequest.html", "adminPrintRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailCatalogRequestor(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = $('#requestor').val();
    var email = $('#email').val();
    
    var subject = "Your new catalog request has been submitted";
    var message = "Dear " + name + ", <br><br>";
    message += "Thank you for your catalog request.  Request details:<br><br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#cat_date_needed').val() + " " + $('#cat_time_needed').val() + "<br>";
    message += "Quantity: " + $('#cat_quantity').val() + "<br>";
    message += "Cost Center: " + db_getCostCenterName($('#cat_billing_depart').val()) + "<br><br>";
    
    message += "Please use the link below to review the status of your submission at any time.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "viewPrintRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    
    message += "Should you have any questions or comments, please contact the IVC Duplicating Center.<br/><br/>"; 
    message += "Thank you.<br>";
    message += "IVC Duplicating Center<br>";
    message += "ivcduplicating@ivc.edu<br>";
    message += "phone: 949.451.5297";
    
    proc_sendEmail(email, name, subject, message);
}

function sendEmailCatalogAdmin(print_request_id) {
    var url_param = "?print_request_id=" + print_request_id;
    var name = "Copier Center";
    var email = "ivcduplicating@ivc.edu";
    
    var subject = "A new catalog request has been created";
    var message = "Dear " + name + ", <br><br>";
    message += "There is a new catalog request.  Request details:<br><br>";
    message += "Requestor: " + $('#requestor').val() + "<br>";
    message += "Contact Phone: " + $('#phone').val() + "<br>";
    message += "Email: " + $('#email').val() + "<br>";
    message += "Request Title: " + $('#request_title').val() + "<br>";
    message += "Date Needed: " + $('#cat_date_needed').val() + " " + $('#cat_time_needed').val() + "<br>";
    message += "Quantity: " + $('#cat_quantity').val() + "<br><br>";
    
    message += "Please use the link below to open request at anytime.<br><br>";

    var str_url = location.href;
    str_url = str_url.replace("newPrintRequest.html", "adminPrintRequest.html");
    message += "<a href='" + str_url + url_param + "'>" + $('#request_title').val() + "</a><br><br>";
    message += "Thank you.<br>";
    
    proc_sendEmail(email, name, subject, message);
}