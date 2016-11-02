$(document).ready(function () {
    $("#search").click(function () {
        $.getJSON('jQUERY_trial/data.json', function (data) {
            $.get('assets/templates/sessionTemplate.html', function(templates) {
                var template = $(templates).find("#session").html();
                var html = Mustache.to_html(template, data);
                $("#sessionArea").html(html);
            });
        });
    });

    $(".session").click(function (event) {
        var id = jQuery(this).attr("id");
        $("#" + id).find(".closable").slideToggle("slow");
    });
});