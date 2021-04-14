$(document).ready(function() {

    $('.carousel').carousel({
        interval: 6000,
        keyboard: true,
        pause: "hover"
    });

    $(document).on('click', '.nav-link', handlerClickNavItem);

});

function handlerClickNavItem() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
}