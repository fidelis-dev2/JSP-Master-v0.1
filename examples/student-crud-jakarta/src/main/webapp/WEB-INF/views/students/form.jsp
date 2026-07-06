<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="tz.shotto.learn.model.Student" %>
<%@ include file="../includes/header.jsp" %>
<%
Student s = (Student) request.getAttribute("student");
boolean edit = s != null;
String action = edit ? "student-edit" : "student-new";
%>
<h2><%= edit ? "Edit Student" : "New Student" %></h2>
<% if (request.getAttribute("error") != null) { %><div class="err"><%= request.getAttribute("error") %></div><% } %>
<form method="post" action="${pageContext.request.contextPath}/<%= action %>">
<% if (edit) { %><input type="hidden" name="id" value="<%= s.getId() %>"><% } %>
<label>Full Name</label><input name="fullName" value="<%= edit ? s.getFullName() : "" %>" required>
<label>Email</label><input type="email" name="email" value="<%= edit ? s.getEmail() : "" %>" required>
<label>Phone</label><input name="phone" value="<%= edit ? s.getPhone() : "" %>">
<label>Course</label><input name="course" value="<%= edit ? s.getCourse() : "JSP & Servlets" %>" required>
<label>Status</label><select name="status"><option <%= edit && "ACTIVE".equals(s.getStatus()) ? "selected" : "" %>>ACTIVE</option><option <%= edit && "INACTIVE".equals(s.getStatus()) ? "selected" : "" %>>INACTIVE</option></select>
<button class="btn" type="submit">Save</button> <a class="btn gray" href="${pageContext.request.contextPath}/students">Back</a>
</form>
<%@ include file="../includes/footer.jsp" %>