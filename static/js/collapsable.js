window.onload = () => {
    document.querySelectorAll('.code-collapse').forEach((element) => {
        var height = element.getAttribute('data-trunc');
        if (height) {
            // make sure height is valid
            var h = parseInt(height);

            // add wrapper
            var wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);

            // add link
            const link = document.createElement('a');
            link.href = "javascript:void(0)";
            link.textContent = "";
            const img = document.createElement('img');
            img.src = "/icons/expand.png";
            img.alt = "expand";
            img.classList.add("expand-contract");
            link.appendChild(img);
            link.addEventListener('click', click_expand);
            link.style.position = 'absolute';
            link.style.bottom = '15px';
            link.style.right = '15px';
            wrapper.appendChild(link);

            contract(link);
        }
    });
};

function click_expand(event) {    
    // expand
    var div = event.srcElement.closest('div').firstChild;
    div.style = '';

    // update link
    var link = event.srcElement.closest('a');
    link.removeEventListener('click', click_expand);
    link.addEventListener('click', click_contract);
    link.querySelector('img').src = "/icons/collapse.png";
    link.title = "Click to collapse to partial view";
}

function click_contract(event) {

    var link = event.srcElement.closest('a');
    contract(link);

    var div = link.parentElement.querySelector('.code-collapse');
    // scroll up
    div.scrollIntoView({
        behavior: 'instant',
        block: 'center'
    })
}

function contract(link) {

    // get element / trunc
    var div = link.parentElement.querySelector('.code-collapse');
    let h = parseInt(div.getAttribute('data-trunc'));

    // hide
    div.style.maskImage = `linear-gradient(to bottom, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 1) ${h-100}px, rgba(0, 0, 0, 0))`;
    div.style.webkitMaskImage = `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1) ${h-100}px, rgba(0, 0, 0, 0))`;
    div.style.maxHeight = `${h}px`;
    div.style.marginBottom = "20px";
    div.style.overflow = "hidden !important";

    // update link
    link.removeEventListener('click', click_contract);
    link.addEventListener('click', click_expand);
    link.querySelector('img').src = "/icons/expand.png"
    link.title = "Click to expand for full content";
}

function click_expand_image(event) {
    // expand
    var img = event.srcElement.closest('div').querySelector('div > picture > img');
    var max_height = img.style.maxHeight
    img.style.maxHeight = '';
    img.style.webkitMaskImage = '';
    img.style.maskImage = '';

    // update link
    var link = event.srcElement.closest('a');
    link.querySelector('img').src = "/icons/collapse.png";
    link.title = "Click to collapse to partial view";
    link.onclick = function() {
        img.style.maxHeight = max_height;
        img.style.webkitMaskImage = 'linear-gradient(rgb(0, 0, 0), rgb(0,0,0) calc(100% - 100px), rgba(0,0,0,0) calc(100% - 20px))';
        img.style.maskImage = 'linear-gradient(rgb(0, 0, 0), rgb(0,0,0) calc(100% - 100px), rgba(0,0,0,0) calc(100% - 20px))';
        link.title = "Click to expand for full content"
        link.querySelector('img').src = '/icons/expand.png'
        link.onclick = click_expand_image;
            // scroll up
        img.scrollIntoView({
            behavior: 'instant',
            block: 'center'
        })
    }
}