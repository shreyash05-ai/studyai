// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const ADMIN_SECRET_KEY = "ShreyashSB";

export const DEFAULT_SUBJECTS = {
  student: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
    "Economics",
  ],
  interview: [
    "Data Structures & Algorithms",
    "System Design",
    "JavaScript",
    "Python",
    "Java",
    "SQL & Databases",
    "Computer Networks",
    "OS Concepts",
    "Behavioral/HR",
    "Problem Solving",
  ],
};

export const STUDY_MODES = {
  student: {
    label: "Student",
    icon: "🎓",
    exams: [
      "JEE Main",
      "JEE Advanced",
      "NEET",
      "UPSC",
      "CAT",
      "GMAT",
      "SAT",
      "IELTS",
      "GATE",
      "Class 12 Board",
      "Other",
    ],
    color: "#00d4ff",
  },
  interview: {
    label: "Interview Prep",
    icon: "💼",
    exams: [
      "Software Engineer (FAANG)",
      "Product Manager",
      "Data Scientist",
      "System Design",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "DevOps Engineer",
      "ML Engineer",
      "Other Tech Role",
    ],
    color: "#10b981",
  },
};
