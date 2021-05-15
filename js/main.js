let element = '';
let blog = "";
const views = [
    'formcontact',
    'inicio',
    'medicinadeportivaadultos',
    'medicinadeportivaninos',
    'nosotros',
    'servicios'
];
const tagsWithText = {
    tags: ['p', 'b', 'small', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']
};
const tagsWithTextInAttribute = {
    tags: ['a', 'button'],
    attrName: 'completeText'
};

$(document).ready(function() {

    $(document).on('click', '.nav-link', handlerClickNavItem);
    $(document).on('click', '#aceptConsent', handleClickAceptConsent);
    $(document).on('click', '#btnSearch', handleClickBtnSearch);
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

    if (options.section.toLowerCase() === 'servicios') {
        $('#element9').show();
    } else {
        $('#element9').hide();
    }

    if (options.section.toLowerCase() === 'blog') {
        contentSpace.html('');
        contentHome.html("");
        contentSpace.addClass("mt-4");

        for (let content of blog.content) {
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
                if (options.element !== undefined) {
                    if (options.element.attr('phraseToMark')) {
                        const phrase = options.element.attr('phraseToMark').toLowerCase();

                        data = markdownFilterInView({
                            pageText: data,
                            filter: phrase,
                            classMarkdown: "textFound"
                        });
                        // console.log('////////////////////', data);
                    }
                }

                $('.nav-link').removeClass('active');

                if (options.section.toLowerCase() === "inicio") {
                    contentSpace.html("");
                    contentHome.html(data);
                    $('#homePage').addClass('active');

                    loadBlogFile();
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

    for (let content of blog.content) {
        getFirstEditorText(content);
    }
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

async function handleClickBtnSearch() {
    $('#loading').show();

    const filter = $('#txtSearch').val();
    const arrFilter = filter.split(' ');
    let arrToFind = new Array();
    let arrFound = new Array();

    for (const view of views) {
        arrToFind.push({
            name: view,
            pageContent: await getContentView(view)
        });
    }

    // console.log('arrfind: ', arrToFind);

    for (const page of arrToFind) {
        for (const filter of arrFilter) {

            let found = searchInArrayText({
                textToFind: filter.toLowerCase(),
                arrayToFind: page.pageContent
            });

            if (found.length > 0) {
                // console.log('te encontre en: ', page.name);

                arrFound.push({
                    pageFound: page.name,
                    coincidences: found
                });
            }
        }
    }

    renderResultToSerch(arrFound);
}

/**
 * Este metodo recorre el texto en formato HTML y extrae el texto de cada tag
 * dependiendo de los parametros que se especifiquen en las variables:
 * - tagsWithText
 * - tagsWithTextInAttribute
 * @param {*} view -> Corresponde al texto en formato HTML
 * @returns -> Devuelve un array con el texto de la vista HTML
 */
async function getContentView(view) {
    const result = await $.ajax({
        type: 'GET',
        url: `/views/${view}.html`
    });

    return extractText(result);
}

function extractText(textHTML) {
    let resultText = new Array();

    const html = $(textHTML).children();
    getTextFromTags(html, resultText);

    // console.log('resultText: ', resultText);
    return resultText;
}

function getTextFromTags(elementHTML, arrayText) {
    elementHTML.each(function(index, element) {

        let tagName = $(element).prop('tagName').toLowerCase();
        let textToAdd = '';
        if (tagsWithText.tags.includes(tagName)) {
            textToAdd = {
                element: $(element),
                text: $(element).text().trim().toLowerCase()
            }
        } else if (tagsWithTextInAttribute.tags.includes(tagName)) {
            if ($(element).attr(tagsWithTextInAttribute.attrName)) { //attribute exist
                // console.log('elemATTR: ', $(element));
                textToAdd = {
                    element: $(element),
                    text: $(element).attr(tagsWithTextInAttribute.attrName).trim().toLowerCase()
                }
            }
        }

        if (textToAdd.length !== 0) {
            arrayText.push(textToAdd);
        }

        // console.log('condition: ', $(element).children());
        if ($(element).children().length > 0) {
            let ne = $(element).children();
            getTextFromTags($(element).children(), arrayText);
        }
    });
}

function searchInArrayText(obj) {
    const founds = obj.arrayToFind.filter(t => t.text.indexOf(obj.textToFind) !== -1);
    const fmap = founds.map(x => { return { text: x.text, element: x.element, filter: obj.textToFind } });
    return fmap;
}

function renderResultToSerch(arrFound) {
    let contentSpace = $('#contentSpace');
    let contentHome = $('#contentHome');

    let html = '<h3>Resultados encontrados</h3>';
    if (arrFound.length > 0) {

        for (const found of arrFound) {
            for (const coincidence of found.coincidences) {
                html += `<a href="javascript:;" class="nav-link" 
                templatehtml="${found.pageFound}" 
                phraseToMark="${coincidence.filter}">
                    <p>${coincidence.text}</p>
                </a>`;
            }
        }

    } else {
        const filter = $('#txtSearch').val();
        html += `<P>No se encontro ningun resultado para <b>${filter}</b></P>`;
    }

    contentHome.html("");
    $('#loading').hide();
    contentSpace.html(html);
}

// param propertiees
// pageText
// filter
// classMarkdown
function markdownFilterInView(param) {
    let html = $(param.pageText);
    getTextFromTagsMarkdown(html.children(), param.filter);

    return html;
}

function getTextFromTagsMarkdown(elementHTML, filter) {
    elementHTML.each(function(index, element) {

        let tagName = $(element).prop('tagName').toLowerCase();
        // let bfound = false;

        if (tagsWithText.tags.includes(tagName)) {
            embedMarkdown($(element), filter);
        } else if (tagsWithTextInAttribute.tags.includes(tagName)) {
            if ($(element).attr(tagsWithTextInAttribute.attrName)) { //attribute exist
                embedMarkdown($(element), filter);
            }
        }

        if ($(element).children().length > 0) {
            // if (!bfound) {
            // console.log('condition ' + tagName + ': ', $(element).children().length);
            getTextFromTagsMarkdown($(element).children(), filter);
            // } else {
            // // console.log('condition ' + tagName + ': ', $(element).children().children().length);
            // getTextFromTagsMarkdown($(element).children().children(), filter);
            // }
        }
    });
}

function embedMarkdown(element, filter) {
    let text = element.text().trim().toLowerCase();
    let copyText = element.text().trim();

    const indexs = text.indexOfAll(filter);
    let content = '';
    if (indexs.length > 0) {
        for (const index of indexs) {
            let ind = index;
            if (ind !== -1) {
                let beforeTextFound = copyText.substr(0, ind);
                let textFound = copyText.substr(ind, filter.length);
                let afterTextFound = copyText.substr(ind + filter.length);
                console.log('//////////////////' + ind + '////////////////////////');
                // console.log({ indtext, bclone: copyText });
                console.log({ aafilter: filter, acopytext: copyText, bBefore: beforeTextFound, cbetween: textFound, dafter: afterTextFound });
                // console.log('encontrado', `${beforeTextFound}<span class="textFound">${textFound}</span>${afterTextFound}`);

                content = `${beforeTextFound}<span class="textFound">${textFound}</span>${afterTextFound}`;
                copyText = content;
            }
        }
        element.html(content);
    }
}

function getFirstEditorText(_blog) {
    for (let content of _blog.elements) {

        switch (content.elType) {
            case "widget":
                drawFirstEditorTextWidget(content);
                return;
        }

        if (content.elType !== "widget") {
            getFirstEditorText(content);
        }
    }
}

function drawFirstEditorTextWidget(content, parentID) {
    const parentElement = $(`#containerFragmentBlog`);

    switch (content.widgetType) {
        case "text-editor":
            $(parentElement).append(`
            <div>
                ${content.settings.editor}
                <a class="nav-link viewMore text-white bg-primary" templatehtml="Blog" style="position: absolute; bottom: 0%;
                right: 0%;">
                    Ir al blog
                </a>
            </div>`);
            return;
    }
}

String.prototype.indexOfAll = function(find) {
    let indexFound = new Array();
    let text = this;
    do {
        const index = text.lastIndexOf(find);
        if (index !== -1) {
            indexFound.push(index);
            text = text.substr(0, index);
        }
    } while (text.lastIndexOf(find) !== -1);

    return indexFound;
}