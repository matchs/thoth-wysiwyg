var config = {
	"defaultSection":"section",
	"defaultParagraph":"p",
	"sections": [
		{
			"name":"SECTION",
			"paragraphs":["P"]
		},
		{
			"name":"DIV",
			"rename":"section"
		},
		{
			"name":"SPAN",
			"remove":true,
			"keepContent":false
		}
	],
	"paragraphs": [
		{
			"name":"P",
			"inlines": ["B", "I", "U"]
		},
		{
			"name":"DIV",
			"rename":"P"
		},
	],
	"inlines" : [
		{
        	"name":"B"
        },
        {
        	"name":"U"
        },
        {
        	"name":"I"
        },
        {
        	"name":"STRONG",
        	"rename":"B"
        }
    ]
};

var i_config = {};
i_config['inlines'] = {};
config.inlines.map(function(item, k){
	i_config['inlines'][item.name] = {
		"priority" : k + 1,
		"remove" : item.remove ? true : false,
		"rename" : item.rename ? true : false,
		"keepContent" : item.keepContent ? true : false
	};
});
i_config['inlines']['#text'] = {
	'priority' : 0,
	'remove': false,
	'rename': false,
	'keepContent': true
};

i_config['sections'] = {};
config.sections.map(function(item, k){
	i_config['sections'][item.name] = {
		"remove" : item.remove ? true : false,
		"rename" : item.rename ? true : false,
		"keepContent" : item.keepContent ? true : false		
	};
});

i_config['paragraphs'] = {};
config.paragraphs.map(function(item, k){
	i_config['sections'][item.name] = {
		"remove" : item.remove ? true : false,
		"rename" : item.rename ? true : false,
		"keepContent" : item.keepContent ? true : false,
		"paragraphs" : item.paragraphs ? item.paragraphs : []
	};
});

var isParagraph = function isParagraph(node) {
	return (i_config['sections'].indexOf(node.nodeName) > -1);
};

var isSection = function isSection(node) {
	return (i_config['paragraphs'].indexOf(node.nodeName) > -1);
};

var isInline = function isInline(node, paragraph) {
	return (i_config['paragraphs'][paragraphs]['inlines'].indexOf(node.nodeName) > -1);	
};

var sectionize = function sectionize(rootNode, section) {
	return [].slice.apply(rootNode.childNodes).reduce(function(mDoc, node, i, nodeSet){
		if(isSection(node)) {
			var section = new SECTION(node.nodeName, i_config);
			var targetNode = node;
		} else {
			var section = new SECTION(i_config['defaultSection'], i_config);
			var rel_i = i,
				setSize = nodeSet.length,
				targetNode = document.createDocumentFragment();

			for(var k = rel_id; setSize >= k && !isSection(nodeSet[k]); k++) {
				frag.appendChild(nodeSet[k]);
				rel_i++;
			}
			nodeSet.splice(i, rel_i);
		}

		for (var p in paragraphize(targetNode, node)) {
			section.appendParagraph(p);
		}	
		mDoc.appendSection(section);

		return mDoc;
	}, new DOCUMENT(i_config));
};

var paragraphize = function paragraphize(targetNode, rootNode) {
	return [].slice.apply(rootNode.childNodes).map(function(node) {
		if(isParagraph(node)){
			var paragraph = new PARAGRAPH(node.nodeName, i_config),
				targetNode = node;

		} else {
			var paragraph = new PARAGRAPH(i_config['defaultParagraph'], i_config),
				setSize = nodeSet.length,
				targetNode = document.createDocumentFragment();

			for(var k = rel_id; setSize >= k && !isParagraph(nodeSet[k]); k++) {
				frag.appendChild(nodeSet[k]);
				rel_i++;
			}
		}

		for (var i in inlinize(targetNode, paragraph._role)) {
			section.appendParagraph(i);
		}

		return section;
	});
}

// INLINE ORDERING ALGORITHM
var inlinize = function inlinize(rootNode, paragraphNodeName){
	//STEPS: 00;01;02
	var targetNode = prepareInlines(rootNode, paragraphNodeName);
	var stacks = getStacks(targetNode);
	console.log(stacks);
		
	//STEP 03 - JOIN IDENTICAL SIBLINGS IN STACK

}

var prepareInlines = function prepareInlines(rootNode, paragraphNodeName) {
	return [].slice.apply(rootNode.childNodes).reduce(function(mDoc, node)) {
		if(node.nodeName == '#text') {
			var targetNode = node;
		} else if(isInline(node, paragraphNodeName)) {
			var targetNode = prepareInlines(node);
		}
		
		return mDoc.appendChild(targetNode);
	}, document.createDocumentFragment());
}

var randomId = (function (){ 
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		len = possible.length;
    
    return function randomId() {
    	var text = '';
	    for( var i=0; i < 10; i++ )
	        text += possible.charAt(Math.floor(Math.random() * len));

    	return text;
	}
})();

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

var SECTION = function SECTION(_role, _config) {

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

var PARAGRAPH = function PARAGRAPH(_role, _config) {

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

var INLINE = function INLINE(_node, _config) {
	this._id = randomId();
	/*this._class = _class;
	this._role = _role;
	this._style = []*/
	this._weight = _config['inlines'][_node.nodeName]['priority'];
	this._role = _node.nodeName;
	//this._content = _content;

	function applyStylings() {

	}

	this.appendChild = function appendChild(inline) {
		
	}

	this.render = function renderInline(){

		return document.createTextNode(this._role);
	}
};


function getStacks(root) {
	root.id = "root";
    var nodes = root.querySelectorAll('*'),
        result;

    //STEP 00 - Identify all the leave nodes
    var leaves = [].slice.apply(nodes).filter(function(i) {
        return i.childNodes.length === 1 && i.firstChild.nodeType === 3;
    }).map(function(node){
        return node.firstChild;
    }); //w*h
    
    function upTop(node, stack) {
        return (node.parentNode.id === "root" || !node.parentNode) ? 
        	sortedInsert(new INLINE(node, i_config), stack) : upTop(node.parentNode, sortedInsert(new INLINE(node, i_config), stack));
    }

    function sortedInsert(element, array) {
    	if(array.length === 0)
    		array.push(element);
    	else 
			array.splice(locationOf(element, array) + 1, 0, element);

		return array;
	}

    function locationOf(element, array, start, end) {
		start = start || 0;
		end = end || array.length;
		var pivot = parseInt(start + (end - start) / 2, 10);

		if (array[pivot]._weight === element._weight) return pivot;

		if (end - start <= 1)
			return array[pivot]._weight > element ? pivot - 1 : pivot;

		if (array[pivot]._weight < element._weight) {
			return locationOf(element, array, pivot, end);
		} else {
			return locationOf(element, array, start, pivot);
		}
	}   

	//STEP 01 - Traverse each leave node in order and then track its ascendance back up to the root. 
	//STEP 02 - Order each stack accordingly to the config
    return leaves.map(function (node){
        return upTop(node, []);
    });
}
