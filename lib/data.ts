// ============================================================
//  IEEE SJSU — SITE DATA
//  Edit this file to update events and projects across the site.
// ============================================================

// ─── HOW TO ADD AN EVENT ─────────────────────────────────────
//
//  1. Drop the flyer image in /public/flyers/ (e.g. my-event.jpg)
//  2. Copy one of the blocks below and fill it in.
//  3. Upcoming events  → add to upcomingEvents[]  (date: 'YYYY-MM-DD')
//     Past events      → move it to pastEvents[]  (date: 'Mon DD, YYYY')
//
//  Fields:
//    id          unique string, e.g. 'u-networking-apple'
//    title       event name
//    date        upcoming: '2026-04-17'   past: 'Apr 17, 2026'
//    startTime   '6:00 PM'  (optional)
//    endTime     '8:00 PM'  (optional)
//    location    room / building
//    category    one of: Speaker | Workshop | Networking | Social | Recruiting | Industry | Hackathon
//    description one or two sentences shown on the card
//    image       '/flyers/my-event.jpg'  or  null  for a placeholder
//
// ─────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  category: 'Speaker' | 'Workshop' | 'Networking' | 'Social' | 'Recruiting' | 'Industry' | 'Hackathon';
  description: string;
  image: string | null;
  images?: string[];   // multiple photos — slideshow on hover
}

export const upcomingEvents: Event[] = [
  // ── ADD NEW UPCOMING EVENTS HERE (soonest first) ──────────

  {
    id: 'u-hackathon',
    title: 'Cognichip AI Hardware Hackathon',
    date: '2026-04-17',
    startTime: 'Apr 10 — Info Session @ 6 PM',
    endTime:   'Apr 17–18 — Hackathon',
    location: 'ENGR 376 / TBD',
    category: 'Hackathon',
    description: 'Two-day AI Hardware Hackathon in partnership with Cognichip. Info session Apr 10 @ 6 PM (ENGR 376). Build something with AI, compete for prizes, and meet engineers from industry — April 17–18.',
    image: '/Cognichip_AI_Hardware_Hackathon.png',
  },
];

export const pastEvents: Event[] = [
  // ── Add past events here (newest first) ──────────────────
  {
    id: 'u-networking-apple',
    title: 'Networking Night with an Apple Engineer',
    date: 'Mar 26, 2026',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Connect one-on-one with a software engineer from Apple. Great opportunity to ask about internships, full-time roles, and life at Apple.',
    image: '/Apple Speaker Event.jpg',
    images: ['/Apple Speaker Event.jpg', '/Apple Speaker Event 2.jpg'],
  },
  {
    id: 'p-tesla',
    title: 'Tesla Tech Talk',
    date: 'Mar 12, 2026',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Speaker',
    description: 'Industry speaker from Tesla covering cutting-edge engineering topics.',
    image: '/Tesla Networking Event.jpg',
    images: ['/Tesla Networking Event.jpg', '/Tesla Networking Event Presentation.jpg', '/Tesla Networking Breakout Event.jpg'],
  },
  {
    id: 'p-alu',
    title: 'ALU Workshop',
    date: 'Mar 13, 2026',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'Build your own ALU from scratch using Verilog — no prior experience needed.',
    image: null,
  },
  {
    id: 'p1',
    title: 'Innovation Garage & Pipeline Kickoff',
    date: 'Mar 9, 2026',
    location: 'ENGR 376',
    category: 'Social',
    description: 'Welcome back event kicking off the spring semester with lab tours and project pipeline reveals.',
    image: '/Innovation Garage Event.jpg',
    images: ['/Innovation Garage Event.jpg', '/Innovation Garage Event 2.jpg', '/Innovation Garage Event 3.jpg'],
  },
  {
    id: 'p2',
    title: 'Altium PCB Workshop',
    date: 'Mar 6, 2026',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'End-to-end PCB design workflow using Altium Designer with industry professionals.',
    image: '/Altium Design Workshop.jpg',
    images: ['/Altium Design Workshop.jpg', '/Altium Desgin Workshop 2.jpg', '/Altium PCB Design Workshop.jpg'],
  },
  {
    id: 'p3',
    title: 'Nuvoton Technical Workshop',
    date: 'Feb 25, 2026',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'Hands-on microcontroller programming with engineers from Nuvoton Technology.',
    image: '/Nuvoton Workshop.jpg',
    images: ['/Nuvoton Workshop.jpg', '/Nuvoton Workshop 2.jpg'],
  },
  {
    id: 'p4',
    title: 'Renesas Networking Event',
    date: 'Feb 18, 2026',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Exclusive networking session with Renesas recruiters and engineers.',
    image: '/Renesas Presentation.jpg',
    images: ['/Renesas Presentation.jpg', '/Renesas Speakers.jpg', '/Renesas Selfie.jpeg'],
  },
  {
    id: 'p5',
    title: 'Astera Labs x IEEE Networking',
    date: 'Nov 6, 2025',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Connect with engineers from Astera Labs — a Silicon Valley connectivity leader.',
    image: '/astera_lab.jpg',
  },
  {
    id: 'p6',
    title: 'Lockheed Martin Recruiter Insights',
    date: 'Oct 31, 2025',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Career insights and recruiting tips from Lockheed Martin engineers.',
    image: '/Lockheed Martin Speaker.jpg',
    images: ['/Lockheed Martin Speaker.jpg', '/Lockheed Insight Event.jpg'],
  },
  {
    id: 'p-quantum',
    title: 'Quantum Computing Lecture',
    date: 'Nov 2025',
    location: 'ENGR 376',
    category: 'Speaker',
    description: 'An intro lecture on quantum computing concepts, industry applications, and where the field is heading.',
    image: '/Quantum Computing Lecture.jpg',
    images: ['/Quantum Computing Lecture.jpg', '/Quantum Computing Info Sesh.jpg'],
  },
  {
    id: 'p7',
    title: 'Cadence Career Talk',
    date: 'Oct 16, 2025',
    location: 'ENGR 376',
    category: 'Recruiting',
    description: 'Explore career opportunities at Cadence Design Systems.',
    image: null,
  },
  {
    id: 'p8',
    title: 'Cognichip Chip Design Competition',
    date: 'May 6, 2025',
    location: 'ENGR 376',
    category: 'Industry',
    description: 'Chip design competition in collaboration with Cognichip, a Silicon Valley startup.',
    image: '/Cognichip Award Ceremony.jpg',
    images: ['/Cognichip Award Ceremony.jpg', '/Congichip Ceremony.jpg'],
  },
];


