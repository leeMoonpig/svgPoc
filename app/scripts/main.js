
/* EditableTextArea Constructor STARTs */
var EditableTextArea = function (textArea) {
    this.element = textArea;
    this.fitType = 'multiline';
    this.sizing = textArea.getBoundingClientRect();
    this.input = this.buildInput();
};

function toArray(nonArray) {
    return Array.prototype.slice.call((nonArray || []));
}

function findLastOrMakeNewTSpan(textArea) {
    var targetTSpan = textArea.lastChild;

    if (!targetTSpan || targetTSpan.nodeName.toLowerCase() !== 'tspan') {
        targetTSpan = toArray(textArea.getElementsByTagName('tspan')).pop();
    }

    if (!targetTSpan) {
        targetTSpan = newTSpan();
        textArea.appendChild(targetTSpan);
    }

    return targetTSpan;
}

function newTSpan(attributesObj) {
    var tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

    Object.keys(attributesObj || {}).forEach(function (keyName) {
        tSpan.setAttributeNS(null, keyName, attributesObj[keyName]);
    });

    return tSpan;
}

EditableTextArea.prototype.buildInput = function buildInput() {
    var textArea = document.createElement('textarea');
    textArea.value = this.element.textContent.replace(/  +/g, ' ');

    if (this.fitType === 'multiline') {
        /* TODO: consider debounce strategy */
        textArea.addEventListener('keyup', this.updateMultineText.bind(this));
    } else {
        /* TODO: singline line, resizing policy */
    }
    // dumb positioning just for POC
    document.body.appendChild(textArea);
};

function appendWord(textArea, maxWidth, word, index) {
    var targetTSpan = findLastOrMakeNewTSpan(textArea);
    var newLineTSpan;
    var originalContent;
    var newLine = /\r|\n/.exec(word);
    var formattedWord = word.replace(/\s/g, '\u00A0');

    originalContent = targetTSpan.textContent;

    targetTSpan.textContent += formattedWord;

    if (newLine || targetTSpan.getBoundingClientRect().width > maxWidth) {
        targetTSpan.textContent = originalContent;
        newLineTSpan = newTSpan({
            'x': 0,
            'dy': '1em'
        });
        newLineTSpan.textContent = (!newLine ? formattedWord : '');
        textArea.appendChild(newLineTSpan);
    }

}

EditableTextArea.prototype.updateMultineText = function updateMultineText(event) {
    /* TODO: honour multiple consec line breaks */
    /* TODO: make a maximum number of new lines restriction */
    /* TODO: what about breaking single, really long words? */
    var editableTextAreaInstance = this;
    var textToApply = event.target.value;
    var textToApplyArray = textToApply.split(/( |\r|\n)/);
    var tSpan = newTSpan();
    var textNode = document.createTextNode(textToApplyArray[0]);

    toArray(this.element.childNodes).forEach(function (childNode) {
        editableTextAreaInstance.element.removeChild(childNode);
    });

    textToApplyArray.forEach(appendWord.bind(undefined, this.element, this.sizing.width));

};
/* EditableTextArea Constructor ENDs */

var svgTest = {
    editable: {
        textAreas: [],
        images: []
    },
    svgContainer: document.getElementById('svgContainer'),
    svg: null,
    selectedElement: null,
    svgNS: 'http://www.w3.org/2000/svg',

    getSvgTemplate: function getSvgTemplate() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET','test-svg.svg',false);
        xhr.overrideMimeType('image/svg+xml');
        xhr.send('');

        return xhr.responseXML.documentElement;
    },
    loadTemplate: function loadTemplate() {
        var template = this.getSvgTemplate();
        this.svgContainer.appendChild(template);
        this.svg = document.getElementsByTagName('svg')[0];
    },
    listTemplateImages: function listTemplateImages(imagesContainer) {
        var images = imagesContainer.getElementsByTagName('image');

        console.log(images);
    },
    listTemplateTextElements: function listTemplateTextElements(textElementContainer) {
        var textElements = textElementContainer.getElementsByTagName('text');

        console.log(textElements);
    },
    getTemplateImages: function getTemplateImages() {
        this.listTemplateImages(this.svg);
    },
    getEditableImages: function getEditableImages() {
        var editableImages = document.getElementById('Editable_Images');
        this.listTemplateImages(editableImages);
    },
    getTemplateTextElements: function getTemplateTextElements() {
        this.listTemplateTextElements(this.svg);
    },
    getEditableTextElements: function getEditableTextElements() {
        var editableTextElements = document.getElementById('Editable_Text');

        this.listTemplateTextElements(editableTextElements);
    },
    removeSvgElement: function removeSvgElement(element) {
        element.parentNode.removeChild(element);
    },
    modifyElement: function modifyElement(element) {
        var textClick = this.replaceTextElementText.bind(this);
        this.selectedElement = element;

        if(element.srcElement.tagName === 'text') {
            // document.getElementsByClassName('js-text-controls')[0].classList.remove('hidden');
            // document.getElementsByClassName('js-text-edit-input')[0].value = element.srcElement.textContent;
            // document.getElementsByClassName('js-text-edit-button')[0].addEventListener('click', textClick, false);
        } else if(element.srcElement.tagName === 'image') {
            console.log(element.srcElement.href);
            element.target.classList.add('selected');
        } else {
            var rect = document.createElementNS(this.svgNS,'rect');
            rect.setAttributeNS(null, 'x', element.clientX );
            rect.setAttributeNS(null, 'y', element.clientY );
            rect.setAttributeNS(null, 'class', 'test-shape' );
            rect.setAttributeNS(null, 'height', '100' );
            rect.setAttributeNS(null, 'width', '100' );
            this.svg.append(rect);
            console.log(element.target);
        }
    },
    replaceTextElementText: function replaceTextElementText() {
        this.selectedElement.srcElement.textContent = document.getElementsByClassName('js-text-edit-input')[0].value;
        document.getElementsByClassName('js-text-controls')[0].classList.add('hidden');
    },
    buildEditables: function buildEditables () {
        var textAreas = Array.prototype.slice.call(this.svgContainer.getElementsByTagName('text'));
        textAreas.forEach(function (textArea) {
            svgTest.editable.textAreas.push(new EditableTextArea(textArea));
        });
    },
    init: function init() {
        svgTest.loadTemplate();
        svgTest.buildEditables();
        this.svgContainer.addEventListener('click', this.modifyElement.bind(this), false);
    }
};

svgTest.init();
