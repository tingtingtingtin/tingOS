export interface TweetData {
  id: string;
  type: "experience" | "education";
  avatar: string;
  name: string;
  handle: string;
  role: string;
  date: string;
  content: string;
  details: string[];
  stats: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

export const tweets: TweetData[] = [
  // --- EXPERIENCE ---
  {
    id: "fanalyze",
    type: "experience",
    avatar: "https://github.com/fanalyze.png",
    name: "Fanalyze",
    handle: "@fanalyze",
    role: "Software Engineering Intern",
    date: "Jul 2025 - Sep 2025",
    content:
      "just launched the new react native mobile app on both play store and app store, AMA",
    details: [
      "Drove full-stack product life-cycle of React Native mobile app, deploying and launching on Apple/Google Play Store",
      "Provisioned containerized Python/Flask backend API using Docker and Terraform on AWS, reducing manual setup by 70%",
      "Developed scalable API by implementing parallel processing with asyncio and Redis layer for caching/rate-limiting",
      "Managed scalable frontend states with Zustand, implementing user monetization features using RevenueCat SDK",
      "Established comprehensive testing framework (Jest and Pytest) to ensure high-quality code and rapid feature iteration",
    ],
    stats: { replies: 4, retweets: 12, likes: 89 },
  },
  {
    id: "cutie-hack",
    type: "experience",
    avatar: "https://github.com/citrushack.png",
    name: "Cutie Hack",
    handle: "@cutiehack_ucr",
    role: "Software Engineering Lead",
    date: "Jun 2025 - Nov 2025",
    content: "Leading the tech team for 200+ attendees is fr no joke",
    details: [
      "Led full-stack development for 200+ attendee hackathon platform, managing cross-platform compatibility and deployment",
      "Achieved 99.9% uptime for participant login and check-in during peak event traffic by resolving critical production bugs",
      "Spearheaded development of LLM-powered Discord bot to provide real-time support for attendees, reducing team workload",
      "Engineered production-ready RAG pipeline using Pinecone to optimize token usage, reducing context size by over 70%",
    ],
    stats: { replies: 12, retweets: 45, likes: 156 },
  },
  {
    id: "acm-ucr",
    type: "experience",
    avatar: "https://github.com/acm-ucr.png",
    name: "ACM at UCR",
    handle: "@acm_ucr",
    role: "Full-Stack Project Lead",
    date: "Oct 2024 - Present",
    content:
      "During the Spring Quarter of 2025, our passionate ACM Spark developers collaborated with the National Arab American Medical Association (NAAMA@UCR) to create their first personal website! \nCheck out https://naama.ucrhighlanders.org/!",
    details: [
      "Led and conducted code reviews for 20+ developers in an Agile workflow to develop and deploy 3+ Next.js websites",
      "Collaborated with 5+ designers/clients to scope project requirements, translating Figma mockups to technical tickets",
      "Established CI/CD pipelines with GitHub Actions to automate testing and deployment to GitHub Pages",
    ],
    stats: { replies: 2, retweets: 5, likes: 42 },
  },
  {
    id: "ucr-ula",
    type: "experience",
    avatar: "https://github.com/ucr.png",
    name: "UCR CS Department",
    handle: "@UCRiverside",
    role: "Undergraduate Learning Assistant",
    date: "Oct 2024 - Aug 2025",
    content: "Mentored students for CS10 series",
    details: [
      "Mentored 50+ students on complex C++ and Python data structures, algorithms, and debugging techniques",
      "Partnered with professors and TAs to identify and resolve recurring student challenges from weekly lab sessions",
    ],
    stats: { replies: 8, retweets: 3, likes: 76 },
  },

  // --- EDUCATION ---
  {
    id: "ucr-ms",
    type: "education",
    avatar: "https://github.com/ucr.png",
    name: "UC Riverside",
    handle: "@UCRiverside",
    role: "M.S. Computer Science",
    date: "Sep 2025 - Jun 2026 (Exp)",
    content: "started my masters! current gpa: 3.83/4.0",
    details: [
      "Relevant Coursework: Advanced Data Structures and Algorithms, GPU Architecture and Parallel Programming, Advanced Operating Systems, Big-Data Management, Machine Learning",
      "Expected Graduation: June 2026",
    ],
    stats: { replies: 5, retweets: 1, likes: 120 },
  },
  {
    id: "ucr-bs",
    type: "education",
    avatar: "https://github.com/ucr.png",
    name: "UC Riverside",
    handle: "@UCRiverside",
    role: "B.S. Computer Science",
    date: "Sep 2022 - Jun 2025",
    content: "officially graduated summa cum laude! gpa: 3.98/4.0",
    details: [
      "Overall GPA: 3.98/4.0 (Summa Cum Laude)",
      "Awards: CitrusHack 2025 (2nd Place Overall)",
      "Relevant Coursework: Web Development, Artificial Intelligence, Operating Systems, Concurrent Programming & Parallel Systems, Information Retrieval, Advanced Algorithms",
    ],
    stats: { replies: 15, retweets: 24, likes: 340 },
  },
];
