/** CV writing template – affects how AI improves summary and experience text */
export const CV_TEMPLATES = [
  { id: 'classic', label: 'Classic', description: 'Formal, traditional, clear bullet points' },
  { id: 'modern', label: 'Modern', description: 'Action verbs, achievements, results-oriented' },
  { id: 'minimal', label: 'Minimal', description: 'Short phrases, keywords, scannable' },
  { id: 'creative', label: 'Creative', description: 'Narrative, personality, engaging' },
] as const

export type CVTemplateId = (typeof CV_TEMPLATES)[number]['id']
export const ISRAELI_INSTITUTES = [
  'Technion - Israel Institute of Technology',
  'Tel Aviv University',
  'Hebrew University of Jerusalem',
  'Ben-Gurion University of the Negev',
  'Bar-Ilan University',
  'University of Haifa',
  'Ariel University',
  'Open University of Israel',
  'Weizmann Institute of Science',
  'Reichman University (IDC Herzliya)',
  'College of Management Academic Studies',
  'HIT - Holon Institute of Technology',
  'Shenkar - Engineering, Design and Art',
  'Bezalel Academy of Arts and Design',
  'Afeka College of Engineering',
  'Ort Braude College',
  'Sam Shamoon College of Engineering',
  'Sapir Academic College',
  'Ruppin Academic Center',
  'Netanya Academic College',
  'Haifa University - Oranim',
  'Kinneret Academic College',
  'Levinsky College of Education',
  'WIZO Haifa',
  'Tel-Hai Academic College',
  'Ashkelon Academic College',
  'Achim College',
  'Hadassah Academic College',
  'Jerusalem College of Technology (Lev)',
  'MTA - Academic College of Tel Aviv-Yafo',
  'Beit Berl College',
  'Kaye Academic College',
] as const

/** Common degree types for CV */
export const DEGREE_TYPES = [
  'B.Sc',
  'B.A',
  'M.Sc',
  'M.A',
  'Ph.D',
  'MBA',
  'LL.B',
  'Practical Engineer',
  'Certificate',
  'Course',
  'Bootcamp',
] as const

/** Common skills for CV – tech, soft skills, tools */
export const SKILL_SUGGESTIONS = [
  // Frontend
  'React',
  'Vue.js',
  'Angular',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'SASS/SCSS',
  'Next.js',
  // Backend
  'Node.js',
  'Python',
  'Java',
  'C#',
  '.NET',
  'PHP',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  // DevOps & Cloud
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'CI/CD',
  'Jenkins',
  'Git',
  'Linux',
  // Data & AI
  'Data Analysis',
  'Machine Learning',
  'Excel',
  'Power BI',
  'Tableau',
  // Soft skills
  'Team Leadership',
  'Project Management',
  'Agile/Scrum',
  'Problem Solving',
  'Communication',
  'Multitasking',
  'Attention to Detail',
  'Self Learning',
  // YouTube & Content
  'YouTube',
  'Video Editing',
  'Content Creation',
  'Social Media Marketing',
  'SEO',
  // Beauty & Wellness
  'Makeup',
  'Hair Styling',
  'Skincare',
  'Nail Art',
  // Sports & Fitness
  'Personal Training',
  'Sports Coaching',
  'Fitness Instruction',
  // Government & Public
  'Public Administration',
  'Government',
  'Policy',
] as const

/** Job sector with display name and links to job search / resources */
export type JobSectorLink = { label: string; url: string }

export type JobSector = {
  id: string
  name: string
  links: JobSectorLink[]
}

