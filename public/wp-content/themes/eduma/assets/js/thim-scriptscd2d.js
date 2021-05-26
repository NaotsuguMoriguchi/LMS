/*
* Re-structure JS
* */
(function ($) {
  'use strict'

  /*
  * Helper functions
  * */
  function thim_get_url_parameters (sParam) {
    var sPageURL = window.location.search.substring(1)

    var sURLVariables = sPageURL.split('&')
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=')

      if (sParameterName[0] === sParam) {
        return sParameterName[1]
      }
    }

  }

  var thim_eduma = {
    el_thim_pop_up_login: null,
    el_loginpopopform: null,
    el_registerPopupForm: null,
    el_form_purchase_course: null,

    ready: function () {
      this.getElements()
      if (this.el_thim_pop_up_login.length) {
        this.el_loginpopopform = this.el_thim_pop_up_login.find('form[name=loginpopopform]')
        this.el_registerPopupForm = this.el_thim_pop_up_login.find('form[name=registerformpopup]')
        this.login_form_popup()
      }

      this.form_submission_validate()
      this.thim_TopHeader()
      this.ctf7_input_effect()
      this.thim_course_filter()
      this.mobile_menu_toggle()
      this.thim_backgroud_gradient()
      this.thim_single_image_popup()
    },

    getElements: function () {
      this.el_thim_pop_up_login = $('#thim-popup-login')
      this.el_form_purchase_course = $('form[name=purchase-course]')
    },

    load: function () {
      this.thim_menu()
      this.thim_carousel()
      this.thim_contentslider()
      this.counter_box()
    },

    resize: function () {

    },

    validate_form: function (form) {
      var valid = true,
        email_valid = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm

      form.find('input.required').each(function () {
        // Check empty value
        if (!$(this).val()) {
          $(this).addClass('invalid')
          valid = false
        }

        // Uncheck
        if ($(this).is(':checkbox') && !$(this).is(':checked')) {
          $(this).addClass('invalid')
          valid = false
        }

        // Check email format
        if ('email' === $(this).attr('type')) {
          if (!email_valid.test($(this).val())) {
            $(this).addClass('invalid')
            valid = false
          }
        }

        // Check captcha
        if ($(this).hasClass('captcha-result')) {
          let captcha_1 = parseInt($(this).data('captcha1')),
            captcha_2 = parseInt($(this).data('captcha2'))

          if ((captcha_1 + captcha_2) !== parseInt($(this).val())) {
            $(this).addClass('invalid').val('')
            valid = false
          }
        }
      })

      // Check repeat password
      if (form.hasClass('auto_login')) {
        let $pw = form.find('input[name=password]'),
          $repeat_pw = form.find('input[name=repeat_password]')

        if ($pw.val() !== $repeat_pw.val()) {
          $pw.addClass('invalid')
          $repeat_pw.addClass('invalid')
          valid = false
        }
      }

      $('form input.required').on('focus', function () {
        $(this).removeClass('invalid')
      })

      return valid
    },

    login_form_popup: function () {
      var teduma = this

      /*$(document).on('click', 'body:not(".loggen-in") .thim-button-checkout',
          function(e) {
            if ($(window).width() > 767) {
              e.preventDefault();
              if ($('#thim-popup-login').length) {
                $('body').addClass('thim-popup-active');
                $('#thim-popup-login').addClass('active');
              } else {
                var redirect = $(this).data('redirect');
                window.location = redirect;
              }
            } else {
              e.preventDefault();
              var redirect = $(this).data('redirect');
              window.location = redirect;
            }
          });*/

      $(document).on('click', '#thim-popup-login .close-popup', function (event) {
        event.preventDefault()
        $('body').removeClass('thim-popup-active')
        teduma.el_thim_pop_up_login.removeClass()

        //Todo: remove param purchase course on login popup
        teduma.el_loginpopopform.find('.params-purchase-code').remove()
      })

      $('body .thim-login-popup a.js-show-popup').on('click', function (event) {
        event.preventDefault()

        $('body').addClass('thim-popup-active')
        teduma.el_thim_pop_up_login.addClass('active')

        if ($(this).hasClass('login')) {
          teduma.el_thim_pop_up_login.addClass('sign-in')
        } else {
          teduma.el_thim_pop_up_login.addClass('sign-up')
        }
      })

      //when login in single page event, show login-popup ,remove redirect to page account
      $('body .widget_book-event a.js-show-popup').on('click', function (event) {
        event.preventDefault()
        $('body').addClass('thim-popup-active')
        teduma.el_thim_pop_up_login.addClass('active')
      })

      teduma.el_thim_pop_up_login.find('.link-bottom a').on('click', function (e) {
        e.preventDefault()

        if ($(this).hasClass('login')) {
          teduma.el_thim_pop_up_login.removeClass('sign-up').addClass('sign-in')
        } else {
          teduma.el_thim_pop_up_login.removeClass('sign-in').addClass('sign-up')
        }
      })

      // Show login popup when click to LP buttons
      $('body:not(".logged-in") .enroll-course .button-enroll-course, body:not(".logged-in") form.purchase-course:not(".guest_checkout") .button:not(.button-add-to-cart)').on('click', function (e) {
        e.preventDefault()

        if ($('body').hasClass('thim-popup-feature')) {
          $('.thim-link-login.thim-login-popup .login').trigger('click')

          // Add param purchase course to login and Register form if exists
          teduma.add_params_purchase_course_to_el(teduma.el_loginpopopform)
          teduma.add_params_purchase_course_to_el(teduma.el_registerPopupForm)
          /*if (teduma.el_form_purchase_course.length) {
            teduma.el_loginpopopform.append('<p class="params-purchase-code"></p>');

            var el_paramsPurchaseCode = teduma.el_loginpopopform.find('.params-purchase-code');

            $.each(teduma.el_form_purchase_course.find('input'), function (i) {
              var inputName = $(this).attr('name');
              var inputPurchaseCourse = $(this).clone();

              if (el_paramsPurchaseCode.find('input[name=' + inputName + ']').length == 0) {
                el_paramsPurchaseCode.append(inputPurchaseCourse);

                if (inputName == 'add-to-cart') {
                  var urlHandleAjax = window.location.href.addQueryVar('r', Math.random());
                  var el_urlHandleAjax = '<input name="urlHandleAjax" value="' + urlHandleAjax + '" type="hidden">';
                  el_paramsPurchaseCode.append(el_urlHandleAjax);
                }
              }
            });
          }*/
        } else {
          window.location.href = $(this).parent().find('input[name=redirect_to]').val()
        }
      })
      $('.learn-press-content-protected-message .lp-link-login').on('click', function (e) {
        e.preventDefault()

        if ($('body').hasClass('thim-popup-feature')) {
          $('.thim-link-login.thim-login-popup .login').trigger('click')
           // Add param purchase course to login and Register form if exists
          teduma.add_params_purchase_course_to_el(teduma.el_loginpopopform)
          teduma.add_params_purchase_course_to_el(teduma.el_registerPopupForm)
         } else {
          window.location.href = $(this).href()
        }
      })

      $(document).on('click', this.el_thim_pop_up_login, function (e) {
        if ($(e.target).attr('id') === 'thim-popup-login') {
          $('body').removeClass('thim-popup-active')
          teduma.el_thim_pop_up_login.removeClass()

          // remove param purchase course on login popup
          teduma.el_loginpopopform.find('.params-purchase-code').remove()
          teduma.el_registerPopupForm.find('.params-purchase-code').remove()
        }
      })

      this.el_loginpopopform.submit(function (e) {
        if (!thim_eduma.validate_form($(this))) {
          e.preventDefault()
          return false
        }

        var $elem = teduma.el_thim_pop_up_login.find('.thim-login-container')
        $elem.addClass('loading')
      })

      teduma.el_thim_pop_up_login.find('form[name=registerformpopup]').on('submit', function (e) {
        if (!thim_eduma.validate_form($(this))) {
          e.preventDefault()
          return false
        }

        var $elem = teduma.el_thim_pop_up_login.find('.thim-login-container')
        $elem.addClass('loading')
      })
    },

    /**
     * Add params purchase course to element
     * @purpose When register, login via buy course will send params purchase to action
     *
     * @param el
     * @since 4.2.6
     * @author tungnx
     */
    add_params_purchase_course_to_el: function (el) {
      var teduma = this

      if (teduma.el_form_purchase_course.length) {
        el.append('<p class="params-purchase-code"></p>')

        var el_paramsPurchaseCode = el.find('.params-purchase-code')

        $.each(teduma.el_form_purchase_course.find('input'), function (i) {
          var inputName = $(this).attr('name')
          var inputPurchaseCourse = $(this).clone()

          if (el_paramsPurchaseCode.find('input[name=' + inputName + ']').length == 0) {
            el_paramsPurchaseCode.append(inputPurchaseCourse)

            if (inputName == 'add-to-cart') {
              var urlHandleAjax = window.location.href.addQueryVar('r', Math.random())
              var el_urlHandleAjax = '<input name="urlHandleAjax" value="' + urlHandleAjax + '" type="hidden">'
              el_paramsPurchaseCode.append(el_urlHandleAjax)
            }
          }
        })
      }
    },

    form_submission_validate: function () {
      // Form login
      $('.form-submission-login form[name=loginform]').on('submit', function (e) {
        if (!thim_eduma.validate_form($(this))) {
          e.preventDefault()
          return false
        }
      })

      // Form register
      $('.form-submission-register form[name=registerform]').on('submit', function (e) {
        if (!thim_eduma.validate_form($(this))) {
          e.preventDefault()
          return false
        }
      })

      // Form lost password
      $('.form-submission-lost-password form[name=lostpasswordform]').on('submit', function (e) {
        if (!thim_eduma.validate_form($(this))) {
          e.preventDefault()
          return false
        }
      })
    },

    thim_TopHeader: function () {
      var header = $('#masthead'),
        height_sticky_header = header.outerHeight(true),
        content_pusher = $('#wrapper-container .content-pusher'),
        top_site_main = $('#wrapper-container .top_site_main')

      if (header.hasClass('header_overlay')) { // Header overlay
        top_site_main.css({ 'padding-top': height_sticky_header + 'px' })
        $(window).resize(function () {
          let height_sticky_header = header.outerHeight(true)
          top_site_main.css({ 'padding-top': height_sticky_header + 'px' })
        })
      } else { // Header default
        content_pusher.css({ 'padding-top': height_sticky_header + 'px' })
        $(window).resize(function () {
          let height_sticky_header = header.outerHeight(true)
          content_pusher.css({ 'padding-top': height_sticky_header + 'px' })
        })

      }
    },

    ctf7_input_effect: function () {
      let $ctf7_edtech = $('.form_developer_course'),
        $item_input = $ctf7_edtech.find('.field_item input'),
        $submit_wrapper = $ctf7_edtech.find('.submit_row')

      $item_input.focus(function () {
        $(this).parent().addClass('focusing')
      }).blur(function () {
        $(this).parent().removeClass('focusing')
      })

      $submit_wrapper.on('click', function () {
        $(this).closest('form').submit()
      })
    },

    thim_course_filter: function () {
      let $body = $('body')

      if (!$body.hasClass('learnpress') || !$body.hasClass('archive')) {
        return
      }

      let ajaxCall = function (data) {
        return $.ajax({
          url: $('#lp-archive-courses').data('allCoursesUrl'), //using for course category page
          type: 'POST',
          data: data,
          dataType: 'html',
          beforeSend: function () {
            $('#thim-course-archive').addClass('loading')
          },
        }).fail(function () {
          $('#thim-course-archive').removeClass('loading')
        }).done(function (data) {
          /*if (typeof history.pushState === 'function') {
            history.pushState(orderby, null, url);
          }*/
          let $document = $($.parseHTML(data))

          $('#thim-course-archive').replaceWith($document.find('#thim-course-archive'))
          $('.learn-press-pagination').html($document.find('.learn-press-pagination').html() || '')
          $('.thim-course-top .course-index span').replaceWith($document.find('.thim-course-top .course-index span'))
        })
      }

      let sendData = {
        s: '',
        ref: 'course',
        post_type: 'lp_course',
        course_orderby: 'newly-published',
        course_paged: 1,
      }

      /*
      * Handle courses sort ajax
      * */
      $(document).on('change', '.thim-course-order > select', function () {
        sendData.s = $('.courses-searching .course-search-filter').val()
        sendData.course_orderby = $(this).val()
        sendData.course_paged = 1

        ajaxCall(sendData)
      })

      /*
      * Handle pagination ajax
      * */

      $(document).on('click', '#lp-archive-courses > .learn-press-pagination a.page-numbers', function (e) {
        e.preventDefault()

        $('html, body').animate({
          'scrollTop': $('.site-content').offset().top - 140,
        }, 1000)

        let pageNum = parseInt($(this).text()),
          paged = pageNum ? pageNum : 1,
          cateArr = [], instructorArr = [],
          cpage = $('.learn-press-pagination.navigation.pagination ul.page-numbers li span.page-numbers.current').text(),
          isNext = $(this).hasClass('next') && $(this).hasClass('page-numbers'),
          isPrev = $(this).hasClass('prev') && $(this).hasClass('page-numbers')
        if (!pageNum) {
          if (isNext) {
            paged = parseInt(cpage) + 1
          }
          if (isPrev) {
            paged = parseInt(cpage) - 1
          }
        }

        $('form.thim-course-filter').find('input.filtered').each(function () {
          switch ($(this).attr('name')) {
            case 'course-cate-filter':
              cateArr.push($(this).val())
              break
            case 'course-instructor-filter':
              instructorArr.push($(this).val())
              break
            case 'course-price-filter':
              sendData.course_price_filter = $(this).val()
              break
            default:
              break
          }
        })

        if ($body.hasClass('category') && $('.list-cate-filter').length <= 0) {
          let bodyClass = $body.attr('class'),
            cateClass = bodyClass.match(/category\-\d+/gi)[0],
            cateID = cateClass.split('-').pop()

          cateArr.push(cateID)
        }

        sendData.course_cate_filter = cateArr
        sendData.course_instructor_filter = instructorArr

        sendData.s = $('.courses-searching .course-search-filter').val()
        sendData.course_orderby = $('.thim-course-order > select').val()
        sendData.course_paged = paged

        ajaxCall(sendData)
      })

      /*
      * Handle filter form click ajax
      * */
      $('form.thim-course-filter').on('submit', function (e) {
        e.preventDefault()

        let formData = $(this).serializeArray(),
          cateArr = [], instructorArr = []

        if (!formData.length) {
          return
        }

        $('html, body').animate({
          'scrollTop': $('.site-content').offset().top - 140,
        }, 1000)

        $(this).find('input').each(function () {
          let form_input = $(this)
          form_input.removeClass('filtered')

          if (form_input.is(':checked')) {
            form_input.addClass('filtered')
          }
        })

        $.each(formData, function (index, filter) {
          switch (filter.name) {
            case 'course-cate-filter':
              cateArr.push(filter.value)
              break
            case 'course-instructor-filter':
              instructorArr.push(filter.value)
              break
            case 'course-price-filter':
              sendData.course_price_filter = filter.value
              break
            default:
              break
          }
        })

        if ($body.hasClass('category') && $('.list-cate-filter').length <= 0) {
          let bodyClass = $body.attr('class'),
            cateClass = bodyClass.match(/category\-\d+/gi)[0],
            cateID = cateClass.split('-').pop()

          cateArr.push(cateID)
        }

        sendData.course_cate_filter = cateArr
        sendData.course_instructor_filter = instructorArr
        sendData.course_paged = 1

        ajaxCall(sendData)
      })
    },

    mobile_menu_toggle: function () {
      $(document).on('click', '.menu-mobile-effect', function (e) {
        e.stopPropagation()
        $('body').toggleClass('mobile-menu-open')
      })

      $(document).on('click', '.mobile-menu-wrapper', function (e) {
        $('body').removeClass('mobile-menu-open')
      })

      $(document).on('click', '.mobile-menu-inner', function (e) {
        e.stopPropagation()
      })
    },

    thim_menu: function () {

      //Add class for masthead
      var $header = $('#masthead.sticky-header'),
        off_Top = ($('.content-pusher').length > 0) ? $('.content-pusher').offset().top : 0,
        menuH = $header.outerHeight(),
        latestScroll = 0
      var $imgLogo = $('.site-header .thim-logo img'),
          srcLogo = $($imgLogo).attr('src'),
          dataRetina = $($imgLogo).data('retina'),
          dataSticky = $($imgLogo).data('sticky'),
          dataMobile = $($imgLogo).data('mobile'),
          dataStickyMobile = $($imgLogo).data('sticky_mobile');
      if ($(window).scrollTop() > 2) {
        $header.removeClass('affix-top').addClass('affix')
      }
      if($(window).outerWidth() < 769) {
        if(dataMobile != null) {
            $($imgLogo).attr('src', dataMobile);
        }
      }else{
        if (window.devicePixelRatio > 1 && dataRetina != null) {
          $($imgLogo).attr('src', dataRetina);
        }
      }

      $(window).scroll(function () {
        var current = $(this).scrollTop()
        if (current > 2) {
          $header.removeClass('affix-top').addClass('affix');
            if($(window).outerWidth() < 769) {
              if(dataStickyMobile != null) {
                $($imgLogo).attr('src', dataStickyMobile);
              }else{
                if(dataSticky != null){
                  $($imgLogo).attr('src', dataSticky);
                }
              }
             }else{
              if(dataSticky != null){
                $($imgLogo).attr('src', dataSticky);
              }
            }
          } else {
          $header.removeClass('affix').addClass('affix-top');
            if($(window).outerWidth() < 769) {
              if(dataMobile != null) {
                $($imgLogo).attr('src', dataMobile);
              }else if(srcLogo != null) {
				  $($imgLogo).attr('src', srcLogo);
			  }
            }else{
              if (window.devicePixelRatio > 1 && dataRetina != null) {
                $($imgLogo).attr('src', dataRetina);
              }else if(srcLogo != null) {
                $($imgLogo).attr('src', srcLogo);
              }
            }
         }

        if (current > latestScroll && current > menuH + off_Top) {
          if (!$header.hasClass('menu-hidden')) {
            $header.addClass('menu-hidden')
          }
        } else {
          if ($header.hasClass('menu-hidden')) {
            $header.removeClass('menu-hidden')
          }
        }

        latestScroll = current
      })


      //Submenu position
      $('.wrapper-container:not(.mobile-menu-open) .site-header .navbar-nav > .menu-item').each(function () {
        if ($('>.sub-menu', this).length <= 0) {
          return
        }

        let elm = $('>.sub-menu', this),
          off = elm.offset(),
          left = off.left,
          width = elm.width()

        let navW = $('.thim-nav-wrapper').width(),
          isEntirelyVisible = (left + width <= navW)

        if (!isEntirelyVisible) {
          elm.addClass('dropdown-menu-right')
        } else {
          let subMenu2 = elm.find('>.menu-item>.sub-menu')

          if (subMenu2.length <= 0) {
            return
          }

          let off = subMenu2.offset(),
            left = off.left,
            width = subMenu2.width()

          let isEntirelyVisible = (left + width <= navW)

          if (!isEntirelyVisible) {
            elm.addClass('dropdown-left-side')
          }
        }
      })

      //Show submenu when hover
      // var $menuItem = $(
      //     '.wrapper-container:not(.mobile-menu-open) .site-header .navbar-nav >li,' +
      //     '.wrapper-container:not(.mobile-menu-open) .site-header .navbar-nav li,' +
      //     '.site-header .navbar-nav li ul li');
      //
      // $menuItem.on({
      //     'mouseenter': function() {
      //         $(this).children('.sub-menu').stop(true, false).fadeIn(250);
      //     },
      //     'mouseleave': function() {
      //         $(this).
      //             children('.sub-menu').
      //             stop(true, false).
      //             fadeOut(250);
      //     },
      // });

      let $headerLayout = $('header#masthead')
      let magicLine = function () {
        if ($(window).width() > 768) {
          //Magic Line
          var menu_active = $(
            '#masthead .navbar-nav>li.menu-item.current-menu-item,#masthead .navbar-nav>li.menu-item.current-menu-parent, #masthead .navbar-nav>li.menu-item.current-menu-ancestor')
          if (menu_active.length > 0) {
            menu_active.before('<span id="magic-line"></span>')
            var menu_active_child = menu_active.find(
              '>a,>span.disable_link,>span.tc-menu-inner'),
              menu_left = menu_active.position().left,
              menu_child_left = parseInt(menu_active_child.css('padding-left')),
              magic = $('#magic-line')

            magic.width(menu_active_child.width()).css('left', Math.round(menu_child_left + menu_left)).data('magic-width', magic.width()).data('magic-left', magic.position().left)

          } else {
            var first_menu = $(
              '#masthead .navbar-nav>li.menu-item:first-child')
            first_menu.before('<span id="magic-line"></span>')
            var magic = $('#magic-line')
            magic.data('magic-width', 0)
          }

          var nav_H = parseInt($('.site-header .navigation').outerHeight())
          magic.css('bottom', nav_H - (nav_H - 90) / 2 - 64)

          $('#masthead .navbar-nav>li.menu-item').on({
            'mouseenter': function () {
              var elem = $(this).find('>a,>span.disable_link,>span.tc-menu-inner'),
                new_width = elem.width(),
                parent_left = elem.parent().position().left,
                left = parseInt(elem.css('padding-left'))
              if (!magic.data('magic-left')) {
                magic.css('left', Math.round(parent_left + left))
                magic.data('magic-left', 'auto')
              }
              magic.stop().animate({
                left: Math.round(parent_left + left),
                width: new_width,
              })
            },
            'mouseleave': function () {
              magic.stop().animate({
                left: magic.data('magic-left'),
                width: magic.data('magic-width'),
              })
            },
          })
        }
      }

      if (!$headerLayout.hasClass('header_v4')) {
        magicLine()
      }

      var subMenuPosition = function (menuItem) {
        var $menuItem = menuItem,
          $container = $menuItem.closest('.container, .header_full'),
          $subMenu = $menuItem.find('>.sub-menu'),
          $menuItemWidth = $menuItem.width(),
          $containerWidth = $container.width(),
          $subMenuWidth = $subMenu.width(),
          $subMenuDistance = $subMenuWidth / 2,
          paddingContainer = 15

      }
    },

    thim_carousel: function ($scope) {
      if (jQuery().owlCarousel) {
        $('.thim-gallery-images').owlCarousel({
          autoPlay: false,
          singleItem: true,
          stopOnHover: true,
          pagination: true,
          autoHeight: false,
        })

        $('.thim-carousel-wrapper').each(function () {
          var item_visible = $(this).data('visible') ? parseInt(
            $(this).data('visible')) : 4,
            item_desktopsmall = $(this).data('desktopsmall') ? parseInt(
              $(this).data('desktopsmall')) : item_visible,
            itemsTablet = $(this).data('itemtablet') ? parseInt(
              $(this).data('itemtablet')) : 2,
            itemsMobile = $(this).data('itemmobile') ? parseInt(
              $(this).data('itemmobile')) : 1,
            pagination = !!$(this).data('pagination'),
            navigation = !!$(this).data('navigation'),
            autoplay = $(this).data('autoplay') ? parseInt(
              $(this).data('autoplay')) : false,
            navigation_text = ($(this).data('navigation-text') &&
              $(this).data('navigation-text') === '2') ? [
              '<i class=\'fa fa-long-arrow-left \'></i>',
              '<i class=\'fa fa-long-arrow-right \'></i>',
            ] : [
              '<i class=\'fa fa-chevron-left \'></i>',
              '<i class=\'fa fa-chevron-right \'></i>',
            ]

          $(this).owlCarousel({
            items: item_visible,
            itemsDesktop: [1200, item_visible],
            itemsDesktopSmall: [1024, item_desktopsmall],
            itemsTablet: [768, itemsTablet],
            itemsMobile: [480, itemsMobile],
            navigation: navigation,
            pagination: pagination,
            lazyLoad: true,
            autoPlay: autoplay,
            navigationText: navigation_text,
            afterAction: function () {
              var width_screen = $(window).width()
              var width_container = $('#main-home-content').width()
              var elementInstructorCourses = $('.thim-instructor-courses')

              if (elementInstructorCourses.length) {
                if (width_screen > width_container) {
                  var margin_left_value = (width_screen - width_container) / 2
                  $('.thim-instructor-courses .thim-course-slider-instructor .owl-controls .owl-buttons').css('left', margin_left_value + 'px')
                }
              }
            }
          })
        })

        $('.thim-course-slider-instructor').each(function () {
          var item_visible = $(this).data('visible') ? parseInt(
            $(this).data('visible')) : 4,
            item_desktopsmall = $(this).data('desktopsmall') ? parseInt(
              $(this).data('desktopsmall')) : item_visible,
            itemsTablet = $(this).data('itemtablet') ? parseInt(
              $(this).data('itemtablet')) : 2,
            itemsMobile = $(this).data('itemmobile') ? parseInt(
              $(this).data('itemmobile')) : 1,
            pagination = !!$(this).data('pagination'),
            navigation = !!$(this).data('navigation'),
            autoplay = $(this).data('autoplay') ? parseInt(
              $(this).data('autoplay')) : false,
            navigation_text = ($(this).data('navigation-text') &&
              $(this).data('navigation-text') === '2') ? [
              '<i class=\'fa fa-long-arrow-left \'></i>',
              '<i class=\'fa fa-long-arrow-right \'></i>',
            ] : [
              '<i class=\'fa fa-chevron-left \'></i>',
              '<i class=\'fa fa-chevron-right \'></i>',
            ]

          $(this).owlCarousel({
            items: item_visible,
            itemsDesktop: [1400, item_desktopsmall],
            itemsDesktopSmall: [1024, itemsTablet],
            itemsTablet: [768, itemsTablet],
            itemsMobile: [480, itemsMobile],
            navigation: navigation,
            pagination: pagination,
            lazyLoad: true,
            autoPlay: autoplay,
            navigationText: navigation_text,
            afterAction: function () {
              var width_screen = $(window).width()
              var width_container = $('#main-home-content').width()
              var elementInstructorCourses = $('.thim-instructor-courses')

              if (elementInstructorCourses.length) {
                if (width_screen > width_container) {
                  var margin_left_value = (width_screen - width_container) / 2
                  $('.thim-instructor-courses .thim-course-slider-instructor .owl-controls .owl-buttons').css('left', margin_left_value + 'px')
                }
              }
            }
          })
        })

        $('.thim-carousel-course-categories .thim-course-slider, .thim-carousel-course-categories-tabs .thim-course-slider').each(function () {
          var item_visible = $(this).data('visible') ? parseInt($(this).data('visible')) : 7,
            item_desktop = $(this).data('desktop') ? parseInt($(this).data('desktop')) : item_visible,
            item_desktopsmall = $(this).data('desktopsmall')
              ? parseInt($(this).data('desktopsmall'))
              : 6,
            item_tablet = $(this).data('tablet') ? parseInt($(this).data('tablet')) : 4,
            item_mobile = $(this).data('mobile') ? parseInt($(this).data('mobile')) : 2,
            pagination = !!$(this).data('pagination'),
            navigation = !!$(this).data('navigation'),
            autoplay = $(this).data('autoplay') ? parseInt($(this).data('autoplay')) : false,
            is_rtl = $('body').hasClass('rtl')

          $(this).owlCarousel({
            items: item_visible,
            itemsDesktop: [1800, item_desktop],
            itemsDesktopSmall: [1024, item_desktopsmall],
            itemsTablet: [768, item_tablet],
            itemsMobile: [480, item_mobile],
            navigation: navigation,
            pagination: pagination,
            autoPlay: autoplay,
            navigationText: [
              '<i class=\'fa fa-chevron-left \'></i>',
              '<i class=\'fa fa-chevron-right \'></i>',
            ],
          })
        })
      }
    },

    thim_contentslider: function ($scope) {
      $('.thim-testimonial-slider').each(function () {
        var elem = $(this),
          item_visible = parseInt(elem.data('visible')),
          item_time = parseInt(elem.data('time')),
          autoplay = elem.data('auto') ? true : false,
          item_ratio = elem.data('ratio') ? elem.data('ratio') : 1.18,
          item_padding = elem.data('padding') ? elem.data('padding') : 15,
          item_activepadding = elem.data('activepadding') ? elem.data(
            'activepadding') : 0,
          item_width = elem.data('width') ? elem.data('width') : 100,
          mousewheel = !!elem.data('mousewheel')
        if (jQuery().thimContentSlider) {
          var testimonial_slider = $(this).thimContentSlider({
            items: elem,
            itemsVisible: item_visible,
            mouseWheel: mousewheel,
            autoPlay: autoplay,
            pauseTime: item_time,
            itemMaxWidth: item_width,
            itemMinWidth: item_width,
            activeItemRatio: item_ratio,
            activeItemPadding: item_activepadding,
            itemPadding: item_padding,
          })
        }

      })
    },

    counter_box: function () {
      if (jQuery().waypoint) {
        jQuery('.counter-box').waypoint(function () {
          jQuery(this).find('.display-percentage').each(function () {
            var percentage = jQuery(this).data('percentage')
            jQuery(this).countTo({
              from: 0,
              to: percentage,
              refreshInterval: 40,
              speed: 2000,
            })
          })
        }, {
          triggerOnce: true,
          offset: '80%',
        })
      }
    },

    thim_backgroud_gradient: function () {
      var background_gradient = jQuery('.thim_overlay_gradient')
      var background_gradient_2 = jQuery('.thim_overlay_gradient_2')
      if (background_gradient.length) {
        $('.thim_overlay_gradient rs-sbg-px > rs-sbg-wrap > rs-sbg').addClass('thim-overlayed')
      }

      if (background_gradient_2.length) {
        $('.thim_overlay_gradient_2 rs-sbg-px > rs-sbg-wrap > rs-sbg').addClass('thim-overlayed')
      }
    },

    thim_single_image_popup: function () {
      if (jQuery().magnificPopup) {
        $('.thim-single-image-popup').magnificPopup({
          type: 'image',
          zoom: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out',
          }
        })
      }
    },

    check_load_menu: function () {
      var window_with_resize = $(window).width()
      var type_menu_first = ''

      // if (window_with == window_with_resize) {
      // 	return;
      // }

      if (!flag_call_ajax_check_load_menu) {
        return
      }

      var el_mobile_menu_wrapper = $('.mobile-menu-wrapper')
      var el_mobile_menu_inner = el_mobile_menu_wrapper.find('.mobile-menu-inner')
      var el_main_menu = $('.width-navigation').find('.menu-main-menu')

      if (el_main_menu.length) {
        type_menu_first = 'html_desktop'
      } else if (el_mobile_menu_inner.length) {
        type_menu_first = 'html_mobile'
      }
      console.log(type_menu_first)
      // if (el_main_menu.length && el_mobile_menu_inner.length) {
      // 	return;
      // }

      flag_call_ajax_check_load_menu = 0

      setTimeout(function () {
        $.ajax({
          type: 'post',
          url: ajaxurl,
          data: {
            action: 'get_template_mainmenu_rezize',
            screen_size: $(window).width(),
          },
          beforeSend: function () {

          },
          success: function (response) {
            console.log(response)
            if (response.success) {
              if (response.data['html_mobile']) {
                $('.mobile-menu-wrapper').html(response.data['html_mobile'])
              }

              if (response.data['html_desktop']) {
                $('.width-navigation').html(response.data['html_desktop'])
              }
            }
          },
          complete: function () {
            flag_call_ajax_check_load_menu = 1
          }
        })
      }, 300)

    }
  }

  // var window_with;
  var flag_call_ajax_check_load_menu = 1

  $(document).ready(function () {
    thim_eduma.ready()
    // thim_eduma.check_load_menu();
    // window_with = $(window).width();
    //
    $(window).resize(function (e) {
      // 	// Check load menu
      // 	thim_eduma.check_load_menu();
    })

  })

  $(window).on('load', function () {
    thim_eduma.load()
  })

  $(window).on('elementor/frontend/init', function () {
    elementorFrontend.hooks.addAction('frontend/element_ready/thim-carousel-post.default',
      thim_eduma.thim_carousel)

    // elementorFrontend.hooks.addAction('frontend/element_ready/thim-courses.default',
    //     thim_eduma.thim_carousel);

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-course-categories.default',
      thim_eduma.thim_carousel)

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-our-team.default',
      thim_eduma.thim_carousel)

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-gallery-images.default',
      thim_eduma.thim_carousel)

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-list-instructors.default',
      thim_eduma.thim_carousel)

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-testimonials.default',
      thim_eduma.thim_contentslider)

    elementorFrontend.hooks.addAction('frontend/element_ready/thim-counters-box.default',
      thim_eduma.counter_box)

    elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
      var $carousel = $scope.find('.owl-carousel')
      if ($carousel.length) {
        var carousel = $carousel.data('owlCarousel')
        carousel && carousel.reload()
      }
    })
  })
})(jQuery)
