let element = '';
let blog = "";

$(document).ready(function() {

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '#aceptConsent', handleClickAceptConsent);
    loadBlogFile();

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
    } else if (section.toLowerCase() === 'blog') {
        contentSpace.html('');

        for (let content of blog.content) {
            builtBlogHTML(content.elements, contentSpace);
        }


        $('#carouselExampleIndicators').hide();
        $('.nav-link').removeClass('active');
        optionMenu.addClass('active');

        $('#loading').hide();
    } else {
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
                initializeTooltipServiceView();
                initializeTooltipAboutView();
            }
        });
    }
}

async function writeBlogFile() {
    const result = await $.ajax({
        type: 'GET',
        url: `/js/blog/elementor-94-2021-05-07.json`,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "json"
    });
    return result;
}

async function loadBlogFile() {
    blog = await writeBlogFile();
    console.log(blog);
}

function builtBlogHTML(_blog, container) {
    // console.log('_blog: ', _blog);
    for (let content of _blog) {
        console.log(content);
        container.append(`<h1>${content.id}</h1>`);

        // console.log('content.elements: ', content.elements);
        if (content.elements.elType !== 'widget') {
            element += builtBlogHTML(content.elements, container);
        } else {

        }
    }

}

function initializeTooltipServiceView() {
    const elements = $('[id^="element"]').find('p>a');

    for (const elem of elements) {
        const title = $(elem).attr('modalTitle');
        const body = $(elem).attr('completeText');
        const card = $(elem).parent().parent();
        const cardID = `#${$(card).attr('id')}`;

        console.log('card:', cardID);

        tippy(cardID, {
            maxWidth: 500,
            hideOnClick: true,
            delay: 100,
            allowHTML: true,
            animation: 'scale',
            content: `<h4>${title}</h4> ${body}`,
        });
    }
}

function initializeTooltipAboutView() {
    const elements = $('.offers');

    for (const elem of elements) {
        const title = $(elem).attr('modalTitle');
        const body = $(elem).attr('completeText');
        const cardID = `#${$(elem).attr('id')}`;

        console.log('card:', cardID);

        tippy(cardID, {
            maxWidth: 500,
            hideOnClick: true,
            delay: 100,
            allowHTML: true,
            animation: 'scale',
            content: `<h4>${title}</h4> ${body}`,
        });
    }
}