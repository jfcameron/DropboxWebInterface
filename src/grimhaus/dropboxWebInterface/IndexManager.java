package grimhaus.dropboxWebInterface;

//implementation dependencies
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.logging.Level;
import java.util.logging.Logger;

public class IndexManager 
{
    public void test()
    {
        try (PrintStream out = new PrintStream(new FileOutputStream("filename.txt"))) 
        {
            out.print("hello");
                        
            
        }   
        catch (FileNotFoundException ex) 
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        
        }
        
    }
    
}
