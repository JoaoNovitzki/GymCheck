/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ 

import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw, Dumbbell, Calendar, Info, LogOut, User, Settings, Plus, Trash2, Save, Eye, Users, ChevronRight, ChevronLeft, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Exercise {
  id: string;
  name: string;
  weight: string;
  sets: string;
  tips: string;
  status: 'done' | 'missed' | 'pending';
}

interface WorkoutDay {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  exercises: Exercise[];
  isRestDay?: boolean;
}

type UserRole = 'trainer' | 'student' | null;

interface Student {
  id: string;
  name: string;
}

const INITIAL_STUDENTS: Student[] = [
  { id: 'joao', name: 'João' },
  { id: 'giovana', name: 'Giovana' },
  { id: 'giselle', name: 'Giselle' },
  { id: 'henrique', name: 'Henrique' },
  { id: 'gustavo', name: 'Gustavo' },
  { id: 'gabriel', name: 'Gabriel' },
  { id: 'isabella', name: 'Isabella' },
];

const GABRIEL_PLAN: WorkoutDay[] = [
  {
    id: 'gab-day-1',
    title: 'Segunda-feira',
    subtitle: 'UPPER (ênfase em peito)',
    color: 'bg-red-500',
    exercises: [
      { id: 'gab1-1', name: 'Supino reto com barra', weight: '', sets: '4x6–8', tips: '', status: 'pending' },
      { id: 'gab1-2', name: 'Puxada na frente (pulldown)', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab1-3', name: 'Supino inclinado com halteres', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab1-4', name: 'Remada baixa na máquina', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab1-5', name: 'Elevação lateral', weight: '', sets: '3x12–15', tips: '', status: 'pending' },
      { id: 'gab1-6', name: 'Tríceps na polia', weight: '', sets: '3x10–15', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'gab-day-2',
    title: 'Terça-feira',
    subtitle: 'LOWER (ênfase em quadríceps)',
    color: 'bg-green-500',
    exercises: [
      { id: 'gab2-1', name: 'Agachamento livre', weight: '', sets: '4x6–8', tips: '', status: 'pending' },
      { id: 'gab2-2', name: 'Leg press', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab2-3', name: 'Cadeira extensora', weight: '', sets: '3x10–15', tips: '', status: 'pending' },
      { id: 'gab2-4', name: 'Mesa flexora', weight: '', sets: '3x10–15', tips: '', status: 'pending' },
      { id: 'gab2-5', name: 'Panturrilha em pé ou no leg', weight: '', sets: '4x12–15', tips: '', status: 'pending' },
      { id: 'gab2-6', name: 'Abdominal à escolha', weight: '', sets: '3x15–20', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'gab-rest-1',
    title: 'Quarta-feira',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'gab-day-3',
    title: 'Quinta-feira',
    subtitle: 'UPPER (ênfase em costas)',
    color: 'bg-blue-500',
    exercises: [
      { id: 'gab3-1', name: 'Puxada na frente ou barra fixa', weight: '', sets: '4x6–8', tips: '', status: 'pending' },
      { id: 'gab3-2', name: 'Supino com halteres', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab3-3', name: 'Remada curvada com barra', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab3-4', name: 'Desenvolvimento com halteres', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab3-5', name: 'Rosca direta com barra', weight: '', sets: '3x8–12', tips: '', status: 'pending' },
      { id: 'gab3-6', name: 'Tríceps francês ou corda', weight: '', sets: '3x10–15', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'gab-day-4',
    title: 'Sexta-feira',
    subtitle: 'LOWER (ênfase em posterior/glúteo)',
    color: 'bg-orange-500',
    exercises: [
      { id: 'gab4-1', name: 'Levantamento terra romeno', weight: '', sets: '4x6–8', tips: '', status: 'pending' },
      { id: 'gab4-2', name: 'Agachamento búlgaro', weight: '', sets: '3x8–12', tips: 'cada perna', status: 'pending' },
      { id: 'gab4-3', name: 'Mesa flexora', weight: '', sets: '3x10–15', tips: '', status: 'pending' },
      { id: 'gab4-4', name: 'Cadeira abdutora', weight: '', sets: '3x12–15', tips: '', status: 'pending' },
      { id: 'gab4-5', name: 'Panturrilha sentado', weight: '', sets: '4x12–15', tips: '', status: 'pending' },
      { id: 'gab4-6', name: 'Prancha', weight: '', sets: '3x 30–60s', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'gab-rest-2',
    title: 'Sábado',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'gab-rest-3',
    title: 'Domingo',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
];

const ISABELLA_PLAN: WorkoutDay[] = [
  {
    id: 'isa-day-1',
    title: 'Segunda-feira',
    subtitle: 'JUMP',
    color: 'bg-pink-500',
    exercises: [
      { id: 'isa1-1', name: 'JUMP', weight: '', sets: '1 hora', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'isa-day-2',
    title: 'Terça-feira',
    subtitle: 'Inferiores',
    color: 'bg-green-500',
    exercises: [
      { id: 'isa2-1', name: 'Agachamento Livre', weight: '', sets: '4x8-12', tips: '', status: 'pending' },
      { id: 'isa2-2', name: 'Leg press', weight: '', sets: '3x10-15', tips: '', status: 'pending' },
      { id: 'isa2-3', name: 'Mesa Flexora', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa2-4', name: 'Elevação Pelvica', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa2-5', name: 'Cadeira Abdutora', weight: '', sets: '3x15-20', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'isa-day-3',
    title: 'Quarta-feira',
    subtitle: 'Superiores e Core',
    color: 'bg-blue-500',
    exercises: [
      { id: 'isa3-1', name: 'Tríceps Corda', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa3-2', name: 'Rosca Direta', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa3-3', name: 'Elevação Lateral (Ombro)', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa3-4', name: 'Puxada Aberta', weight: '', sets: '3x10-12', tips: '', status: 'pending' },
      { id: 'isa3-5', name: 'Prancha', weight: '', sets: '3x 45segundos', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'isa-rest-1',
    title: 'Quinta-feira',
    subtitle: 'Descanso / Boxe do Amor',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'isa-day-4',
    title: 'Sexta-feira',
    subtitle: 'Posteriores e Glúteo',
    color: 'bg-orange-500',
    exercises: [
      { id: 'isa4-1', name: 'Stiff (Barra ou Halteres)', weight: '', sets: '3x10-12', tips: '', status: 'pending' },
      { id: 'isa4-2', name: 'Mesa Flexora', weight: '', sets: '3x12-15', tips: '', status: 'pending' },
      { id: 'isa4-3', name: 'Gluteo (Cabo ou Maquina)', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: 'isa4-4', name: 'Cadeira Abdutora', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: 'isa4-5', name: 'Bike Hit', weight: '', sets: '10minutos', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'isa-rest-2',
    title: 'Sábado',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'isa-rest-3',
    title: 'Domingo',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
];

const GUSTAVO_PLAN: WorkoutDay[] = [
  {
    id: 'g-day-1',
    title: 'Segunda-feira',
    subtitle: 'Treino A: Peito, Ombros e Tríceps',
    color: 'bg-red-500',
    exercises: [
      { id: 'ga-1', name: 'Supino Inclinado com Halteres', weight: '', sets: '3 x 8–10', tips: '', status: 'pending' },
      { id: 'ga-2', name: 'Supino Reto na Máquina', weight: '', sets: '3 x 10–12', tips: '', status: 'pending' },
      { id: 'ga-3', name: 'Desenvolvimento com Halteres', weight: '', sets: '3 x 8–10', tips: '', status: 'pending' },
      { id: 'ga-4', name: 'Elevação Lateral no Cabo', weight: '', sets: '4 x 12–15', tips: '', status: 'pending' },
      { id: 'ga-5', name: 'Tríceps Corda (na polia)', weight: '', sets: '3 x 12–15', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'g-rest-1',
    title: 'Terça-feira',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'g-day-2',
    title: 'Quarta-feira',
    subtitle: 'Treino B: Costas, Posterior de Ombro e Bíceps',
    color: 'bg-blue-500',
    exercises: [
      { id: 'gb-1', name: 'Puxada Alta (Puxada Frente)', weight: '', sets: '3 x 8–10', tips: '', status: 'pending' },
      { id: 'gb-2', name: 'Remada Baixa com Triângulo', weight: '', sets: '3 x 10–12', tips: '', status: 'pending' },
      { id: 'gb-3', name: 'Remada Curvada com Barra', weight: '', sets: '3 x 8–10', tips: '', status: 'pending' },
      { id: 'gb-4', name: 'Crucifixo Inverso (Halter ou Máquina)', weight: '', sets: '3 x 12–15', tips: '', status: 'pending' },
      { id: 'gb-5', name: 'Rosca Direta com Halteres', weight: '', sets: '3 x 10–12', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'g-rest-2',
    title: 'Quinta-feira',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'g-day-3',
    title: 'Sexta-feira',
    subtitle: 'Treino C: Pernas e Panturrilhas',
    color: 'bg-green-500',
    exercises: [
      { id: 'gc-1', name: 'Leg Press 45°', weight: '', sets: '3 x 10–12', tips: '', status: 'pending' },
      { id: 'gc-2', name: 'Stiff (Levantamento Terra Romeno)', weight: '', sets: '3 x 8–10', tips: '', status: 'pending' },
      { id: 'gc-3', name: 'Cadeira Extensora', weight: '', sets: '3 x 12–15', tips: '', status: 'pending' },
      { id: 'gc-4', name: 'Cadeira Flexora', weight: '', sets: '3 x 10–12', tips: '', status: 'pending' },
      { id: 'gc-5', name: 'Panturrilha em Pé', weight: '', sets: '4 x 12–15', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'g-rest-3',
    title: 'Sábado',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'g-rest-4',
    title: 'Domingo',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
];

const INITIAL_PLAN: WorkoutDay[] = [
  {
    id: 'day-1',
    title: '1º Dia',
    subtitle: 'Peito, Ombro e Tríceps (Push)',
    color: 'bg-red-500',
    exercises: [
      { id: '1-1', name: 'Voador', weight: '', sets: '3x12', tips: 'Foco na contração do peito', status: 'pending' },
      { id: '1-2', name: 'Tríceps barra', weight: '', sets: '3x10', tips: 'Cotovelos fechados', status: 'pending' },
      { id: '1-3', name: 'Elevação lateral', weight: '', sets: '4x15', tips: 'Não suba além da linha dos ombros', status: 'pending' },
      { id: '1-4', name: 'Supino declinado ou Dips', weight: '', sets: '3x10', tips: '', status: 'pending' },
      { id: '1-5', name: 'Posterior de ombro no voador', weight: '', sets: '3x12', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'day-2',
    title: '2º Dia',
    subtitle: 'Costas e Bíceps (Pull)',
    color: 'bg-blue-500',
    exercises: [
      { id: '2-1', name: 'Puxada aberta alta', weight: '', sets: '3x10', tips: 'Puxe em direção ao peito', status: 'pending' },
      { id: '2-2', name: 'Rosca direta', weight: '', sets: '3x12', tips: 'Sem balançar o corpo', status: 'pending' },
      { id: '2-3', name: 'Remada baixa fechada', weight: '', sets: '3x10', tips: 'Esmague as costas', status: 'pending' },
      { id: '2-4', name: 'Rosca martelo', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '2-5', name: 'Puxada supinada unilateral', weight: '', sets: '3x12', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'rest-1',
    title: 'Quarta-feira',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
  {
    id: 'day-3',
    title: '3º Dia',
    subtitle: 'Pernas (Legs)',
    color: 'bg-green-500',
    exercises: [
      { id: '3-1', name: 'Padrão de agachamento (livre ou máquina)', weight: '', sets: '3x10', tips: 'Mantenha o calcanhar no chão', status: 'pending' },
      { id: '3-2', name: 'Mesa flexora', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '3-3', name: 'Cadeira extensora', weight: '', sets: '3x15', tips: 'Pico de contração', status: 'pending' },
      { id: '3-4', name: 'Stiff', weight: '', sets: '3x10', tips: 'Coluna reta', status: 'pending' },
      { id: '3-5', name: 'Cadeira adutora', weight: '', sets: '3x15', tips: '', status: 'pending' },
      { id: '3-6', name: 'Panturrilha (alternando em pé e sentado)', weight: '', sets: '4x20', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'day-4',
    title: '4º Dia',
    subtitle: 'Peito, Ombro e Tríceps (Push)',
    color: 'bg-red-500',
    exercises: [
      { id: '4-1', name: 'Voador', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '4-2', name: 'Tríceps francês na polia', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '4-3', name: 'Elevação lateral', weight: '', sets: '4x15', tips: '', status: 'pending' },
      { id: '4-4', name: 'Supino reto', weight: '', sets: '3x10', tips: '', status: 'pending' },
      { id: '4-5', name: 'Elevação frontal', weight: '', sets: '3x12', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'day-5',
    title: '5º Dia',
    subtitle: 'Costas e Bíceps (Pull)',
    color: 'bg-blue-500',
    exercises: [
      { id: '5-1', name: 'Puxada aberta alta', weight: '', sets: '3x10', tips: '', status: 'pending' },
      { id: '5-2', name: 'Rosca Scott', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '5-3', name: 'Puxada fechada', weight: '', sets: '3x10', tips: '', status: 'pending' },
      { id: '5-4', name: 'Rosca martelo', weight: '', sets: '3x12', tips: '', status: 'pending' },
      { id: '5-5', name: 'Puxada supinada unilateral', weight: '', sets: '3x12', tips: '', status: 'pending' },
    ],
  },
  {
    id: 'rest-2',
    title: 'Domingo',
    subtitle: 'Descanso',
    color: 'bg-gray-400',
    exercises: [],
    isRestDay: true,
  },
];

const STORAGE_KEY = 'gymtrack_data_v3';
const HISTORY_KEY = 'gymtrack_history_v1';
const NOTES_KEY = 'gymtrack_notes_v1';
const STATUS_HISTORY_KEY = 'gymtrack_status_history_v1';
const STUDENTS_KEY = 'gymtrack_students_v1';
const AUTH_KEY = 'gymtrack_auth';
const SELECTED_STUDENT_KEY = 'gymtrack_selected_student';

export default function App() {
  const [allWorkoutPlans, setAllWorkoutPlans] = useState<Record<string, WorkoutDay[]>>({});
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, Record<string, boolean>>>({});
  const [dailyExerciseStatus, setDailyExerciseStatus] = useState<Record<string, Record<string, Record<string, 'done' | 'missed' | 'pending'>>>>({});
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [currentUser, setCurrentUser] = useState<UserRole>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedStatusHistory = localStorage.getItem(STATUS_HISTORY_KEY);
    const savedNotes = localStorage.getItem(NOTES_KEY);
    const savedStudents = localStorage.getItem(STUDENTS_KEY);
    const savedAuth = localStorage.getItem(AUTH_KEY);
    const savedSelectedStudent = localStorage.getItem(SELECTED_STUDENT_KEY);

    let loadedStudents = INITIAL_STUDENTS;
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        const studentIds = new Set(parsed.map((s: any) => s.id));
        loadedStudents = [...parsed, ...INITIAL_STUDENTS.filter(s => !studentIds.has(s.id))];
      } catch (e) {
        console.error('Error parsing students data', e);
      }
    }
    setStudents(loadedStudents);

    if (savedAuth) {
      setCurrentUser(savedAuth as UserRole);
    }

    if (savedSelectedStudent) {
      setSelectedStudentId(savedSelectedStudent);
    } else if (savedAuth === 'student') {
      // Default for student if not set
      setSelectedStudentId(loadedStudents[0]?.id || null);
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Ensure Gabriel gets his custom plan if he doesn't have one yet or has the default one
        if (parsedData.gabriel && parsedData.gabriel.length > 0 && parsedData.gabriel[0].id === 'day-1') {
          parsedData.gabriel = JSON.parse(JSON.stringify(GABRIEL_PLAN));
        } else if (!parsedData.gabriel) {
          parsedData.gabriel = JSON.parse(JSON.stringify(GABRIEL_PLAN));
        }

        // Ensure Isabella gets her custom plan if she doesn't have one yet or has the default one
        if (parsedData.isabella && parsedData.isabella.length > 0 && parsedData.isabella[0].id === 'day-1') {
          parsedData.isabella = JSON.parse(JSON.stringify(ISABELLA_PLAN));
        } else if (!parsedData.isabella) {
          parsedData.isabella = JSON.parse(JSON.stringify(ISABELLA_PLAN));
        }

        // Ensure all loaded students have a plan
        loadedStudents.forEach(s => {
          if (!parsedData[s.id]) {
            let plan = INITIAL_PLAN;
            if (s.id === 'gustavo') plan = GUSTAVO_PLAN;
            if (s.id === 'gabriel') plan = GABRIEL_PLAN;
            if (s.id === 'isabella') plan = ISABELLA_PLAN;
            parsedData[s.id] = JSON.parse(JSON.stringify(plan));
          }
        });

        setAllWorkoutPlans(parsedData);
      } catch (e) {
        console.error('Error parsing saved data', e);
        const initial: Record<string, WorkoutDay[]> = {};
        loadedStudents.forEach(s => {
          let plan = INITIAL_PLAN;
          if (s.id === 'gustavo') plan = GUSTAVO_PLAN;
          if (s.id === 'gabriel') plan = GABRIEL_PLAN;
          if (s.id === 'isabella') plan = ISABELLA_PLAN;
          initial[s.id] = JSON.parse(JSON.stringify(plan));
        });
        setAllWorkoutPlans(initial);
      }
    } else {
      const initial: Record<string, WorkoutDay[]> = {};
      loadedStudents.forEach(s => {
        let plan = INITIAL_PLAN;
        if (s.id === 'gustavo') plan = GUSTAVO_PLAN;
        if (s.id === 'gabriel') plan = GABRIEL_PLAN;
        if (s.id === 'isabella') plan = ISABELLA_PLAN;
        initial[s.id] = JSON.parse(JSON.stringify(plan));
      });
      setAllWorkoutPlans(initial);
    }

    if (savedHistory) {
      try {
        setWorkoutHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history data', e);
      }
    }

    if (savedNotes) {
      try {
        setStudentNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error parsing notes data', e);
      }
    }

    if (savedStatusHistory) {
      try {
        setDailyExerciseStatus(JSON.parse(savedStatusHistory));
      } catch (e) {
        console.error('Error parsing status history data', e);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allWorkoutPlans));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(workoutHistory));
      localStorage.setItem(NOTES_KEY, JSON.stringify(studentNotes));
      localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(dailyExerciseStatus));
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    }
  }, [allWorkoutPlans, workoutHistory, studentNotes, dailyExerciseStatus, students, isLoaded]);

  // Save selected student
  useEffect(() => {
    if (isLoaded && selectedStudentId) {
      localStorage.setItem(SELECTED_STUDENT_KEY, selectedStudentId);
    }
  }, [selectedStudentId, isLoaded]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (password !== '123456') {
      setLoginError('Senha incorreta.');
      return;
    }

    if (username === 'Treinador') {
      setCurrentUser('trainer');
      localStorage.setItem(AUTH_KEY, 'trainer');
      setLoginError('');
    } else {
      const student = students.find(s => s.name.toLowerCase() === username.toLowerCase());
      if (student) {
        setCurrentUser('student');
        setSelectedStudentId(student.id);
        localStorage.setItem(AUTH_KEY, 'student');
        localStorage.setItem(SELECTED_STUDENT_KEY, student.id);
        setLoginError('');
      } else {
        setLoginError('Usuário não encontrado. Use seu nome ou "Treinador".');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    setIsEditing(false);
    setSelectedStudentId(null);
    localStorage.removeItem(SELECTED_STUDENT_KEY);
  };

  const currentWorkoutPlan = selectedStudentId ? allWorkoutPlans[selectedStudentId] || INITIAL_PLAN : [];

  const getWorkoutDayIndex = (date: Date) => {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    if (day === 0) return 6; // Sunday -> Index 6
    return day - 1; // Mon (1) -> 0, Tue (2) -> 1, ..., Sat (6) -> 5
  };

  const selectedDayIndex = getWorkoutDayIndex(selectedDate);
  const selectedWorkoutDay = currentWorkoutPlan[selectedDayIndex];

  const getExerciseStatus = (studentId: string | null, date: Date, exerciseId: string) => {
    if (!studentId) return 'pending';
    const dateKey = date.toISOString().split('T')[0];
    return dailyExerciseStatus[studentId]?.[dateKey]?.[exerciseId] || 'pending';
  };

  const updateExercise = (dayId: string, exerciseId: string, updates: Partial<Exercise>) => {
    if (!selectedStudentId) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];

    // If updating status, it goes to dailyExerciseStatus
    if (updates.status) {
      setDailyExerciseStatus(prev => {
        const studentStatus = prev[selectedStudentId] || {};
        const dateStatus = studentStatus[dateKey] || {};
        const newStatus = {
          ...prev,
          [selectedStudentId]: {
            ...studentStatus,
            [dateKey]: {
              ...dateStatus,
              [exerciseId]: updates.status as 'done' | 'missed' | 'pending'
            }
          }
        };

        // Also update workoutHistory (green dot)
        const hasDone = Object.values(newStatus[selectedStudentId][dateKey]).some(s => s === 'done');
        setWorkoutHistory(hPrev => ({
          ...hPrev,
          [selectedStudentId]: {
            ...(hPrev[selectedStudentId] || {}),
            [dateKey]: hasDone
          }
        }));

        return newStatus;
      });
    }

    // Other updates (name, weight, sets, tips) go to allWorkoutPlans
    if (updates.name !== undefined || updates.weight !== undefined || updates.sets !== undefined || updates.tips !== undefined) {
      setAllWorkoutPlans(prev => {
        const studentPlans = prev[selectedStudentId] || INITIAL_PLAN;
        const updatedPlans = studentPlans.map(day => {
          if (day.id === dayId) {
            return {
              ...day,
              exercises: day.exercises.map(ex => 
                ex.id === exerciseId ? { ...ex, ...updates } : ex
              )
            };
          }
          return day;
        });

        return {
          ...prev,
          [selectedStudentId]: updatedPlans
        };
      });
    }
  };

  const resetWeek = () => {
    if (!selectedStudentId) return;
    if (window.confirm('Deseja resetar o status de todos os exercícios? Os pesos serão mantidos.')) {
      setAllWorkoutPlans(prev => {
        const studentPlan = prev[selectedStudentId] || INITIAL_PLAN;
        return {
          ...prev,
          [selectedStudentId]: studentPlan.map(day => ({
            ...day,
            exercises: day.exercises.map(ex => ({ ...ex, status: 'pending' }))
          }))
        };
      });
    }
  };

  const addExercise = (dayId: string) => {
    if (!selectedStudentId) return;
    const newId = `${dayId}-${Date.now()}`;
    setAllWorkoutPlans(prev => {
      const studentPlan = prev[selectedStudentId] || INITIAL_PLAN;
      return {
        ...prev,
        [selectedStudentId]: studentPlan.map(day => {
          if (day.id === dayId) {
            return {
              ...day,
              exercises: [...day.exercises, { id: newId, name: 'Novo Exercício', weight: '', sets: '3x10', tips: '', status: 'pending' }]
            };
          }
          return day;
        })
      };
    });
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    if (!selectedStudentId) return;
    setAllWorkoutPlans(prev => {
      const studentPlan = prev[selectedStudentId] || INITIAL_PLAN;
      return {
        ...prev,
        [selectedStudentId]: studentPlan.map(day => {
          if (day.id === dayId) {
            return {
              ...day,
              exercises: day.exercises.filter(ex => ex.id !== exerciseId)
            };
          }
          return day;
        })
      };
    });
  };

  const updateDayInfo = (dayId: string, updates: Partial<WorkoutDay>) => {
    if (!selectedStudentId) return;
    setAllWorkoutPlans(prev => {
      const studentPlan = prev[selectedStudentId] || INITIAL_PLAN;
      return {
        ...prev,
        [selectedStudentId]: studentPlan.map(day => 
          day.id === dayId ? { ...day, ...updates } : day
        )
      };
    });
  };

  const addStudent = (name: string) => {
    if (!name.trim()) return;
    const newId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newStudent: Student = { id: newId, name };
    
    // Deep clone INITIAL_PLAN to avoid shared references
    const clonedPlan = JSON.parse(JSON.stringify(INITIAL_PLAN));
    
    setStudents(prev => [...prev, newStudent]);
    setAllWorkoutPlans(prev => ({
      ...prev,
      [newId]: clonedPlan
    }));
    setStudentNotes(prev => ({
      ...prev,
      [newId]: ''
    }));
    setSelectedStudentId(newId);
    setIsAddingStudent(false);
    setNewStudentName('');
  };

  const removeStudent = (studentId: string) => {
    if (window.confirm('Tem certeza que deseja remover este aluno? Todos os dados de treino serão perdidos.')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setAllWorkoutPlans(prev => {
        const { [studentId]: _, ...rest } = prev;
        return rest;
      });
      if (selectedStudentId === studentId) {
        setSelectedStudentId(null);
      }
    }
  };

  if (!isLoaded) return null;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Dumbbell className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">GymCheck</h1>
            <p className="text-stone-500 text-sm text-center leading-relaxed">
              Track Your Workout.<br />
              Control Your Progress
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 ml-1">Usuário</label>
              <input 
                name="username"
                type="text" 
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 ml-1">Senha</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
                placeholder="••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>
            )}
            <button 
              type="submit"
              className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 active:scale-[0.98]"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">cownie.co</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                  {currentUser === 'trainer' ? 'Painel do Treinador' : 'Meu Treino'}
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentUser === 'trainer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {currentUser === 'trainer' ? 'Treinador' : 'Aluno'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                {isEditing && currentUser === 'trainer' ? (
                  <div className="flex items-center gap-1.5 w-full max-w-md">
                    <Info size={16} className="text-purple-500 shrink-0" />
                    <input
                      value={selectedStudentId ? studentNotes[selectedStudentId] || '' : ''}
                      onChange={(e) => {
                        if (selectedStudentId) {
                          setStudentNotes(prev => ({
                            ...prev,
                            [selectedStudentId]: e.target.value
                          }));
                        }
                      }}
                      className="flex-1 bg-purple-50 border border-purple-100 rounded px-2 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-purple-200"
                      placeholder="Ex: 2 séries válidas de 8 a 10 repetições..."
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Info size={16} className="text-stone-400" />
                    <span>
                      {selectedStudentId 
                        ? studentNotes[selectedStudentId] || 'Nenhuma observação definida.' 
                        : 'Selecione um aluno para ver as observações.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser === 'trainer' && selectedStudentId && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isEditing ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isEditing ? <Eye size={16} /> : <Settings size={16} />}
                  <span className="hidden sm:inline">{isEditing ? 'Visualizar' : 'Editar Plano'}</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-500 rounded-full transition-all"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Student Selector for Trainer */}
        {currentUser === 'trainer' && (
          <div className="space-y-4">
            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-stone-400">
                <Users size={20} />
                <h2 className="text-xs font-bold uppercase tracking-widest">Selecione o Aluno</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {students.map(student => (
                  <div key={student.id} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setIsEditing(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                        selectedStudentId === student.id 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200' 
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {student.name}
                    </button>
                    {selectedStudentId !== student.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStudent(student.id);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="Remover Aluno"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                
                {isAddingStudent ? (
                  <div className="col-span-2 sm:col-span-1 flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Nome..."
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addStudent(newStudentName);
                        if (e.key === 'Escape') setIsAddingStudent(false);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl text-sm border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      onClick={() => addStudent(newStudentName)}
                      className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setIsAddingStudent(false)}
                      className="p-2 bg-stone-100 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingStudent(true)}
                    className="px-4 py-3 rounded-xl text-sm font-bold transition-all border border-dashed border-stone-300 text-stone-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Novo Aluno</span>
                  </button>
                )}
              </div>
            </section>

            {/* Trainer Attendance View */}
            {selectedStudentId && (
              <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-stone-400">
                    <CalendarDays size={20} />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Frequência do Aluno</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 7);
                        setSelectedDate(newDate);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 7);
                        setSelectedDate(newDate);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-stone-400">{day}</div>
                  ))}
                  {(() => {
                    const start = new Date(selectedDate);
                    start.setDate(start.getDate() - start.getDay());
                    return Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date(start);
                      date.setDate(date.getDate() + i);
                      const dateKey = date.toISOString().split('T')[0];
                      const hasActivity = workoutHistory[selectedStudentId]?.[dateKey];
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={i}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                            hasActivity
                              ? 'bg-green-100 text-green-700 font-bold'
                              : isToday 
                                ? 'bg-stone-100 text-stone-900 font-bold border border-stone-300' 
                                : 'bg-stone-50 text-stone-400'
                          }`}
                        >
                          <span className="text-[10px] opacity-60 leading-none mb-0.5">
                            {date.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase()}
                          </span>
                          <span className="font-bold">{date.getDate()}</span>
                          {hasActivity && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
                <p className="mt-4 text-[10px] text-stone-400 text-center uppercase tracking-widest font-bold">
                  Dias em verde indicam que o aluno realizou exercícios
                </p>
              </section>
            )}
          </div>
        )}

        {/* Student Info for Student */}
        {currentUser === 'student' && selectedStudentId && (
          <div className="space-y-4">
            <section className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {students.find(s => s.id === selectedStudentId)?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aluno(a)</p>
                  <p className="font-bold text-stone-900">{students.find(s => s.id === selectedStudentId)?.name || 'Desconhecido'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 transition-all"
              >
                <CalendarDays size={16} />
                <span>{selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
              </button>
            </section>

            {/* Calendar View */}
            <AnimatePresence>
              {showCalendar && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Selecionar Data</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() - 7);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-stone-100 rounded"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + 7);
                          setSelectedDate(newDate);
                        }}
                        className="p-1 hover:bg-stone-100 rounded"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-7 gap-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                      <div key={i} className="text-center text-[10px] font-bold text-stone-400">{day}</div>
                    ))}
                    {(() => {
                      const start = new Date(selectedDate);
                      start.setDate(start.getDate() - start.getDay());
                      return Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date(start);
                        date.setDate(date.getDate() + i);
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const dateKey = date.toISOString().split('T')[0];
                        const hasActivity = selectedStudentId && workoutHistory[selectedStudentId]?.[dateKey];

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDate(date);
                              setShowCalendar(false);
                            }}
                            className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                              isSelected 
                                ? 'bg-stone-900 text-white shadow-lg' 
                                : hasActivity
                                  ? 'bg-green-100 text-green-700 font-bold'
                                  : isToday 
                                    ? 'bg-stone-100 text-stone-900 font-bold' 
                                    : 'hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <span className="text-[10px] opacity-60 leading-none mb-0.5">
                              {date.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase()}
                            </span>
                            <span className="font-bold">{date.getDate()}</span>
                            {hasActivity && !isSelected && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                            )}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {selectedStudentId ? (
            currentUser === 'student' ? (
              // Student View: Only show selected day
              selectedWorkoutDay && (
                <motion.section
                  key={selectedWorkoutDay.id + selectedDate.toDateString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
                >
                  {/* Day Header */}
                  <div className={`px-6 py-4 flex items-center justify-between ${selectedWorkoutDay.color} text-white`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold uppercase tracking-wider">{selectedWorkoutDay.title}</h2>
                        <span className="text-xs font-medium opacity-80 bg-white/20 px-2 py-0.5 rounded-full">
                          {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 font-medium">{selectedWorkoutDay.subtitle}</p>
                    </div>
                    {selectedWorkoutDay.isRestDay && <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase">Off</span>}
                  </div>

                  {/* Exercises List */}
                  <div className="divide-y divide-stone-100">
                    {selectedWorkoutDay.isRestDay ? (
                      <div className="p-12 text-center text-stone-400 italic">
                        Aproveite o dia para descansar e recuperar as energias!
                      </div>
                    ) : (
                      selectedWorkoutDay.exercises.map((ex) => {
                        const status = getExerciseStatus(selectedStudentId, selectedDate, ex.id);
                        return (
                          <div 
                            key={ex.id} 
                            className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-all border-l-4 ${
                              status === 'done' ? 'bg-green-50/40 border-green-500' : 
                              status === 'missed' ? 'bg-red-50/40 border-red-500' : 'bg-white border-transparent'
                            }`}
                          >
                            {/* Exercise Name & Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className={`font-bold text-base sm:text-lg truncate ${
                                  status === 'done' ? 'text-green-700 line-through opacity-60' : 
                                  status === 'missed' ? 'text-red-700 opacity-60' : 'text-stone-800'
                                }`}>
                                  {ex.name}
                                </h3>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-lg border border-stone-200 shadow-sm">
                                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Sets</span>
                                  <span className="text-xs font-black text-stone-700">
                                    {ex.sets}
                                  </span>
                                </div>
                              </div>
                              {ex.tips && (
                                <p className="text-xs text-stone-500 italic flex items-center gap-1.5 mt-1 bg-stone-50/50 p-1.5 rounded-md border border-stone-100/50">
                                  <Info size={14} className="text-stone-400 shrink-0" />
                                  <span className="truncate sm:whitespace-normal">{ex.tips}</span>
                                </p>
                              )}
                            </div>

                            {/* Weight Input & Actions */}
                            <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                              <div className="relative flex items-center group">
                                <Dumbbell size={16} className="absolute left-3 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="Peso (kg)"
                                  value={ex.weight}
                                  onChange={(e) => updateExercise(selectedWorkoutDay.id, ex.id, { weight: e.target.value })}
                                  className="pl-9 pr-3 py-2.5 w-full sm:w-32 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all shadow-inner"
                                />
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => updateExercise(selectedWorkoutDay.id, ex.id, { status: status === 'done' ? 'pending' : 'done' })}
                                  className={`p-3 sm:p-2.5 rounded-xl transition-all active:scale-95 ${
                                    status === 'done' 
                                      ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                                      : 'bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-600'
                                  }`}
                                  title="Concluído"
                                >
                                  <Check size={22} className={status === 'done' ? 'scale-110' : ''} />
                                </button>
                                <button
                                  onClick={() => updateExercise(selectedWorkoutDay.id, ex.id, { status: status === 'missed' ? 'pending' : 'missed' })}
                                  className={`p-3 sm:p-2.5 rounded-xl transition-all active:scale-95 ${
                                    status === 'missed' 
                                      ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                                      : 'bg-stone-100 text-stone-400 hover:bg-red-100 hover:text-red-600'
                                  }`}
                                  title="Não feito"
                                >
                                  <X size={22} className={status === 'missed' ? 'scale-110' : ''} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.section>
              )
            ) : (
              // Trainer View: Show all days
              currentWorkoutPlan.map((day, dayIdx) => (
              <motion.section
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.05 }}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
                id={day.id}
              >
                {/* Day Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${day.color} text-white`}>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input 
                          value={day.title}
                          onChange={(e) => updateDayInfo(day.id, { title: e.target.value })}
                          className="bg-white/20 border border-white/30 rounded px-2 py-1 w-full font-bold uppercase tracking-wider text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
                          placeholder="Título do Dia"
                        />
                        <input 
                          value={day.subtitle}
                          onChange={(e) => updateDayInfo(day.id, { subtitle: e.target.value })}
                          className="bg-white/20 border border-white/30 rounded px-2 py-1 w-full text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
                          placeholder="Subtítulo do Dia"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-lg font-bold uppercase tracking-wider">{day.title}</h2>
                        <p className="text-sm opacity-90 font-medium">{day.subtitle}</p>
                      </>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {isEditing && (
                      <button 
                        onClick={() => updateDayInfo(day.id, { isRestDay: !day.isRestDay })}
                        className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded uppercase transition-colors"
                      >
                        {day.isRestDay ? 'Ativar Treino' : 'Marcar Descanso'}
                      </button>
                    )}
                    {day.isRestDay && !isEditing && <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase">Off</span>}
                  </div>
                </div>

                {/* Exercises List */}
                <div className="divide-y divide-stone-100">
                  {day.isRestDay && !isEditing ? (
                    <div className="p-12 text-center text-stone-400 italic">
                      Aproveite o dia para descansar e recuperar as energias!
                    </div>
                  ) : (
                    <>
                      {day.exercises.map((ex) => {
                        const status = getExerciseStatus(selectedStudentId, selectedDate, ex.id);
                        return (
                          <div 
                            key={ex.id} 
                            className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${
                              !isEditing && status === 'done' ? 'bg-green-50/30' : 
                              !isEditing && status === 'missed' ? 'bg-red-50/30' : ''
                            }`}
                          >
                            {/* Exercise Name & Config */}
                            <div className="flex-1 space-y-3">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => removeExercise(day.id, ex.id)}
                                      className="text-stone-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                      <input 
                                        value={ex.name}
                                        onChange={(e) => updateExercise(day.id, ex.id, { name: e.target.value })}
                                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Nome do exercício"
                                      />
                                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                                        <span className="text-[10px] font-bold text-stone-400 uppercase">Séries</span>
                                        <input 
                                          value={ex.sets}
                                          onChange={(e) => updateExercise(day.id, ex.id, { sets: e.target.value })}
                                          className="w-16 bg-transparent text-sm text-center font-bold focus:outline-none"
                                          placeholder="3x10"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 pl-7">
                                    <Info size={14} className="text-stone-400" />
                                    <input 
                                      value={ex.tips}
                                      onChange={(e) => updateExercise(day.id, ex.id, { tips: e.target.value })}
                                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs italic focus:outline-none focus:ring-2 focus:ring-purple-200"
                                      placeholder="Dicas ou observações..."
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className={`font-bold text-base ${
                                      status === 'done' ? 'text-green-700 line-through opacity-60' : 
                                      status === 'missed' ? 'text-red-700 opacity-60' : 'text-stone-800'
                                    }`}>
                                      {ex.name}
                                    </h3>
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-stone-100 rounded-full">
                                      <span className="text-[10px] font-bold text-stone-400 uppercase">Séries</span>
                                      <span className="text-xs font-bold text-stone-600">
                                        {ex.sets}
                                      </span>
                                    </div>
                                  </div>
                                  {ex.tips && (
                                    <p className="text-xs text-stone-500 italic flex items-center gap-1">
                                      <Info size={12} className="text-stone-400" />
                                      {ex.tips}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Weight Input & Actions */}
                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                              <div className="relative flex items-center">
                                <Dumbbell size={14} className="absolute left-3 text-stone-400" />
                                <input
                                  type="text"
                                  placeholder="Peso (kg)"
                                  value={ex.weight}
                                  readOnly={currentUser === 'trainer' && !isEditing}
                                  onChange={(e) => updateExercise(day.id, ex.id, { weight: e.target.value })}
                                  className={`pl-9 pr-3 py-2 w-28 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                    currentUser === 'trainer' && !isEditing ? 'cursor-default' : 'focus:ring-stone-200'
                                  }`}
                                />
                              </div>

                              {!isEditing ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    disabled={currentUser === 'trainer'}
                                    onClick={() => updateExercise(day.id, ex.id, { status: status === 'done' ? 'pending' : 'done' })}
                                    className={`p-2 rounded-lg transition-all ${
                                      status === 'done' 
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                                        : 'bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-600'
                                    } ${currentUser === 'trainer' ? 'opacity-50 cursor-default' : ''}`}
                                    title="Concluído"
                                  >
                                    <Check size={20} />
                                  </button>
                                  <button
                                    disabled={currentUser === 'trainer'}
                                    onClick={() => updateExercise(day.id, ex.id, { status: status === 'missed' ? 'pending' : 'missed' })}
                                    className={`p-2 rounded-lg transition-all ${
                                      status === 'missed' 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                                        : 'bg-stone-100 text-stone-400 hover:bg-red-100 hover:text-red-600'
                                    } ${currentUser === 'trainer' ? 'opacity-50 cursor-default' : ''}`}
                                    title="Não feito"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-[88px] flex justify-center text-stone-300">
                                  <Settings size={20} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {isEditing && (
                        <button 
                          onClick={() => addExercise(day.id)}
                          className="w-full py-4 flex items-center justify-center gap-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 transition-all border-t border-stone-100 border-dashed"
                        >
                          <Plus size={18} />
                          <span className="text-sm font-bold uppercase tracking-wider">Adicionar Exercício</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.section>
            ))
          )
        ) : (
            <div className="p-20 text-center text-stone-400 flex flex-col items-center gap-4">
              <Users size={48} className="opacity-20" />
              <p className="font-medium">Selecione um aluno para gerenciar o treino.</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-4 pb-12 text-center text-stone-400 text-xs">
        <p>Os dados são salvos automaticamente no seu navegador.</p>
        <p className="mt-1">GymCheck - Sistema de Gestão de Treinos</p>
      </footer>
    </div>
  );
}
