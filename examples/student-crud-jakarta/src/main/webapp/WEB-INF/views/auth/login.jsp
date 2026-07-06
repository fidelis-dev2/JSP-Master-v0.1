<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!doctype html><html><head><meta charset="UTF-8"><title>Login</title><link rel="stylesheet" href="${pageContext.request.contextPath}/style.css"></head><body><div class="wrap">
<h1>Login</h1>
<% if (request.getAttribute("error") != null) { %><div class="err"><%= request.getAttribute("error") %></div><% } %>
<form action="${pageContext.request.contextPath}/login" method="post">
<label>Username</label><input type="text" name="username" required>
<label>Password</label><input type="password" name="password" required>
<button class="btn" type="submit">Login</button>
</form>
<div class="footer">shottofidelis2@gmail.com | Dev: Fidelis Paschal Shotto | +255629628637</div></div></body></html>