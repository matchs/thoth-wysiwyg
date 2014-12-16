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
			"name":"A"
		},
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
		"keepContent" : item.keepContent ? true : false,
		"paragraphs" : item.paragraphs ? item.paragraphs : []
	};
});

i_config['paragraphs'] = {};
config.paragraphs.map(function(item, k){
	i_config['paragraphs'][item.name] = {
		"remove" : item.remove ? true : false,
		"rename" : item.rename ? true : false,
		"keepContent" : item.keepContent ? true : false,
		"inlines" : item.inlines ? item.inlines : []
	};
});

var isParagraph = function isParagraph(node) {
	return (i_config['paragraphs'][node.nodeName] !== undefined);
};

var isSection = function isSection(node) {
	return (i_config['sections'][node.nodeName] !== undefined);
};

var isInline = function isInline(node, paragraph) {
	return (i_config['paragraphs'][paragraph]['inlines'].indexOf(node.nodeName) > -1);	
};

var build = function build(node) {
	return sectionize(node);
}

var sectionize = function sectionize(rootNode) {
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
				frag.appendChild(nodeSet[k].cloneNode(true));
				rel_i++;
			}
			nodeSet.splice(i, rel_i);
		}

		var paragraphs = paragraphize(targetNode, node);
		for (var p in paragraphs) {
			section.appendParagraph(paragraphs[p]);
		}	
		mDoc.appendSection(section);

		return mDoc;
	}, new DOC(i_config));
};

var paragraphize = function paragraphize(rootNode) {
	return [].slice.apply(rootNode.childNodes).map(function(node) {
		if(isParagraph(node)){
			var paragraph = new PARAGRAPH(node.nodeName, i_config),
				targetNode = node;
		} else {
			var paragraph = new PARAGRAPH(i_config['defaultParagraph'], i_config),
				setSize = nodeSet.length,
				targetNode = document.createDocumentFragment();

			for(var k = rel_id; setSize >= k && !isParagraph(nodeSet[k]); k++) {
				frag.appendChild(nodeSet[k].cloneNode(true));
				rel_i++;
			}
		}

		var inlines = inlinize(targetNode, paragraph._role);
		for (var i in inlines) {
			paragraph.appendInline(inlines[i]);
		}

		return paragraph;
	});
}

// INLINE ORDERING ALGORITHM
var inlinize = function inlinize(rootNode, paragraphNodeName){
	//STEPS: 00;01;02
	var targetNode = prepareInlines(rootNode, paragraphNodeName);
	var stacks = getStacks(targetNode);
	return stacks.map(function mapStacks(stack){
		return stack.reduce(function(accum, current){
			if(typeof current.appendInline == 'function'){
				current.appendInline(accum);
				return current;
			}
			return accum;
		})
	});
}

var prepareInlines = function prepareInlines(rootNode, paragraphNodeName) {
	return [].slice.apply(rootNode.childNodes).reduce(function(docFrag, node) {
		if(node.nodeName == '#text') {
			var targetNode = node;
		} else if(isInline(node, paragraphNodeName)) {
			var targetNode = document.createElement(node.nodeName);
			targetNode.appendChild(prepareInlines(node, paragraphNodeName));
		} else {
			var targetNode = document.createDocumentFragment();
			var childNodes = [].slice.apply(node.childNodes)
			for(var i in childNodes) {
				targetNode.appendChild(prepareInlines(childNodes[i], paragraphNodeName));
			}
		}

		docFrag.appendChild(targetNode.cloneNode(true));
		return docFrag;
	}, document.createDocumentFragment());
}

var build = function build(rootNode) {
	return sectionize(rootNode);
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

/*	if(_config.removes[_role]) {
		return false;
	}*/

	this._id = randomId();	
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

	/*if(_config.removes[_role]) {
		return false;
	}*/

	this._id = randomId();
	this._role = _role;
	this._config = _config;

	this._inlines = [];

	this.render = function renderParagraph() {
		var element = document.createElement(this._role);
		element.class = this._class;

		this._inlines.map(function mapRenderParagraph(inline){
			return element.appendChild(inline.render());
		});

		var frag = document.createDocumentFragment();
		frag.appendChild(element);
		return frag;
	};

	this.appendInline = function appendInline(inline) {
		//@todo check config for inserts, renames and removal
		this._inlines.push(inline);
	};
};

var INLINE = function INLINE(_node, _config) {
	this._id = randomId();
	this._weight = _config['inlines'][_node.nodeName]['priority'];
	this._role = _node.nodeName;

	if(_node.nodeName == '#text') {
		this._content = _node.textContent;
	} else {
		this._inlines = [];	
		this.appendInline = function appendInline(inline) {
			this._inlines.push(inline);
		}
	}

	this.render = function renderInline(){
		var frag = document.createDocumentFragment();
		if(this._content) {
			var targetNode = document.createTextNode(this._content);
		} else {
			var targetNode = document.createElement(this._role);
			for(var i in this._inlines) {
				targetNode.appendChild(this._inlines[i].render());
			}
		}

		frag.appendChild(targetNode);

		return frag;
	}
};


function getStacks(root) {
	root.id = "root";
    var result;

    //STEP 00 - Identify all the leave nodes
    var leaves = (function domwalker() {
	  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
	  var textNodes = [];
	  while (walker.nextNode()) {
	    textNodes.push(walker.currentNode);
	  }
	  return textNodes;
	})();
    
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
