// jQuery
$.getScript("http://www.cornify.com/js/cornify.js", function()
{
    const typing = [];
	const secret = 'htut';

	window.addEventListener('keyup', (e) => {
	  //console.log(e.key);
	  typing.push(e.key);
	  var typed = typing.slice(-secret.length).join('');
	  console.log(typed);

	  /* if the secret key matches */
	  if (typed == secret) {
	    console.log('yes!');
	    cornify_add();
	    typing.splice(0);
	  }
	});
});


