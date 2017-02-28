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
var fileBrowser = new FileBrowser();




function getQueryParameters() {
  var queryString = location.search.slice(1),
      params = {};

  queryString.replace(/([^=]*)=([^&]*)&*/g, function (_, key, value) {
    params[key] = value;
  });

  return params;
}

function main()
{
    
}

main();

//window.onload = main;