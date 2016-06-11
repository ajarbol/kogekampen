'use strict';

var $ = window.jQuery;

$(function() {

    /*-------------------------------------------------*/
    /* =  Selector utils and styling
    /*-------------------------------------------------*/
	$("select").selectOrDie();

    //hack for https://github.com/vestman/Select-or-Die/issues/22
    $('.sod_select.touch .sod').change(function() {
        var newValue = $(this).find('option:selected').val();
        $('.sod_option.selected.active').removeClass('selected active');
        $('.sod_option[data-value="'+newValue+'"]').addClass('selected active');
    });

	/*-------------------------------------------------*/
    /* =  Popup notification
    /*-------------------------------------------------*/
    window.showNotification = function(title, message, className) {
        $('.popup-flash').fadeIn('fast');
        $('.element h3, .element p').remove();
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
    /* =  Scroll on link
    /*-------------------------------------------------*/
    if ($(window).width() < 950) {
      var top_ofset = $('header').height() + 60;
    }
    else {
      var top_ofset = $('header').height() + 10;
    }

    $('header nav ul a').smoothScroll({
      offset: - top_ofset,
      // one of 'top' or 'left'
      direction: 'top',
      easing: 'easeInOutExpo',
      speed: 1000,
      // coefficient for "auto" speed
      autoCoefficent: 2,
      preventDefault: true
    });

	/*-------------------------------------------------*/
    /* =  POPUPs
    /*-------------------------------------------------*/
    window.addPopup = function ($popup, $trigger) {
    	$trigger.on('click' , function() {
            var offset = $(window).width() <= 480 ? 0 : 100;
            var height = $(window).scrollTop() + offset;
            $popup.find('.content-popup').css('margin', height + 'px auto');
            $popup.toggleClass('active');
        });
        $popup.find('.close-popup').on('click' , function() {
            $popup.toggleClass('active');
        });
        $popup.find('.overlay-popup').on('click' , function() {
            $popup.toggleClass('active');
        });
    }

    /*-------------------------------------------------*/
    /* =  NAV BAR VISIBILITY AND RESPONSIVENESS
    /*-------------------------------------------------*/ 
    var num = $('.header-main').offset().top; 

    $(window).bind('scroll', function() {

        if ($(window).scrollTop() > num) {
            $('.header-main').addClass('change');
        }
        else if(!$('nav').hasClass('active')) {
            num = $('.header-main').offset().top;
            $('.header-main').removeClass('change');

        }
    });

    var toggleNav = function () {
    	if ($('nav').hasClass('active')) {
    		$('nav.active a').unbind('click');
    		$('nav').removeClass('active');
            if ($(window).scrollTop() <= num) {
                $('.header-main').removeClass('change');
            }
    	}
    	else {
    		$('nav').addClass('active');
    		$('nav.active a').bind('click', toggleNav);
            $('.header-main').addClass('change');
    	}
    }

    $('.bars').click(toggleNav);

    /*-------------------------------------------------*/
    /* =  WIP features
    /*-------------------------------------------------*/

    $('[data-action="comming-soon"]').click(function(){
        showNotification("404 🤓", "Denne side kommer snart!", "error");
    })

});