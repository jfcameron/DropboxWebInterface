/*
 * DocumentRenderer
 * Renders a document of a name at a path.
 * Uses a template.
 * Replaces #VarName# with HTML content
 */
package grimhaus.dropboxWebInterface;

//implementation dependencies
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DocumentRenderer 
{
    //
    // Constants
    //
    //Template constants
    private static final String c_TemplateDirectory        = "template/";
    private static final String c_TemplateHTMLDocumentName = "template.html";
    private static final String c_TemplateCSSFileName      = "template.css";
    //Output constants
    private static final String c_OutputDirectory = "output/";

    //
    // Data members
    //
    private final grimhaus.dropboxWebInterface.Logger m_Logger;
    private final String m_TemplateHTMLData;    
    
    //
    // Constructors
    //
    DocumentRenderer(grimhaus.dropboxWebInterface.Logger aGUI)
    {
        //Assigning instance data
        m_TemplateHTMLData = loadTemplateHTMLDocument();
        m_Logger = aGUI;
        
        m_Logger.log("A DocumentRenderer is constructing");
        
    }
    
    //
    // public interface
    //
    public void render(String aFileName, TemplateVariableToHTTPContentMap aTemplateVariableToHTTPContentMap)
    {
        m_Logger.log("DocumentRenderer is Creating document " + aFileName + "...");
        
        //1. add output dir
        aFileName = appendOutputDirectoryToFrontOfFileName(aFileName);
        //2. ensure structure exists
        ensurePathExists(aFileName);
        
        //3. generate final document data
        String documentHTMLData = m_TemplateHTMLData;
        
        for (Map.Entry<String, String> entry : aTemplateVariableToHTTPContentMap.entrySet())
            documentHTMLData = documentHTMLData.replace(entry.getKey(), entry.getValue());
        
        //4. Render the document
        try (PrintStream out = new PrintStream(new FileOutputStream(aFileName))) 
        {
            out.print(documentHTMLData);
            out.close();
            
        }   
        catch (FileNotFoundException ex) 
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        
        }
        
    }
    
    //
    // Implementation
    //
    private static String appendOutputDirectoryToFrontOfFileName(String aFileName)
    {
        //Adds the output directory to the front of the name
        if (c_OutputDirectory.contains("/"))
            aFileName = c_OutputDirectory + aFileName;
        else
            aFileName = c_OutputDirectory + "/" + aFileName;
        
        return aFileName;
        
    }
    
    private void ensurePathExists(String aFileName)
    {
        String[] parsedFileName = aFileName.split("/",0);
        
        m_Logger.log(aFileName);
        
        for(int i = 0; i < parsedFileName.length-1; i++)
        {
            m_Logger.log(parsedFileName[i]);
            
            String currentDirectoryName = "";
            for(int j = 0; j <= i; j++)
                currentDirectoryName += parsedFileName[j] + "/";
            
            m_Logger.log(currentDirectoryName);
            
            File directory = new File(String.valueOf(currentDirectoryName));
        
            if (!directory.exists())
                directory.mkdir();
        
        }
        
    }
    
    private static String readFile(String path, Charset encoding) 
    throws IOException 
    {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }
    
    private static String loadTemplateHTMLDocument()
    {
        try
        {
            return readFile(c_TemplateDirectory+c_TemplateHTMLDocumentName, Charset.defaultCharset());
            
        }
        catch (IOException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
            
            
        }
        
        return "";
        
    }
    
}
