$(document).ready(function() {

    // $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '.nav-link', handlerClickNavItem);

});

function handlerClickNavItem() {
    let contentSpace = $('#contentSpace');
    const section = $(this).attr('templatehtml');
    let optionMenu = $(this);

    if (section.toLowerCase() === 'inicio') {
        contentSpace.html('');
        $('#carouselExampleIndicators').show();
        return;
    }

    $.ajax({
        type: 'GET',
        url: `/views/${section.toLowerCase()}.html`,
        beforeSend: function() {
            $('#loading').show();
        },
        success: function(data) {
            $('#carouselExampleIndicators').hide();
            contentSpace.html(data);
            $('.nav-link').removeClass('active');
            optionMenu.addClass('active');

            $('#loading').hide();
        }
    });
}