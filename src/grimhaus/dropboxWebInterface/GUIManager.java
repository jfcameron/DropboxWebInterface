package grimhaus.dropboxWebInterface;

//implementation dependencies
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.border.EmptyBorder;

public class GUIManager 
{
    //
    // Constants
    //
    private static final String    c_WindowName = "Dropbox Web interface GUI";
    private static final Dimension c_WindowSize = new Dimension(800,500);
    private static final Font      font = new Font
    (
        Font.MONOSPACED, 
        Font.PLAIN,
        18
        
    );
    
    //
    // Data member
    //
    private JTextArea editArea;
    
    //Constructor
    GUIManager()
    {
        //Create contents for window
        JLabel emptyLabel = new JLabel("asdfasdfasdf");
        emptyLabel.setPreferredSize(c_WindowSize);
          
        
        // the GUI as seen by the user (without frame)
        JPanel gui = new JPanel(new BorderLayout());
        gui.setBorder(new EmptyBorder(2,3,2,3));

        // adjust numbers for a bigger default area
        editArea = new JTextArea(4,4);
        editArea.setEditable(false);
        editArea.setLineWrap(true);
        editArea.setWrapStyleWord(true);
        // adjust the font to a monospaced font.
        
        
        editArea.setFont(font);
        
        gui.add
        (
            new JScrollPane
            (
                editArea,
                JScrollPane.VERTICAL_SCROLLBAR_ALWAYS,
                JScrollPane.HORIZONTAL_SCROLLBAR_NEVER
            )
        
        );
                
        
        //Request device screensize
        Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
        
        //Create and set up the window.
        JFrame frame = new JFrame(c_WindowName);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
        //frame.getContentPane().add(emptyLabel, BorderLayout.CENTER);
        frame.add(gui);
        frame.setLocation
        (
            (dim.width /2-frame.getSize().width /2) - (c_WindowSize.width /2), 
            (dim.height/2-frame.getSize().height/2) - (c_WindowSize.height/2)
        
        );        
        
        //Display the window.
        frame.setSize(c_WindowSize); //frame.pack();
        frame.setVisible(true);
    }
    
    public void log(String aString)
    {
        editArea.append(aString + "\n");
        
        
    }
    
}
