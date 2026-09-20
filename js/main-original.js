/*! WOW wow.js - v1.3.0 - 2016-10-04
* https://wowjs.uk
* Copyright (c) 2016 Thomas Grainger; Licensed MIT */!function(a,b){if("function"==typeof define&&define.amd)define(["module","exports"],b);else if("undefined"!=typeof exports)b(module,exports);else{var c={exports:{}};b(c,c.exports),a.WOW=c.exports}}(this,function(a,b){"use strict";function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function d(a,b){return b.indexOf(a)>=0}function e(a,b){for(var c in b)if(null==a[c]){var d=b[c];a[c]=d}return a}function f(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)}function g(a){var b=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],c=arguments.length<=2||void 0===arguments[2]?!1:arguments[2],d=arguments.length<=3||void 0===arguments[3]?null:arguments[3],e=void 0;return null!=document.createEvent?(e=document.createEvent("CustomEvent"),e.initCustomEvent(a,b,c,d)):null!=document.createEventObject?(e=document.createEventObject(),e.eventType=a):e.eventName=a,e}function h(a,b){null!=a.dispatchEvent?a.dispatchEvent(b):b in(null!=a)?a[b]():"on"+b in(null!=a)&&a["on"+b]()}function i(a,b,c){null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c}function j(a,b,c){null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]}function k(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight}Object.defineProperty(b,"__esModule",{value:!0});var l,m,n=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),o=window.WeakMap||window.MozWeakMap||function(){function a(){c(this,a),this.keys=[],this.values=[]}return n(a,[{key:"get",value:function(a){for(var b=0;b<this.keys.length;b++){var c=this.keys[b];if(c===a)return this.values[b]}}},{key:"set",value:function(a,b){for(var c=0;c<this.keys.length;c++){var d=this.keys[c];if(d===a)return this.values[c]=b,this}return this.keys.push(a),this.values.push(b),this}}]),a}(),p=window.MutationObserver||window.WebkitMutationObserver||window.MozMutationObserver||(m=l=function(){function a(){c(this,a),"undefined"!=typeof console&&null!==console&&(console.warn("MutationObserver is not supported by your browser."),console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content."))}return n(a,[{key:"observe",value:function(){}}]),a}(),l.notSupported=!0,m),q=window.getComputedStyle||function(a){var b=/(\-([a-z]){1})/g;return{getPropertyValue:function(c){"float"===c&&(c="styleFloat"),b.test(c)&&c.replace(b,function(a,b){return b.toUpperCase()});var d=a.currentStyle;return(null!=d?d[c]:void 0)||null}}},r=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];c(this,a),this.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null,scrollContainer:null,resetAnimation:!0},this.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),this.vendors=["moz","webkit"],this.start=this.start.bind(this),this.resetAnimation=this.resetAnimation.bind(this),this.scrollHandler=this.scrollHandler.bind(this),this.scrollCallback=this.scrollCallback.bind(this),this.scrolled=!0,this.config=e(b,this.defaults),null!=b.scrollContainer&&(this.config.scrollContainer=document.querySelector(b.scrollContainer)),this.animationNameCache=new o,this.wowEvent=g(this.config.boxClass)}return n(a,[{key:"init",value:function(){this.element=window.document.documentElement,d(document.readyState,["interactive","complete"])?this.start():i(document,"DOMContentLoaded",this.start),this.finished=[]}},{key:"start",value:function(){var a=this;if(this.stopped=!1,this.boxes=[].slice.call(this.element.querySelectorAll("."+this.config.boxClass)),this.all=this.boxes.slice(0),this.boxes.length)if(this.disabled())this.resetStyle();else for(var b=0;b<this.boxes.length;b++){var c=this.boxes[b];this.applyStyle(c,!0)}if(this.disabled()||(i(this.config.scrollContainer||window,"scroll",this.scrollHandler),i(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live){var d=new p(function(b){for(var c=0;c<b.length;c++)for(var d=b[c],e=0;e<d.addedNodes.length;e++){var f=d.addedNodes[e];a.doSync(f)}});d.observe(document.body,{childList:!0,subtree:!0})}}},{key:"stop",value:function(){this.stopped=!0,j(this.config.scrollContainer||window,"scroll",this.scrollHandler),j(window,"resize",this.scrollHandler),null!=this.interval&&clearInterval(this.interval)}},{key:"sync",value:function(){p.notSupported&&this.doSync(this.element)}},{key:"doSync",value:function(a){if("undefined"!=typeof a&&null!==a||(a=this.element),1===a.nodeType){a=a.parentNode||a;for(var b=a.querySelectorAll("."+this.config.boxClass),c=0;c<b.length;c++){var e=b[c];d(e,this.all)||(this.boxes.push(e),this.all.push(e),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(e,!0),this.scrolled=!0)}}}},{key:"show",value:function(a){return this.applyStyle(a),a.className=a.className+" "+this.config.animateClass,null!=this.config.callback&&this.config.callback(a),h(a,this.wowEvent),this.config.resetAnimation&&(i(a,"animationend",this.resetAnimation),i(a,"oanimationend",this.resetAnimation),i(a,"webkitAnimationEnd",this.resetAnimation),i(a,"MSAnimationEnd",this.resetAnimation)),a}},{key:"applyStyle",value:function(a,b){var c=this,d=a.getAttribute("data-wow-duration"),e=a.getAttribute("data-wow-delay"),f=a.getAttribute("data-wow-iteration");return this.animate(function(){return c.customStyle(a,b,d,e,f)})}},{key:"resetStyle",value:function(){for(var a=0;a<this.boxes.length;a++){var b=this.boxes[a];b.style.visibility="visible"}}},{key:"resetAnimation",value:function(a){if(a.type.toLowerCase().indexOf("animationend")>=0){var b=a.target||a.srcElement;b.className=b.className.replace(this.config.animateClass,"").trim()}}},{key:"customStyle",value:function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a}},{key:"vendorSet",value:function(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];a[""+c]=d;for(var e=0;e<this.vendors.length;e++){var f=this.vendors[e];a[""+f+c.charAt(0).toUpperCase()+c.substr(1)]=d}}}},{key:"vendorCSS",value:function(a,b){for(var c=q(a),d=c.getPropertyCSSValue(b),e=0;e<this.vendors.length;e++){var f=this.vendors[e];d=d||c.getPropertyCSSValue("-"+f+"-"+b)}return d}},{key:"animationName",value:function(a){var b=void 0;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=q(a).getPropertyValue("animation-name")}return"none"===b?"":b}},{key:"cacheAnimationName",value:function(a){return this.animationNameCache.set(a,this.animationName(a))}},{key:"cachedAnimationName",value:function(a){return this.animationNameCache.get(a)}},{key:"scrollHandler",value:function(){this.scrolled=!0}},{key:"scrollCallback",value:function(){if(this.scrolled){this.scrolled=!1;for(var a=[],b=0;b<this.boxes.length;b++){var c=this.boxes[b];if(c){if(this.isVisible(c)){this.show(c);continue}a.push(c)}}this.boxes=a,this.boxes.length||this.config.live||this.stop()}}},{key:"offsetTop",value:function(a){for(;void 0===a.offsetTop;)a=a.parentNode;for(var b=a.offsetTop;a.offsetParent;)a=a.offsetParent,b+=a.offsetTop;return b}},{key:"isVisible",value:function(a){var b=a.getAttribute("data-wow-offset")||this.config.offset,c=this.config.scrollContainer&&this.config.scrollContainer.scrollTop||window.pageYOffset,d=c+Math.min(this.element.clientHeight,k())-b,e=this.offsetTop(a),f=e+a.clientHeight;return d>=e&&f>=c}},{key:"disabled",value:function(){return!this.config.mobile&&f(navigator.userAgent)}}]),a}();b["default"]=r,a.exports=b["default"]});




jQuery(document).ready(function ($) {

new WOW().init();


    $(window).on("resize", function (e) {
        checkScreenSize();
    });

    checkScreenSize();

    function checkScreenSize(){
        console.log('checked');

        $('.borderless-image.left').each(function(index, el) {
            $(this).css('width', '100%');
            console.log($(this));
            console.log($(this).parent().offset().left);
             if($(this).hasClass('background-image-container')){
                 $(this).css('width', $(this).parent().offset().left + $(this).outerWidth());
                 $(this).css('margin-left', '-' + $(this).parent().offset().left + 'px');
             } else {
                 $(this).css('width', $(this).parent().offset().left + $(this).outerWidth() + 32);
                 $(this).css('margin-left', '-' + ($(this).parent().offset().left + 32) + 'px');
             }
        });

        $('.borderless-image.right').each(function(index, el) {
          let marginNumber = $(window).width() - ($(this).offset().left + $(this).outerWidth());
          $(this).css('width', $(this).outerWidth() + marginNumber);
          $(this).css('margin-right', '-' + marginNumber + 'px');
        });
    }

    // Smooth Anchor Link scroll START
	$('a[href*=\\#]').on('click', function(event){
		let thePosition = $(this.hash).offset().top;

		if(thePosition) {
			event.preventDefault();
			$('html,body').animate({scrollTop:thePosition - 0}, 500);
		}
	});

    $('#to-bottom-button').on('click', function(event) {
      if($('.home-scroll-anchor').length > 0){
        let topPosition = $('.home-scroll-anchor').offset().top + 2;
        $('html,body').animate({scrollTop:topPosition}, 500);
      }
    });
    // Smooth Anchor Link scroll END

    // To Top Button START
    $('#to-the-top').hide();
    $(window).scroll(function () {
    	if ($(this).scrollTop() > 100) { // Wenn 100 Pixel gescrolled wurde
    		$('#to-the-top').fadeIn();
    	} else {
    		$('#to-the-top').fadeOut();
    	}
    });
    $('#to-the-top').on('click', function() {
        $("html, body").animate({ scrollTop: 0 },  1000);
    });
    // To Top Button END

    $('.mobile-slider').slick({
      autoplay: true,
      dots: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: 8000,
      speed: 800,
      waitForAnimate: false,
      cssEase:false
    });

    $('.desktop-slider').slick({
      autoplay: true,
      dots: false,
      arrows: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplaySpeed: 8000,
      speed: 800,
    });

    $('.full-slider').slick({
      autoplay: true,
      dots: true,
      arrows: false,
      slidesToShow: 1,
      infinite: true,
      variableWidth: true,
      centerMode: true,
      responsive: [
       {
         breakpoint: 600,
         settings: {
           slidesToShow: 1,
           slidesToScroll: 1,
           infinite: false,
           // variableWidth: false,
           centerMode: false,

         }
       }
      ]
    });

    // $('.full-slider').on('wheel', (function(e) {
    //   e.preventDefault();
    //
    //   if (e.originalEvent.deltaY < 0) {
    //     $(this).slick('slickNext');
    //   } else {
    //     $(this).slick('slickPrev');
    //   }
    // }));


    // Load more Funktion START
    function checkIfThereAreMore() {
      $('.image-text-section').each(function(index, el) {
        let theHiddenones = $(this).find('.image-box.hidden');
        if(theHiddenones.length == 0) {
          $(this).find('.load-more').hide();
        } else {
          $(this).find('.load-more').show();
        }
      });
    }

    // Hide too much image on load
    if($(window).width() > 600) {
      $('.image-text-section .container > .row > .col-sm').each(function(index, el) {
        $(this).find('.image-box').each(function(index, el) {
            if($(this).parent().parent().parent().parent().hasClass('restaurant')) {
                if(index > 1) {
                  $(this).addClass('hidden');
                }
            } else {
                if(index > 0) {
                  $(this).addClass('hidden');
                }
            }

        });
        checkIfThereAreMore();
      });
    }


    // load two more on click
    $('.image-text-section .load-more').on('click', function(event) {
      $(this).parent().parent().find('.col-sm').each(function(index, el) {
        $(this).find('.image-box.hidden').each(function(index, el) {
          if(index == 0) {
            $(this).fadeIn()
            $(this).removeClass('hidden');
            checkIfThereAreMore();

          }
        });
      });
      checkScreenSize();
    });
    // Load more Funktion END

    // More Text Link START
    $('.morelink').on('click',  function(event) {
        $(this).parent().find('.introtext').hide();
        $(this).hide();
        $(this).parent().find('.fulltext').show();
    });
    // More TExt Link END


    // view Reservation-Button while Scrolling START
    function checkVisibilityOfReservationButton() {
        let minHeight = $('#reservierung').offset().top + $('.image-text-section.reservierung').outerHeight() + $(window).innerHeight();
        let maxHeight = $('footer').offset().top;
        var scrolled = $(window).scrollTop();
        var currentposition = $('#reservation-button').offset().top;

        if (currentposition < maxHeight && currentposition > minHeight) {
            $('#reservation-button').css('opacity', '1');
        } else {
            $('#reservation-button').css('opacity', '0');
        }


    }
    checkVisibilityOfReservationButton();

    $(window).on('scroll', function(){
        checkVisibilityOfReservationButton();
    });
    // view Reservation-Button while Scrolling END


});