/** Popular job sectors – contemporary and in-demand with relevant links */
export const JOB_SECTORS: JobSector[] = [
  {
    id: 'tech',
    name: 'High-Tech & Technology',
    links: [
      { label: 'Drushim', url: 'https://www.drushim.co.il/' },
      { label: 'AllJobs Tech', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?sr=1&q=הייטק' },
      { label: 'JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=הייטק' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/jobs/' },
    ],
  },
  {
    id: 'gov',
    name: 'Government & Public Sector',
    links: [
      { label: 'Government jobs', url: 'https://www.gov.il/he/departments/govtopics/public_service' },
      { label: 'Public tenders - AllJobs', url: 'https://www.alljobs.co.il/ArticlePage.aspx?LinkWord=publicjobs' },
      { label: 'Local government', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=רשות%20מקומית' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    links: [
      { label: 'Sports jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=ספורט' },
      { label: 'Fitness jobs - JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=כושר' },
      { label: 'Sports instructors', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=מדריך%20כושר' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    links: [
      { label: 'Beauty jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=יופי' },
      { label: 'Salon jobs', url: 'https://www.jobmaster.co.il/jobs/?q=מספרה' },
      { label: 'Makeup & skincare', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=איפור' },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube & Digital Content',
    links: [
      { label: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com/' },
      { label: 'Media jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=תוכן%20דיגיטלי' },
      { label: 'Digital marketing jobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=שיווק%20דיגיטלי' },
    ],
  },
  {
    id: 'health',
    name: 'Healthcare & Medicine',
    links: [
      { label: 'Healthcare jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=בריאות' },
      { label: 'Medical jobs - JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=רפואה' },
      { label: 'Health funds', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=קופת%20חולים' },
    ],
  },
  {
    id: 'education',
    name: 'Education & Teaching',
    links: [
      { label: 'Education jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=חינוך' },
      { label: 'Ministry of Education', url: 'https://www.gov.il/he/departments/ministry-of-education' },
      { label: 'Teachers & instructors', url: 'https://www.jobmaster.co.il/jobs/?q=מורה' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    links: [
      { label: 'Finance jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=פיננסים' },
      { label: 'Banks', url: 'https://www.jobmaster.co.il/jobs/?q=בנק' },
      { label: 'Investments & insurance', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=ביטוח' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    links: [
      { label: 'Marketing jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=שיווק' },
      { label: 'Sales jobs - JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=מכירות' },
      { label: 'Digital marketing', url: 'https://www.drushim.co.il/jobs/marketing/' },
    ],
  },
  {
    id: 'design',
    name: 'Design & Creative',
    links: [
      { label: 'Design jobs - Drushim', url: 'https://www.drushim.co.il/jobs/design/' },
      { label: 'Graphics & art', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=עיצוב%20גרפי' },
      { label: 'JobMaster Design', url: 'https://www.jobmaster.co.il/jobs/?q=מעצב' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Hospitality',
    links: [
      { label: 'Restaurant jobs - AllJobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=מסעדה' },
      { label: 'Hospitality', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=מלונאות' },
      { label: 'Chefs & kitchen', url: 'https://www.jobmaster.co.il/jobs/?q=שף' },
    ],
  },
  {
    id: 'retail',
    name: 'Retail & Customer Service',
    links: [
      { label: 'Retail jobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=קמעונאות' },
      { label: 'Customer service', url: 'https://www.jobmaster.co.il/jobs/?q=שירות%20לקוחות' },
      { label: 'Store managers', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=מנהל%20חנות' },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    links: [
      { label: 'Logistics jobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=לוגיסטיקה' },
      { label: 'Driving & delivery', url: 'https://www.jobmaster.co.il/jobs/?q=נהג' },
      { label: 'Warehouse', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=מחסנאי' },
    ],
  },
  {
    id: 'construction',
    name: 'Construction & Interior Design',
    links: [
      { label: 'Construction jobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=בנייה' },
      { label: 'Interior design', url: 'https://www.jobmaster.co.il/jobs/?q=עיצוב%20פנים' },
      { label: 'Electricity & plumbing', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=חשמלאי' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Consulting',
    links: [
      { label: 'Legal jobs', url: 'https://www.alljobs.co.il/Search/AllJobs.asp?q=משפטים' },
      { label: 'Lawyers', url: 'https://www.jobmaster.co.il/jobs/?q=עורך%20דין' },
      { label: 'Consulting', url: 'https://www.drushim.co.il/jobs/consulting/' },
    ],
  },
]
