import java.io.*;
import java.net.Socket;
import java.sql.Connection;

public class JavaSocket {

    public static void main(String[] args) throws IOException {
        //String hostName = args[0];
        //int portNumber = Integer.parseInt(args[1]);

        try {
            Socket echoSocket = new Socket("127.0.0.1", 6112);
            PrintWriter out =
                    new PrintWriter(echoSocket.getOutputStream(), true);
            //BufferedReader in =
            //        new BufferedReader(
            //                new InputStreamReader(echoSocket.getInputStream()));
            //BufferedReader stdIn =
            //        new BufferedReader(
            //                new InputStreamReader(System.in));
            out.write("test");
            out.write(4);
            out.flush();
            out.close();



            Thread.sleep(1000);

            echoSocket.close();
        }catch(Exception e){

        }
    }
}
