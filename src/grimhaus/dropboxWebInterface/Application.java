package grimhaus.dropboxWebInterface;

import grimhaus.dropboxWebInterface.Resource.DirectoryMapper;
import grimhaus.dropboxWebInterface.GUI.GUIManager;
import grimhaus.dropboxWebInterface.HTML.DocumentRenderer;
import grimhaus.dropboxWebInterface.HTML.TemplateVariableToHTMLContentMap;
import grimhaus.dropboxWebInterface.HTML.VariableToHTMLContentPair;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Date;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;


public class Application 
{    
    private static final String c_DropboxPublicDirectoryRoot = new String("C:\\Users\\Joe\\Dropbox\\Public");//"C:\\Users\\Joe\\Desktop\\DropboxWebInterface\\testDirectory");
    private static final String c_DropboxPublicRootURL = new String("https://dl.dropboxusercontent.com/u/102655232");
    
    
    //test objects
    private static final GUIManager       c_GUIManager       = new GUIManager();
    private static  DirectoryMapper  c_DirectoryMapper ;// = new DirectoryMapper((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager,c_DropboxPublicDirectoryRoot);
    private static  DocumentRenderer c_DocumentRenderer;// = new DocumentRenderer((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager);
    
    //program entry point
    public static void main(String[] args) 
    {
        //new Date();//(new File(getClass().getClassLoader().getResource(getClass().getCanonicalName().replace('.', '/') + ".class").toURI()).lastModified()));
        c_GUIManager.log
        (
            "DropBoxWebInterface\n"+
            "Build: "+
            buildDate.toString()+
            "\n===========================\n\n"
        
        );
        
        c_DirectoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager,c_DropboxPublicDirectoryRoot,c_DropboxPublicRootURL); 
        c_DocumentRenderer = new DocumentRenderer((grimhaus.dropboxWebInterface.GUI.Logger)c_GUIManager);
                       
    }
    
    private static final Date buildDate = getClassBuildTime();

    /**
    * Handles files, jar entries, and deployed jar entries in a zip file (EAR).
    * @return The date if it can be determined, or null if not.
    */
    private static Date getClassBuildTime() 
    {
        Date d = null;
        Class<?> currentClass = new Object() {}.getClass().getEnclosingClass();
        URL resource = currentClass.getResource(currentClass.getSimpleName() + ".class");
        if (resource != null) {
            if (resource.getProtocol().equals("file")) {
            try {
                    d = new Date(new File(resource.toURI()).lastModified());
                } catch (URISyntaxException ignored) { }
            } else if (resource.getProtocol().equals("jar")) {
                String path = resource.getPath();
                d = new Date( new File(path.substring(5, path.indexOf("!"))).lastModified() );    
            } else if (resource.getProtocol().equals("zip")) {
                String path = resource.getPath();
                File jarFileOnDisk = new File(path.substring(0, path.indexOf("!")));
                //long jfodLastModifiedLong = jarFileOnDisk.lastModified ();
                //Date jfodLasModifiedDate = new Date(jfodLastModifiedLong);
                try(JarFile jf = new JarFile (jarFileOnDisk)) {
                    ZipEntry ze = jf.getEntry (path.substring(path.indexOf("!") + 2));//Skip the ! and the /
                    long zeTimeLong = ze.getTime ();
                    Date zeTimeDate = new Date(zeTimeLong);
                    d = zeTimeDate;
                } catch (IOException|RuntimeException ignored) { }
        
            }
    
        }
    
        return d;

    }
    
}
