/*
 * DocumentRenderer
 * Renders a document of a name at a path.
 * Uses a template.
 * Replaces #VarName# with HTML content
 */
package grimhaus.dropboxWebInterface.HTML;

//implementation dependencies
import grimhaus.dropboxWebInterface.Application;
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
    private static final String c_OutputDirectory          = "output/";

    //
    // Data members
    //
    private final grimhaus.dropboxWebInterface.GUI.Logger m_Logger;
    private final String m_TemplateHTMLData;    
    
    //
    // Constructors
    //
    public DocumentRenderer(grimhaus.dropboxWebInterface.GUI.Logger aLogger)
    {
        //Assigning instance data
        m_TemplateHTMLData = loadTemplateHTMLDocument();
        m_Logger           = aLogger;
        
    }
    
    //
    // public interface
    //
    public void render(String aFileName, TemplateVariableToHTMLContentMap aTemplateVariableToHTTPContentMap)
    {
        //1. check if the dir exists, create it if it doesnt
        aFileName = appendOutputDirectoryToFrontOfFileName(aFileName);
        ensurePathExists(aFileName);
        
        //2. generate document contents
        String documentHTMLData = m_TemplateHTMLData; //set output buffer to raw template
        for (Map.Entry<String, String> entry : aTemplateVariableToHTTPContentMap.entrySet()) //replace vars in template with new content
            documentHTMLData = documentHTMLData.replace(entry.getKey(), entry.getValue());
        
        //3. Render the document
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

        for(int i = 0; i < parsedFileName.length-1; i++)
        {
            String currentDirectoryName = "";
            for(int j = 0; j <= i; j++)
                currentDirectoryName += parsedFileName[j] + "/";
            
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
