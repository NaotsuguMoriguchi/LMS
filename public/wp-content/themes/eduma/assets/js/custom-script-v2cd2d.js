var thim_scroll = true
var woof_js_after_ajax_done
var can_escape = true;

(function ($) {
  'use strict'
  if (typeof LearnPress != 'undefined') {
    if (typeof LearnPress.load_lesson == 'undefined') {
      LearnPress.load_lesson = function (a, b) {
        LearnPress.$Course && LearnPress.$Course.loadLesson(a, b)
      }
    }
  }

  $.avia_utilities = $.avia_utilities || {}
  $.avia_utilities.supported = {}
  $.avia_utilities.supports = (function () {
    var div = document.createElement('div'),
      vendors = ['Khtml', 'Ms', 'Moz', 'Webkit', 'O']
    return function (prop, vendor_overwrite) {
      if (div.style.prop !== undefined) {
        return ''
      }
      if (vendor_overwrite !== undefined) {
        vendors = vendor_overwrite
      }
      prop = prop.replace(/^[a-z]/, function (val) {
        return val.toUpperCase()
      })

      var len = vendors.length
      while (len--) {
        if (div.style[vendors[len] + prop] !== undefined) {
          return '-' + vendors[len].toLowerCase() + '-'
        }
      }
      return false
    }
  }());

  /* Smartresize */
  (function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
      var timeout
      return function debounced () {
        var obj = this, args = arguments

        function delayed () {
          if (!execAsap)
            func.apply(obj, args)
          timeout = null
        }

        if (timeout)
          clearTimeout(timeout)
        else if (execAsap)
          func.apply(obj, args)
        timeout = setTimeout(delayed, threshold || 100)
      }
    }
    // smartresize
    jQuery.fn[sr] = function (fn) {
      return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr)
    }
  })(jQuery, 'smartresize')

  //Back To top
  var back_to_top = function () {
    jQuery(window).scroll(function () {
      if (jQuery(this).scrollTop() > 400) {
        jQuery('#back-to-top').addClass('active')
      } else {
        jQuery('#back-to-top').removeClass('active')
      }
    })
    jQuery('#back-to-top').on('click', function () {
      jQuery('html, body').animate({ scrollTop: '0px' }, 800)
      return false
    })
  }

  //// stick header
  $(document).ready(function () {
    var layout = $('#thim-course-archive').attr('data-attr')
    if (!jQuery.cookie('course_switch')) {
      $('#thim-course-archive').removeClass()
      $('.thim-course-switch-layout > a').removeClass('switch-active')
      if (layout === 'thim-course-list') {
        $('#thim-course-archive').addClass('thim-course-list')
        $('.thim-course-switch-layout > a.switchToList').addClass('switch-active')
      } else {
        $('#thim-course-archive').addClass('thim-course-grid')
        $('.thim-course-switch-layout > a.switchToGrid').addClass('switch-active')
      }
    }

    var $header = $('#masthead.header_default')
    var $content_pusher = $('#wrapper-container .content-pusher')
    $header.imagesLoaded(function () {
      var height_sticky_header = $header.outerHeight(true)
      $content_pusher.css({ 'padding-top': height_sticky_header + 'px' })
      $(window).resize(function () {
        var height_sticky_header = $header.outerHeight(true)
        $content_pusher.css(
          { 'padding-top': height_sticky_header + 'px' })
      })
    })
  })

  var thim_SwitchLayout = function () {
    var cookie_name = 'course_switch',
      archive = $('#thim-course-archive')
    if (archive.length > 0) {

      $(document).on('click', '.thim-course-switch-layout > a', function (event) {
        var elem = $(this),
          archive = $('#thim-course-archive')
        event.preventDefault()
        if (!elem.hasClass('switch-active')) {
          $('.thim-course-switch-layout > a').removeClass('switch-active')
          elem.addClass('switch-active')
          if (elem.hasClass('switchToGrid')) {
            archive.fadeOut(300, function () {
              archive.removeClass('thim-course-list').addClass(' thim-course-grid').fadeIn(300)
              jQuery.cookie(cookie_name, 'grid-layout',
                { expires: 3, path: '/' })
            })
          } else {
            archive.fadeOut(300, function () {
              archive.removeClass('thim-course-grid').addClass('thim-course-list').fadeIn(300)
              jQuery.cookie(cookie_name, 'list-layout',
                { expires: 3, path: '/' })
            })
          }
        }
      })
    }

  }

  var thim_Shop_SwitchLayout = function () {
    var cookie_name = 'product_list',
      archive = $('#thim-product-archive')
    if (archive.length > 0) {
      //Check grid-layout
      if (!jQuery.cookie(cookie_name) || jQuery.cookie(cookie_name) == 'grid-layout') {
        if (archive.hasClass('thim-product-list')) {
          archive.removeClass('thim-product-list').addClass('thim-product-grid')
        }
        $('.thim-product-switch-layout > a.switch-active').removeClass('switch-active')
        $('.thim-product-switch-layout > a.switchToGrid').addClass('switch-active')
      } else {
        if (archive.hasClass('thim-product-grid')) {
          archive.removeClass('thim-product-grid').addClass('thim-product-list')
        }
        $('.thim-product-switch-layout > a.switch-active').removeClass('switch-active')
        $('.thim-product-switch-layout > a.switchToList').addClass('switch-active')
      }

      $(document).on('click', '.thim-product-switch-layout > a', function (event) {
        var elem = $(this),
          archive = $('#thim-product-archive')

        event.preventDefault()
        if (!elem.hasClass('switch-active')) {
          $('.thim-product-switch-layout > a').removeClass('switch-active')
          elem.addClass('switch-active')
          if (elem.hasClass('switchToGrid')) {
            archive.fadeOut(300, function () {
              archive.removeClass('thim-product-list').addClass(' thim-product-grid').fadeIn(300)
              jQuery.cookie(cookie_name, 'grid-layout',
                { expires: 3, path: '/' })
            })
          } else {
            archive.fadeOut(300, function () {
              archive.removeClass('thim-product-grid').addClass('thim-product-list').fadeIn(300)
              jQuery.cookie(cookie_name, 'list-layout',
                { expires: 3, path: '/' })
            })
          }
        }
      })
    }

  }

  var thim_Blog_SwitchLayout = function () {
    var cookie_name = 'blog_layout',
      archive = $('#blog-archive'),
      switch_layout = archive.find('.switch-layout')
    if (archive.length > 0) {
      //Check grid-layout
      if (!jQuery.cookie(cookie_name) || jQuery.cookie(cookie_name) == 'grid-layout') {
        if (archive.hasClass('blog-list')) {
          archive.removeClass('blog-list').addClass('blog-grid')
        }
        switch_layout.find('> a.switch-active').removeClass('switch-active')
        switch_layout.find('> a.switchToGrid').addClass('switch-active')
      } else {
        if (archive.hasClass('blog-grid')) {
          archive.removeClass('blog-grid').addClass('blog-list')
        }
        switch_layout.find('> a.switch-active').removeClass('switch-active')
        switch_layout.find('> a.switchToList').addClass('switch-active')
      }

      $(document).on('click', '#blog-archive .switch-layout > a',
        function (event) {
          var elem = $(this),
            archive = $('#blog-archive')

          event.preventDefault()
          if (!elem.hasClass('switch-active')) {
            switch_layout.find('>a').removeClass('switch-active')
            elem.addClass('switch-active')
            if (elem.hasClass('switchToGrid')) {
              archive.fadeOut(300, function () {
                archive.removeClass('blog-list').addClass('blog-grid').fadeIn(300)
                jQuery.cookie(cookie_name, 'grid-layout',
                  { expires: 3, path: '/' })
              })
            } else {
              archive.fadeOut(300, function () {
                archive.removeClass('blog-grid').addClass('blog-list').fadeIn(300)
                jQuery.cookie(cookie_name, 'list-layout',
                  { expires: 3, path: '/' })
              })
            }
          }
        })
    }

  }

  /* ****** jp-jplayer  ******/
  var thim_post_audio = function () {
    $('.jp-jplayer').each(function () {
      var $this = $(this),
        url = $this.data('audio'),
        type = url.substr(url.lastIndexOf('.') + 1),
        player = '#' + $this.data('player'),
        audio = {}
      audio[type] = url
      $this.jPlayer({
        ready: function () {
          $this.jPlayer('setMedia', audio)
        },
        swfPath: 'jplayer/',
        cssSelectorAncestor: player,
      })
    })
  }

  var thim_post_gallery = function () {
    $('article.format-gallery .flexslider').imagesLoaded(function () {
      if (jQuery().flexslider) {
        $('.flexslider').flexslider({
          slideshow: true,
          animation: 'fade',
          pauseOnHover: true,
          animationSpeed: 400,
          smoothHeight: true,
          directionNav: true,
          controlNav: false,
        })
      }
    })
  }

  /* ****** PRODUCT QUICK VIEW  ******/
  var thim_quick_view = function () {
    $(document).on('click', '.quick-view', function (e) {
      /* add loader  */
      $('.quick-view a').css('display', 'none')
      $(this).append('<a href="javascript:;" class="loading dark"></a>')
      var product_id = $(this).attr('data-prod')
      var data = { action: 'jck_quickview', product: product_id }
      $.post(ajaxurl, data, function (response) {
        $.magnificPopup.open({
          mainClass: 'my-mfp-zoom-in',
          items: {
            src: response,
            type: 'inline',
          },
          callbacks: {
            open: function () {
              $('body').addClass('thim-popup-active')
              $.magnificPopup.instance.close = function () {
                $('body').removeClass('thim-popup-active')
                $.magnificPopup.proto.close.call(this)
              }
            },
          },
        })
        $('.quick-view a').css('display', 'inline-block')
        $('.loading').remove()
        $('.product-card .wrapper').removeClass('animate')
        setTimeout(function () {
          if (typeof wc_add_to_cart_variation_params !==
            'undefined') {
            $('.product-info .variations_form').each(function () {
              $(this).wc_variation_form().find('.variations select:eq(0)').change()
            })
          }
        }, 600)
      })
      e.preventDefault()
    })
  }

  var thim_miniCartHover = function () {
    jQuery(document).on('mouseenter', '.site-header .minicart_hover', function () {
      jQuery(this).next('.widget_shopping_cart_content').slideDown()
    }).on('mouseleave', '.site-header .minicart_hover', function () {
      jQuery(this).next('.widget_shopping_cart_content').delay(100).stop(true, false).slideUp()
    })
    jQuery(document).on('mouseenter', '.site-header .widget_shopping_cart_content',
      function () {
        jQuery(this).stop(true, false).show()
      }).on('mouseleave', '.site-header .widget_shopping_cart_content',
      function () {
        jQuery(this).delay(100).stop(true, false).slideUp()
      })
  }

  var thim_course_menu_landing = function () {
    if ($('.thim-course-menu-landing').length > 0) {
      var menu_landing = $('.thim-course-menu-landing'),
        tab_course = $('#course-landing .nav-tabs')

      var tab_active = tab_course.find('>li.active'),
        tab_item = tab_course.find('>li>a'),
        tab_landing = menu_landing.find('.thim-course-landing-tab'),
        tab_landing_item = tab_landing.find('>li>a'),
        landing_Top = ($('#course-landing').length) > 0 ? $('#course-landing').offset().top : 0,
        checkTop = ($(window).height() > landing_Top) ? $(window).height() : landing_Top

      $('footer#colophon').addClass('has-thim-course-menu')
      if (tab_active.length > 0) {
        var active_href = tab_active.find('>a').attr('href'),
          landing_active = tab_landing.find('>li>a[href="' + active_href + '"]')

        if (landing_active.length > 0) {
          landing_active.parent().addClass('active')
        }
      }

      tab_landing_item.on('click', function (event) {
        event.preventDefault()

        var href = $(this).attr('href'),
          parent = $(this).parent()

        if (!parent.hasClass('active')) {
          tab_landing.find('li.active').removeClass('active')
          parent.addClass('active')
        }

        if (tab_course.length > 0) {
          tab_course.find('>li>a[href="' + href + '"]').trigger('click')

          $('body, html').animate({
            scrollTop: tab_course.offset().top - 50,
          }, 800)
        } else {
          $('body, html').animate({
            scrollTop: $($.attr(this, 'href')).offset().top,
          }, 500)
        }
      })

      tab_item.on('click', function () {
        var href = $(this).attr('href'),
          parent_landing = tab_landing.find('>li>a[href="' + href +
            '"]').parent()

        if (!parent_landing.hasClass('active')) {
          tab_landing.find('li.active').removeClass('active')
          parent_landing.addClass('active')
        }
      })

      $(window).scroll(function () {
        if ($(window).scrollTop() > checkTop) {
          $('body').addClass('course-landing-active')
        } else {
          $('body.course-landing-active').removeClass('course-landing-active')
        }
      })
    }
  }

  var thimImagepopup = function () {
    if (jQuery().magnificPopup) {
      $('.thim-image-popup').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
      })
    }
  }

  $(document).on('click', '#course-curriculum-popup .popup-close', function (event) {
    event.preventDefault()
    $('#learn-press-block-content').remove()
  })

  $(function () {
    back_to_top()

    /* Waypoints magic
     ---------------------------------------------------------- */
    if (typeof jQuery.fn.waypoint !== 'undefined') {
      jQuery(
        '.wpb_animate_when_almost_visible:not(.wpb_start_animation)').waypoint(function () {
        jQuery(this).addClass('wpb_start_animation')
      }, { offset: '85%' })
    }
  })

  function empty (data) {
    if (typeof (data) == 'number' || typeof (data) == 'boolean') {
      return false
    }
    if (typeof (data) == 'undefined' || data === null) {
      return true
    }
    if (typeof (data.length) != 'undefined') {
      return data.length === 0
    }
    var count = 0
    for (var i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        count++
      }
    }
    return count === 0
  }

  var windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    $document = $(document),
    orientation = windowWidth > windowHeight ? 'landscape' : 'portrait'
  var TitleAnimation = {
    selector: '.article__parallax',
    initialized: false,
    animated: false,
    initialize: function () {
    },
    update: function () {
    },
  }

  $(window).on('debouncedresize', function (e) {
    windowWidth = $(window).width()
    windowHeight = $(window).height()
    TitleAnimation.initialize()
  })

  $(window).on('orientationchange', function (e) {
    setTimeout(function () {
      TitleAnimation.initialize()
    }, 300)
  })

  var latestScrollY = $('html').scrollTop() || $('body').scrollTop(),
    ticking = false

  function updateAnimation () {
    ticking = false
    TitleAnimation.update()
  }

  function requestScroll () {
    if (!ticking) {
      requestAnimationFrame(updateAnimation)
    }
    ticking = true
  }

  $(window).on('scroll', function () {
    latestScrollY = $('html').scrollTop() || $('body').scrollTop()
    requestScroll()
  })

  jQuery(function ($) {
    var adminbar_height = jQuery('#wpadminbar').outerHeight()
    jQuery('.navbar-nav li a,.arrow-scroll > a').on('click', function (e) {
      if (parseInt(jQuery(window).scrollTop(), 10) < 2) {
        var height = 47
      } else height = 0
      var sticky_height = jQuery('#masthead').outerHeight()
      var menu_anchor = jQuery(this).attr('href')
      if (menu_anchor && menu_anchor.indexOf('#') == 0 &&
        menu_anchor.length > 1) {
        e.preventDefault()
        $('html,body').animate({
          scrollTop: jQuery(menu_anchor).offset().top -
            adminbar_height - sticky_height + height,
        }, 850)
      }
    })
  })

  function mobilecheck () {
    var check = false;
    (function (a) {
      if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
    return check
  }

  if (mobilecheck()) {
    window.addEventListener('load', function () { // on page load
      var main_content = document.getElementById('main-content')
      if (main_content) {
        main_content.addEventListener('touchstart', function (e) {
          jQuery('.wrapper-container').removeClass('mobile-menu-open')
        })
      }
    }, false)
  }

  /* mobile menu */
  if (jQuery(window).width() > 768) {
    jQuery(
      '.navbar-nav>li.menu-item-has-children >a,.navbar-nav>li.menu-item-has-children >span,.navbar-nav>li.tc-menu-layout-builder >a,.navbar-nav>li.tc-menu-layout-builder >span').after(
      '<span class="icon-toggle"><i class="fa fa-angle-down"></i></span>')
  } else {
    jQuery(
      '.navbar-nav>li.menu-item-has-children:not(.current-menu-parent) >a,.navbar-nav>li.menu-item-has-children:not(.current-menu-parent) >span,.navbar-nav>li.tc-menu-layout-builder:not(.current-menu-parent) >a,.navbar-nav>li.tc-menu-layout-builder:not(.current-menu-parent) >span').after(
      '<span class="icon-toggle"><i class="fa fa-angle-down"></i></span>')
    jQuery(
      '.navbar-nav>li.menu-item-has-children.current-menu-parent >a,.navbar-nav>li.menu-item-has-children.current-menu-parent >span,.navbar-nav>li.tc-menu-layout-builder.current-menu-parent >a,.navbar-nav>li.tc-menu-layout-builder.current-menu-parent >span').after(
      '<span class="icon-toggle"><i class="fa fa-angle-up"></i></span>')
  }
  jQuery(
    '.navbar-nav>li.menu-item-has-children .icon-toggle, .navbar-nav>li.tc-menu-layout-builder .icon-toggle').on(
        'click', function () {
    if (jQuery(this).next('.sub-menu').is(':hidden')) {
      jQuery(this).next('.sub-menu').slideDown(500, 'linear')
      jQuery(this).html('<i class="fa fa-angle-up"></i>')
    } else {
      jQuery(this).next('.sub-menu').slideUp(500, 'linear')
      jQuery(this).html('<i class="fa fa-angle-down"></i>')
    }
  })

  /* ====== ON RESIZE ====== */
  $(window).on('load', function () {
    thim_post_audio()
    thim_post_gallery()
    thim_quick_view()
    thim_miniCartHover()
    thim_SwitchLayout()
    thim_Shop_SwitchLayout()
    thim_Blog_SwitchLayout()
    thimImagepopup()

    setTimeout(function () {
      TitleAnimation.initialize()
      thim_course_menu_landing()
    }, 400)
  })

})(jQuery);

