// Lab 08: Jakarta JSP/Servlet practice
// Goal: Badilisha path, ongeza validation, na u-run kwenye Tomcat 10.1.

package tz.shotto.practice.lab08;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/lab-08")
public class Lab08Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("title", "Lab 08");
        request.setAttribute("message", "Hii ni practice ya somo 08. Andika version yako mwenyewe.");
        request.getRequestDispatcher("/WEB-INF/views/lab.jsp").forward(request, response);
    }
}
