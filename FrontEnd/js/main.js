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

function main()
{
    fileBrowser.renderDirectory("Media/Projects/VoxelEdit");
    
}