// ─── PROJECTS ────────────────────────────────────────────────
// featured: shown large on the projects page + homepage carousel
// workshops: shown as a grid on the projects page

export type ProjectCategory = 'Active Project' | 'Industry Challenge' | 'Speaker Event' | 'Workshop' | 'Networking';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  date: string;
  image: string | null;
  images?: string[];
}

export const featuredProjects: Project[] = [
  {
    id: 'proj-ecg',
    title: 'ECG Wearable Monitor',
    category: 'Active Project',
    description: 'A student-built wearable ECG device capable of real-time heart rate monitoring and arrhythmia detection. Designed from the ground up — analog front-end, PCB layout, and embedded firmware.',
    date: 'Spring 2026',
    image: '/ECG Workshop Soldering.jpg',
    images: ['/ECG Workshop Soldering.jpg', '/ECG Workshop Testing.jpg', '/ECG Presentation Event.jpg', '/ECG Workshop Lecture.png'],
  },
  {
    id: 'proj-cognichip',
    title: 'Cognichip Chip Design Competition',
    category: 'Industry Challenge',
    description: 'IEEE SJSU competed in Cognichip\'s chip design challenge — a Silicon Valley startup pushing the frontier of AI hardware. Students tackled real IC design problems under industry mentorship.',
    date: 'May 2025',
    image: '/Cognichip Award Ceremony.jpg',
    images: ['/Cognichip Award Ceremony.jpg', '/Congichip Ceremony.jpg'],
  },
  {
    id: 'proj-englehart',
    title: 'QSpice Workshop with Mike Englehart',
    category: 'Speaker Event',
    description: 'Circuit simulation workshop hosted by industry engineer Mike Englehart — covering real-world EE career paths, embedded systems design, and hands-on QSpice simulation techniques.',
    date: 'Fall 2025',
    image: '/QSpice Intro Presentation.jpg',
    images: ['/QSpice Intro Presentation.jpg'],
  },
];

export interface Workshop {
  id: string;
  title: string;
  date: string;
  description: string;
  tag: string;          // e.g. 'PCB Design', 'Verilog', 'Embedded'
  image: string | null;
  images?: string[];
}

