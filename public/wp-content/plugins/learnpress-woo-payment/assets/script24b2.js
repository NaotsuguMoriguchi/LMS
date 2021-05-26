;jQuery(function ($) {
    function get_cart_option() {
        return LP_WooCommerce_Payment.woocommerce_cart_option;
    }

    $('form.purchase-course').submit(function (event) {
    	event.preventDefault();
        var $form = $(this),
            $button = $('button.purchase-button, button.button-add-to-cart , button.button-purchase-course', this),
            $view_cart = $('.view-cart-button', this),
            $clicked = $form.find('input:focus, button:focus'),
            addToCart = $clicked.hasClass('button-add-to-cart'),
            errorHandler = function () {
                $button.removeClass('loading');
                $('body, html').css('overflow', 'visible');
            };
            
        $button.removeClass('added').addClass('loading');
        $form.find('#learn-press-wc-message, input[name="purchase-course"]').remove();

        var ajax_url = '';
        if ($form.find('input[name="course_url"]').length) {
            ajax_url = $form.find('input[name="course_url"]').val();
            var concat_sign = '&';
            if (/\?/.test(ajax_url) == false) {
                concat_sign = '?';
            }
            ajax_url += concat_sign + 'r=' + Math.random();
        } else {
            ajax_url = window.location.href.addQueryVar('r', Math.random());// Do not cache this page
        }
        $.ajax({
            url: ajax_url,// Do not cache this page
            data: $(this).serialize(),
            error: errorHandler,
            dataType: 'text',
            success: function (response) {
                response = LP.parseJSON(response);
                if (response.added_to_cart == 'yes') {
                	var $form = $('form.purchase-course input[name="add-to-cart"][value="'+response.course_id+'"]').parent("form");
                    if (response.message && !response.single_purchase) {
                        var $message = $(response.message).addClass('woocommerce-message');
                        $form.parent('.lp-course-buttons').prepend($('<div id="learn-press-wc-message"></div>').append($message));
                    }
                    if ( response.redirect ) {
                        LP.reload( response.redirect );
                    } else {
                        $form.hide();
                    }

                    $('body, html').css('overflow', 'visible');
                    $(document.body).trigger('wc_fragment_refresh');
                } else {
                    errorHandler();
                }
            }
        });
        return false;
    });

    var x = $('#learn-press-checkout')
        .on('learn_press_checkout_place_order', function () {

            var $form = $(this),
                chosen = $('input[type="radio"]:checked', $form);
            $form.find('input[name="woocommerce_chosen_method"]').remove();
            if (chosen.val() == 'woocommerce') {
                $form.append('<input type="hidden" name="woocommerce_chosen_method" value="' + chosen.data('method') + '"/>');
            }
        });

});
