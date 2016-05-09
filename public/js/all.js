'use strict';

var $ = window.jQuery;

$(function() {

    /*-------------------------------------------------*/
    /* =  Selector utils and styling
    /*-------------------------------------------------*/
	$("select").selectOrDie();

	/*-------------------------------------------------*/
    /* =  Popup notification
    /*-------------------------------------------------*/
    window.showNotification = function(title, message, className) {
        $('.popup-flash').fadeIn('fast');
        $('.element h3').remove();
        $('.element')
            .prepend('<p>' + message + '</p>')
            .prepend('<h3 class="' + className + '">' + title + '</h3>');
    }

    window.closeNotification = function(element) {
        $(element).fadeOut('fast');
    }

    $('[data-action="popup-flash-close"]').on('click', function() {
        closeNotification('.popup-flash');
    });

    /*-------------------------------------------------*/
    /* =  scroll on link
    /*-------------------------------------------------*/
    $('header nav ul a').smoothScroll({
      offset: 0,
      // one of 'top' or 'left'
      direction: 'top',
      easing: 'easeInOutExpo',
      speed: 1000,
      // coefficient for "auto" speed
      autoCoefficent: 2,
      preventDefault: true
    });

	/*-------------------------------------------------*/
    /* =  REGISTER POPUP
    /*-------------------------------------------------*/ 
	$('.register-now').on('click' , function() {
        $('.register-popup').toggleClass('active');
    });

    $('.register-popup .close-popup, .register-popup .overlay-popup').on('click' , function() {
        $('.register-popup').toggleClass('active');
    });

    /*-------------------------------------------------*/
    /* =  NAV BAR VISIBILITY AND RESPONSIVENESS
    /*-------------------------------------------------*/ 
    var num = $('.header-main').offset().top; 

    $(window).bind('scroll', function() {

        if ($(window).scrollTop() > num) {
            $('.header-main').addClass('change');
        }
        else {
            num = $('.header-main').offset().top;
            $('.header-main').removeClass('change');

        }
    });

    var toggleNav = function () {
    	if ($('nav').hasClass('active')) {
    		$('nav.active a').unbind('click');
    		$('nav').removeClass('active');
    	}
    	else {
    		$('nav').addClass('active');
    		$('nav.active a').bind('click', toggleNav);
    	}
    }

    $('.bars').click(toggleNav);
});