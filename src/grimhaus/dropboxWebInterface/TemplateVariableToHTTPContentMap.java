package grimhaus.dropboxWebInterface;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class TemplateVariableToHTTPContentMap 
{
    private HashMap<String,String> m_HashMap;
    
    public TemplateVariableToHTTPContentMap()
    {
        m_HashMap = new HashMap<String,String>();
        
        
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
