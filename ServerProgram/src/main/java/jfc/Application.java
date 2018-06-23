package jfc;

import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.logging.Level;
import java.util.logging.Logger;

public class Application
{
    private static String m_DropboxPublicDirectoryRoot = "";
    private static String m_DropboxPublicRootURL = "";
    private static String m_DirectoryMapOutputPath = "";

    public static void main(String[] args)
    {
        System.out.print(""
                + "====\n"
                + BuildInfo.NAME + " " + BuildInfo.VERSION
                + "\nbuild date: " + BuildInfo.Date
                + "\ngit info: " + BuildInfo.Branch + ", " + BuildInfo.Commit
                + "\nAuthor: jfcameron.github.io\n"
                + "====\n\n");

        if (loadSettings())
        {
            DirectoryMapper directoryMapper = new DirectoryMapper(
                    m_DropboxPublicDirectoryRoot,
                    m_DropboxPublicRootURL,
                    m_DirectoryMapOutputPath);

            System.out.print(""
                    + "*********\n"
                    + "Mapping is complete\n"
                    + "*********");
        }
        else
            System.out.print(""
                    + "Settings could not be loaded from Settings.json. "
                    + "Please verify json contents and rerun the program.");
    }

    private static boolean loadSettings()
    {
        JSONParser parser = new JSONParser();

        try
        {
            JSONObject jsonObject = (JSONObject) parser.parse(Resources.loadTextFile("settings.json"));

            m_DropboxPublicDirectoryRoot = jsonObject.get("PathToDropboxPublicDirectoryRoot").toString();
            m_DropboxPublicRootURL = jsonObject.get("DropboxPublicRootURL").toString();
            m_DirectoryMapOutputPath = jsonObject.get("DirectoryMapOutputPath").toString();

            if ("".equals(m_DropboxPublicDirectoryRoot)
                    || "".equals(m_DropboxPublicRootURL)
                    || "".equals(m_DirectoryMapOutputPath))
            {
                System.out.print(""
                        + "Settings.json contains uninitalized values. Please fill out settings and rerun the program\n"
                        + "m_DropboxPublicDirectoryRoot: " + m_DropboxPublicDirectoryRoot + "\n"
                        + "m_DropboxPublicRootURL: " + m_DropboxPublicRootURL + "\n"
                        + "m_DirectoryMapOutputPath: " + m_DirectoryMapOutputPath + "\n");

                return false;
            }
        }
        catch (ParseException ex)
        {
            Logger.getLogger(Application.class.getName()).log(Level.SEVERE, null, ex);
        }

        return true;
    }
}
