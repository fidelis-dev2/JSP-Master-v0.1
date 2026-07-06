package tz.shotto.learn.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import tz.shotto.learn.dao.StudentDAO;
import java.io.IOException;

@WebServlet("/student-delete")
public class StudentDeleteServlet extends HttpServlet {
    private final StudentDAO dao = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            dao.delete(id);
            response.sendRedirect(request.getContextPath() + "/students?success=Student deleted successfully");
        } catch (Exception e) {
            throw new ServletException("Failed to delete student", e);
        }
    }
}