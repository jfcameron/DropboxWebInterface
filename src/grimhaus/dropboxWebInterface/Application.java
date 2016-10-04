//package
package grimhaus.dropboxWebInterface;

//implementation dependencies
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;

//app object
public class Application 
{
    private IndexManager m_IndexManager;
    
    //program entry point
    public static void main(String[] args) throws FileNotFoundException 
    {
        try (PrintStream out = new PrintStream(new FileOutputStream("filename.txt"))) 
        {
            out.print("hello");
        
        }    
        
    }
    
}
