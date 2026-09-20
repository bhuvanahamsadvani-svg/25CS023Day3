import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropDb {
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/", "root", "1234");
        Statement stmt = conn.createStatement();
        stmt.execute("DROP DATABASE IF EXISTS cold_chain_logistics");
        stmt.execute("CREATE DATABASE cold_chain_logistics");
        System.out.println("DB recreated!");
    }
}
