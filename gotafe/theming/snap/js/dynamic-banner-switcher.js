/*
 * @Author: Greg Bird (@BirdyOz, greg.bird.oz@gmail.com)
 * @Date:   2018-06-22 15:01:21
 * @Last Modified by:   BirdyOz
 * @Last Modified time: 2018-08-03 14:32:36
 */

jQuery(document).ready(function($) {
    console.log("@GB: Dyanamic banner script loaded");

    // Append stylesheet
    $('head').append('<link rel="stylesheet" type="text/css" href="http://gitlocal:8888/public/gotafe/theming/snap/css/dynamic-banner-switcher.css">');
    // $('head').append('<link rel="stylesheet" type="text/css" href="http://gitlocal:8888/public/gotafe/theming/snap/css/dynamic-banner-switcher.css">');

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
        $('#gotafe-banner-audience').html("<span class=\"muted\">Audience: <\/span>" + btntxt);
        event.preventDefault();
    });

    // Toggle heights
    $('a.toggle-banner-height').click(function(event) {
        body.toggleClass('gotafe-narrow-banner');
        event.preventDefault();
    });

    // Toggle contrast
    $('a.toggle-high-contrast').click(function(event) {
        body.toggleClass('gotafe-high-contrast');
        event.preventDefault();
    });

    // Toggle images
    $('a.toggle-banner-image').click(function(event) {
        body.toggleClass(curr_class);
        event.preventDefault();
    });


    var logo, codes_array, details_array, code_text, title_text, audience_text, audience_name, year_text = "";

    // //Set default branding logo to 'Main'
    // $('header#page-header').addClass("Main");


    // // Extract breadcrumbs.  Create an array.  Only select items from breadcrumbs which refer to categories.
    // var breadcrumbs = $("ul.breadcrumb a[href*='categoryid'] span[itemprop='title']");

    // // Loop through the breadcrumbs, looking for sub-branding
    // $(breadcrumbs).each(function() {
    //     var breadcrumb = $(this).text();

    //     // Convert breadcrumb into "slug", then add class to #page-header.
    //     // This will allow for more granular sub-branding, once banner images have been developed

    //     var breadcrumb_class = "breadcrumbs-" + slugify(breadcrumb);
    //     $('header#page-header').addClass(breadcrumb_class);
    // });



    // Extract course short description from breadcrumbs.  It is the current banner header
    var description = $('#page-mast>h1>a').text();
    console.log("@GB: description = ", description);

    // This regex pattern matches the GOTAFE 2017 course naming convention
    //  UNIT CODE: Unit Title ([Audience, ]Year)
    //      OR
    //  UNIT CODE 1 | UNIT CODE 2 | UNIT CODE 3: Cluster Title([Audience, ]Year)
    //
    // Examples:
    //  HLTEN511B: Provide nursing care for clients requiring palliative care (2016)
    //  AHCHBR203A: Provide daily care for horses (VETIS, 2016)
    //  SITXMPR501: Obtain and manage sponsorship (Hosp, 2016)
    //  BSBWOR502A: Ensure Team Effectiveness (ID16)
    //  AHCWRK502A | AHCWRK503A: Reports & Data Cluster 1 (Wine, ID17)
    //
    // Capture groups:
    // /^(.*)\:(.*)\((.*)\)
    //    $1    $2    $3
    //  $1 - Code(s)
    //  $2 - Descriptive title
    //  $3 - Audience (if defined) & Year

    var re = /^(.*)\:(.*)\((.*)\)/gi;
    var TitleArray = re.exec(description);


    // Only parses title if it matches the naming convention; ie it matches the pattern defined by the regex
    // This is to avoid unnecessary processing of descriptions that do not match the naming convention
    if (TitleArray) {

        // Extract codes_array
        codes_array = TitleArray[1].split("|").sort();
        // Trim whitespace
        codes_array = $.map(codes_array, function(value) {
            return value.trim();
        });

        console.log("@GB: codes_array = ", codes_array);


        // Extract descriptive title
        title_text = TitleArray[2].trim();

        // Update banner heading, to match descriptive title
        $('#page-mast>h1>a').text(title_text);

        // Extract year and audience
        details_array = TitleArray[3].split(",");
        details_array = $.map(details_array, function(value) {
            return value.trim();
        });

        // Separate out year from audience
        if (details_array.length === 1) {
            year_text = details_array[0];
        } else {
            // If there is an audience, add it to the banner
            audience_str = details_array.slice(0, details_array.length - 1).join(", ");

            // Get the friendly name for this audience
            if (audience_str.indexOf('-') !== -1) {
                audience_name = "";
                audience_arr = audience_str.split("-");
                audience_newarr = [];
                $.each(audience_arr, function(index, val) {
                    var friendly = friendlyname(val);
                    audience_newarr.push(friendly);
                    // audience_name = audience_name + friendly + ", ";
                });
                audience_name = audience_newarr.join(", ");
            } else {
                audience_name = friendlyname(audience_str);
            }

            console.log("@GB: audience_name = ", audience_name);
            audience_text = "<div id =\"gotafe-banner-audience\"><span class=\"muted\">Audience: <\/span>" + audience_name + "<\/div>";
            $('#page-mast>h1').after(audience_text);

            // Add 'Audience' class to body.
            var audience_class = "gotafe-audience-" + slugify(audience_str);
            $('body').addClass(audience_class);
            year_text = details_array[details_array.length - 1];
        }

                // For each code, add class to body.
        // This will allow for more granular sub-branding, once banner images have been developed
        $.each(codes_array, function(index, val) {
            var code_class = "gotafe-code-" + slugify(val);
            $('body').addClass(code_class);
        });

        // If there is more than one code
        if (codes_array.length === 1) {
            // Single Unit of Comptency
            code_text = "<div id =\"gotafe-banner-codes\"><span class=\"muted\">Unit Code: <\/span>" + codes_array + "<\/div>";

        } else {
            // Cluster of 2 or more units
            // concatenate with ", ".  Use " & " before the last code
            code_text = "<div id =\"gotafe-banner-codes\"><span class=\"muted\">Unit Codes: <\/span>" + codes_array.slice(0, codes_array.length - 1).join(", ") + " & " + codes_array[codes_array.length - 1] + "<\/div>";
        }
        // Append below banner heading
        $('#page-mast>h1').after(code_text);

        // Update Page Headings to prepend year.  Add as a bootstrap panel
        $('#page-mast>h1').before("<div id =\"gotafe-banner-year\" class=\"panel pull-right text-center\"> <div class=\"panel-body \">" + year_text + "<\/div>");

        // Add 'Year' class to #page-header.
        var year_class = "gotafe-year-" + slugify(year_text);
        $('body').addClass(year_class);

        // Is this subject 'In Development'?
        if (year_text.substring(0, 2) === "ID") {
            // Add footer to 'Year' panel
            $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">In Development<\/div>");
            $('#gotafe-banner-year').addClass("panel-danger");
        }

        // Is this subject 'In Development'?
        if (year_text.substring(0, 2) === "LD") {
            // Add footer to 'Year' panel
            $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">Learning Development<\/div>");
            $('#gotafe-banner-year').addClass("panel-danger");
        }

        // Is this subject 'In Development'?
        if (year_text.substring(0, 2) === "SP") {
            // Add footer to 'Year' panel
            $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">Staff Sandpit<\/div>");
            $('#gotafe-banner-year').addClass("panel-danger");
        }


        // DEBUG ONLY - IF TEST BANNER
        if (year_text.substring(0, 2) === "TB") {
            // Add footer to 'Year' panel
            $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">TEST BANNER<\/div>");
            $('#gotafe-banner-year').addClass("panel-danger");
            // add test-banner to #page to allow for selective addition of custom banners
            $('#page').addClass("test-banner");
        }
    }

});