(function ($) {
  var thim_quiz_index = function () {
    var question_index = $('.single-quiz .index-question'),
      quiz_total_text = $('.single-quiz .quiz-total .quiz-text')
    if (question_index.length > 0) {
      quiz_total_text.html(question_index.html())
    }
  }

  $(window).on('load', function () {
    // $('.article__parallax').each(function(index, el) {
    //     $(el).parallax('50%', 0.4);
    // });
    // $('.images_parallax').parallax_images({
    //     speed: 0.5,
    // });

    // $(window).resize(function() {
    //     $('.images_parallax').each(function(index, el) {
    //         $(el).imagesLoaded(function() {
    //             var parallaxHeight = $(this).find('img').height();
    //             $(this).height(parallaxHeight);
    //         });
    //     });
    // }).trigger('resize');

    thim_quiz_index()

    //Add class for profile tab
    var $profile_list = $('.profile-tabs .nav-tabs>li ')
    if ($profile_list.length > 0) {
      $profile_list.addClass('thim-profile-list-' + $profile_list.length)
    }
  })

  // Learnpress custom code js
  $(document).ready(function () {
    //Course wishlist
    $('.course-wishlist-box [class*=\'course-wishlist\']').on('click', function (event) {
      event.preventDefault()
      var $this = $(this)
      if ($this.hasClass('loading')) return
      $this.addClass('loading')
      $this.toggleClass('course-wishlist')
      $this.toggleClass('course-wishlisted')
      $class = $this.attr('class')
      if ($this.hasClass('course-wishlisted')) {
        $.ajax({
          type: 'POST',
          url: window.location.href,
          dataType: 'html',
          data: {
            //action   : 'learn_press_toggle_course_wishlist',
            'lp-ajax': 'toggle_course_wishlist',
            course_id: $this.data('id'),
            nonce: $this.data('nonce'),
          },
          success: function () {
            $this.removeClass('loading')
          },
          error: function () {
            $this.removeClass('loading')
          },
        })
      }
      if ($this.hasClass('course-wishlist')) {
        $.ajax({
          type: 'POST',
          url: window.location.href,
          dataType: 'html',
          data: {
            //action   : 'learn_press_toggle_course_wishlist',
            'lp-ajax': 'toggle_course_wishlist',
            course_id: $this.data('id'),
            nonce: $this.data('nonce'),
          },
          success: function () {
            $this.removeClass('loading')
          },
          error: function () {
            $this.removeClass('loading')
          },
        })
      }
    })

    $('.video-container').on('click', '.beauty-intro .btns', function () {
      var iframe = '<iframe src="' + $(this).closest('.video-container').find('.yt-player').attr('data-video') + '" height= "' +
        $('.parallaxslider').height() + '"></iframe>'
      $(this).closest('.video-container').find('.yt-player').replaceWith(iframe)
      //debug >HP
      $(this).closest('.video-container').find('.hideClick:first').css('display', 'none')
    })

    if (!$('.add-review').length) {
      return
    }
    var $star = $('.add-review .filled')
    var $review = $('#review-course-value')
    $star.find('li').on('mouseover', function () {
      $(this).nextAll().find('span').removeClass('fa-star').addClass('fa-star-o')
      $(this).prevAll().find('span').removeClass('fa-star-o').addClass('fa-star')
      $(this).find('span').removeClass('fa-star-o').addClass('fa-star')
      $review.val($(this).index() + 1)
    })

    //Replace placeholder input password & login
    $('.login-username [name="log"]').attr('placeholder', thim_js_translate.login)
    $('.login-password [name="pwd"]').attr('placeholder', thim_js_translate.password)

    $(window).scroll(function (event) {
      if (thim_scroll && thim_scroll === false) {
        event.preventDefault()
      }
    })
  })

  $(document).on('click', '#course-review-load-more', function () {
    var $button = $(this)
    if (!$button.is(':visible')) return
    $button.addClass('loading')
    var paged = parseInt($(this).attr('data-paged')) + 1
    $.ajax({
      type: 'POST',
      dataType: 'html',
      url: window.location.href,
      data: {
        action: 'learn_press_load_course_review',
        paged: paged,
      },
      success: function (response) {
        var $content = $(response),
          $new_review = $content.find('.course-reviews-list>li')
        $('#course-reviews .course-reviews-list').append($new_review)
        if ($content.find('#course-review-load-more').length) {
          $button.removeClass('loading').attr('data-paged', paged)
        } else {
          $button.remove()
        }
      },
    })
  })

  $(document).on('click', '.single-lp_course .course-meta .course-review .value',
    function () {
      var review_tab = $('.course-tabs a[href="#tab-course-review"]')
      if (review_tab.length > 0) {
        review_tab.trigger('click')
        $('body, html').animate({
          scrollTop: review_tab.offset().top - 50,
        }, 800)
      }
      var review_tab_v3 = $('.course-tabs a[href="#tab-reviews"]')
      if (review_tab_v3.length > 0) {
        review_tab_v3.trigger('click')
        $('body, html').animate({
          scrollTop: review_tab_v3.offset().top - 50,
        }, 800)
      }
    })

  //Widget live search course
  var search_timer = false

  function thimlivesearch (contain) {
    var input_search = contain.find('.courses-search-input'),
      list_search = contain.find('.courses-list-search'),
      keyword = input_search.val(),
      loading = contain.find('.fa-search,.fa-times')

    if (keyword) {
      if (keyword.length < 1) {
        return
      }
      loading.addClass('fa-spinner fa-spin')
      $.ajax({
        type: 'POST',
        data: 'action=courses_searching&keyword=' + keyword + '&from=search',
        url: ajaxurl,
        success: function (html) {
          var data_li = ''
          var items = jQuery.parseJSON(html)
          if (!items.error) {
            $.each(items, function (index) {
              if (index == 0) {
                if (this['guid'] != '#') {
                  data_li += '<li class="ui-menu-item' +
                    this['id'] +
                    ' ob-selected"><a class="ui-corner-all" href="' +
                    this['guid'] + '">' + this['title'] +
                    '</a></li>'
                } else {
                  data_li += '<li class="ui-menu-item' +
                    this['id'] + ' ob-selected">' +
                    this['title'] + '</li>'
                }

              } else {
                data_li += '<li class="ui-menu-item' +
                  this['id'] +
                  '"><a class="ui-corner-all" href="' +
                  this['guid'] + '">' + this['title'] +
                  '</a></li>'
              }
            })
            list_search.addClass('search-visible').html('').append(data_li)
          }
          thimsearchHover()
          loading.removeClass('fa-spinner fa-spin')
        },
        error: function (html) {
        },
      })
    }
    list_search.html('')
  }

  function thimsearchHover () {
    $('.courses-list-search li').on('mouseenter', function () {
      $('.courses-list-search li').removeClass('ob-selected')
      $(this).addClass('ob-selected')
    })
  }

  $(document).ready(function () {

    $(document).on('click', '.thim-course-search-overlay .search-toggle',
      function (e) {
        e.stopPropagation()
        var parent = $(this).parent()
        $('body').addClass('thim-search-active')
        setTimeout(function () {
          parent.find('.thim-s').focus()
        }, 500)

      })
    $(document).on('click', '.search-popup-bg', function () {
      var parent = $(this).parent()
      window.clearTimeout(search_timer)
      parent.find('.courses-list-search').empty()
      parent.find('.thim-s').val('')
      $('body').removeClass('thim-search-active')
    })

    $(document).on('keyup', '.courses-search-input', function (event) {
      clearTimeout($.data(this, 'search_timer'))
      var contain = $(this).parents('.courses-searching'),
        list_search = contain.find('.courses-list-search'),
        item_search = list_search.find('>li')
      if (event.which == 13) {
        event.preventDefault()
        $(this).stop()
      } else if (event.which == 38) {
        if (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(
          navigator.userAgent.substring(navigator.userAgent.indexOf(
            'Chrome') + 7).split(' ')[0]) >= 15) {
          var selected = item_search.filter('.ob-selected')
          if (item_search.length > 1) {
            item_search.removeClass('ob-selected')
            // if there is no element before the selected one, we select the last one
            if (selected.prev().length == 0) {
              selected.siblings().last().addClass('ob-selected')
            } else { // otherwise we just select the next one
              selected.prev().addClass('ob-selected')
            }
          }
        }
      } else if (event.which == 40) {
        if (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(
          navigator.userAgent.substring(navigator.userAgent.indexOf(
            'Chrome') + 7).split(' ')[0]) >= 15) {
          var selected = item_search.filter('.ob-selected')
          if (item_search.length > 1) {
            item_search.removeClass('ob-selected')

            // if there is no element before the selected one, we select the last one
            if (selected.next().length == 0) {
              selected.siblings().first().addClass('ob-selected')
            } else { // otherwise we just select the next one
              selected.next().addClass('ob-selected')
            }
          }
        }
      } else if (event.which == 27) {
        if ($('body').hasClass('thim-search-active')) {
          $('body').removeClass('thim-search-active')
        }
        list_search.html('')
        $(this).val('')
        $(this).stop()
      } else {
        var search_timer = setTimeout(function () {
          thimlivesearch(contain)
        }, 500)
        $(this).data('search_timer', search_timer)
      }
    })
    $(document).on('keypress', '.courses-search-input', function (event) {
      var item_search = $(this).parents('.courses-searching').find('.courses-list-search>li')

      if (event.keyCode == 13) {
        var selected = $('.ob-selected')
        if (selected.length > 0) {
          var ob_href = selected.find('a').first().attr('href')
          window.location.href = ob_href
        }
        event.preventDefault()
      }
      if (event.keyCode == 27) {
        if ($('body').hasClass('thim-search-active')) {
          $('body').removeClass('thim-search-active')
        }
        $('.courses-list-search').html('')
        $(this).val('')
        $(this).stop()
      }
      if (event.keyCode == 38) {
        var selected = item_search.filter('.ob-selected')
        // if there is no element before the selected one, we select the last one
        if (item_search.length > 1) {
          item_search.removeClass('ob-selected')
          if (selected.prev().length == 0) {
            selected.siblings().last().addClass('ob-selected')
          } else { // otherwise we just select the next one
            selected.prev().addClass('ob-selected')
          }
        }
      }
      if (event.keyCode == 40) {
        var selected = item_search.filter('.ob-selected')
        if (item_search.length > 1) {
          item_search.removeClass('ob-selected')
          // if there is no element before the selected one, we select the last one
          if (selected.next().length == 0) {
            selected.siblings().first().addClass('ob-selected')
          } else { // otherwise we just select the next one
            selected.next().addClass('ob-selected')
          }
        }
      }
    })

    $(document).on('click', '.courses-list-search, .courses-search-input',
      function (event) {
        event.stopPropagation()
      })

    $(document).on('click', 'body', function () {
      if (!$('body').hasClass('course-scroll-remove')) {
        $('body').addClass('course-scroll-remove')
        $('.courses-list-search').html('')
      }
    })

    $(window).scroll(function () {
      if ($('body').hasClass('course-scroll-remove') &&
        $('.courses-list-search li').length > 0) {
        $('.courses-searching .courses-list-search').empty()
        $('.courses-searching .thim-s').val('')
      }
    })

    $(document).on('focus', '.courses-search-input', function () {
      if ($('body').hasClass('course-scroll-remove')) {
        $('body').removeClass('course-scroll-remove')
      }
    })

    //Prevent search result
    $(document).on('click', '#popup-header .search-visible', function (e) {
      var href = $(e.target).attr('href')
      if (!href) {
        $('#popup-header .search-visible').removeClass('search-visible')
      }

    })

    $(document).on('click', '#popup-header button', function (e) {
      $('#popup-header .thim-s').trigger('focus')

    })

    $(document).on('focus', '#popup-header .thim-s', function () {
      var link = $('#popup-header .courses-list-search a')

      if ($(this).val() != '' && link.length > 0) {
        $('#popup-header .courses-list-search').addClass('search-visible')
      }
    })

    //Widget icon box
    $('.wrapper-box-icon').each(function () {
      var $this = $(this)
      if ($this.attr('data-icon')) {
        var $color_icon = $('.boxes-icon i', $this).css('color')
        var $color_title = $('.heading__primary a', $this).css('color')
        var $color_icon_change = $this.attr('data-icon')
      }
      if ($this.attr('data-icon-border')) {
        var $color_icon_border = $('.boxes-icon', $this).css('border-color')
        var $color_icon_border_change = $this.attr('data-icon-border')
      }
      if ($this.attr('data-icon-bg')) {
        var $color_bg = $('.boxes-icon', $this).css('background-color')
        var $color_bg_change = $this.attr('data-icon-bg')
      }

      if ($this.attr('data-btn-bg')) {
        var $color_btn_bg = $('.smicon-read', $this).css('background-color')
        var $color_btn_border = $('.smicon-read', $this).css('border-color')
        var $color_btn_bg_text_color = $('.smicon-read', $this).css('color')

        var $color_btn_bg_change = $this.attr('data-btn-bg')
        if ($this.attr('data-text-readmore')) {
          var $color_btn_bg_text_color_change = $this.attr(
            'data-text-readmore')
        } else {
          $color_btn_bg_text_color_change = $color_btn_bg_text_color
        }

        $('.smicon-read', $this).on({
          'mouseenter': function () {
            if ($('#style_selector_container').length > 0) {
              if ($('.smicon-read', $this).css('background-color') != $color_btn_bg)
                $color_btn_bg = $('.smicon-read', $this).css('background-color')
            }
            $('.smicon-read', $this).css({
              'background-color': $color_btn_bg_change,
              'border-color': $color_btn_bg_change,
              'color': $color_btn_bg_text_color_change,
            })
          },
          'mouseleave': function () {
            $('.smicon-read', $this).css({
              'background-color': $color_btn_bg,
              'border-color': $color_btn_border,
              'color': $color_btn_bg_text_color,
            })
          },
        })

      }

      $($this).on({
        'mouseenter': function () {
          if ($this.attr('data-icon')) {
            $('.boxes-icon i', $this).css({ 'color': $color_icon_change })
            $('.heading__primary a', $this).css({ 'color': $color_icon_change })
          }
          if ($this.attr('data-icon-bg')) {
            /* for select style*/
            if ($('#style_selector_container').length > 0) {
              if ($('.boxes-icon', $this).css('background-color') != $color_bg)
                $color_bg = $('.boxes-icon', $this).css('background-color')
            }

            $('.boxes-icon', $this).css({ 'background-color': $color_bg_change })
          }
          if ($this.attr('data-icon-border')) {
            $('.boxes-icon', $this).css({ 'border-color': $color_icon_border_change })
          }
        },
        'mouseleave': function () {
          if ($this.attr('data-icon')) {
            $('.boxes-icon i', $this).css({ 'color': $color_icon })
            $('.heading__primary a', $this).css({ 'color': $color_title })
          }
          if ($this.attr('data-icon-bg')) {
            $('.boxes-icon', $this).css({ 'background-color': $color_bg })
          }
          if ($this.attr('data-icon-border')) {
            $('.boxes-icon', $this).css({ 'border-color': $color_icon_border })
          }
        },
      })

    })
    /* End Icon Box */

    //Background video
    $('.bg-video-play').on('click', function () {
      var elem = $(this),
        video = $(this).parents('.thim-widget-icon-box').find('.full-screen-video'),
        player = video.get(0)
      if (player.paused) {
        player.play()
        elem.addClass('bg-pause')
      } else {
        player.pause()
        elem.removeClass('bg-pause')
      }
    })

    //wpcf7-form-submit
    $(document).on('click', '.wpcf7-form-control.wpcf7-submit', function () {
      var elem = $(this),
        form = elem.parents('.wpcf7-form')
      form.addClass('thim-sending')
      $(document).on('invalid.wpcf7', function (event) {
        form.removeClass('thim-sending')
      })
      $(document).on('spam.wpcf7', function (event) {
        form.removeClass('thim-sending')
        setTimeout(function () {
          if ($('.wpcf7-response-output').length > 0) {
            $('.wpcf7-response-output').hide()
          }
        }, 4000)
      })
      $(document).on('mailsent.wpcf7', function (event) {
        form.removeClass('thim-sending')
        setTimeout(function () {
          if ($('.wpcf7-response-output').length > 0) {
            $('.wpcf7-response-output').hide()
          }
        }, 4000)

      })
      $(document).on('mailfailed.wpcf7', function (event) {
        form.removeClass('thim-sending')
        setTimeout(function () {
          if ($('.wpcf7-response-output').length > 0) {
            $('.wpcf7-response-output').hide()
          }
        }, 4000)
      })
    })
  })

  //Include plugin event file events.js
  jQuery(document).ready(function () {

    // owl-carausel
    var carousels = $('.tp_event_owl_carousel')
    for (var i = 0; i < carousels.length; i++) {
      var data = $(carousels[i]).attr('data-countdown')
      var options = {
        navigation: true, // Show next and prev buttons
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true,
      }
      if (typeof data !== 'undefined') {
        data = JSON.parse(data)
        $.extend(options, data)

        $.each(options, function (k, v) {
          if (v === 'true') {
            options[k] = true
          } else if (v === 'false') {
            options[k] = false
          }
        })
      }

      if (typeof options.slide === 'undefined' || options.slide ===
        true) {
        $(carousels[i]).owlCarousel(options)
      } else {
        $(carousels[i]).removeClass('owl-carousel')
      }
    }
  })

  // Sticky sidebar
  jQuery(document).ready(function () {
    var offsetTop = 20
    if ($('#wpadminbar').length) {
      offsetTop += $('#wpadminbar').outerHeight()
    }
    if ($('#masthead.sticky-header').length) {
      offsetTop += $('#masthead.sticky-header').outerHeight()
    }
    jQuery('#sidebar.sticky-sidebar').theiaStickySidebar({
      'containerSelector': '',
      'additionalMarginTop': offsetTop,
      'additionalMarginBottom': '0',
      'updateSidebarHeight': false,
      'minWidth': '768',
      'sidebarBehavior': 'modern',
    })
  })

  // Prevent search when no content submited
  jQuery(document).ready(function () {
    $('.courses-searching form').submit(function () {
      var input_search = $(this).find('input[name=\'s\']')
      if ($.trim(input_search.val()) === '') {
        input_search.focus()
        return false
      }
    })

    $('form#bbp-search-form').submit(function () {
      if ($.trim($('#bbp_search').val()) === '') {
        $('#bbp_search').focus()
        return false
      }
    })

    $('form.search-form').submit(function () {
      var input_search = $(this).find('input[name=\'s\']')
      if ($.trim(input_search.val()) === '') {
        input_search.focus()
        return false
      }
    })

    //My account login
    $('#customer_login .login').submit(function (event) {
      var elem = $(this),
        input_username = elem.find('#username'),
        input_pass = elem.find('#password')

      if (input_pass.length > 0 && input_pass.val() == '') {
        input_pass.addClass('invalid')
        event.preventDefault()
      }

      if (input_username.length > 0 && input_username.val() == '') {
        input_username.addClass('invalid')
        event.preventDefault()
      }
    })

    //My account register
    $('#customer_login .register').submit(function (event) {
      var elem = $(this),
        input_username = elem.find('#reg_username'),
        input_email = elem.find('#reg_email'),
        input_pass = elem.find('#reg_password'),
        input_captcha = $('#customer_login .register .captcha-result'),
        valid_email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm

      if (input_captcha.length > 0) {
        var captcha_1 = parseInt(input_captcha.data('captcha1')),
          captcha_2 = parseInt(input_captcha.data('captcha2'))

        if (captcha_1 + captcha_2 != parseInt(input_captcha.val())) {
          input_captcha.addClass('invalid').val('')
          event.preventDefault()
        }
      }

      if (input_pass.length > 0 && input_pass.val() == '') {
        input_pass.addClass('invalid')
        event.preventDefault()
      }

      if (input_username.length > 0 && input_username.val() == '') {
        input_username.addClass('invalid')
        event.preventDefault()
      }

      if (input_email.length > 0 && (input_email.val() == '' ||
        !valid_email.test(input_email.val()))) {
        input_email.addClass('invalid')
        event.preventDefault()
      }
    })

    //Validate comment form submit
    $('form#commentform').submit(function (event) {
      var elem = $(this),
        comment = elem.find('#comment[aria-required="true"]'),
        author = elem.find('#author[aria-required="true"]'),
        url = elem.find('#url[aria-required="true"]'),
        email = elem.find('#email[aria-required="true"]'),
        valid_email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm

      if (author.length > 0 && author.val() == '') {
        author.addClass('invalid')
        event.preventDefault()
      }

      if (comment.length > 0 && comment.val() == '') {
        comment.addClass('invalid')
        event.preventDefault()
      }

      if (url.length > 0 && url.val() == '') {
        url.addClass('invalid')
        event.preventDefault()
      }

      if (email.length > 0 &&
        (email.val() == '' || !valid_email.test(email.val()))) {
        email.addClass('invalid')
        event.preventDefault()
      }
    })

    $('#customer_login .register, #reg_username, #reg_email, #reg_password').on('focus', function () {
      $(this).removeClass('invalid')
    })

    $('input.wpcf7-text, textarea.wpcf7-textarea').on('focus', function () {
      if ($(this).hasClass('wpcf7-not-valid')) {
        $(this).removeClass('wpcf7-not-valid')
      }
    })

    $('.thim-language').on({
      'mouseenter': function () {
        $(this).children('.list-lang').stop(true, false).fadeIn(250)
      },
      'mouseleave': function () {
        $(this).children('.list-lang').stop(true, false).fadeOut(250)
      },
    })

    $('#toolbar .menu li.menu-item-has-children').on({
      'mouseenter': function () {
        $(this).children('.sub-menu').stop(true, false).fadeIn(250)
      },
      'mouseleave': function () {
        $(this).children('.sub-menu').stop(true, false).fadeOut(250)
      },
    })

    //Widget gallery-posts
    function gallery_layout () {
      var $container = jQuery('.isotope-layout')
      $container.each(function () {
        var $this = jQuery(this), $width, $col, $width_unit,
          $height_unit
        var $spacing = 10
        $col = 6
        if ($col != 1) {
          if (parseInt($container.width()) < 768) {
            $col = 4
          }
          if (parseInt($container.width()) < 480) {
            $col = 2
          }

        }
        $width_unit = Math.floor((parseInt($container.width(), 10) -
          ($col - 1) * $spacing) / $col)
        $height_unit = Math.floor(parseInt($width_unit, 10))

        $this.find('.item_gallery').css({
          width: $width_unit,
        })
        if ($col == 1) {
          $height_unit = 'auto'
        }
        $this.find('.item_gallery .thim-gallery-popup').css({
          height: $height_unit,
        })
        if ($this.find('.item_gallery').hasClass('size32')) {
          if ($col > 1) {
            $this.find('.item_gallery.size32 .thim-gallery-popup').css({
              height: $height_unit * 2 + $spacing,
            })
          }
        }
        if ($this.find('.item_gallery').hasClass('size32')) {
          if ($col > 3) {
            $width = $width_unit * 4 + $spacing * 3
            $this.find('.item_gallery.size32').css({
              width: $width,
            })
          } else {
            $width = $width_unit * 2 + $spacing * 1
            $this.find('.item_gallery.size32').css({
              width: $width,
            })
          }
        }
        if ($this.find('.item_gallery').hasClass('size22') && $col != 1) {
          $this.find('.item_gallery.size22 .thim-gallery-popup').css({
            height: $height_unit * 2 + $spacing,
          })
        }
        if ($this.find('.item_gallery').hasClass('size22') && $col != 1) {
          $width = $width_unit * 2 + $spacing * 1
          $this.find('.item_gallery.size22').css({
            width: $width,
          })
        }
        if (jQuery().isotope) {
          $this.isotope({
            itemSelector: '.item_gallery',
            masonry: {
              columnWidth: $width_unit,
              gutter: $spacing,
            },
          })
        }
      })
    }

    gallery_layout()
    $(window).resize(function () {
      gallery_layout()
    })

    $(document).on('click', '.filter-controls .filter', function (e) {
      e.preventDefault()
      var filter = $(this).data('filter'),
        filter_wraper = $(this).parents('.thim-widget-gallery-posts').find('.wrapper-gallery-filter')
      $('.filter-controls .filter').removeClass('active')
      $(this).addClass('active')
      filter_wraper.isotope({ filter: filter })
    })

    $(document).on('click', '.thim-gallery-popup', function (e) {
      e.preventDefault()
      var elem = $(this),
        post_id = elem.attr('data-id'),
        data = { action: 'thim_gallery_popup', post_id: post_id }
      elem.addClass('loading')
      $.post(ajaxurl, data, function (response) {
        elem.removeClass('loading')
        $('.thim-gallery-show').append(response)
        if ($('.thim-gallery-show img').length > 0) {
          $('.thim-gallery-show').magnificPopup({
            mainClass: 'my-mfp-zoom-in',
            type: 'image',
            delegate: 'a',
            showCloseBtn: false,
            gallery: {
              enabled: true,
            },
            callbacks: {
              open: function () {
                $('body').addClass('thim-popup-active')
                $.magnificPopup.instance.close = function () {
                  $('.thim-gallery-show').empty()
                  $('body').removeClass('thim-popup-active')
                  $.magnificPopup.proto.close.call(this)
                }
              },
            },
          }).magnificPopup('open')
        } else {
          $.magnificPopup.open({
            mainClass: 'my-mfp-zoom-in',
            items: {
              src: $('.thim-gallery-show'),
              type: 'inline',
            },
            showCloseBtn: false,
            callbacks: {
              open: function () {
                $('body').addClass('thim-popup-active')
                $.magnificPopup.instance.close = function () {
                  $('.thim-gallery-show').empty()
                  $('body').removeClass('thim-popup-active')
                  $.magnificPopup.proto.close.call(this)
                }
              },
            },
          })
        }

      })

    })

    $('.widget-button.custom_style').each(function () {
      var elem = $(this),
        old_style = elem.attr('style'),
        hover_style = elem.data('hover')
      elem.on({
        'mouseenter': function () {
          elem.attr('style', hover_style)
        },
        'mouseleave': function () {
          elem.attr('style', old_style)
        },
      })
    })

  })

  $(window).on('load', function () {

    $(window).resize(function () {
      thim_get_position_header_course_v2(
        $('.content_course_2 .header_single_content .bg_header'))
      $('.thim-carousel-instructors .instructor-item').css('min-height', '')
      // $('.thim-owl-carousel-post:not(.layout-3) .image').
      //     css('min-height', '');
      $('.thim-course-carousel .course-thumbnail').css('min-height', '')
      $('body.thim-demo-university-4 .thim-about-eduma, body.thim-demo-university-4 .thim-video-popup .video-info').css('min-height', '')
      if ($(window).width() < 767 || $(window).width() > 1200) {
        $('body.thim-demo-university-4 #sb_instagram .sbi_photo').css('min-height', '')
      }
      thim_get_position_header_course_v2(
        $('.content_course_2 .header_single_content .bg_header'))
      // thim_min_height_carousel($('.thim-carousel-instructors .instructor-item'));
      thim_min_height_carousel($('.thim-owl-carousel-post:not(.layout-3) .image'))
      thim_min_height_carousel($('.thim-course-carousel .course-thumbnail'))
      thim_min_height_carousel($('.thim-row-bg-border-top .thim-bg-border-top'))
      thim_min_height_carousel_old($('.thim-carousel-instructors .instructor-item'))
      thim_min_height_carousel_old($('.thim-testimonial-carousel-kindergarten .item'))

      thim_min_height_carousel(
        $('.thim-widget-carousel-categories .item'))
      thim_min_height_carousel(
        $('.elementor-widget-thim-carousel-categories .item'))

      thim_min_height_content_area()
      if ($(window).width() > 767) {
        thim_min_height_carousel(
          $('.thim-grid-posts .item-post'))
        thim_min_height_carousel(
          $('body.thim-demo-university-4 .thim-about-eduma, body.thim-demo-university-4 .thim-video-popup .video-info'))
      }

      if ($(window).width() > 767 && $(window).width() < 1200) {
        if ($('body.thim-demo-university-4 .thim-icon-our-programs').length) {
          var min_height = parseInt($(
            'body.thim-demo-university-4 .thim-icon-our-programs').outerHeight() / 3)
          $('body.thim-demo-university-4 #sb_instagram .sbi_photo').css('min-height', min_height)
        }

      }
    })
  })

  function thim_get_position_header_course_v2 ($selector) {
    if ($(window).width() > 1025) {
      $selector.css('left', '-' +
        ($(window).width() - $('.container').width()) / 2 + 'px')
      $selector.css('right', '-' +
        (($(window).width() - $('.container').width()) / 2 +
          (45 + $('.content_course_2 .course_right').width())) +
        'px')
    } else {
      $selector.css('left', '-15px')
      $selector.css('right', '-' +
        (45 + $('.content_course_2 .course_right').width()) + 'px')
    }

  }

  $(window).on('load', function () {
    thim_min_height_carousel('.thim-carousel-instructors', '.instructor-item')
    thim_min_height_carousel('.thim-owl-carousel-post', '.image')
    thim_min_height_carousel('.thim-course-carousel', '.course-thumbnail')

    thim_min_height_content_area()
  })

  function thim_min_height_carousel_old ($selector) {
    var min_height = 0
    $selector.each(function (index, val) {
      if ($(this).outerHeight() > min_height) {
        min_height = $(this).outerHeight()
      }
      if (index + 1 == $selector.length) {
        $selector.css('min-height', min_height)
      }
    })
  }

  function thim_min_height_carousel (el, child) {
    var $elements = $(el)

    $elements.each(function () {
      var $element = $(this),
        $child = child ? $element.find(child) : $element.children(),
        maxHeight = 0

      $child.each(function () {
        var thisHeight = $(this).outerHeight()
        if (thisHeight > maxHeight) {
          maxHeight = thisHeight
        }
      }).css('min-height', maxHeight)
    })
  }

  function thim_min_height_content_area () {
    var content_area = $('#main-content .content-area'),
      footer = $('#main-content .site-footer'),
      winH = $(window).height()
    if (content_area.length > 0 && footer.length > 0) {
      content_area.css('min-height', winH - footer.height())
    }
  }

  $(document).ready(function () {
    $('.thim-search-light-style').append('<a class="thim-button-down thim-click-to-bottom" href="#"><i class="fa fa-chevron-down"></i></a>')
    $(document).on('click', '.thim-button-down', function (e) {
      e.preventDefault()
      if ($('#wpadminbar').length > 0) {
        var height = parseInt($('#wpadminbar').outerHeight()) +
          parseInt($('.thim-search-light-style').outerHeight())
      } else {
        var height = parseInt($('.thim-search-light-style').outerHeight())
      }
      $('body, html').animate({
        'scrollTop': height,
      }, 600)
    })

    var html_scroll = '<div class="scroll_slider_tab"><div class="container">' +
      '<a href="" class="to_bottom">' +
      '<svg xmlns="http://www.w3.org/2000/svg"' +
      'xmlns:xlink="http://www.w3.org/1999/xlink"' +
      'width="18px" height="28px">' +
      '<path fill-rule="evenodd"  fill="rgb(255, 255, 255)"' +
      'd="M16.169,2.687 C14.585,0.904 12.173,0.000 9.000,0.000 C5.827,0.000 3.415,0.904 1.831,2.687 C0.238,4.479 -0.000,6.580 -0.000,7.673 L-0.000,20.328 C-0.000,21.420 0.238,23.520 1.831,25.313 C3.415,27.096 5.827,28.000 9.000,28.000 C12.173,28.000 14.585,27.096 16.169,25.313 C17.762,23.520 18.000,21.420 18.000,20.328 L18.000,7.673 C18.000,6.580 17.762,4.479 16.169,2.687 ZM9.000,9.755 C8.342,9.755 7.808,9.242 7.808,8.611 L7.808,6.159 C7.808,5.528 8.342,5.015 9.000,5.015 C9.658,5.015 10.192,5.528 10.192,6.159 L10.192,8.611 C10.192,9.242 9.658,9.755 9.000,9.755 ZM17.059,20.328 C17.059,21.458 16.670,27.097 9.000,27.097 C1.330,27.097 0.941,21.458 0.941,20.328 L0.941,7.673 C0.941,6.566 1.315,1.138 8.529,0.911 L8.529,4.163 C7.578,4.369 6.866,5.185 6.866,6.159 L6.866,8.611 C6.866,9.585 7.578,10.401 8.529,10.607 L8.529,14.318 C8.529,14.568 8.740,14.770 9.000,14.770 C9.260,14.770 9.471,14.568 9.471,14.318 L9.471,10.607 C10.422,10.401 11.134,9.585 11.134,8.611 L11.134,6.159 C11.134,5.185 10.422,4.369 9.471,4.163 L9.471,0.911 C16.685,1.138 17.059,6.566 17.059,7.673 L17.059,20.328 Z"/>' +
      '</svg>' +
      '<i class="icon-chevron-down icon1"></i>' +
      '<i class="icon-chevron-down icon2"></i>' +
      '</a>' +
      '</div></div>'
    $('.have_scroll_bottom').append(html_scroll)
    $(document).on('click', '.have_scroll_bottom .scroll_slider_tab .to_bottom',
      function (e) {
        e.preventDefault()
        if ($('#wpadminbar').length > 0) {
          var height = parseInt($('#wpadminbar').outerHeight()) +
            parseInt($('.have_scroll_bottom').outerHeight())
        } else {
          var height = parseInt(
            $('.have_scroll_bottom').outerHeight())
        }
        $('body, html').animate({
          'scrollTop': height,
        }, 600)
      })

    $(document).on('click', 'body.page-template-landing-page .current_page_item>a, .thim-top-landing .widget-button',
      function (e) {
        if ($('.thim-top-landing').length > 0) {
          e.preventDefault()
          if ($('#wpadminbar').length > 0) {
            var height = parseInt(
              $('#wpadminbar').outerHeight()) +
              parseInt($('.thim-top-landing').outerHeight())
          } else {
            var height = parseInt(
              $('.thim-top-landing').outerHeight())
          }
          $('body, html').animate({
            'scrollTop': height,
          }, 600)
        }
      })

  })
  $(document).ready(function () {
    //Shop filter color
    $('.woof_list input[data-tax="pa_color"]').each(function () {
      $(this).css('background-color', $(this).attr('name'))
    })
    $('.woof_list input.woof_radio_term[name="pa_color"]').each(function () {
      $(this).css('background-color', $(this).data('slug'))
    })
  })

  woof_js_after_ajax_done = function () {
    $('.woof_list input[data-tax="pa_color"]').each(function () {
      $(this).css('background-color', $(this).attr('name'))
    })
    $('.woof_list input.woof_radio_term[name="pa_color"]').each(function () {
      $(this).css('background-color', $(this).data('slug'))
    })

    if ($('#thim-product-archive').hasClass('thim-product-list')) {
      $('.thim-product-switch-layout>a.switchToGrid.switch-active').removeClass('switch-active')
      $('.thim-product-switch-layout>a.switchToList').addClass('switch-active')
    } else {
      $('.thim-product-switch-layout>a.switchToList.switch-active').removeClass('switch-active')
      $('.thim-product-switch-layout>a.switchToGrid').addClass('switch-active')
    }

  }

  //Code for timetable widget
  // TODO when using many Thim Course Categories widgets
  $(document).ready(function () {

    var tab_cat_course = $('.thim-carousel-course-categories-tabs')
    tab_cat_course.each(function () {
      tab_cat_course.find('.thim-course-slider .item').click(function (e) {
        e.preventDefault()
        tab_cat_course.find('.item_content.active').removeClass('active')
        tab_cat_course.find($(this).find('.title a').attr('href')).addClass('active')
        tab_cat_course.find('.thim-course-slider .item.active').removeClass('active')
        $(this).addClass('active')
      })
    })

    var item_input_new = $(
      '.form_developer_course .content .yikes-easy-mc-form>label>input')
    item_input_new.focusin(function () {
      $(this).parent().find('span').css('font-size', '14px')
      $(this).parent().find('span').css('bottom', '36px')
    }).focusout(function () {
      if ($(this).val() == '') {
        $(this).parent().find('span').css('font-size', '0px')
        $(this).parent().find('span').css('bottom', '0px')
      }
    })

    //Add class for nav-tabs single course
    var tab_course = $('.course-tabs .nav-tabs>li').length
    if (tab_course > 0) {
      $('.course-tabs .nav-tabs>li').addClass('thim-col-' + tab_course)
    }

    $('.thim-widget-timetable .timetable-item ').each(function () {
      var elem = $(this),
        old_style = elem.attr('style'),
        hover_style = elem.data('hover')
      elem.on({
        'mouseenter': function () {
          elem.attr('style', hover_style)
        },
        'mouseleave': function () {
          elem.attr('style', old_style)
        },
      })
    })

    if (typeof LP != 'undefined') {
      LP.Hook.addAction('learn_press_receive_message', function () {
        var lesson_title = $(
          '.course-item.item-current .course-item-title').text(),
          lesson_index = $('.course-item.item-current .index').text()
        $('#popup-header .popup-title').html('<span class="index">' + lesson_index + '</span>' +
          lesson_title)
      })
    }

    $('.thim-video-popup .button-popup').on('click', function (e) {
      var item = $(this)
      e.preventDefault()
      $.magnificPopup.open({
        items: {
          src: item.parent().parent().find('.video-content'),
          type: 'inline',
        },
        showCloseBtn: false,
        callbacks: {
          open: function () {
            $('body').addClass('thim-popup-active')
            $.magnificPopup.instance.close = function () {
              $('body').removeClass('thim-popup-active')
              $.magnificPopup.proto.close.call(this)
            }
          },
        },
      })
    })

    $('.mc4wp-form #mc4wp_email').on('focus', function () {
      $(this).parents('.mc4wp-form').addClass('focus-input')
    }).on('focusout', function () {
      $(this).parents('.mc4wp-form.focus-input').removeClass('focus-input')
    })

    $(document).on('click', '.button-retake-course, .button-finish-course', function () {
      $('.thim-box-loading-container.visible').removeClass('visible')
    })

    $(document).on('click', '.button-load-item', function () {
      $('#course-curriculum-popup').addClass('loading')
      $('.thim-box-loading-container').addClass('visible')
    })

    //Thim simple slider
    // $('.thim-event-simple-slider').thim_simple_slider({
    //     item        : 3,
    //     itemActive  : 1,
    //     itemSelector: '.item-event',
    //     align       : 'right',
    //     pagination  : true,
    //     navigation  : true,
    //     height      : 392,
    //     activeWidth : 1170,
    //     itemWidth   : 800,
    //     prev_text   : '<i class="fa fa-long-arrow-left"></i>',
    //     next_text   : '<i class="fa fa-long-arrow-right"></i>',
    // });

    $('.width-navigation .menu-main-menu>li.menu-item').last().addClass('last-menu-item')

    //add mac-os to body class
    if (navigator.userAgent.indexOf('Mac') > 0) {
      $('body').addClass('mac-os')
    }
    //add i-os to body class
    if (navigator.platform.match(/(iPhone|iPod|iPad)/i)) {
      $('body').addClass('i-os')
    }

    //Set padding for demo vc RTL
    setTimeout(function () {
      $(window).trigger('resize')
    }, 1000)
    $(window).resize(function () {
      var get_padding1 = parseFloat(
        $('body.rtl .vc_row-has-fill[data-vc-full-width="true"]').css('left')),
        get_padding2 = parseFloat(
          $('body.rtl .vc_row-no-padding[data-vc-full-width="true"]').css('left'))
      if (get_padding1 != 'undefined') {
        $('body.rtl .vc_row-has-fill[data-vc-full-width="true"]').css({ 'right': get_padding1, 'left': '' })
      }
      if (get_padding2 != 'undefined') {
        $('body.rtl .vc_row-no-padding[data-vc-full-width="true"]').css({ 'right': get_padding2, 'left': '' })
      }
    })

    //Course archive search filter
    var search_time_out = null
    $(document).on('keydown', 'body:not(.course-filter-active) .course-search-filter',
      function (event) {
        if (event.ctrlKey) {
          return
        }

        if (event.keyCode === 13) {
          event.preventDefault()
          return false
        }

        if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 8 || event.keyCode === 32) {
          var elem = $(this),
            keyword = event.keyCode === 8 ? elem.val() : elem.val() + event.key,
            $body = $('body')

          if (search_time_out != null) clearTimeout(search_time_out)

          search_time_out = setTimeout(function () {
            elem.attr('disabled', 'disabled')
            search_time_out = null

            $('#thim-course-archive').addClass('loading')

            var archive = elem.parents('#lp-archive-courses'),
              cateArr = []

            if ($body.hasClass('category')) {
              var bodyClass = $body.attr('class'),
                cateClass = bodyClass.match(/category\-\d+/gi)[0],
                cateID = cateClass.split('-').pop()

              cateArr.push(cateID)
            }

            if ($('.list-cate-filter').length > 0) {
              $('.list-cate-filter input.filtered').each(function () {

                if ($(this).val() !== cateID) {
                  cateArr.push($(this).val())
                }
              })
            }

            $.ajax({
              url: $('#lp-archive-courses').data('allCoursesUrl'),
              type: 'POST',
              dataType: 'html',
              data: {
                s: keyword,
                ref: 'course',
                post_type: 'lp_course',
                course_orderby: $('.thim-course-order > select').val(),
                course_cate_filter: cateArr,
                course_paged: 1,
              },
              success: function (html) {
                var archive_html = $(html).find('#lp-archive-courses').html()
                archive.html(archive_html)
                $('.course-search-filter').val(keyword).trigger('focus')
                $body.removeClass('course-filter-active')
                $('.filter-loading').remove()
              },
              error: function () {
                $body.removeClass('course-filter-active')
                $('.filter-loading').remove()
              },
            })

          }, 1000)
        }
      })

    $(document).on('click', '.button-load-item', function () {
      can_escape = false
    })

    $(document).on('keydown', function (event) {
      if (event.keyCode == 27) {
        if (typeof can_escape !== 'undefined') {
          if (can_escape === false) {
            event.preventDefault()
          }
        }
      }

    })

    //Add view password into checkbox field
    $('.login-password').append('<span id="show_pass"><i class="fa fa-eye"></i></span>')
    $(document).on('click', '#show_pass', function () {
      var el = $(this),
        thim_pass = el.parents('.login-password').find('>input')
      if (el.hasClass('active')) {
        thim_pass.attr('type', 'password')
      } else {
        thim_pass.attr('type', 'text')
      }
      el.toggleClass('active')
    })

    $(document).on('click', '.content_course_2 .course_right .menu_course ul li a, .content_course_2 .thim-course-menu-landing .thim-course-landing-tab li a',
      function () {
        $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top,
        }, 1000)
      })

    $(window).resize(function () {
      if ($(window).width() > 600) {
        $('footer#colophon.has-footer-bottom').css('margin-bottom', $('.footer-bottom').height())
      }
      if ($(window).width() < 768) {
        $('body.course-item-popup').addClass('full-screen-content-item')
        $('body.ltr.course-item-popup #learn-press-course-curriculum').css('left', '-300px')
        $('body.ltr.course-item-popup #learn-press-content-item').css('left', '0')
        $('body.rtl.course-item-popup #learn-press-course-curriculum').css('right', 'auto')
        $('body.rtl.course-item-popup #learn-press-content-item').css('right', 'auto')
      }
    })

  })

})(jQuery)
