package tz.shotto.learn.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import tz.shotto.learn.dao.StudentDAO;
import tz.shotto.learn.model.Student;
import java.io.IOException;

@WebServlet("/student-new")
public class StudentCreateServlet extends HttpServlet {
    private final StudentDAO dao = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/views/students/form.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String course = request.getParameter("course");
        String status = request.getParameter("status");

        if (fullName == null || fullName.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            request.setAttribute("error", "Full name and email are required.");
            request.getRequestDispatcher("/WEB-INF/views/students/form.jsp").forward(request, response);
            return;
        }

        try {
            Student s = new Student(0, fullName.trim(), email.trim(), phone, course, status);
            dao.create(s);
            response.sendRedirect(request.getContextPath() + "/students?success=Student saved successfully");
        } catch (Exception e) {
            throw new ServletException("Failed to save student", e);
        }
    }
}