# Static hosting media interface 
![alt tag](http://jfcameron.github.io/Images/WebInterface_DirectoryExplorer/Big.png "")

## Description:
refreshless web app that allows browsing, streaming and downloading of multimedia content hosted on a static server

## Features
* content directory browsing
* audio & video streaming, 
* image viewing, 
* document viewing (pdf, txt, md) 
* file download links.

## Explanation
The project is made of two separate programs: a Java program meant to be run as a cron job on the server, a JS program, served on a static site.
The Java program creates a JSON representation of your content directories. The JS program fetches these JSON files and uses them to retrieve the content. 

## Setup:
* Build the Java application & modify the settings.json file (it is inside the jar).
* Put content and JS app on a static hosting site (github pages, dropbox + updog.co)
* setup a job to occasionally regenerate the json files

### Example Settings.json:
```JSON
{
    "PathToDropboxPublicDirectoryRoot": "../Apps/updog/myname/Public/",
    "DirectoryMapOutputPath": "../Apps/updog/myname/PublicInterface/",
    "DropboxPublicRootURL": "https://myname.updog.co/Public/"
}
```

## Libraries used:
* [json-simple](https://github.com/fangyidong/json-simple) - json parser, used by the Java program
* [Pure.css](https://purecss.io/) - used to style the js directory browser
* [VideoJS](http://videojs.com/) - html5 video streaming lib
