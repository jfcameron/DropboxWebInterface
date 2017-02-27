package grimhaus.dropboxWebInterface.HTML;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import javafx.util.Pair;

public class TemplateVariableToHTMLContentMap 
{
    private HashMap<String,String> m_HashMap;
    
    public TemplateVariableToHTMLContentMap(VariableToHTMLContentPair...aPairs)
    {
        m_HashMap = new HashMap<String,String>();
        
        for(int i = 0; i < aPairs.length; i++)
            m_HashMap.put(aPairs[i].getKey(),aPairs[i].getValue());
            
    }
    
    public void put(String aTemplateVariableName, String aHTTPContent)
    {
        m_HashMap.put(aTemplateVariableName,aHTTPContent);
        
    }
    
    public Set<Map.Entry<String,String>> entrySet()
    {
        return m_HashMap.entrySet();
        
    }
    
}
