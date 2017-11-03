var job_index = 1;

var str_paper_size_option = "";
var str_duplex_option = "";
var str_paper_color_option = "";
var str_cover_color_option = "";
var str_binding_option = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        cp_Object.getCopierPriceList();
        getUserCostCenterList();
        
        getPaperSize();
        getDuplex();
        getPaperColor();
        getCoverColor();
        getBindingList();

        getUserInformation();
        setJobOption();
    }
    else {
        window.open('Login.html', '_self');
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
        window.open('LoginFromDC.html', '_self');
        return false;
    });
    
    // job section calculation event ///////////////////////////////////////////    
    $(document).on('change', '[id^="quantity_job_"]', function() {
        var index_id = $(this).attr('id').replace("quantity_job_", "");
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));
        input_val = Math.abs(input_val);
        input_val = Math.floor(input_val);
        $(this).val(input_val);
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * input_val;
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="pdf_pages_job_"]', function() {
        var index_id = $(this).attr('id').replace("pdf_pages_job_", "");
        var input_val = Number($(this).val().replace(/[^0-9\.]/g, ''));
        input_val = Math.abs(input_val);
        input_val = Math.floor(input_val);
        $(this).val(input_val);
        duplexSettingForPages(index_id, input_val);
        var total_page = input_val * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="paper_size_job_"]', function() {
        var index_id = $(this).attr('id').replace("paper_size_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="duplex_job_"]', function() {  
        var index_id = $(this).attr('id').replace("duplex_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="paper_color_job_"]', function() { 
        var index_id = $(this).attr('id').replace("paper_color_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="cover_color_job_"]', function() {
        var index_id = $(this).attr('id').replace("cover_color_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('change', '[id^="binding_job_"]', function() {
        var index_id = $(this).attr('id').replace("binding_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_color_copy_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_color_copy_job_", "");
        if ($('#ckb_color_copy_job_' + index_id).is(':checked')) {
            $('#ckb_first_pg_color_print_job_' + index_id).iCheck('uncheck');
            $('#ckb_last_pg_color_print_job_' + index_id).iCheck('uncheck');
            $('#page_color_option_section_job_' + index_id).hide();
        }
        else {
            $('#page_color_option_section_job_' + index_id).show();
        }
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_front_cover_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_front_cover_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_back_cover_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_back_cover_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_confidential_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_confidential_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_three_hole_punch_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_three_hole_punch_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_staple_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_staple_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_cut_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_cut_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_booklet_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_booklet_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_first_pg_color_print_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_first_pg_color_print_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    $(document).on('ifChanged', '[id^="ckb_last_pg_color_print_job_"]', function() {
        var index_id = $(this).attr('id').replace("ckb_last_pg_color_print_job_", "");
        var total_page = Number($('#pdf_pages_job_' + index_id).val()) * Number($('#quantity_job_' + index_id).val());
        calculateDropOffTotalCost(index_id, total_page);
    });
    
    // drop off add job button click ///////////////////////////////////////////
    $('#btn_drop_add_job').click(function() {
        job_index++;
        setAddJobSectionHTML();
        setJobOption();
        $('body').animate({ scrollTop: $("#job_index_" + job_index).offset().top });
    });
    
    // drop off delete job button click ////////////////////////////////////////
    $('#btn_drop_delete_job').click(function() {
        if (job_index > 1) {
            $('#job_index_' + job_index).remove();
            job_index--;
            $('body').animate({ scrollTop: $("#job_index_" + job_index).offset().top });
        }
    });
    
    // drop off submit button click ////////////////////////////////////////////
    $('#btn_drop_submit').click(function() {
        var err_main = formDropOffValidation();
        var err_jobs = jobDropOffValidation();
        
        if (err_main !== "") {
            $.ladda('stopAll');
            swal("Error", err_main, "error");
            return false;
        }
        if (err_jobs !== "") {
            $.ladda('stopAll');
            swal("Error", err_jobs, "error");
            return false;
        }

        $('#btn_drop_add_job').prop('disabled', true);
        $('#btn_drop_delete_job').prop('disabled', true);
        $('#btn_drop_submit').prop('disabled', true);
        $('#btn_drop_cancel').prop('disabled', true);
        
        setTimeout(function() {
            var print_request_id = addPrintRequest();
            addDropOffJob(print_request_id);
            db_insertTransaction(print_request_id, sessionStorage.getItem('ls_dc_loginDisplayName'), "Request submitted");
            
            window.open('printingDropOff.html?print_request_id=' + print_request_id, '_blank');

            $.ladda('stopAll');
            swal({  title: "Success",
                text: "Your copy center drop off request has been submitted successfully",
                type: "success",
                confirmButtonText: "OK" },
                function() {
                    sessionStorage.clear();
                    window.open('LoginFromDC.html', '_self');
                    return false;
                }
            );
        }, 1000);        
    });

    // drop off cancel button click ////////////////////////////////////////////
    $('#btn_drop_cancel').click(function() {
        sessionStorage.clear();
        window.open('LoginFromDC.html', '_self');
        return false;
    });
    
    // auto size
    $('#note_job_1').autosize();
    
    // bootstrap datepicker
    $('#drop_date_needed').datepicker({ minDate: new Date(), beforeShowDay: $.datepicker.noWeekends });
    
    // timepicker
    $('#drop_time_needed').timepicker();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPaperSize() {
    var result = new Array();
    result = db_getPaperSize();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperSizeID'] + "'>" + result[i]['PaperSize'] + "</option>";
    }
    
    str_paper_size_option = html;
}

function getDuplex() {
    var result = new Array();
    result = db_getDuplex();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['DuplexID'] + "'>" + result[i]['Duplex'] + "</option>";
    }
    
    str_duplex_option = html;
}

function getPaperColor() {
    var result = new Array();
    result = db_getPaperColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['PaperColorID'] + "'>" + result[i]['PaperColor'] + "</option>";
    }
    
    str_paper_color_option = html;
}

function getCoverColor() {
    var result = new Array();
    result = db_getCoverColor();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['CoverColorID'] + "'>" + result[i]['CoverColor'] + "</option>";
    }
    
    str_cover_color_option = html;
}