function slugify(text) {
    // https://gist.github.com/mathewbyrne/1280286
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
        .replace(/[\s_-]+/g, '-');
}

function friendlyname(text) {
    // Translate audience abbreviations into human readable alternatives
    var shortname = slugify(text);
    var longname = "";
    var audiences = {
        "ag": "Agriculture",
        "agedcare": "Aged Care",
        "allhlth": "Allied Health",
        "ansci": "Animal Sciences",
        "auto": "Automotive",
        "beauty": "Beauty",
        "build": "Building and Construction",
        "bus": "Business",
        "cab": "Cabinet Making",
        "carptry": "Carpentry",
        "childserv": "Childrens Services",
        "clm": "Conservation and Land Management",
        "comserv": "Community Services",
        "csu": "Charles Sturt University",
        "dairy": "Dairy",
        "design": "Design",
        "elec": "Electrical",
        "edsupt": "Educational Support",
        "foodpro": "Food Production",
        "gamedev": "Game Development",
        "glass": "Glass",
        "hair": "Hairdressing",
        "hort": "Horticulture",
        "hosp": "Hospitality",
        "hydropon": "Hydroponics",
        "it": "Information Technology",
        "jnry": "Joinery",
        "learndev": "Learning and Development",
        "lsu": "Learning Services Unit",
        "ncee": "NCEE",
        "nurse": "Nursing",
        "plumb": "Plumbing",
        "rec": "Outdoor Recreation",
        "sport": "Sport",
        "tourism": "Tourism",
        "trainassess": "Training and Assessment",
        "vit": "Viticulture",
        "voc": "Vocational",
        "wine": "Winemaking"
    };
    if (shortname in audiences) {
        longname = audiences[shortname];
    } else {
        longname = text;
    }
    return longname;
}