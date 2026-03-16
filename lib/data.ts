// ============================================================
//  IEEE SJSU — SITE DATA
//  Edit this file to update events and projects across the site.
// ============================================================

// ─── EVENTS ──────────────────────────────────────────────────
// To add an upcoming event: copy a block into upcomingEvents
// To add a past event:      copy a block into pastEvents
// image: path to a file in /public, e.g. '/flyers/my-event.jpg'
//        or leave as null for a placeholder

export interface Event {
  id: string;
  title: string;
  date: string;         // "YYYY-MM-DD" for upcoming, "Mon DD, YYYY" for past
  startTime?: string;
  endTime?: string;
  location: string;
  category: 'Speaker' | 'Workshop' | 'Networking' | 'Social' | 'Recruiting' | 'Industry';
  description: string;
  image: string | null;
}

export const upcomingEvents: Event[] = [
  // ── Add upcoming events here ──────────────────────────────
  // {
  //   id: 'u3',
  //   title: 'My New Event',
  //   date: '2026-04-10',
  //   startTime: '5:00 PM',
  //   endTime: '7:00 PM',
  //   location: 'ENGR 376',
  //   category: 'Workshop',
  //   description: 'Description here.',
  //   image: null,
  // },
];

export const pastEvents: Event[] = [
  // ── Add past events here (newest first) ──────────────────
  {
    id: 'p-tesla',
    title: 'Tesla Tech Talk',
    date: 'Mar 12, 2026',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Speaker',
    description: 'Industry speaker from Tesla covering cutting-edge engineering topics.',
    image: null,
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
    image: null,
  },
  {
    id: 'p2',
    title: 'Altium PCB Workshop',
    date: 'Mar 6, 2026',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'End-to-end PCB design workflow using Altium Designer with industry professionals.',
    image: null,
  },
  {
    id: 'p3',
    title: 'Nuvoton Technical Workshop',
    date: 'Feb 25, 2026',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'Hands-on microcontroller programming with engineers from Nuvoton Technology.',
    image: null,
  },
  {
    id: 'p4',
    title: 'Renesas Networking Event',
    date: 'Feb 18, 2026',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Exclusive networking session with Renesas recruiters and engineers.',
    image: null,
  },
  {
    id: 'p5',
    title: 'Astera Labs x IEEE Networking',
    date: 'Nov 6, 2025',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Connect with engineers from Astera Labs — a Silicon Valley connectivity leader.',
    image: null,
  },
  {
    id: 'p6',
    title: 'Lockheed Martin Recruiter Insights',
    date: 'Oct 31, 2025',
    location: 'ENGR 376',
    category: 'Networking',
    description: 'Career insights and recruiting tips from Lockheed Martin engineers.',
    image: null,
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
    image: null,
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
}

export const featuredProjects: Project[] = [
  // ── Add featured projects here ────────────────────────────
  // {
  //   id: 'proj-1',
  //   title: 'My Project',
  //   category: 'Active Project',
  //   description: 'Description here.',
  //   date: 'Spring 2026',
  //   image: null,
  // },
];

export interface Workshop {
  id: string;
  title: string;
  date: string;
  description: string;
  tag: string;          // e.g. 'PCB Design', 'Verilog', 'Embedded'
  image: string | null;
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
    image: null,
  },
  {
    id: 'ws-nuvoton',
    title: 'Nuvoton Technical Workshop',
    date: 'Feb 25, 2026',
    description: 'Hands-on microcontroller programming with industry professionals.',
    tag: 'Microcontrollers',
    image: null,
  },
  {
    id: 'ws-qspice',
    title: 'QSpice Workshop',
    date: 'Nov 5–12, 2025',
    description: 'Two-day circuit simulation workshop with QSpice.',
    tag: 'Circuit Simulation',
    image: null,
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

export interface Department {
  id: string;
  name: string;
  description: string;
  color: string;        // tailwind bg color class e.g. 'bg-blue-600'
  lead: TeamMember;
  officers: TeamMember[];
}

export const executives: TeamMember[] = [
  { name: 'Add Name', role: 'President',      linkedin: null, photo: null },
  { name: 'Add Name', role: 'Vice President', linkedin: null, photo: null },
];

export const departments: Department[] = [
  {
    id: 'projects',
    name: 'Projects',
    description: 'Runs hardware & software projects',
    color: 'bg-blue-600',
    lead:     { name: 'Add Name', role: 'Chief Projects Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Organizes workshops & events',
    color: 'bg-indigo-600',
    lead:     { name: 'Add Name', role: 'Chief Events Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Promotes the club',
    color: 'bg-violet-600',
    lead:     { name: 'Add Name', role: 'Chief Outreach Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Manages funding & sponsorships',
    color: 'bg-emerald-600',
    lead:     { name: 'Add Name', role: 'Chief Finance Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Oversees digital presence',
    color: 'bg-cyan-600',
    lead:     { name: 'Add Name', role: 'Chief Website Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Coordinates study resources',
    color: 'bg-amber-600',
    lead:     { name: 'Add Name', role: 'Chief Academic Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    description: 'Creates club identity & media',
    color: 'bg-rose-600',
    lead:     { name: 'Add Name', role: 'Chief Brand Officer', linkedin: null, photo: null },
    officers: [
      { name: 'Add Name', role: 'Officer', linkedin: null, photo: null },
    ],
  },
];
