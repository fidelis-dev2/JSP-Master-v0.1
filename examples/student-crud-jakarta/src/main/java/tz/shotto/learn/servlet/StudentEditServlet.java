package tz.shotto.learn.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import tz.shotto.learn.dao.StudentDAO;
import tz.shotto.learn.model.Student;
import java.io.IOException;

@WebServlet("/student-edit")
public class StudentEditServlet extends HttpServlet {
    private final StudentDAO dao = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            request.setAttribute("student", dao.findById(id));
            request.getRequestDispatcher("/WEB-INF/views/students/form.jsp").forward(request, response);
        } catch (Exception e) {
            throw new ServletException("Failed to load student", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            Student s = new Student(
                Integer.parseInt(request.getParameter("id")),
                request.getParameter("fullName"),
                request.getParameter("email"),
                request.getParameter("phone"),
                request.getParameter("course"),
                request.getParameter("status")
            );
            dao.update(s);
            response.sendRedirect(request.getContextPath() + "/students?success=Student updated successfully");
        } catch (Exception e) {
            throw new ServletException("Failed to update student", e);
        }
    }
}