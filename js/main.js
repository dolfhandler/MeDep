$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

    $('.carousel').carousel({
        interval: 6000,
        keyboard: true,
        pause: "hover"
    });

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '.btnTop', handlerClickNavItem);

});

function handlerClickNavItem(e) {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    const section = $(this).attr('href');
}