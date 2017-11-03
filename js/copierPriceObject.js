//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Created By: Rich Kim
 * Created: 9/19/2017
 * Modified: 
 * Version: 1.0.0
 * Description: calculate total cost for duplicating and drop off request
 */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// duplex ID
var single_side = "1";
var double_side = "2";

// paper size ID
var ps_letter = "1";
var ps_legal = "2";
var ps_tabloid = "3";
var ps_letter_80 = "4";

// cover color ID
var cc_white = "1";
var cc_blue = "2";
var cc_pink = "3";
var cc_lunar_blue = "4";
var cc_terra_green = "5";

// binding ID
var bn_coil = "1";
var bn_comb = "2";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var cp_Object = (function() {
    // plotter paper price
    var bond_per_sqft = 0.00;
    var glossy_per_sqft = 0.00;
    
    // duplicating copier price
    var copier_price_id = 0;
    var s_letter = 0.00;
    var d_letter = 0.00;
    var s_letter_color = 0.00;
    var d_letter_color = 0.00;
    var s_legal = 0.00;
    var d_legal = 0.00;
    var s_legal_color = 0.00;
    var d_legal_color = 0.00;
    var s_tabloid = 0.00;
    var d_tabloid = 0.00;
    var s_tabloid_color = 0.00;
    var d_tabloid_color = 0.00;
    var s_letter_80 = 0.00;
    var d_letter_80 = 0.00;
    var s_letter_color_80 = 0.00;
    var d_letter_color_80 = 0.00;
    var front_cover = 0.00;
    var front_cover_color = 0.00;
    var back_cover = 0.00;
    var back_cover_color = 0.00;
    var cut = 0.00;
    var coil_binding = 0.00;
    var comb_binding = 0.00;
    var booklet = 0.00;
    
    //////////////////////////////////////////////////////////////////////////////////////////
    return {
        getPlotterPriceList: function() {
            return getPlotterPaperTypePrice();
        },
        getBondPerSqFT: function() {
            return bond_per_sqft;
        },
        getGlossyPerSqFT: function() {
            return glossy_per_sqft;
        },
        getCopierPriceList: function() {
            return getDuplicatingCopierPrice();
        },
        getCopierPriceID: function() {
            return copier_price_id;
        },
        getSingleLetter: function() {
            return s_letter;
        },
        getDoubleLetter: function() {
            return d_letter;
        },
        getSingleLetterColor: function() {
            return s_letter_color;
        },
        getDoubleLetterColor: function() {
            return d_letter_color;
        },
        getSingleLegal: function() {
            return s_legal;
        },
        getDoubleLegal: function() {
            return d_legal;
        },
        getSingleLegalColor: function() {
            return s_legal_color;
        },
        getDoubleLegalColor: function() {
            return d_legal_color;
        },
        getSingleTabloid: function() {
            return s_tabloid;
        },
        getDoubleTabloid: function() {
            return d_tabloid;
        },
        getSingleTabloidColor: function() {
            return s_tabloid_color;
        },
        getDoubleTabloidColor: function() {
            return d_tabloid_color;
        },
        getSingleLetter80: function() {
            return s_letter_80;
        },
        getDoubleLetter80: function() {
            return d_letter_80;
        },
        getSingleLetterColor80: function() {
            return s_letter_color_80;
        },
        getDoubleLetterColor80: function() {
            return d_letter_color_80;
        },
        getFrontCover: function() {
            return front_cover;
        },
        getFrontCoverColor: function() {
            return front_cover_color;
        },
        getBackCover: function() {
            return back_cover;
        },
        getBackCoverColor: function() {
            return back_cover_color;
        },
        getCut: function() {
            return cut;
        },
        getCoilBinding: function() {
            return coil_binding;
        },
        getCombBinding: function() {
            return comb_binding;
        },
        getBooklet: function() {
            return booklet;
        },
        getPrintPaperPrice: function(paper_size, duplex, ckb_color_print) {
            switch(paper_size) {
                case ps_letter:
                    if (ckb_color_print) {
                        if (duplex === single_side) {
                            return s_letter_color;
                        }
                        else {
                            return d_letter_color;
                        }
                    }
                    else {
                        if (duplex === single_side) {
                            return s_letter;
                        }
                        else {
                            return d_letter;
                        }
                    }
                    break;
                case ps_legal:
                    if (ckb_color_print) {
                        if (duplex === single_side) {
                            return s_legal_color;
                        }
                        else {
                            return d_legal_color;
                        }
                    }
                    else {
                        if (duplex === single_side) {
                            return s_legal;
                        }
                        else {
                            return d_legal;
                        }
                    }
                    break;
                case ps_tabloid:
                    if (ckb_color_print) {
                        if (duplex === single_side) {
                            return s_tabloid_color;
                        }
                        else {
                            return d_tabloid_color;
                        }
                    }
                    else {
                        if (duplex === single_side) {
                            return s_tabloid;
                        }
                        else {
                            return d_tabloid;
                        }
                    }
                    break;
                case ps_letter_80:
                    if (ckb_color_print) {
                        if (duplex === single_side) {
                            return s_letter_color_80;
                        }
                        else {
                            return d_letter_color_80;
                        }
                    }
                    else {
                        if (duplex === single_side) {
                            return s_letter_80;
                        }
                        else {
                            return d_letter_80;
                        }
                    }
                default:
                    return 0.00;
            }
        },
        getPrintPaperPriceText: function(paper_size, ckb_color_print) {
            switch(paper_size) {
                case ps_letter:
                    if (ckb_color_print) {
                        return "Paper Size: Letter 8.5 X 11 Color Print<br/>";
                    }
                    else {
                        return "Paper Size: Letter 8.5 X 11<br/>";
                    }
                    break;
                case ps_legal:
                    if (ckb_color_print) {
                        return "Paper Size: Legal 8.5 X 14 Color Print<br/>";
                    }
                    else {
                        return "Paper Size: Legal 8.5 X 14<br/>";
                    }
                    break;
                case ps_tabloid:
                    if (ckb_color_print) {
                        return "Paper Size: Tabloid 11 X 17 Color Print<br/>";
                    }
                    else {
                        return "Paper Size: Tabloid 11 X 17<br/>";
                    }
                    break;
                case ps_letter_80:
                    if (ckb_color_print) {
                        return "Paper Size: 80 Lbs Cardstock Color Print<br/>";
                    }
                    else {
                        return "Paper Size: 80 Lbs Cardstock<br/>";
                    }
                default:
                    return "";
            }
        },
        getFrontCoverPrice: function(cover_color_id) {
            if (cover_color_id === cc_white) {
                return front_cover;
            }
            else {
                return front_cover_color;
            }
        },
        getFrontCoverPriceText: function(cover_color_id, cover_color) {
            if (cover_color_id === cc_white) {
                return "Front Cover White : " + formatDollar(front_cover, 2) + "<br/>";
            }
            else {
                return "Front Cover " + cover_color + " : " + formatDollar(front_cover_color, 2) + "<br/>";
            }
        },
        getBackCoverPrice: function(cover_color_id) {
            if (cover_color_id === cc_white) {
                return back_cover;
            }
            else {
                return back_cover_color;
            }
        },
        getBackCoverPriceText: function(cover_color_id, cover_color) {
            if (cover_color_id === cc_white) {
                return "Back Cover White : " + formatDollar(back_cover, 2) + "<br/>";
            }
            else {
                return "Back Cover " + cover_color + " : " + formatDollar(back_cover_color, 2) + "<br/>";
            }
        },
        getBindingPrice: function(binding_id) {
            if (binding_id === bn_coil) {
                return coil_binding;
            }
            else if (binding_id === bn_comb) {
                return comb_binding;
            }
            else {
                return 0.00;
            }
        },
        getBindingPriceText: function(binding_id) {
            if (binding_id === bn_coil) {
                return "Coil Binding: " + formatDollar(coil_binding, 2) + "<br/>";
            }
            else if (binding_id === bn_comb) {
                return "Comb Binding: " + formatDollar(comb_binding, 2) + "<br/>";
            }
            else {
                return "";
            }
        }
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////
    function getPlotterPaperTypePrice() {
        var result = new Array();
        result = db_getPaperType();
        
        for (var i = 0; i < result.length; i++) {
            switch(result[i]['PaperTypeID']) {
                case "1":
                    bond_per_sqft = Number(result[i]['PaperCost']);
                    break;
                case "2":
                    glossy_per_sqft = Number(result[i]['PaperCost']);
                    break;
                default:
                    break;
            }
        }
        return true;
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////
    function getDuplicatingCopierPrice() {
        var result = new Array(); 
        result = db_getCopierPrice();
        
        if (result.length === 0) {
            return false;
        }
        else {
            copier_price_id = result[0]['CopierPriceID'];
            s_letter = Number(result[0]['s_letter']);
            d_letter = Number(result[0]['d_letter']);
            s_letter_color = Number(result[0]['s_letter_color']);
            d_letter_color = Number(result[0]['d_letter_color']);
            s_legal = Number(result[0]['s_legal']);
            d_legal = Number(result[0]['d_legal']);
            s_legal_color = Number(result[0]['s_legal_color']);
            d_legal_color = Number(result[0]['d_legal_color']);
            s_tabloid = Number(result[0]['s_tabloid']);
            d_tabloid = Number(result[0]['d_tabloid']);
            s_tabloid_color = Number(result[0]['s_tabloid_color']);
            d_tabloid_color = Number(result[0]['d_tabloid_color']);
            s_letter_80 = Number(result[0]['s_letter_80']);
            d_letter_80 = Number(result[0]['d_letter_80']);
            s_letter_color_80 = Number(result[0]['s_letter_color_80']);
            d_letter_color_80 = Number(result[0]['d_letter_color_80']);
            front_cover = Number(result[0]['front_cover']);
            front_cover_color = Number(result[0]['front_cover_color']);
            back_cover = Number(result[0]['back_cover']);
            back_cover_color = Number(result[0]['back_cover_color']);
            cut = Number(result[0]['cut']);
            coil_binding = Number(result[0]['coil_binding']);
            comb_binding = Number(result[0]['comb_binding']);
            booklet = Number(result[0]['booklet']);
            return true;
        }
    }
    
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
