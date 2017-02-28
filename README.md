#Dropbox Web Interface
![alt tag](http://jfcameron.github.io/Images/WebInterface_DirectoryExplorer/Big.png "")

##Description:
This project generates a small website that allows vistors to browse the contents of your public dropbox, stream content (such as audio and video) and download files.
This is accomplished with two separate subprojects: a Java application and a Javascript application.

The Java application creates a JSON representation of your Dropbox's public directory (and sub dirs). This JSON data is then provided to the Javascript application, which uses it to render the directories of your dropbox and resolve download links to your files.

The project is meant to work alongside the Dropbox app [Updog](https://updog.co/) which allows Dropbox users to host static webpages from their dropbox app/ directory.

##Setup:
Extract example.7z to the root of your dropbox 

OR:

1. Place the javascript app on a webserver. I suggest using the Updog app for Dropbox.
2. Place the java app somewhere in your filesystem, I suggest somewhere in your dropbox directory.
3. run the jar once to generate Settings.json file.
4. Fill out the data needed in Settings.json (url, output, dropbox public location).
5. Run the jar again.

*optional parameter: noGUI will run the application without generating a GUI and will autoterminate the program on completion.

###Example Settings.json:
```c++
{
    "PathToDropboxPublicDirectoryRoot":"..\\..\\..\\Dropbox\\Public\\",
    "DropboxPublicRootURL":"https://dl.dropboxusercontent.com/u/xxxxxxxxx/",
    "DirectoryMapOutputPath":"..\\..\\..\\Dropbox\\Apps\\updog\\jfcameron\\PublicInterfaceTEST\\"
    
}
```

##Libraries used:
* [json-simple](https://github.com/fangyidong/json-simple)
* [Pure.css](https://purecss.io/)
* [VideoJS](http://videojs.com/)