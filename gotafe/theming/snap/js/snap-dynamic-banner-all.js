/*
 * @Author: Greg Bird (@BirdyOz, greg.bird.oz@gmail.com)
 * @Date:   2018-06-22 15:01:21
 * @Last Modified by:   Greg Bird
 * @Last Modified time: 2018-09-07 13:22:17
 */

// If JQuery is undefined, inject Jquery

if (typeof jQuery == 'undefined') {
    document.write('<script src="https://code.jquery.com/jquery-3.3.1.min.js"></' + 'script>');
}
//
jQuery(document).ready(function($) {

    // Define global variables
    var logo, codes_array, details_array, code_text, title_text, audience_text, audience_name, year_text = "";


    // Determine if I am in Snap, Clean or Other
    if ($("body.theme-snap")[0]) {
        // I'm in snap
        BuildSnapBanner(); // Build dynamic banners
        AddSearhToMyCourses(); // Add search box to Snap's My Courses UI
    } else if ($('head link[href*="/theme/styles.php/clean/"]')[0]) {
        BuildCleanBanner(); // Build dynamic banners
    } else {
        // I'm in neither - Do nothing
        return false;
    }
});

function BuildSnapBanner() {
    console.log("@GB: BuildSnapBanner invoked (Ver 2018-09-07 11:12:14)");
    // Only invoke The BuildBarrer function if within a course
    // If I am not at the site level, I must be in a course
    if ($('.format-site').length === 0) {
        // I am in a course, so add a 'hook' to set general styles
        $('body').addClass('gotafe-in-course');

        // Extract breadcrumbs.  Create an array.
        var breadcrumbs = $(".breadcrumb-item>a");

        // Add a unique class to the body tag, for each element of the breadcrumbs
        AddBreadcrumbClasses(breadcrumbs);

        // Extract cthe ccourse title
        var description = $('#page-mast>h1>a').text();

        // Break this up to Title, audience, codes and year
        BannerTitle (description);


    }
}

function BuildCleanBanner() {
    console.log("@GB: BuildCleanBanner Invoked");

}

function AddBreadcrumbClasses(breadcrumbs) {
        // Loop through the breadcrumbs, looking for sub-branding
        $(breadcrumbs).each(function() {
            var breadcrumb = $(this).text();
            // Convert breadcrumb into "slug", then add class to body
            var breadcrumb_class = "gotafe-breadcrumb-" + slugify(breadcrumb);
            console.log("@GB: breadcrumb_class = ", breadcrumb_class);
            $('body').addClass(breadcrumb_class);
        });
}

