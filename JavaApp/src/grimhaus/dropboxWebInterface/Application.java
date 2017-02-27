package grimhaus.dropboxWebInterface;

import grimhaus.dropboxWebInterface.Resource.DirectoryMapper;
import grimhaus.dropboxWebInterface.GUI.GUIManager;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Date;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import java.io.FileWriter;
import java.nio.file.Files;
import org.json.simple.parser.ParseException;


public class Application 
{        
    //Data members
    private static String m_DropboxPublicDirectoryRoot = "";
    private static String m_DropboxPublicRootURL = "";
    private static String m_DirectoryMapOutputPath = "";
    
    private static final Date buildDate = getClassBuildTime();
    
    private static boolean m_NoGUI = false;
    
    private static GUIManager guiManager;
    
    //program entry point
    public static void main(String[] args) 
    {
        checkArgs(args);
        
        if (!m_NoGUI)
            guiManager = new GUIManager();
        
        if (guiManager != null)
            guiManager.log
            (
                "DropBoxWebInterface\n"+
                "Build: "+
                buildDate.toString()+
                "\n===========================\n\n"
                    
            );
        
        if (loadSettings())
        {
            DirectoryMapper directoryMapper  = new DirectoryMapper((grimhaus.dropboxWebInterface.GUI.Logger)guiManager,m_DropboxPublicDirectoryRoot,m_DropboxPublicRootURL,m_DirectoryMapOutputPath); 
            
            if (m_NoGUI)
                System.exit(0);
            else
            {
                guiManager.log("*********\nMapping is complete\n*********");
                
            }
            
        }
        else
        {
            if (guiManager != null)
                guiManager.log("Settings could not be loaded from Settings.json. Please verify json contents and rerun the program.");
            
        }
        
        
    }
    
    private static boolean loadSettings()
    {
        File file = new File("Settings.json");
        
        if (!file.exists())
        {
            if (guiManager != null)
                guiManager.log("Settings.json did not exist. Creating the file. Please fill out Settings.json with the needed information");
            
            try 
            {
                JSONObject obj = new JSONObject();
                obj.put("PathToDropboxPublicDirectoryRoot","");
                obj.put("DropboxPublicRootURL","");
                obj.put("DirectoryMapOutputPath","");
                
                FileWriter fileWriter = new FileWriter("Settings.json");
                
                fileWriter.write(obj.toJSONString());
                fileWriter.flush();
            
            } 
            catch (IOException ex) 
            {
                if (guiManager != null)
                    guiManager.log(ex.getMessage());
            
                Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
            
            }
            
            return false;
            
        }
        else
        {
            JSONParser parser = new JSONParser();
        
            try 
            {
                JSONObject jsonObject = (JSONObject) parser.parse(new FileReader("Settings.json"));
                
                m_DropboxPublicDirectoryRoot = jsonObject.get("PathToDropboxPublicDirectoryRoot").toString();
                m_DropboxPublicRootURL = jsonObject.get("DropboxPublicRootURL").toString();
                m_DirectoryMapOutputPath = jsonObject.get("DirectoryMapOutputPath").toString();
                
                if (
                        "".equals(m_DropboxPublicDirectoryRoot) || 
                        "".equals(m_DropboxPublicRootURL) || 
                        "".equals(m_DirectoryMapOutputPath)
                   )
                {
                    if (guiManager != null)
                        guiManager.log
                        (
                            "Settings.json contains uninitalized values. Please fill out settings and rerun the program\n"+
                            "m_DropboxPublicDirectoryRoot: " + m_DropboxPublicDirectoryRoot + "\n" +
                            "m_DropboxPublicRootURL: " + m_DropboxPublicRootURL + "\n" +
                            "m_DirectoryMapOutputPath: " + m_DirectoryMapOutputPath + "\n"
                        
                        );
            
                    return false;
                    
                }
                
            }                
            catch (IOException ex) 
            {
                if (guiManager != null)
                    guiManager.log(ex.getMessage());
                
                Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
            
            }            
            catch (ParseException ex) 
            {
                if (guiManager != null)
                    guiManager.log(ex.getMessage());
                
                Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
                
            }
            
        }
        
        return true;
        
        
    }
    
    private static void checkArgs(String[] args)
    {
        for (String s: args)
        {
            if (s.contentEquals("noGUI"))
                m_NoGUI = true;
                
        }
        
    }

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
