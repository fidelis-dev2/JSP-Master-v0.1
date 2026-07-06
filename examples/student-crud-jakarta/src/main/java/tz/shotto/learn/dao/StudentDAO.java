package tz.shotto.learn.dao;

import tz.shotto.learn.config.DB;
import tz.shotto.learn.model.Student;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO {

    public List<Student> findAll() throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT id, full_name, email, phone, course, status FROM students ORDER BY id DESC";
        try (Connection con = DB.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Student(
                    rs.getInt("id"),
                    rs.getString("full_name"),
                    rs.getString("email"),
                    rs.getString("phone"),
                    rs.getString("course"),
                    rs.getString("status")
                ));
            }
        }
        return list;
    }

    public Student findById(int id) throws SQLException {
        String sql = "SELECT id, full_name, email, phone, course, status FROM students WHERE id=?";
        try (Connection con = DB.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Student(rs.getInt("id"), rs.getString("full_name"), rs.getString("email"), rs.getString("phone"), rs.getString("course"), rs.getString("status"));
                }
            }
        }
        return null;
    }

    public void create(Student s) throws SQLException {
        String sql = "INSERT INTO students(full_name,email,phone,course,status) VALUES(?,?,?,?,?)";
        try (Connection con = DB.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, s.getFullName());
            ps.setString(2, s.getEmail());
            ps.setString(3, s.getPhone());
            ps.setString(4, s.getCourse());
            ps.setString(5, s.getStatus());
            ps.executeUpdate();
        }
    }

    public void update(Student s) throws SQLException {
        String sql = "UPDATE students SET full_name=?, email=?, phone=?, course=?, status=? WHERE id=?";
        try (Connection con = DB.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, s.getFullName());
            ps.setString(2, s.getEmail());
            ps.setString(3, s.getPhone());
            ps.setString(4, s.getCourse());
            ps.setString(5, s.getStatus());
            ps.setInt(6, s.getId());
            ps.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM students WHERE id=?";
        try (Connection con = DB.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        }
    }
}