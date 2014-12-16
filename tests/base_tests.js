QUnit.test( "Testing text remains correct", function( assert ) {
	//I am not in danger, Skyler. I am the danger.
  assert.ok( build(document.getElementById('doc1')).render().textContent == "I am not in danger, Skyler. I am the danger.", "Passed!" );
});

QUnit.test( "Testing HTML rendered correctly", function( assert ) {
  var rendered = build(document.getElementById('doc1')).render();
  var elem = document.createElement('div');
  elem.appendChild(rendered);
  console.log(elem.innerHTML);
  assert.ok( elem.innerHTML == "<div><p>I am not in danger, <b>Skyler</b>. <u><b>I am </b></u><i><u><b>the danger</b></u></i>.</p></div>", "Passed!" );
});