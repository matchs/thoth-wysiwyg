QUnit.test( "Testing if inlines are correctly parsed", function( assert ) {
	var inlines = inlinize(document.getElementById('root'), 'P');
	assert.ok( inlines.length == 6, "Passed!" );
	//I am not in danger, <b>Skyler</b>. <u><b>I am </b></u><i><u><b>the danger</b></u></i>.
	assert.ok( inlines[0]._content == "I am not in danger, ", "Passed!" );
	
	assert.ok( inlines[0].render().nodeName == '#document-fragment', "Passed!" );	
	
	assert.ok( inlines[1]._role == "B", "Passed!" );
	assert.ok( inlines[1]._inlines.length == 1, "Passed!" );
	assert.ok( inlines[1]._inlines[0]._content == "Skyler", "Passed!" );

	assert.ok( inlines[3]._role == "U", "Passed!" );
	assert.ok( inlines[3]._inlines.length == 1, "Passed!" );
	assert.ok( inlines[3]._inlines[0]._role == "B", "Passed!" );	
	assert.ok( inlines[3]._inlines[0]._inlines[0]._content == "I am ", "Passed!" );	
});

QUnit.test( "Testing if text style is preserved", function( assert ) {
	//I am not in danger, <b>Skyler</b>. <b><u>I am <i>the danger</i></u></b>.
	var leaves = getAllLeaveNodes(document.getElementById('root'));
	assert.ok( leaves.length == 6, "Passed!" );

	var paragraphs = paragraphize(document.getElementById('sec1'));
	var elem = document.createElement('div');
	elem.appendChild(paragraphs[0].render());
	elem.firstChild.id = 'root';

	var newLeaves = getAllLeaveNodes(elem.firstChild);
	assert.ok(leaves.length == newLeaves.length, "Passed!");

	function getStyles(node, slist) {
		return (node.parentNode.id === "root" || !node.parentNode) ? 
			slist.push(node.nodeName) && slist : getStyles(node.parentNode, slist.push(node.nodeName) && slist);
	}

	for(var i=0, l=leaves.length; i < l; i++){
		var leave1style = getStyles(leaves[i], []);
		var leave2style = getStyles(newLeaves[i], []);

		var stylesMatch = leave1style.reduce(function (accum, curr){
			return accum && (leave2style.indexOf(curr) > -1);
		}, true);

		assert.ok(stylesMatch, "Passed!");
	}
});

QUnit.test( "Testing if text order is preserved", function( assert ) {
	//I am not in danger, Skyler. I am the danger.
  	assert.ok( build(document.getElementById('doc1')).render().textContent == "I am not in danger, Skyler. I am the danger.", "Passed!" );
});

QUnit.test( "Testing if paragraphs are correctly parsed", function( assert ) {
	var paragraphs = paragraphize(document.getElementById('sec1'));
	assert.ok( paragraphs.length == 1, "Passed!" );

	assert.ok( paragraphs[0].render().nodeName == '#document-fragment', "Passed!" );
	assert.ok( paragraphs[0]._role == 'P', "Passed!" );
	assert.ok( paragraphs[0]._inlines.length == 6, "Passed!" );

	assertRendersOk(assert, paragraphs[0].render(), "<p>I am not in danger, <b>Skyler</b>. <u><b>I am </b></u><i><u><b>the danger</b></u></i>.</p>");
});

QUnit.test( "Testing if sections are correctly parsed", function( assert ) {
	var doc = sectionize(document.getElementById('doc1'));
	
	assert.ok( typeof doc == 'object', "Passed!" );
	assert.ok( doc.render().nodeName == '#document-fragment', "Passed!" );

	assert.ok( doc._sections.length == 1, "Passed!" );
	assert.ok( doc._sections[0]._role == 'DIV', "Passed!" );
	assert.ok( doc._sections[0]._paragraphs.length == 1, "Passed!" );

	assertRendersOk(assert, doc._sections[0].render(), "<div><p>I am not in danger, <b>Skyler</b>. <u><b>I am </b></u><i><u><b>the danger</b></u></i>.</p></div>");
});

QUnit.test( "Testing HTML rendered correctly", function( assert ) {
	var rendered = build(document.getElementById('doc1')).render();
	assertRendersOk(assert, rendered, "<div><p>I am not in danger, <b>Skyler</b>. <u><b>I am </b></u><i><u><b>the danger</b></u></i>.</p></div>");
});


function assertRendersOk(assert, rendered, compare) {
	var elem = document.createElement('div');
	elem.appendChild(rendered);
	assert.ok( elem.innerHTML == compare, "Passed!");
}
