package grimhaus.dropboxWebInterface;

//implementation dependencies
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DocumentRenderer 
{
    //
    // Data members
    //
    private final grimhaus.dropboxWebInterface.Logger m_Logger;
    
    //
    // Constructors
    //
    DocumentRenderer(grimhaus.dropboxWebInterface.Logger aGUI)
    {
        m_Logger = aGUI;
        
        
        m_Logger.log("A DocumentRenderer is constructing");
        
    }
    
    //
    // public interface
    //
    public void test()
    {
        m_Logger.log("DocumentRenderer is Creating new file...");
        
        try (PrintStream out = new PrintStream(new FileOutputStream("filename.txt"))) 
        {
            out.print("hello");
                        
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
    
    
}
