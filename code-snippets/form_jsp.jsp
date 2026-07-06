<form action="save-student" method="post">
  <label>Full Name</label>
  <input type="text" name="fullName" required>

  <label>Email</label>
  <input type="email" name="email" required>

  <label>Course</label>
  <select name="course" required>
    <option value="JSP & Servlets">JSP & Servlets</option>
    <option value="Java JDBC">Java JDBC</option>
  </select>

  <button type="submit">Save Student</button>
</form>