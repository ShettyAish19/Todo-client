import React, { useState, useEffect } from "react";
import axios from "axios";

const statuses = ["todo", "in-progress", "done"];
const labels = { "todo": "📌 To Do", "in-progress": "🔄 In Progress", "done": "✅ Done" };
const colors = { "todo": "#f8f9fa", "in-progress": "#fff3cd", "done": "#d4edda" };

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("https://to-do-server-tc2t.onrender.com/todos")

      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await axios.post("https://to-do-server-tc2t.onrender.com/todos", { title });
    setTodos([...todos, res.data]);
    setTitle("");
  };

  const moveTodo = async (id, newStatus) => {
    const res = await axios.patch(`https://to-do-server-tc2t.onrender.com/todos/${id}/status`, { status: newStatus });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://to-do-server-tc2t.onrender.com/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>📋 My Task Board</h1>
      <form onSubmit={addTodo} style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            background: "linear-gradient(135deg,#16a085,#1abc9c)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Add Task
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}>
        {statuses.map((status) => (
          <div key={status} style={{ flex: 1 }}>
            <h2 style={{ textAlign: "center" }}>{labels[status]}</h2>
            <div
              style={{
                background: "#ffffff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                minHeight: "300px"
              }}
            >
              {todos.filter((t) => t.status === status).map((todo) => (
                <div
                  key={todo._id}
                  style={{
                    background: colors[status],
                    margin: "10px 0",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{todo.title}</span>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {status !== "todo" && (
                      <button onClick={() => moveTodo(todo._id, "todo")} style={{ background: "#3498db", color: "#fff", border: "none", borderRadius: "5px", padding: "5px" }}>◀</button>
                    )}
                    {status !== "done" && (
                      <button onClick={() => moveTodo(todo._id, "done")} style={{ background: "#2ecc71", color: "#fff", border: "none", borderRadius: "5px", padding: "5px" }}>✔</button>
                    )}
                    {status !== "in-progress" && (
                      <button onClick={() => moveTodo(todo._id, "in-progress")} style={{ background: "#f39c12", color: "#fff", border: "none", borderRadius: "5px", padding: "5px" }}>➡</button>
                    )}
                    <button onClick={() => deleteTodo(todo._id)} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", padding: "5px" }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
