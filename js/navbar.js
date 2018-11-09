$(document).ready(function() {

    $(".navbar").hide(); //Hide the navigation bar first

    $(window).scroll(function() { //Listen for the window's scroll event
        if (isScrolledAfterElement("#content")) { //if it has scrolled beyond the #content elment
            $('.navbar').fadeIn(); //Show the navigation bar
        } else {
            $('.navbar').fadeOut(); //Else hide it
        }
    });

    //Function that returns true if the window has scrolled beyond the given element
    function isScrolledAfterElement(elem) {
        var $elem = $(elem);
        var $window = $(window);

        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elem.offset().top;

        return elemTop <= docViewBottom;
    }
});