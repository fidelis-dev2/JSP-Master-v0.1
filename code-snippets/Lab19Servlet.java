// Lab 19: Jakarta JSP/Servlet practice
// Goal: Badilisha path, ongeza validation, na u-run kwenye Tomcat 10.1.

package tz.shotto.practice.lab19;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/lab-19")
public class Lab19Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("title", "Lab 19");
        request.setAttribute("message", "Hii ni practice ya somo 19. Andika version yako mwenyewe.");
        request.getRequestDispatcher("/WEB-INF/views/lab.jsp").forward(request, response);
    }
}
