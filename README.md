# Dropbox Web Interface
![alt tag](http://jfcameron.github.io/Images/WebInterface_DirectoryExplorer/Big.png "")

## Description:
Serve your dropbox files over the web via a refreshless javascript application.
The project depends on the (free) Dropbox app [Updog](https://updog.co/) to host the js app.

## Features
* reactive design via [Pure.css](https://purecss.io/).
* audio & video streaming, 
* image viewing, 
* document viewing (pdf, txt, md) 
* optional file download links.

## Explanation
Codebase is split between two projects: the javascript web interface project and the metadata generating java application. The java application creates json data that describes the structure of your dropbox directory and files. These json files are in turn consumed by the js app to serve your files as content. The Java application must be run occasionally to keep the json data in sync, I'd suggest scheduling this.

The JS application allows users to navigate your dropbox directories via a refreshless directory browser. Image, document, audio and video files can be viewed directly in the browser or optionally downloaded.

## Setup:
Extract example.7z to the root of your dropbox 

OR:

1. Place the javascript app on a webserver. I suggest using the Updog app for Dropbox.
2. Place the java app somewhere in your filesystem, I suggest somewhere in your dropbox directory.
3. run the jar once to generate Settings.json file.
4. Fill out the data needed in Settings.json (url, output, dropbox public location).
5. Run the jar again.

*optional parameter: noGUI will run the application without generating a GUI and will autoterminate the program on completion.

### Example Settings.json:
```JSON
{
    "PathToDropboxPublicDirectoryRoot":"..\\Apps\\updog\\myname\\Public\\",
    "DropboxPublicRootURL":"https://myname.updog.co/Public/",
    "DirectoryMapOutputPath":"..\\Apps\\updog\\myname\\PublicInterface\\"
}
```

## Libraries used:
* [json-simple](https://github.com/fangyidong/json-simple) - json parser, used by the Java program
* [Pure.css](https://purecss.io/) - used to style the js directory browser
* [VideoJS](http://videojs.com/) - html5 video streaming lib
