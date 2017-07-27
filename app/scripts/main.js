var svgTest = {
    svgContainer: document.getElementById("svgContainer"),
    svg: null,
    selectedElement: null,
    svgNS: "http://www.w3.org/2000/svg",

    getSvgTemplate: function getSvgTemplate() {
            var xhr = new XMLHttpRequest();

            xhr.open("GET","test-svg.svg",false);
            xhr.overrideMimeType("image/svg+xml");
            xhr.send("");

            return xhr.responseXML.documentElement;
    },
    loadTemplate: function loadTemplate() {
            var template = this.getSvgTemplate();
            this.svgContainer.appendChild(template);
            this.svg = document.getElementsByTagName("svg")[0];
    },
    listTemplateImages: function listTemplateImages(imagesContainer) {
            var images = imagesContainer.getElementsByTagName("image");

            console.log(images);
    },
    listTemplateTextElements: function listTemplateTextElements(textElementContainer) {
            var textElements = textElementContainer.getElementsByTagName("text");

            console.log(textElements);
    },
    getTemplateImages: function getTemplateImages() {
            this.listTemplateImages(this.svg);
    },
    getEditableImages: function getEditableImages() {
            var editableImages = document.getElementById("Editable_Images");
            this.listTemplateImages(editableImages);
    },
    getTemplateTextElements: function getTemplateTextElements() {
            this.listTemplateTextElements(this.svg);
    },
    getEditableTextElements: function getEditableTextElements() {
            var editableTextElements = document.getElementById("Editable_Text");

            this.listTemplateTextElements(editableTextElements);
    },
    removeSvgElement: function removeSvgElement(element) {
            element.parentNode.removeChild(element);
    },
    modifyElement: function modifyElement(element) {
            var textClick = this.replaceTextElementText.bind(this);
            this.selectedElement = element;

            if(element.srcElement.tagName === "text") {
                    document.getElementsByClassName("js-text-controls")[0].classList.remove("hidden");
                    document.getElementsByClassName("js-text-edit-input")[0].value = element.srcElement.textContent;
                    document.getElementsByClassName("js-text-edit-button")[0].addEventListener("click", textClick, false);
            } else if(element.srcElement.tagName === "image") {
                    console.log(element.srcElement.href);
                    element.target.classList.add("selected");
            } else {
                    var rect = document.createElementNS(this.svgNS,"rect");
                    rect.setAttributeNS(null, "x", element.clientX );
                    rect.setAttributeNS(null, "y", element.clientY );
                    rect.setAttributeNS(null, "class", "test-shape" );
                    rect.setAttributeNS(null, "height", "100" );
                    rect.setAttributeNS(null, "width", "100" );
                    this.svg.append(rect);
                    console.log(element.target);
            }
    },
    replaceTextElementText: function replaceTextElementText() {
            this.selectedElement.srcElement.textContent = document.getElementsByClassName("js-text-edit-input")[0].value;
            document.getElementsByClassName("js-text-controls")[0].classList.add("hidden");
    },
    init: function init() {
            svgTest.loadTemplate();
            this.svgContainer.addEventListener("click", this.modifyElement.bind(this), false);
    }
};

svgTest.init();
