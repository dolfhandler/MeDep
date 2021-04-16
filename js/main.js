$(document).ready(function() {

    // $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '.nav-link', handlerClickNavItem);

});

function handlerClickNavItem() {
    let contentSpace = $('#contentSpace');
    const section = $(this).attr('templatehtml');

    if (section.toLowerCase() === 'inicio') {
        contentSpace.html('');
        $('#carouselExampleIndicators').show();
        return;
    }

    console.log('url', `http://127.0.0.1:5500/views/${section}.html`);

    $.ajax({
        type: 'GET',
        url: `/views/${section.toLowerCase()}.html`,
        beforeSend: function wait() {
            contentSpace.html(`
                <div class="fa-1x text-primary" id="loading">
                    <!--<i class="fas fa-cog fa-spin"></i>--> Cargando...
                </div>
            `);
        },
        success: function(data) {
            $('#carouselExampleIndicators').hide();
            contentSpace.html(data);
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });
}