export const workshops: Workshop[] = [
  // ── Add workshops here (newest first) ────────────────────
  {
    id: 'ws-alu',
    title: 'ALU Workshop',
    date: 'Mar 13, 2026',
    description: 'Build your own ALU from scratch using Verilog — no prior experience needed.',
    tag: 'Verilog / Digital Logic',
    image: null,
  },
  {
    id: 'ws-altium',
    title: 'Altium PCB Workshop',
    date: 'Mar 6, 2026',
    description: 'End-to-end PCB design using Altium Designer.',
    tag: 'PCB Design',
    image: '/Altium Design Workshop.jpg',
  },
  {
    id: 'ws-nuvoton',
    title: 'Nuvoton Technical Workshop',
    date: 'Feb 25, 2026',
    description: 'Hands-on microcontroller programming with industry professionals.',
    tag: 'Microcontrollers',
    image: '/Nuvoton Workshop.jpg',
  },
  {
    id: 'ws-quantum',
    title: 'Quantum Computing Workshop',
    date: 'Oct 30, 2025',
    description: 'Introduction to quantum computing concepts and applications.',
    tag: 'Lecture',
    image: null,
  },
  {
    id: 'ws-stm32',
    title: 'Digital Systems Workshop',
    date: 'Oct 23, 2025',
    description: 'Embedded systems programming with STM32.',
    tag: 'Embedded / STM32',
    image: null,
  },
  {
    id: 'ws-fpga',
    title: 'Microchip FPGA Tech Talk',
    date: 'Nov 20, 2025',
    description: 'Hardware design with modern FPGAs.',
    tag: 'Hardware',
    image: null,
  },
];


// ─── SPONSORSHIP PACKET ───────────────────────────────────────
// Add page images (files in /public) in order. Use null for a placeholder page.
// e.g. ['/sponsorship/page-1.jpg', '/sponsorship/page-2.jpg', ...]

export const sponsorshipPages: (string | null)[] = [
  '/sponsorship/1.png',
  '/sponsorship/2.png',
  '/sponsorship/3.png',
  '/sponsorship/4.png',
  '/sponsorship/5.png',
];

// ─── TEAM ─────────────────────────────────────────────────────
// Update names, roles, and LinkedIn URLs here.
// linkedin: full URL or null
// photo: path in /public or null (shows initials avatar)

export interface TeamMember {
  name: string;
  role: string;
  linkedin?: string | null;
  photo?: string | null;
}

export interface SubDepartment {
  id: string;
  name: string;
  lead: TeamMember;
  officers: TeamMember[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;       // border/accent color (tailwind)
  lead: TeamMember;
  subDepartments: SubDepartment[];
}

export const executives: TeamMember[] = [
  { name: 'Add Name', role: 'Chief Executive Officer',   linkedin: null, photo: null },
  { name: 'Add Name', role: 'Chief Operations Officer',  linkedin: null, photo: null },
];

export const departments: Department[] = [
  {
    id: 'brand',
    name: 'Brand',
    description: 'Creates club identity & media',
    icon: '🎨',
    accent: 'border-pink-500/40',
    lead: { name: 'Add Name', role: 'Chief Brand Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'smm',
        name: 'SMM',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [{ name: 'Add Name', role: 'Officer', linkedin: null, photo: null }],
      },
      {
        id: 'content',
        name: 'Content Creation',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Promotes the club',
    icon: '📣',
    accent: 'border-orange-500/40',
    lead: { name: 'Add Name', role: 'Chief Outreach Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'internal-outreach',
        name: 'Internal Outreach',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [{ name: 'Add Name', role: 'Officer', linkedin: null, photo: null }],
      },
      {
        id: 'biz-relations',
        name: 'Business Relations',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Runs hardware & software projects',
    icon: '📁',
    accent: 'border-yellow-500/40',
    lead: { name: 'Add Name', role: 'Chief Projects Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'ai-projects',
        name: 'AI Projects',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [{ name: 'Add Name', role: 'Officer', linkedin: null, photo: null }],
      },
      {
        id: 'ml-projects',
        name: 'ML Projects',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Creates workshops & seminars',
    icon: '🎓',
    accent: 'border-purple-500/40',
    lead: { name: 'Add Name', role: 'Chief Academic Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'ai-committee',
        name: 'AI Committee',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
      {
        id: 'ml-committee',
        name: 'ML Committee',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Manages funding & sponsorships',
    icon: '💰',
    accent: 'border-green-500/40',
    lead: { name: 'Add Name', role: 'Chief Finance Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'internal-funding',
        name: 'Internal Funding',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
      {
        id: 'external-funding',
        name: 'External Funding',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Oversees digital presence',
    icon: '🌐',
    accent: 'border-cyan-500/40',
    lead: { name: 'Add Name', role: 'Chief Website Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'frontend',
        name: 'Frontend',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Organizes events & socials',
    icon: '📅',
    accent: 'border-blue-500/40',
    lead: { name: 'Add Name', role: 'Chief Events Officer', linkedin: null, photo: null },
    subDepartments: [
      {
        id: 'internal-events',
        name: 'Internal Events',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
      {
        id: 'external-events',
        name: 'External Events',
        lead:     { name: 'Add Name', role: 'Lead', linkedin: null, photo: null },
        officers: [
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
          { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
        ],
      },
    ],
  },
];
