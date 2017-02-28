--
Description:
--
This project generates a small website that allows vistors to browse the contents of your public dropbox, stream content (such as audio and video) and download files.
This is accomplished with two separate subprojects: a Java application and a separate Javascript application.

The Java application creates a JSON representation of your Dropbox's public directory (and sub dirs). This JSON data is then provided to the Javascript application, which uses it to render the directories of your dropbox and resolve download links to your files.

The project is meant to work alongside the Dropbox app Updog which allows Dropbox users to host static webpages from their dropbox app/ directory.

--
Usage:
--
JavaApp Usage:
run the app once to generate Settings.json @ .
Plug in the Settings data (url, output, dropbox public location).
Run again to produce the JSON data.

optional parameter: noGUI will run the application without generating a GUI and will autoterminate the program on completion.

FrontEnd Usage:
js/settings.js plug in settings values.