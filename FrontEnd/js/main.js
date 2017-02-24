/* 
 *  Filename: main.js
 *  Description: program entry point
 * 
*/

/*
 * name: main
 * args: none
 * desc: program entry point
 *
*/
var fileBrowser = new FileBrowser("https://dl.dropboxusercontent.com/u/102655232/");


function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

function getQueryParameters() {
  var queryString = location.search.slice(1),
      params = {};

  queryString.replace(/([^=]*)=([^&]*)&*/g, function (_, key, value) {
    params[key] = value;
  });

  return params;
}

//function setQueryParameters(params) {
//  var query = [],
//      key, value;
//
//  for(key in params) {
//    if(!params.hasOwnProperty(key)) continue;
//    value = params[key];
//    query.push(key + "=" + value);
//  }
//
//  location.search = query.join("&");
//}

function main()
{
    fileBrowser.renderDirectory($_GET("d")? $_GET("d"): "/");
    
}

main();