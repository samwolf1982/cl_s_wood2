//****04.02.2014****/
jQuery(document).ready(function() {
    var ajax_url = jQuery("span.mysef_cart").html();
    var ajax_url_refresh = jQuery("span.mysef_refresh").html();
    var doubleform = jQuery('form[name="updateCart"]').length;
    if (doubleform > 1) {
        jQuery("span.refreshcart").remove();
        jQuery("div.delcart a").remove();
        jQuery('.mycart_refresh_form').attr("name", "null");
    }
    jQuery(".buttons .button_buy, .button_buy").on("click", function() {

        var href = jQuery(this).attr('href');
        var pid_1 = href.split('product_id=')[1];
        var pid = pid_1.split('&')[0];
        if (jQuery(".productitem_" + pid + " " + ".name a").length) {
            var product_link = jQuery(".productitem_" + pid + " " + ".name a").attr("href");
        } else {
            var product_link = jQuery(".mysef_redirect").text() + "?" + href.split("?")[1];
        }
        jQuery(this).addClass('was_clicked');
        jQuery("#system-message-container, #system-message").remove();
        jQuery("#jshop_module_cart").append('<div class="ajaxloaddingcart"></div>');
        if (jQuery(".show_added_to_cart").length) {
            jQuery(this).append('<div class="ajaxloaddingcart"></div>');
        } else {
            //jQuery('html, body').animate({scrollTop: jQuery('.mycart_wrapp').offset().top}, 500);
        }
        jQuery.ajax({
            type: "POST",
            cache: false,
            url: ajax_url + "?time=" + Math.random(),
            data: "url=" + href,
            success: function(msg) {
                var $el = jQuery('.modal#message');
                $el.find('.text').text("Товар был добавлен в корзину");
                jQuery('.modal').modal('hide');
                $el.modal('show');

                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                endStr = msg.indexOf('<div class="start_cart"></div>');
                fullstr = msg.indexOf('<div class="end_cart"></div>');
                msg = msg.substr(endStr, fullstr - endStr);
                jQuery('.mycart_wrapp').html(msg);
                console.log(href);
                //jQuery('.mycart_wrapp',window.parent.document).html(msg);jQuery('.mycart_wrapp',window.opener.document).html(msg);
                if (jQuery(".show_added_to_cart").length) {
                    //jQuery(".was_clicked").parent().prepend("<span class='was_added_to_cart'>"+jQuery('.lang_productatcart').text()+"</span>");
                    setTimeout("jQuery('.was_added_to_cart').fadeOut(3000);", 1000);
                } else {
                    jQuery('.mycart_content').slideDown("slow");
                }
                setTimeout("jQuery('a').removeClass('was_clicked');", 3500);
            },
            error: function() {
                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                window.location.replace(product_link);
            }
        });
        if (!jQuery(".att_none").length) {
            return false;
        }
    });

    jQuery(".buttons .button").on("click", function() {
        if (jQuery('#to').val() == "cart") {

            //If was not select free attributes
            jQuery(".prod_free_attribs input").each(function(index) {
                if (jQuery(this).val() == "") {
                    jQuery(this).addClass("empty_attr_input");
                    jQuery(this).parent().prev().addClass("empty_attr_input_name");
                    jQuery(".prod_free_attribs").addClass("redborder");
                }
            });
            if (jQuery(".empty_attr_input").length) {
                if (confirm(jQuery(".lang_spoc").text())) {
                    jQuery(".prod_free_attribs input.empty_attr_input").val("...").removeClass("empty_attr_input");
                    jQuery(".prod_free_attribs").removeClass("redborder");
                } else {
                    jQuery(".prod_free_attribs input.empty_attr_input").removeClass("empty_attr_input");
                    return false;
                }
            }
            //End	

            var allValue = jQuery('form[name="product"]').serialize();
            var arr = JSON.stringify(jQuery('form[name="product"]').serializeArray());
            var arr_to = jQuery('form[name="product"]').serializeArray();
            var catid = jQuery('input#category_id').val();
            var prodid = jQuery('input#product_id').val();
            var produrl = jQuery("span.mysef_cart").html() + "?category_id=" + catid + "&product_id=" + prodid;
            if (jQuery("span.first_attr_val_1").length) {
                var countradio = jQuery(".jshop_prod_attributes .input_type_radio").parent("[id^='block_attr_sel_']").length;
                var countradiocheck = jQuery(".jshop_prod_attributes input:radio:checked").length;
                if (countradiocheck < countradio) {
                    alert(jQuery(".lang_spo").text());
                    jQuery(".jshop_prod_attributes").addClass("redborder");
                    return false;
                }
            }
            var beforcount = jQuery(".mycart_count_prod").text();
            var beforsumm = jQuery(".mycart_summ_total").text();
            dataObj = {};
            jQuery.each(arr_to, function() {
                var name = this.name;
                var value = this.value;
                if (!value.length || value == '' || value == 0) {
                    if (jQuery("span.first_attr_val_1").length) {
                        jQuery(".jshop_prod_attributes select").addClass("empty_select");
                    }
                }
                //window.location.replace(produrl);
            });
            if (jQuery("span.first_attr_val_1").length) {
                if (jQuery(".empty_select").length) {
                    alert(jQuery(".lang_spo").text());
                    jQuery(".jshop_prod_attributes").addClass("redborder");
                    jQuery(".jshop_prod_attributes select").removeClass("empty_select");
                    return false;
                }
            }

            jQuery("#jshop_module_cart").append('<div class="ajaxloaddingcart"></div>');
            jQuery("#system-message-container, #system-message").remove();
            jQuery('html, body').animate({
                scrollTop: jQuery('.mycart_wrapp').offset().top
            }, 500);
            jQuery.ajax({
                type: "POST",
                cache: false,
                url: ajax_url + "?time=" + Math.random(),
                data: allValue + "&task=add",
                ifModified: true,
                success: function(msg) {
                    jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                    jQuery(".jshop_prod_attributes").removeClass("redborder");
                    endStr = msg.indexOf('<div class="start_cart"></div>');
                    fullstr = msg.indexOf('<div class="end_cart"></div>');
                    msg = msg.substr(endStr, fullstr - endStr);
                    jQuery('.mycart_wrapp').html(msg);
                    //jQuery('.mycart_wrapp',window.parent.document).html(msg);jQuery('.mycart_wrapp',window.opener.document).html(msg);
                    var aftercount = jQuery(".mycart_count_prod").text();
                    var aftersumm = jQuery(".mycart_summ_total").text();
                    if ((aftercount == beforcount) && beforsumm == aftersumm) {
                        //jQuery(".buttons .button:not('.prod_added_to_compare, .compare')").removeClass().addClass("redirbutton");
                        //jQuery(".redirbutton").trigger("click");
                        alert(jQuery(".lang_mqb").text());
                        return false;
                    } else {
                        jQuery(".mycart_content").slideDown("slow");
                        setTimeout("jQuery('.mycart_content').slideUp('slow');", 2000);
                    }
                },
                error: function() {
                    jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                    location.reload();
                }
            });
            return false;
        }
    });
    jQuery(".refreshcart img").on("click", function() {
        jQuery("#jshop_module_cart").append('<div class="ajaxloaddingcart"></div>');
        jQuery("#system-message-container, #system-message").remove();
        jQuery('html, body').animate({
            scrollTop: jQuery('.mycart_wrapp').offset().top
        }, 500);
        var allValue = jQuery('form[name="updateCart"]').serialize();
        var arr = JSON.stringify(jQuery('form[name="updateCart"]').serializeArray());
        var arr_to = jQuery('form[name="updateCart"]').serializeArray();
        var beforcount = jQuery(".mycart_count_prod").text();
        var beforsumm = jQuery(".mycart_summ_total").text();
        jQuery.ajax({
            type: "POST",
            cache: false,
            url: ajax_url_refresh + "?time=" + Math.random(),
            data: allValue,
            ifModified: true,
            success: function(msg) {
                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                endStr = msg.indexOf('<div class="start_cart"></div>');
                fullstr = msg.indexOf('<div class="end_cart"></div>');
                msg = msg.substr(endStr, fullstr - endStr);
                jQuery('.mycart_wrapp').html(msg);
                //jQuery('.mycart_wrapp',window.parent.document).html(msg);jQuery('.mycart_wrapp',window.opener.document).html(msg);
                var aftercount = jQuery(".mycart_count_prod").text();
                var aftersumm = jQuery(".mycart_summ_total").text();
                if ((aftercount == beforcount) && beforsumm == aftersumm) {
                    alert(jQuery(".lang_qnu").text());
                    return false;
                } else {
                    jQuery('.mycart_content').slideDown("slow");
                }
            },
            error: function() {
                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                location.reload();
            }
        });
        return false;
    });
    jQuery("div.delcart a").on("click", function() {
        var href = jQuery(this).attr('href');
        var numberid = href.split('number_id=')[1];
        jQuery("#jshop_module_cart").append('<div class="ajaxloaddingcart"></div>');
        jQuery('html, body').animate({
            scrollTop: jQuery('#jshop_module_cart').offset().top
        }, 500);
        jQuery.ajax({
            type: "POST",
            cache: false,
            url: ajax_url + "?time=" + Math.random(),
            data: ajax_url + "&task=delete" + "&number_id=" + numberid,
            success: function(msg) {
                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                endStr = msg.indexOf('<div class="start_cart"></div>');
                fullstr = msg.indexOf('<div class="end_cart"></div>');
                msg = msg.substr(endStr, fullstr - endStr);
                jQuery('.mycart_wrapp').html(msg);
                //jQuery('.mycart_wrapp',window.parent.document).html(msg);jQuery('.mycart_wrapp',window.opener.document).html(msg);
                jQuery('.mycart_content').slideDown("slow");
                jQuery(".jshop_prod_cart a[href*='" + href + "']").parents("tr").css("display", "none");
                jQuery(".jshop_subtotal .name:contains('Итого')").parent().addClass("mysumm_cart_page");
                jQuery(".jshop_subtotal .name:contains('Скидка')").parent().addClass("mydiscount_cart_page");
                jQuery(".jshop_subtotal .name:contains('%')").parent().addClass("mytax_cart_page");
                jQuery(".jshop_subtotal .total").addClass("mysumm_total_cart_page");
                var weighttxt = jQuery("span.myweight_cart").html();
                jQuery(".weightorder span").text(weighttxt);
                var mysummnulltxt = jQuery("span.mysumm_null_cart").html();
                jQuery(".jshop_subtotal .mysumm_cart_page .value").text(mysummnulltxt);
                var mydiscounttxt = jQuery("span.mydiscount_cart").html();
                jQuery(".jshop_subtotal .mydiscount_cart_page .value").text(mydiscounttxt);
                var mytaxtxt = jQuery("span.mytax_cart").html();
                jQuery(".jshop_subtotal .mytax_cart_page .value").text(mytaxtxt);
                var mysummtotaltxt = jQuery("span.mysumm_total_cart").html();
                jQuery(".jshop_subtotal .mysumm_total_cart_page .value").text(mysummtotaltxt);
            },
            error: function() {
                jQuery(".ajaxloaddingcart").remove(".ajaxloaddingcart");
                location.reload();
            }
        });
        return false;
    });
});