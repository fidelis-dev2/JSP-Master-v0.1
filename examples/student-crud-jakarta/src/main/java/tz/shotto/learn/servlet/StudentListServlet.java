package tz.shotto.learn.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import tz.shotto.learn.dao.StudentDAO;
import java.io.IOException;

@WebServlet("/students")
public class StudentListServlet extends HttpServlet {
    private final StudentDAO dao = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.setAttribute("students", dao.findAll());
            request.getRequestDispatcher("/WEB-INF/views/students/list.jsp").forward(request, response);
        } catch (Exception e) {
            throw new ServletException("Failed to load students", e);
        }
    }
}