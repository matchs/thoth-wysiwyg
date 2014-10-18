var randomId = function randomId() {
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var DOC = function DOCUMENT(_config){
	this._sections = [];

	var indexOf = function indexOfSection(id) {
		for(var i = 0, l = this._sections.length; i < l; i++) {
			if(this._sections[i].getId() == id) {
				return i;
			}
		}

		return -1;
	}

	this.render = function renderDocument() {
		var element = document.createDocumentFragment();

		this._sections.map(function mapRenderDocument(section){
			element.appendChild(section.render());
		});

		return element;
	}

	this.appendSection = function addSection(section) {
		this._sections.push(section);
	}

	this.dropSection = function dropSection(id) {
		var i = indexOf(id);
		if (i >= 0) {
			this._sections.splice(i, 1);
			return true;
		}
		return false;
	}

	this.replaceSection = function replaceSection(id, section) {
		//@todo check config for inserts, renames and removal
		var i = indexOf(id);
		if(i >= 0) {
			this._sections[i] = section;	
			return section;
		} 
		return false;
	};

	this.getSection = function getSection(id) {
		return this._sections.filter(function filterGetSections(section){
			return section.getId() == id;
		})[0];
	};

	this.getSectionList = function getParagraphList() {
		return this._sections;
	};
}

var SECTION = function SECTION(_role, _class, _config) {

	if(_config.removes[_role]) {
		return false;
	}

	this._id = randomId();
	this._class = _class;
	this._role = _role;
	this._config = _config;

	this._paragraphs = [];
	
	var indexOf = function indexOfParagraph(id) {
		for(var i = 0, l = this._paragraphs.length; i < l; i++) {
			if(this._paragraphs[i].getId() == id) {
				return i;
			}
		}

		return -1;
	}

	this.render = function renderSection() {
		var element = document.createElement(this._role);
		element.class = this._class;

		this._paragraphs.map(function mapRenderSection(paragraph){
			return element.appendChild(paragraph.render());
		});

		return element;
	};

	this.empty = function empty() {
		this._paragraphs = [];
	};

	this.appendParagraph = function appendParagraph(paragraph) {
		//@todo check config for inserts, renames and removal
		this._paragraphs.push(paragraph);
	};

	this.dropParagraph = function dropParagraph(id) {
		var i = indexOf(id);
		if(i >= 0){
			this._paragraphs.splice(i, 1);
			return true;
		}

		return false;
	};

	this.replaceParagraph = function replaceParagraph(id, paragraph) {
		//@todo check config for inserts, renames and removal
		var i = indexOfParagraph(id);
		if(i >= 0){
			this._paragraphs[i] = paragraph;
			return paragraph;
		}

		return false;
	};

	this.getParagraph = function getParagraph(id) {
		return this._paragraphs.filter(function filterGetParagraphs(paragraph){
			return paragraph.getId() == id;
		})[0];
	};

	this.getParagraphList = function getParagraphList() {
		return this._paragraphs;
	};
};

var PARAGRAPH = function PARAGRAPH(_role, _class, _config) {

	if(_config.removes[_role]) {
		return false;
	}

	this._id = randomId();
	this._class = _class;
	this._role = _role;
	this._config = _config;

	this._inlines = [];

	this.render = function renderParagraph() {
		var element = document.createElement(this._role);
		element.class = this._class;

		this._inlines.map(function mapRenderParagraph(inline){
			return element.appendChild(inline.render());
		});

		return element;
	};

	this.appendInline = function appendInline(paragraph) {
		//@todo check config for inserts, renames and removal
		this._inlines.push(paragraph);
	};
};

var INLINE = function INLINE(_role, _content, _style, _class, _config) {

	if(_config.removes[_role]) {
		return false;
	}

	this._id = randomId();
	this._class = _class;
	this._role = _role;
	this._style = []

	this._content = _content;

	function applyStylings() {

	}

	this.render = function renderInline(){
		return document.createTextNode(this._content);
	}
};