function BannerTitle (description) {

        // This regex pattern matches the GOTAFE 2019 course naming convention
        //  UNIT CODE: Unit Title ([Audience, ]Year)
        //      OR
        //  UNIT CODE 1 | UNIT CODE 2 | UNIT CODE 3: Cluster Title ([Audience, ]Year)
        //
        // Examples:
        //  HLTEN511B: Provide nursing care for clients requiring palliative care (2019)
        //  AHCHBR203A: Provide daily care for horses (VETIS, 2019)
        //  SITXMPR501: Obtain and manage sponsorship (Hosp, 2019)
        //  BSBWOR502A: Ensure Team Effectiveness (ID19)
        //  AHCWRK502A | AHCWRK503A: Reports & Data Cluster 1 (Wine, ID19)
        //
        // Capture groups:
        // /^(.*)\:(.*)\((.*)\)
        //    $1    $2    $3
        //  $1 - Code(s)
        //  $2 - Descriptive title
        //  $3 - Audience (if defined) & Year

        var re = /^(.*)\:(.*)\((.*)\)/gi;
        var TitleArray = re.exec(description);

        // Only parse title if it matches the naming convention; ie it matches the pattern defined by the regex
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
                        var friendly = FriendlyName(val);
                        audience_newarr.push(friendly);
                        // audience_name = audience_name + friendly + ", ";
                    });
                    audience_name = audience_newarr.join(", ");
                } else {
                    audience_name = FriendlyName(audience_str);
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
                code_text = "<div id =\"gotafe-banner-codes\"><span class=\"muted\">Code: <\/span>" + codes_array + "<\/div>";

            } else {
                // Cluster of 2 or more units
                // concatenate with ", ".  Use " & " before the last code
                code_text = "<div id =\"gotafe-banner-codes\"><span class=\"muted\">Codes: <\/span>" + codes_array.slice(0, codes_array.length - 1).join(", ") + " & " + codes_array[codes_array.length - 1] + "<\/div>";
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

            // Is this subject 'Ledarning and Development'?
            if (year_text.substring(0, 2) === "LD") {
                // Add footer to 'Year' panel
                $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">Learning Development<\/div>");
                $('#gotafe-banner-year').addClass("panel-danger");
            }

            // Is this subject 'Staff Sandpit'?
            if (year_text.substring(0, 2) === "SP") {
                // Add footer to 'Year' panel
                $('#gotafe-banner-year').prepend("<div class=\"panel-heading\">Staff Sandpit<\/div>");
                $('#gotafe-banner-year').addClass("panel-danger");
            }

        }
}
function FriendlyName(text) {
    // Translate audience abbreviations into human readable alternatives
    var shortname = slugify(text);
    var longname = "";
    var audiences = {
        "acct": "Accounting",
        "admin": "Administration",
        "ag": "Agriculture ",
        "ansci": "Animal Sciences",
        "art": "Art",
        "auto": "Automotive",
        "baking": "Baking",
        "beauty": "Beauty",
        "book": "Bookkeeping",
        "build": "Building and Construction",
        "bus": "Business",
        "cab": "Cabinet Making",
        "carptry": "Carpentry",
        "childserv": "Childcare",
        "clm": "Conservation and Land Management",
        "comcook": "Commercial Cookery",
        "comserv": "Community Services",
        "construct": "Construction",
        "csu": "Charles Sturt University",
        "dental": "Dental",
        "design": "Design",
        "dmedia": "Digital Media",
        "edsupt": "Education Support",
        "elec": "Electrotechnology",
        "eng": "Engineering",
        "evntman": "Event Management",
        "foodpro": "Food Processing",
        "gas": "Gasfitting",
        "gened": "General Education",
        "glass": "Glass",
        "hair": "Hairdressing",
        "health": "Health",
        "hort": "Horticulture",
        "hosp": "Hospitality",
        "hr": "Human Resources",
        "hydropon": "Hydroponics",
        "indsupt": "Individual Suupport",
        "it": "Information Technology",
        "jnry": "Joinery",
        "koorie": "Koorie Education",
        "learndev": "Learning and Development",
        "lsu": "LSU",
        "media": "Media",
        "mngmt": "Management",
        "multicult": "Multicultural Education",
        "ncee": "NCEE",
        "nurse": "Nursing",
        "ohs": "OHS",
        "plumb": "Plumbing",
        "projman": "Project Management",
        "rec": "Outdoor Recreation",
        "sport": "Sport",
        "teachtrain": "Teaching and Training",
        "tourism": "Tourism",
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

function AddSearhToMyCourses() {
    // Adds a search box to the top of the SNAP "My Courses" UI
    var snip = '<div class="clearfix"></div> <div class="card-block snap-mycourses-search"> <div class="card-text content"> <div class="no-overflow"> <form id="coursesearch" action="https://gotafetest34.trainingvc.com.au/course/search.php" method="get"> <fieldset class="coursesearchbox invisiblefieldset"> <label for="shortsearchbox">Search all courses </label> <input name="search" id="shortsearchbox" type="text" value=""> <input type="submit" value="Go"> </fieldset> </form> </div> <div class="footer"></div> </div>';
    $('#snap-pm-courses-current').prepend(snip);
    $('#snap-pm-courses-current').not(':has(#snap-pm-courses-current-cards)').addClass('gotafe-no-courses');
}