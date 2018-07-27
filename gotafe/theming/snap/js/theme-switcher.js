/*
 * @Author: Greg Bird (@BirdyOz, greg.bird.oz@gmail.com)
 * @Date:   2018-06-22 15:01:21
 * @Last Modified by:   BirdyOz
 * @Last Modified time: 2018-07-27 10:28:26
 */

jQuery(document).ready(function($) {

    // Append stylesheet
    $('head').append('<link rel="stylesheet" type="text/css" href="https://birdyoz.github.io/gotafe/theming/snap/css/theme-switcher.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="http://localhost:8888/gotafe/theming/snap/css/theme-switcher.css">');

    // Set placeholder class.  To be swapped ou on mouxe click.
    var curr_class = "gotafe-placeholder";
    console.log("@GB: curr_class = ", curr_class);
    // Define hook for body
    var body = $('body');
    // Add placeholder class
    body.addClass(curr_class);

    // Switcher buttons - Trap click actions
    $('#switcher a').click(function(event) {
        // Remove current class
        body.removeClass(curr_class);
        var btn = $(this);
        lastClass = btn.attr('class').split(' ').pop();
        // Get buttom class
        console.log("@GB: lastClass = ", lastClass);
        curr_class = lastClass;
        body.addClass(curr_class);
        // Update heading
        var btntxt = btn.text();
        console.log("@GB: btntxt = ", btntxt);
        $('#page-mast>h1>a').text(btntxt);
        event.preventDefault();
    });

    // Toggle heights
    $('a.toggle-banner-height').click(function(event) {
        body.toggleClass('gotafe-narrow-banner');
        event.preventDefault();
    });

    // Toggle images
    $('a.toggle-banner-image').click(function(event) {
        body.toggleClass(curr_class);
        event.preventDefault();
    });
});
