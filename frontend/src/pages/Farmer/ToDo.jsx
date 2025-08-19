import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FarmerNavbar from '../../components/FarmerNavbar';
import { LanguageContext } from '../../App';
import { FaCheckCircle, FaRegClock, FaPlus } from 'react-icons/fa';

const daysOfWeek = [
  "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"
];

const translations = {
  en: {
    title: "7-Day To-Do Plan",
    addTask: "Add Task",
    task: "Task",
    save: "Save",
    completed: "Completed",
    markCompleted: "Mark as Completed",
    noTasks: "No tasks for this day.",
    enterTask: "Enter your task...",
    time: "Time",
    setTime: "Set Time",
    alertTask: "Task time reached:",
  },
  ta: {
    title: "7 நாட்கள் செய்யவேண்டிய திட்டம்",
    addTask: "பணி சேர்க்கவும்",
    task: "பணி",
    save: "சேமிக்கவும்",
    completed: "முடிந்தது",
    markCompleted: "முடிந்ததாக குறிக்கவும்",
    noTasks: "இந்த நாளுக்கு பணிகள் இல்லை.",
    enterTask: "உங்கள் பணியை உள்ளிடவும்...",
    time: "நேரம்",
    setTime: "நேரத்தை அமைக்கவும்",
    alertTask: "பணியின் நேரம் வந்துவிட்டது:",
  }
};

function ToDo() {
  const { language } = useContext(LanguageContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(Array(7).fill({ text: '', time: '' }));
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const token = localStorage.getItem('agrochain-token');
    try {
      const res = await axios.get('http://localhost:5000/api/todo/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      setTasks([]);
      alert('Error fetching tasks: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowStr = now.toISOString().slice(0, 16);
      tasks.forEach((dayTasks, dayIdx) => {
        if (Array.isArray(dayTasks)) {
          dayTasks.forEach((task, idx) => {
            if (
              task.time &&
              !task.completed &&
              !task._alerted &&
              `${now.toISOString().slice(0, 10)}T${task.time}`.slice(0, 16) === nowStr
            ) {
              alert(`${translations[language].alertTask} ${task.text}`);
              setTasks(prev => {
                const updated = prev.map(arr => arr.map(t => ({ ...t })));
                updated[dayIdx][idx]._alerted = true;
                return updated;
              });
            }
          });
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [tasks, language, translations]);

  const handleAddTask = async (dayIdx) => {
    const token = localStorage.getItem('agrochain-token');
    if (!newTask[dayIdx].text.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/todo/add', {
        day: dayIdx,
        text: newTask[dayIdx].text,
        time: newTask[dayIdx].time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTask(prev => {
        const arr = [...prev];
        arr[dayIdx] = { text: '', time: '' };
        return arr;
      });
      fetchTasks();
    } catch (err) {
      alert('Error adding task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMarkCompleted = async (dayIdx, taskIdx) => {
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.put('http://localhost:5000/api/todo/complete', {
        day: dayIdx,
        taskIdx
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      alert('Error updating task: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <FarmerNavbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-3" style={{ color: '#2C5F2D' }}>{translations[language].title}</h3>
        {loading ? (
          <div className="alert alert-info">Loading...</div>
        ) : (
          <div className="row g-4">
            {daysOfWeek.map((day, dayIdx) => (
              <div className="col-md-6" key={dayIdx}>
                <div className="card border-0 shadow-lg h-100" style={{ borderRadius: 16 }}>
                  <div className="card-header border-0 fw-bold" style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 16px 0 0' }}>{day}</div>
                  <div className="card-body">
                    <ul className="list-group mb-3">
                      {(tasks[dayIdx] && tasks[dayIdx].length > 0) ? (
                        tasks[dayIdx].map((task, idx) => (
                          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center" style={{ borderRadius: 8 }}>
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                              {task.text}
                              {task.time && (
                                <span className="ms-2 badge bg-light text-dark border"><FaRegClock className="me-1" />{task.time}</span>
                              )}
                            </span>
                            {task.completed ? (
                              <span className="badge bg-success d-flex align-items-center" style={{ borderRadius: 20 }}><FaCheckCircle className="me-1" />{translations[language].completed}</span>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleMarkCompleted(dayIdx, idx)}
                                style={{ borderRadius: 20 }}
                              >
                                {translations[language].markCompleted}
                              </button>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">{translations[language].noTasks}</li>
                      )}
                    </ul>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={translations[language].enterTask}
                        value={newTask[dayIdx].text}
                        onChange={e => {
                          const arr = [...newTask];
                          arr[dayIdx] = { ...arr[dayIdx], text: e.target.value };
                          setNewTask(arr);
                        }}
                      />
                      <input
                        type="time"
                        className="form-control"
                        value={newTask[dayIdx].time}
                        onChange={e => {
                          const arr = [...newTask];
                          arr[dayIdx] = { ...arr[dayIdx], time: e.target.value };
                          setNewTask(arr);
                        }}
                        style={{ maxWidth: 140 }}
                        placeholder={translations[language].setTime}
                      />
                      <button
                        className="btn"
                        onClick={() => handleAddTask(dayIdx)}
                        disabled={!newTask[dayIdx].text.trim()}
                        style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff' }}
                      >
                        <FaPlus className="me-2" />{translations[language].addTask}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ToDo;
