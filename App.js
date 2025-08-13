import React, { useState, useEffect } from 'react';
import useVoiceTaskList from './VoiceTaskList';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const { start, stop } = useVoiceTaskList((task) => {
    setTasks(prev => [...prev, { id: Date.now(), text: task, done: false }]);
  });

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="App">
      <h1>VoiceList</h1>

      <div className="input-container">
        <input
          type="text"
          value={input}
          placeholder="Add a task"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="recording-controls">
        <button className="start-btn" onClick={start}>Start Recording</button>
        <button className="stop-btn" onClick={stop}>Stop Recording</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
            {t.text}
            <div className="task-buttons">
              <button onClick={() => toggleDone(t.id)}>{t.done ? "Undone" : "Done"}</button>
              <button onClick={() => deleteTask(t.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <p><i>Try saying: "Add task: ..."</i></p>
    </div>
  );
};

export default App;
