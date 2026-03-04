import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gymcheck.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workout_plans (
    student_id TEXT,
    data TEXT,
    PRIMARY KEY (student_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS exercise_status (
    student_id TEXT,
    date TEXT,
    data TEXT,
    PRIMARY KEY (student_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS student_notes (
    student_id TEXT,
    note TEXT,
    PRIMARY KEY (student_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );

  -- Seed initial students
  INSERT OR IGNORE INTO students (id, name) VALUES ('joao', 'João');
  INSERT OR IGNORE INTO students (id, name) VALUES ('giovana', 'Giovana');
  INSERT OR IGNORE INTO students (id, name) VALUES ('giselle', 'Giselle');
  INSERT OR IGNORE INTO students (id, name) VALUES ('henrique', 'Henrique');
  INSERT OR IGNORE INTO students (id, name) VALUES ('gustavo', 'Gustavo');
  INSERT OR IGNORE INTO students (id, name) VALUES ('gabriel', 'Gabriel');
  INSERT OR IGNORE INTO students (id, name) VALUES ('isabella', 'Isabella');
  INSERT OR IGNORE INTO students (id, name) VALUES ('thaise', 'Thaise');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { id, name, initialPlan } = req.body;
    const insertStudent = db.prepare("INSERT INTO students (id, name) VALUES (?, ?)");
    const insertPlan = db.prepare("INSERT INTO workout_plans (student_id, data) VALUES (?, ?)");
    
    const transaction = db.transaction(() => {
      insertStudent.run(id, name);
      insertPlan.run(id, JSON.stringify(initialPlan));
    });
    
    transaction();
    res.json({ success: true });
  });

  app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM students WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/data/:studentId", (req, res) => {
    const { studentId } = req.params;
    const plan = db.prepare("SELECT data FROM workout_plans WHERE student_id = ?").get(studentId);
    const note = db.prepare("SELECT note FROM student_notes WHERE student_id = ?").get(studentId);
    const status = db.prepare("SELECT date, data FROM exercise_status WHERE student_id = ?").all();
    
    const statusMap = {};
    status.forEach(s => {
      statusMap[s.date] = JSON.parse(s.data);
    });

    res.json({
      plan: plan ? JSON.parse(plan.data) : null,
      note: note ? note.note : "",
      status: statusMap
    });
  });

  app.post("/api/workout-plans", (req, res) => {
    const { studentId, data } = req.body;
    db.prepare("INSERT OR REPLACE INTO workout_plans (student_id, data) VALUES (?, ?)")
      .run(studentId, JSON.stringify(data));
    res.json({ success: true });
  });

  app.post("/api/exercise-status", (req, res) => {
    const { studentId, date, data } = req.body;
    db.prepare("INSERT OR REPLACE INTO exercise_status (student_id, date, data) VALUES (?, ?)")
      .run(studentId, date, JSON.stringify(data));
    res.json({ success: true });
  });

  app.post("/api/student-notes", (req, res) => {
    const { studentId, note } = req.body;
    db.prepare("INSERT OR REPLACE INTO student_notes (student_id, note) VALUES (?, ?)")
      .run(studentId, note);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
