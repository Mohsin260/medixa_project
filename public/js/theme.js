/*
* ----------------------------------------------------------------------------------------
Author       : DuezaThemes
Author URL   : https://themeforest.net/user/duezathemes
Template Name: UNIFORM - Multi-Purpose eCommerce Template
Version      : 1.0                                          
* ----------------------------------------------------------------------------------------
*/

// -----------------------------

//   js index
/* =================== */
/*  
    -preloader
    -jQuery MeanMenu
    -jQuery MeanMenu
    -meanmenu 
    -sticky
    -scroll-up
    -nivo slider
    -nivo slider home 2
    -nivo slider home 3
    -counter
    -smooth scroll
    -countdown
    -accordion
    -brand carousel
    -h2-tst carousel
    -feature-post carousel
    -h2-tst carousel
    -feature-pro-carousel
    -h3-testimonial-carousel
    -related-pro-carousel
    -customer-review-caousel
    -team-caousel
    -hide-login-register
    -hide-show-sign-in-form
    -price-slider
    -cart-plus-minus-button 
    -about-video-popup
    -newsletter-popup



*/
// -----------------------------


(function($) {
    "use strict";


    /*---------------------
    preloader
    --------------------- */

    $(window).on('load', function() {
        $('#preloader').fadeOut('slow', function() { $(this).hide(); });
    });


    /*----------------------------
     jQuery MeanMenu
    ------------------------------ */
    $('nav#dropdown').meanmenu();

    /*-----------------
    meanmenu 
    -----------------*/
    $('nav#mobile_menu_active').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: '.mobile-menu-area .container',
    });


    /*-----------------
    sticky
    -----------------*/
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 85) {
            $('.menu-area').addClass('navbar-fixed-top');
        } else {
            $('.menu-area').removeClass('navbar-fixed-top');
        }
    });


    /*-----------------
    scroll-up
    -----------------*/
    $.scrollUp({
        scrollText: '<i class="fa fa-arrow-up" aria-hidden="true"></i>',
        easingType: 'linear',
        scrollSpeed: 1500,
        animation: 'fade'
    });


    /*-----------------------
    nivo slider
    -----------------------*/
    $('#home1_slider').nivoSlider({
        directionNav: true,
        animSpeed: 2000,
        slices: 18,
        pauseTime: 5000,
        pauseOnHover: false,
        controlNav: false,
        prevText: '<i class="fa fa-chevron-left nivo-prev-icon"></i>',
        nextText: '<i class="fa fa-chevron-right nivo-next-icon"></i>'
    });


    /*-----------------------
    nivo slider home 2
    -----------------------*/
    $('#home2_slider').nivoSlider({
        directionNav: true,
        animSpeed: 2000,
        slices: 18,
        pauseTime: 5000,
        pauseOnHover: false,
        controlNav: false,
        prevText: '<i class="fa fa-chevron-left nivo-prev-icon"></i>',
        nextText: '<i class="fa fa-chevron-right nivo-next-icon"></i>'
    });


    /*-----------------------
    nivo slider home 3
    -----------------------*/
    $('#home3_slider').nivoSlider({
        directionNav: true,
        animSpeed: 2000,
        slices: 18,
        pauseTime: 5000000,
        pauseOnHover: false,
        controlNav: false,
        prevText: '<i class="fa fa-chevron-left nivo-prev-icon"></i>',
        nextText: '<i class="fa fa-chevron-right nivo-next-icon"></i>'
    });

    /*------------------------------
         counter
    ------------------------------ */
    $('.counter-up').counterUp();


    /*---------------------
    smooth scroll
    --------------------- */
    $('.smoothscroll').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;

        $('html, body').stop().animate({
            'scrollTop': $(target).offset().top - 80
        }, 1200);
    });


    /*---------------------
    countdown
    --------------------- */
    $('[data-countdown]').each(function() {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function(event) {
            $this.html(event.strftime('<span class="cdown days"><span class="time-count">%-D</span> <p>Days</p></span> <span class="cdown hour"><span class="time-count">%-H</span> <p>Hour</p></span> <span class="cdown minutes"><span class="time-count">%M</span> <p>Min</p></span> <span class="cdown second"> <span><span class="time-count">%S</span> <p>Sec</p></span>'));
        });
    });


    /*---------------------
    accordion
    --------------------- */
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }

    /*---------------------
    brand carousel
    --------------------- */
    $('.brand-carousel').owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    })


    /*---------------------
    h2-tst carousel
    --------------------- */
    function h2_tst_carousel() {
        var owl = $(".h2-tst-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 1,
            smartSpeed: 2000,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    h2_tst_carousel();


    /*---------------------
    feature-post carousel
    --------------------- */
    function feature_post_carousel() {
        var owl = $(".feature-post-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 2,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 2
                }
            }
        });
    }
    feature_post_carousel();


    /*---------------------
    h2-tst carousel
    --------------------- */
    function h2_testimonial_carousel() {
        var owl = $(".h2-testimonial-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-long-arrow-left'></i>", "<i class='fa fa-long-arrow-right'></i>"],
            nav: true,
            items: 1,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    h2_testimonial_carousel();


    /*---------------------
    feature-pro-carousel
    --------------------- */
    function feature_pro_carousel() {
        var owl = $(".feature-pro-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 3,
            smartSpeed: 2000,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 3
                }
            }
        });
    }
    feature_pro_carousel();

    /*------------------------------
    h3-testimonial-carousel
    ---------------------------- */
    function h3_testimonial_carousel() {
        var owl = $(".h3-testimonial-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-long-arrow-left'></i>", "<i class='fa fa-long-arrow-right'></i>"],
            nav: true,
            items: 1,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    h3_testimonial_carousel();

    /*------------------------------
    related-pro-carousel
    ---------------------------- */
    function related_pro_carousel() {
        var owl = $(".related-pro-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 4,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                760: {
                    items: 4
                }
            }
        });
    }
    related_pro_carousel();

    /*------------------------------
    customer-review-caousel
    ---------------------------- */
    function customer_review_caousel() {
        var owl = $(".customer-review-caousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 2,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                900: {
                    items: 1
                },
                760: {
                    items: 2
                }
            }
        });
    }
    customer_review_caousel();

    /*------------------------------
    team-caousel
    ---------------------------- */
    function carousel() {
        var owl = $(".team-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 4,
            smartSpeed: 2000,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                900: {
                    items: 2
                },
                992: {
                    items: 4
                }
            }
        });
    }
    carousel();


    /*-----------------------
    hide-login-register
    -----------------------*/
    var lrc = document.getElementById("login_register_content"); if (lrc) lrc.style.display = "none";
    $("#login_register").on('click', function() {
        $("#login_register_content").fadeToggle("slow");
    });


    /*-----------------------
    hide-show-sign-in-form
    -----------------------*/
    var mc = document.getElementById("my_cart"); if (mc) mc.style.display = "none";
    $("#top_cart").on('click', function() {
        $("#my_cart").fadeToggle("slow");
    });


    /*-----------------------
    price-slider
    -----------------------*/
    $(function() {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function(event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    });

    /*-----------------------
    cart-plus-minus-button 
    -------------------------*/
    $(".cart-plus-minus").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function() {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find("input").val(newVal);
    });

    /*---------------------
    about-video-popup
    --------------------- */
    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 300,
        preloader: false,
        fixedContentPos: false
    });

    /*---------------------
    newsletter-popup
    --------------------- */
    jQuery(document).ready(function($) {
        var wd1_nlpopup_expires = $("#wd1_nlpopup").data("expires");
        var wd1_nlpopup_delay = $("#wd1_nlpopup").data("delay") * 1000;

        $('#wd1_nlpopup_close').on('click', function(e) {
            $.cookie('wd1_nlpopup', 'closed', { expires: wd1_nlpopup_expires, path: '/' });
            $('#wd1_nlpopup,#wd1_nlpopup_overlay').fadeOut(200);
            e.preventDefault();
        });

        if ($.cookie('wd1_nlpopup') != 'closed') {
            setTimeout(wd1_open_nlpopup, wd1_nlpopup_delay);
        }

        function wd1_open_nlpopup() {
            var topoffset = $(document).scrollTop(),
                viewportHeight = $(window).height(),
                $popup = $('#wd1_nlpopup');
            var calculatedOffset = (topoffset + (Math.round(viewportHeight / 2))) - (Math.round($popup.outerHeight() / 2));

            if (calculatedOffset <= 40) {
                calculatedOffset = 40;
            }

            $popup.css('top', calculatedOffset);
            $('#wd1_nlpopup,#wd1_nlpopup_overlay').fadeIn(500);
        }

    });



    /* jQuery Cookie Plugin v1.3.1 */
    (function(a) {
        if (typeof define === "function" && define.amd) { define(["jquery"], a); } else { a(jQuery); }
    }(function(e) {
        var a = /\+/g;

        function d(g) {
            return g;
        }

        function b(g) {
            return decodeURIComponent(g.replace(a, " "));
        }

        function f(g) {
            if (g.indexOf('"') === 0) { g = g.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"); }
            try {
                return c.json ? JSON.parse(g) : g;
            } catch (h) {}
        }
        var c = e.cookie = function(p, o, u) {
            if (o !== undefined) {
                u = e.extend({}, c.defaults, u);
                if (typeof u.expires === "number") {
                    var q = u.expires,
                        s = u.expires = new Date();
                    s.setDate(s.getDate() + q);
                }
                o = c.json ? JSON.stringify(o) : String(o);
                return (document.cookie = [c.raw ? p : encodeURIComponent(p), "=", c.raw ? o : encodeURIComponent(o), u.expires ? "; expires=" + u.expires.toUTCString() : "", u.path ? "; path=" + u.path : "", u.domain ? "; domain=" + u.domain : "", u.secure ? "; secure" : ""].join(""));
            }
            var g = c.raw ? d : b;
            var r = document.cookie.split("; ");
            var v = p ? undefined : {};
            for (var n = 0, k = r.length; n < k; n++) {
                var m = r[n].split("=");
                var h = g(m.shift());
                var j = g(m.join("="));
                if (p && p === h) {
                    v = f(j);
                    break;
                }
                if (!p) { v[h] = f(j); }
            }
            return v;
        };
        c.defaults = {};
        e.removeCookie = function(h, g) {
            if (e.cookie(h) !== undefined) {
                e.cookie(h, "", e.extend(g, { expires: -1 }));
                return true;
            }
            return false;
        };
    }));


    /*---------------------
    // Ajax Contact Form
    --------------------- */

    $('.cf-msg').hide();
    $('form#cf button#submit').on('click', function() {
        var fname = $('#fname').val();
        var fmobile = $('#fmobile').val();
        var fsite = $('#fsite').val();
        var email = $('#email').val();
        var msg = $('#msg').val();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email)) {
            alert('Please enter valid email');
            return false;
        }

        fname = $.trim(fname);
        fmobile = $.trim(fmobile);
        fsite = $.trim(fsite);
        email = $.trim(email);
        msg = $.trim(msg);

        if (fname != '' && email != '' && msg != '') {
            var values = "fname=" + fname + "&fmobile=" + fmobile + "&fsite=" + fsite + "&email=" + email + " &msg=" + msg;
            $.ajax({
                type: "POST",
                url: "mail.php",
                data: values,
                success: function() {
                    $('#fname').val('');
                    $('#fmobile').val('');
                    $('#fsite').val('');
                    $('#email').val('');
                    $('#msg').val('');

                    $('.cf-msg').fadeIn().html('<div class="alert alert-success"><strong>Success!</strong> Email has been sent successfully.</div>');
                    setTimeout(function() {
                        $('.cf-msg').fadeOut('slow');
                    }, 4000);
                }
            });
        } else {
            $('.cf-msg').fadeIn().html('<div class="alert alert-danger"><strong>Warning!</strong> Please fillup the informations correctly.</div>')
        }
        return false;
    });


}(jQuery));
