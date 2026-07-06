<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*,tz.shotto.learn.model.Student" %>
<%@ include file="../includes/header.jsp" %>
<div class="nav"><a class="btn" href="${pageContext.request.contextPath}/student-new">Add Student</a></div>
<% if (request.getParameter("success") != null) { %><div class="msg"><%= request.getParameter("success") %></div><% } %>
<table>
<tr><th>#</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Status</th><th>Action</th></tr>
<%
List<Student> students = (List<Student>) request.getAttribute("students");
if (students != null) {
  int no = 1;
  for (Student s : students) {
%>
<tr>
<td><%= no++ %></td><td><%= s.getFullName() %></td><td><%= s.getEmail() %></td><td><%= s.getPhone() %></td><td><%= s.getCourse() %></td><td><%= s.getStatus() %></td>
<td><a class="btn gray" href="${pageContext.request.contextPath}/student-edit?id=<%= s.getId() %>">Edit</a> <a class="btn danger" onclick="return confirm('Delete student?')" href="${pageContext.request.contextPath}/student-delete?id=<%= s.getId() %>">Delete</a></td>
</tr>
<% }} %>
</table>
<%@ include file="../includes/footer.jsp" %>