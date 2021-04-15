$(document).ready(function() {

    $('.carousel').carousel({
        interval: 6000,
        keyboard: true,
        pause: "hover"
    });

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '.btnTop', handlerClickNavItem);

});

function handlerClickNavItem(e) {
    e.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    const section = $(this).attr('href');

    $('html, body').animate({
        scrollTop: $(`${section}`).offset().top
    }, 1000);
}