function getBindingList() {
    var result = new Array();
    result = db_getBindingList();
    
    var html = "<option value='0'>None</option>";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['BindingID'] + "'>" + result[i]['Binding'] + "</option>";
    }
    
    str_binding_option = html;
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
    
    $('#drop_billing_depart').append(html);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getUserInformation() {    
    $('#requestor').val(sessionStorage.getItem('ls_dc_loginDisplayName'));
    $('#email').val(sessionStorage.getItem('ls_dc_loginEmail'));
    $('#phone').val(sessionStorage.getItem('ls_dc_loginPhone'));
    $('#phone').attr("readonly", false);
    $('#login_id').val(sessionStorage.getItem('ls_dc_loginID'));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setJobOption() {
    $('#paper_size_job_' + job_index).append(str_paper_size_option);
    $('#duplex_job_' + job_index).append(str_duplex_option);
    $('#paper_color_job_' + job_index).append(str_paper_color_option);
    $('#cover_color_job_' + job_index).append(str_cover_color_option);
    $('#binding_job_' + job_index).append(str_binding_option);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function duplexSettingForPages(index_id, pdf_pages) {
    if (pdf_pages === 1) {
        $('#duplex_job_' + index_id).val("1");
        $('#duplex_job_' + index_id).attr('disabled', true);
    }
    else {
        $('#duplex_job_' + index_id).attr('disabled', false);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculateDropOffTotalCost(index_id, total_page) {
    var cost_info = "";
    var quantity = Number($('#quantity_job_' + index_id).val());
    var pages = Number($('#pdf_pages_job_' + index_id).val());
    var paper_color = $('#paper_color_job_' + index_id + ' option:selected').text();
    var color_copy = ($('#ckb_color_copy_job_' + index_id).is(':checked') ? true : false);
    
    cost_info += "Original Page: " + pages + "<br/>";
    cost_info += "Quantity: " + quantity + "<br/>";
    cost_info += "Paper Color: " + paper_color + "<br/>";
    
    var paper_cost = getDropOffPrintPaperPrice(index_id, color_copy);
    cost_info += getDropOffPrintPaperSizeHTML(index_id, color_copy);
    
    var total_cost = paper_cost * total_page;
    total_cost += dropOffBindingCost(index_id) + dropOfffrontCoverCost(index_id) + dropOffbackCoverCost(index_id) + dropOffcutCost(index_id) + dropOffBookletCost(index_id);
    
    if (!color_copy) {
        total_cost += dropOffFirstPgColorPrintCost(index_id, quantity);
        total_cost += dropOffLastPgColorPrintCost(index_id, quantity);
        cost_info += dropOffFirstPgColorPrintHTML(index_id, quantity);
        cost_info += dropOffLastPgColorPrintHTML(index_id, quantity);
    }
    
    cost_info += dropOffBindingHTML(index_id);
    cost_info += dropOfffrontCoverHTML(index_id);
    cost_info += dropOffbackCoverHTML(index_id);
    cost_info += dropOffconfidential(index_id);
    cost_info += dropOffthreeHolePunch(index_id);
    cost_info += dropOffstaple(index_id);
    cost_info += dropOffcutHTML(index_id);
    cost_info += dropOffBookletHTML(index_id);
    
    cost_info += "<b>Print Cost: " + formatDollar(paper_cost, 3) + "</b><br>";
    $('#cost_info_job_' + index_id).html(cost_info.trim());
    $('#total_print_job_' + index_id).html(total_page);
    $('#total_cost_job_' + index_id).html(formatDollar(total_cost, 2));
}

function getDropOffPrintPaperPrice(index_id, color_copy) {
    var paper_size_id = $('#paper_size_job_' + index_id).val();
    var duplex_id = $('#duplex_job_' + index_id).val();

    return cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, color_copy);
}

function getDropOffPrintPaperSizeHTML(index_id, color_copy) {
    var paper_size_id = $('#paper_size_job_' + index_id).val();
    return cp_Object.getPrintPaperPriceText(paper_size_id, color_copy);
}

function dropOfffrontCoverCost(index_id) {
    var color_cover_id = $('#cover_color_job_' + index_id).val();
    var front_cover = ($('#ckb_front_cover_job_' + index_id).is(':checked') ? true : false);
    
    if (front_cover) {
        return cp_Object.getFrontCoverPrice(color_cover_id);
    } 
    else {
        return 0.00;
    }
}

function dropOfffrontCoverHTML(index_id) {
    var color_cover_id = $('#cover_color_job_' + index_id).val();
    var cover_color = $('#cover_color_job_' + index_id + ' option:selected').text();
    var front_cover = ($('#ckb_front_cover_job_' + index_id).is(':checked') ? true : false);
    
    if (front_cover) {
        return cp_Object.getFrontCoverPriceText(color_cover_id, cover_color);
    } 
    else {
        return "";
    }
}

function dropOffbackCoverCost(index_id) {
    var color_cover_id = $('#cover_color_job_' + index_id).val();
    var back_cover = ($('#ckb_back_cover_job_' + index_id).is(':checked') ? true : false);
    
    if (back_cover) {
        return cp_Object.getBackCoverPrice(color_cover_id);
    }
    else {
        return 0.00;
    }
}

function dropOffbackCoverHTML(index_id) {
    var color_cover_id = $('#cover_color_job_' + index_id).val();
    var cover_color = $('#cover_color_job_' + index_id + ' option:selected').text();
    var back_cover = ($('#ckb_back_cover_job_' + index_id).is(':checked') ? true : false);
    
    if (back_cover) {
        return cp_Object.getBackCoverPriceText(color_cover_id, cover_color);
    }
    else {
        return "";
    }
}

function dropOffconfidential(index_id) {
    var confidential = ($('#ckb_confidential_job_' + index_id).is(':checked') ? true : false);
    if (confidential) {
        return "Confidential<br/>";
    }
    else {
        return "";
    }
}

function dropOffthreeHolePunch(index_id) {
    var three_hole_punch = ($('#ckb_three_hole_punch_job_' + index_id).is(':checked') ? true : false);
    if (three_hole_punch) {
        return "3 Hole Punch<br/>";
    }
    else {
        return "";
    }
}

function dropOffstaple(index_id) {
    var staple = ($('#ckb_staple_job_' + index_id).is(':checked') ? true : false);
    if (staple) {
        return "Staple<br/>";
    }
    else {
        return "";
    }
}

function dropOffcutCost(index_id) {
    var cut = ($('#ckb_cut_job_' + index_id).is(':checked') ? true : false);
    if (cut) {
        return cp_Object.getCut();
    }
    else {
        return 0.00;
    }
}

function dropOffcutHTML(index_id) {
    var cut = ($('#ckb_cut_job_' + index_id).is(':checked') ? true : false);
    if (cut) {
        return "Cut : " + formatDollar(cp_Object.getCut(), 2) + "<br/>";
    }
    else {
        return "";
    }
}

function dropOffBindingCost(index_id) {
    var binding_id = $('#binding_job_' + index_id).val();
    return cp_Object.getBindingPrice(binding_id);
}

function dropOffBindingHTML(index_id) {
    var binding_id = $('#binding_job_' + index_id).val();
    return cp_Object.getBindingPriceText(binding_id);
}

function dropOffBookletCost(index_id) {
    var booklet = ($('#ckb_booklet_job_' + index_id).is(':checked') ? true : false);
    if (booklet) {
        return cp_Object.getBooklet();
    }
    else {
        return 0.00;
    }
}

function dropOffBookletHTML(index_id) {
    var booklet = ($('#ckb_booklet_job_' + index_id).is(':checked') ? true : false);
    if (booklet) {
        return "Booklet : " + formatDollar(cp_Object.getBooklet(), 2) + "<br/>";
    }
    else {
        return "";
    }
}

function dropOffFirstPgColorPrintCost(index_id, qty) {
    var first_pg_color_print = ($('#ckb_first_pg_color_print_job_' + index_id).is(':checked') ? true : false);
    if (first_pg_color_print) {
        var paper_size_id = $('#paper_size_job_' + index_id).val();
        var duplex_id = $('#duplex_job_' + index_id).val();
        
        var first_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var first_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        return first_color_price - first_bw_price;
    }
    else {
        return 0.00;
    }
}

function dropOffFirstPgColorPrintHTML(index_id, qty) {
    var first_pg_color_print = ($('#ckb_first_pg_color_print_job_' + index_id).is(':checked') ? true : false);
    if (first_pg_color_print) {
        var paper_size_id = $('#paper_size_job_' + index_id).val();
        var duplex_id = $('#duplex_job_' + index_id).val();
        
        var first_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var first_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        return "First Page Color Print: " + formatDollar(first_color_price - first_bw_price, 2) + "<br/>";
    }
    else {
        return "";
    }
}

function dropOffLastPgColorPrintCost(index_id, qty) {
    var last_pg_color_print = ($('#ckb_last_pg_color_print_job_' + index_id).is(':checked') ? true : false);
    if (last_pg_color_print) {
        var paper_size_id = $('#paper_size_job_' + index_id).val();
        var duplex_id = $('#duplex_job_' + index_id).val();
   
        var last_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var last_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        return last_color_price - last_bw_price;
    }
    else {
        return 0.00;
    }
}

function dropOffLastPgColorPrintHTML(index_id, qty) {
    var last_pg_color_print = ($('#ckb_last_pg_color_print_job_' + index_id).is(':checked') ? true : false);
    if (last_pg_color_print) {
        var paper_size_id = $('#paper_size_job_' + index_id).val();
        var duplex_id = $('#duplex_job_' + index_id).val();
   
        var last_bw_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, false) * qty;
        var last_color_price = cp_Object.getPrintPaperPrice(paper_size_id, duplex_id, true) * qty;
        return "Last Page Color Print: " + formatDollar(last_color_price - last_bw_price, 2) + "<br/>";
    }
    else {
        return "";
    }
}

////////////////////////////////////////////////////////////////////////////////
function formDropOffValidation() {
    var err = "";

    if ($('#phone').val().replace(/\s+/g, '') === "") {
        err += "Phone number is a required field\n";
    }
    if ($('#request_title').val().replace(/\s+/g, '') === "") {
        err += "Request title is a required field\n";
    }
    if ($('#drop_date_needed').val().replace(/\s+/g, '') === "") {
        err += "Date needed is a required field\n";
    }
    if ($('#drop_time_needed').val().replace(/\s+/g, '') === "") {
        err += "Time needed is a required field\n";
    }

    return err;
}

function jobDropOffValidation() {
    var err = "";
    
    for (var i = 1; i <= job_index; i++) {
        if ($('#quantity_job_' + i).val().replace(/\s+/g, '') === "" || $('#quantity_job_' + i).val().replace(/\s+/g, '') === "0") {
            err += "Job # " + i + ": Quantity is a required field\n";
        }
        if ($('#pdf_pages_job_' + i).val().replace(/\s+/g, '') === "" || $('#pdf_pages_job_' + i).val().replace(/\s+/g, '') === "0") {
            err += "Job # " + i + ": Pages number is a required field\n";
        }
    }

    return err;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addPrintRequest() {
    var name = textReplaceApostrophe($('#requestor').val());
    var email = textReplaceApostrophe($('#email').val());
    var phone = textReplaceApostrophe($('#phone').val());
    var login_type = sessionStorage.getItem('ls_dc_loginType');
    var login_id = textReplaceApostrophe($('#login_id').val());
    var request_title = textReplaceApostrophe($('#request_title').val());
    
    return db_insertPrintRequest("3", "1", login_type, login_id, name, email, phone, request_title);
}

function addDropOffJob(print_request_id) {
    for (var i = 1; i <= job_index; i++) {
        addEachDropOffJob(print_request_id, i);
        var cost_info = $('#cost_info_job_' + i).html();
        db_insertReceipt(print_request_id, cost_info);
    }
}

function addEachDropOffJob(print_request_id, job_row) {
    var cost_center_id = $('#drop_billing_depart').val();
    var date_needed = textReplaceApostrophe($('#drop_date_needed').val());
    var time_needed = textReplaceApostrophe($('#drop_time_needed').val());
    var job_name = "Job # " + job_row;
    var pages = textReplaceApostrophe($('#pdf_pages_job_' + job_row).val());
    var quantity = textReplaceApostrophe($('#quantity_job_' + job_row).val());
    var paper_size_id = $('#paper_size_job_' + job_row).val();
    var duplex_id = $('#duplex_job_' + job_row).val();
    var paper_color_id = $('#paper_color_job_' + job_row).val();
    var cover_color_id = $('#cover_color_job_' + job_row).val();
    var color_copy = ($('#ckb_color_copy_job_'+ job_row).is(':checked') ? true : false);
    var front_cover = ($('#ckb_front_cover_job_' + job_row).is(':checked') ? true : false);
    var back_cover = ($('#ckb_back_cover_job_' + job_row).is(':checked') ? true : false);
    var confidential = ($('#ckb_confidential_job_' + job_row).is(':checked') ? true : false);   
    var three_hole_punch = ($('#ckb_three_hole_punch_job_' + job_row).is(':checked') ? true : false);
    var staple = ($('#ckb_staple_job_' + job_row).is(':checked') ? true : false);
    var cut = ($('#ckb_cut_job_' + job_row).is(':checked') ? true : false);
    var binding_id = $('#binding_job_' + job_row).val();
    var booklet = ($('#ckb_booklet_job_' + job_row).is(':checked') ? true : false);
    var first_pg_color_print = ($('#ckb_first_pg_color_print_job_' + job_row).is(':checked') ? true : false);
    var last_pg_color_print = ($('#ckb_last_pg_color_print_job_' + job_row).is(':checked') ? true : false);
    var total_print = $('#total_print_job_' + job_row).html();
    var total_cost = revertDollar($('#total_cost_job_' + job_row).html());
    var note = textReplaceApostrophe($('#note_job_' + + job_row).val());
    
    return db_insertDropOffJob(print_request_id, "1", cost_center_id, job_name, pages, quantity, date_needed, time_needed, paper_size_id, duplex_id, paper_color_id, cover_color_id, color_copy, front_cover, back_cover,
                                confidential, three_hole_punch, staple, cut, binding_id, booklet, first_pg_color_print, last_pg_color_print, total_print, total_cost, note);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setAddJobSectionHTML() {
    var str_html = "<div class='row' id='job_index_" + job_index + "'>";
    str_html += "<div class='col-md-12'>";
    str_html += "<div class='ibox float-e-margins'>";
    str_html += "<div class='ibox-content'>";                   
    str_html += "<form class='form-horizontal'>"; 
    str_html += "<br>";
    str_html += "<div class='form-group has-success'>";
    str_html += "<div class='col-md-2'><h2 class='pull-right font-bold'>JOB # " + job_index + "</h2></div>";                                   
    str_html += "</div>";                                         
    str_html += "<div class='form-group has-success'>";                                         
    str_html += "<label class='col-md-2 control-label'>Paper Size:</label>";                                        
    str_html += "<div class='col-md-4'><select class='form-control m-b' data-container='body' id='paper_size_job_" + job_index + "'></select></div>";                                    
    str_html += "<label class='col-md-2 control-label'>Quantity:</label>";                                 
    str_html += "<div class='col-md-1'><input type='text' class='form-control' id='quantity_job_" + job_index + "'></div>";                                  
    str_html += "<label class='col-md-2 control-label'>Pages:</label>";                                     
    str_html += "<div class='col-md-1'><input type='text' class='form-control' id='pdf_pages_job_" + job_index + "'></div>";                                          
    str_html += "</div>";                                        
    str_html += "<div class='form-group has-success'>";                                          
    str_html += "<label class='col-md-2 control-label'>Paper Color:</label>";                                        
    str_html += "<div class='col-md-4'><select class='form-control m-b' data-container='body' id='paper_color_job_" + job_index + "'></select></div>"; 
    str_html += "<label class='col-md-2 control-label'>Duplex:</label>";                                    
    str_html += "<div class='col-md-4'><select class='form-control m-b' data-container='body' id='duplex_job_" + job_index + "'></select></div>";
    str_html += "</div>";
    str_html += "<div class='form-group has-success'>";                                          
    str_html += "<label class='col-md-2 control-label'>Binding:</label>";                                        
    str_html += "<div class='col-md-4'><select class='form-control m-b' data-container='body' id='binding_job_" + job_index + "'></select></div>";
    str_html += "<label class='col-md-2 control-label'>Cover Sheet:</label>";
    str_html += "<div class='col-md-4'><select class='form-control m-b' data-container='body' id='cover_color_job_" + job_index + "'></select></div>";
    str_html += "</div>"; 
    str_html += "<div class='form-group'>"; 
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_color_copy_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Color Print</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_front_cover_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Front Cover</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_back_cover_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Back Cover</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_confidential_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Confidential</label></div></div>";                                        
    str_html += "</div>";                                        
    str_html += "<div class='form-group'>"; 
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_three_hole_punch_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Three Hole Punch</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_staple_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Staple</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_cut_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Cut</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_booklet_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Booklet</label></div></div>";
    str_html += "</div>";
    str_html += "<div class='form-group' id='page_color_option_section_job_" + job_index + "'>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_first_pg_color_print_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;First Page Color Print</label></div></div>";
    str_html += "<div class='col-md-3'><div class='i-checks'><label><input type='checkbox' id='ckb_last_pg_color_print_job_" + job_index + "'>&nbsp;&nbsp;&nbsp;Last Page Color Print</label></div></div>";
    str_html += "</div>";
    str_html += "<div class='form-group'>";
    str_html += "<label class='col-md-2 control-label'>Note:</label>";
    str_html += "<div class='col-md-10'>";
    str_html += "<textarea class='form-control' style='resize: vertical; height: 55px;' id='note_job_" + job_index + "'></textarea>";
    str_html += "</div>";
    str_html += "</div>";
    str_html += "</form>";
    str_html += "<div class='alert alert-success m-b-sm'>";
    str_html += "<p id='cost_info_job_" + job_index + "'></p>";
    str_html += "<p class='font-bold'><b>Total Print: </b><b id='total_print_job_" + job_index + "'></b></p>";                                
    str_html += "<p class='font-bold'><b>Total Cost: </b><b id='total_cost_job_" + job_index + "'></b></p>";                                 
    str_html += "</div>";
    str_html += "</div>";                                    
    str_html += "</div>";
    str_html += "</div>";                                    
    str_html += "</div>";
    
    $('#dropoff_section').append(str_html);
    
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
    
    $('#note_job_' + job_index).autosize();
}