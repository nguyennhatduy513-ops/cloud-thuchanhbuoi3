import React, { useState, useEffect } from 'react';
import './App.css';
 const API_URL = 'https://mern-backend-235879.onrender.com/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    major: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.studentId) {
      alert('Vui lòng nhập đầy đủ Họ tên và Mã SV!');
      return;
    }

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      setFormData({ name: '', studentId: '', email: '', major: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id || student.id);
    setFormData({
      name: student.name || '',
      studentId: student.studentId || '',
      email: student.email || '',
      major: student.major || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2>Quản Lý Sinh Viên (MERN Stack)</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="studentId"
          placeholder="Mã SV"
          value={formData.studentId}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="major"
          placeholder="Ngành học"
          value={formData.major}
          onChange={handleChange}
        />
        <button type="submit">
          {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', studentId: '', email: '', major: '' });
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <table className="student-table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Ngành</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((sv) => (
              <tr key={sv._id || sv.id}>
                <td>{sv.studentId}</td>
                <td>{sv.name}</td>
                <td>{sv.email}</td>
                <td>{sv.major}</td>
                <td>
                  <button onClick={() => handleEdit(sv)}>Sửa</button>
                  <button onClick={() => handleDelete(sv._id || sv.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Chưa có dữ liệu sinh viên
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;