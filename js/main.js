$(document).ready(function() {

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '#aceptConsent', handleClickAceptConsent);

});

function handleClickAceptConsent() {
    if ($(this).prop('checked')) {
        $('#btnSendMessage').removeAttr('disabled');
    } else {
        $('#btnSendMessage').attr('disabled', '');
    }
}

function handlerClickNavItem() {
    let contentSpace = $('#contentSpace');
    const section = $(this).attr('templatehtml');
    let optionMenu = $(this);

    if (section.toLowerCase() === 'inicio') {
        $('.nav-link').removeClass('active');
        $('#homePage').addClass('active');

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