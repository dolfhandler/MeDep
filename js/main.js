let element = '';
let blog = "";

$(document).ready(function() {

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '#aceptConsent', handleClickAceptConsent);
    loadBlogFile();
    loadView({
        section: 'inicio'
    });

});



function handleClickAceptConsent() {
    if ($(this).prop('checked')) {
        $('#btnSendMessage').removeAttr('disabled');
    } else {
        $('#btnSendMessage').attr('disabled', '');
    }
}

function handlerClickNavItem() {
    const section = $(this).attr('templatehtml');
    loadView({
        section: section,
        element: $(this)
    });
}

function loadView(options) {
    let contentSpace = $('#contentSpace');
    let contentHome = $('#contentHome');

    if (options.section.toLowerCase() === 'blog') {
        contentSpace.html('');
        contentSpace.addClass("mt-4");

        for (let content of blog.content) {
            // border: 1px solid #009900;
            contentSpace.append(`<section id="${content.id}" style="padding: 5px;  width: 100%; display: flex; flex-direction: row;" ></section>`)
            builtBlogHTML(content);
        }

        $('#carouselExampleIndicators').hide();
        $('.nav-link').removeClass('active');
        options.element.addClass('active');

        $('#loading').hide();
    } else {
        $.ajax({
            type: 'GET',
            url: `/views/${options.section.toLowerCase()}.html`,
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                $('.nav-link').removeClass('active');

                if (options.section.toLowerCase() === "inicio") {
                    contentSpace.html("");
                    contentHome.html(data);
                    $('#homePage').addClass('active');
                } else {
                    contentHome.html("");
                    contentSpace.html(data);
                    options.element.addClass('active');
                }

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
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
    return result;
}

async function loadBlogFile() {
    blog = await writeBlogFile();
}

function builtBlogHTML(_blog) {
    const parentID = _blog.id;
    for (let content of _blog.elements) {

        switch (content.elType) {
            case 'column':
                drawColum(content, parentID);
                break;
            case 'section':
                drawColum(content, parentID);
                break;
            case "widget":
                drawWidget(content, parentID);
                break;
        }

        if (content.elType !== "widget") {
            builtBlogHTML(content);
        }
    }

}

function drawColum(content, parentID) {
    const parentElement = $(`#${parentID}`);

    // border: 1px solid #900;
    $(parentElement).append(`<div id="${content.id}" style="padding: 5px; width: ${content.settings._column_size}%;"></div>`);
}

async function drawWidget(content, parentID) {
    const parentElement = $(`#${parentID}`);

    switch (content.widgetType) {
        case "text-editor":
            $(parentElement).append(`<div>${content.settings.editor}</div>`);
            break;
        case "heading":
            $(parentElement).append(`<div style="
            text-align: ${content.settings.align};
            color: ${content.settings.title_color};
            font-family: ${content.settings.typography_font_family};
            font-weight: ${content.settings.typography_font_weight};
            font-size: ${content.settings.typography_font_size.size} ${content.settings.typography_font_size.unit};
            text-align: ${content.settings.align};
            ">
            <h1>${content.settings.title}</h1>
            </div>`);
            break;
        case "button":
            $(parentElement).append(`
            <div style="
                text-align: ${content.settings.align};
            ">
            <a href="#" class="btn btn-primary"
                style="
                margin-right: ${content.settings.icon_indent.size}${content.settings.icon_indent.unit};
                ">
                ${content.settings.text}
            </a>
            </div>
            `);
            break;
        case "image":
            if (content.settings.image !== undefined)
                $(parentElement).append(`<div style="text-align: center;">
            <img src="${ChangeURL(content.settings.image.url)}" alt="" 
            width="${content.settings.image_custom_dimension.width}"
            height="${content.settings.image_custom_dimension.height}">
            </div>`);
            break;
        case "image-box":
            if (content.settings.image !== undefined) {
                const url = ChangeURL(content.settings.image.url);
                $(parentElement).append(`<div style="text-align: center;">
                <img src="${url}" alt="" width="300" height="220">
                <h1>${content.settings.title_text}</h1>
                <p>${content.settings.description_text}</p>
                </div>`);
            }
            break;
        case "image-carousel":
            let innerCarousel = '';
            let flag = 0;

            for (const image of content.settings.carousel) {
                url = ChangeURL(image.url);

                // <div  style="background: url('${url}') no-repeat center center/cover;  width:100%; height:800px; margin: auto;"></div>
                innerCarousel += `
                <div class="carousel-item ${flag===0?'active':''}">
                <div class="d-block w-100">
                <div  style="background: url('${url}') no-repeat top left / 100% 100%;  width:100%; height:650px; margin: auto;"></div>
                </div>
                </div>`;

                if (flag === 0) {
                    flag = 1;
                }
            }

            $(parentElement).append(`<div style="text-align: center;">
            
            <div id="carouselBlog" class="carousel slide mb-4" data-ride="carousel">
                <div class="carousel-inner">
                    
                        ${innerCarousel}
                    
                </div>
                <a class="carousel-control-prev" href="#carouselBlog" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselBlog" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>

            </div>`);
            break;
        case "star-rating":
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += `<i class="fas fa-star fa-1x"></i>`;
            }
            $(parentElement).append(`<div style="color: #FDCC0D">${stars}</div>`);
            break;
        default:
            break;
    }
}

function ChangeURL(url) {
    const imagesBlog = "/image/blog";
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return `${imagesBlog}/${fileName}`;
}

function initializeTooltipServiceView() {
    const elements = $('[id^="element"]').find('p>a');

    for (const elem of elements) {
        const title = $(elem).attr('modalTitle');
        const body = $(elem).attr('completeText');
        const card = $(elem).parent().parent();
        const cardID = `#${$(card).attr('id')}`;

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