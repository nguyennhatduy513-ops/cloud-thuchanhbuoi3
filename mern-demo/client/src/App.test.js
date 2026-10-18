import React, { useState, useEffect } from 'react';
import './App.css';

// Đường dẫn Backend API (Lấy từ biến môi trường hoặc mặc định /api/students)
const API_URL = import.meta.env?.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/students` 
  : '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    major: ''
  });
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách sinh viên từ Backend (READ)
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

  // Xử lý thay đổi dữ liệu trong ô Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Thêm mới hoặc Cập nhật sinh viên (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.studentId) {
      alert('Vui lòng nhập đầy đủ Họ tên và Mã SV!');
      return;
    }

    try {
      if (editingId) {
        // Cập nhật (PUT)
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditingId(null);
      } else {
        // Thêm mới (POST)
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      // Reset Form và cập nhật lại danh sách
      setFormData({ name: '', studentId: '', email: '', major: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  // Nạp dữ liệu vào Form để chuẩn bị Sửa
  const handleEdit = (student) => {
    setEditingId(student._id || student.id);
    setFormData({
      name: student.name || '',
      studentId: student.studentId || '',
      email: student.email || '',
      major: student.major || ''
    });
  };

  // 3. Xóa sinh viên (DELETE)
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

      {/* Khung Form nhập thông tin */}
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

      {/* Bảng hiển thị danh sách sinh viên */}
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