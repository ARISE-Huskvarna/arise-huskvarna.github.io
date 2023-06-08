
function q(elem, parent=document){ return parent.querySelector(elem); }

const dialogImageAction = q('dialog#dialog-image-action');

const numImgs = 30;

function getImgStates() {
    let imgStates = Object();
    try {
        imgStates = JSON.parse(localStorage.getItem('imgState')) || Object();
    } catch(e) {}
    return imgStates;
}

function updateImages() {

    let numPoints = 0;

    const images = [];

    const imgStates = getImgStates();

    let imgNums = Array.from(Array(numImgs + 1).keys());
    imgNums.shift();

    imgNums = imgNums.sort((a, b) => (imgStates[a] || 0) - (imgStates[b] || 0));

    imgNums.forEach(i => {
        let imageElem = q('template#template-image').content.firstElementChild.cloneNode(true);

        imageElem.dataset.i = i;
        q('h2', imageElem).textContent = `Bild ${i}`;
        q('img', imageElem).src = `/bilder/${i}.jpg`;

        switch(imgStates[i]) {
            default:
                imageElem.classList.toggle('sent', false);
                imageElem.classList.toggle('accepted', false);
                break;
                case 1:
                imageElem.classList.toggle('sent', true);
                imageElem.classList.toggle('accepted', false);
                break;
            case 2:
                imageElem.classList.toggle('sent', true);
                imageElem.classList.toggle('accepted', true);
                numPoints++;
                break;
        }

        images.push(imageElem);
    });

    q('ol#images').replaceChildren(...images);

    q('nav#navbar span#points').textContent = `${numPoints}/${numImgs}`;
}

updateImages();

function setImgState(i, newState) {
    const imgStates = getImgStates();

    imgStates[i] = newState;

    localStorage.setItem('imgState', JSON.stringify(imgStates));
}

q('ol#images').addEventListener('click', event => {
    let elem = event.target.closest('li');
    if (elem === null) return;
    const i = elem.dataset.i
    dialogImageAction.dataset.i = i;
    q('h2', dialogImageAction).textContent = `Markera bild ${i} som`;
    dialogImageAction.showModal();
});

q('form', dialogImageAction).addEventListener('submit', event => {
    const i = dialogImageAction.dataset.i;
    switch(event.submitter.id) {
        case 'btn-image-action-mark-not-sent':
            setImgState(i, 0);
            break;
            case 'btn-image-action-mark-sent':
            setImgState(i, 1);
            break;
            case 'btn-image-action-mark-accepted':
                setImgState(i, 2);
                break;
    };
    updateImages();
});

document.addEventListener('click', event => {
    if(event.target.matches('dialog')) {
        const dialogRect = event.target.getBoundingClientRect();

        if (!(event.clientY >= dialogRect.top&& event.clientY <= dialogRect.bottom &&
            event.clientX >= dialogRect.left && event.clientX <= dialogRect.right))
            event.target.close();
    }
});
