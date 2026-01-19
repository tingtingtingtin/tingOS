import type { Person, WithContext } from "schema-dts";
const URL = "https://tingwu.dev";

export const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tingxuan Wu",
  alternateName: "Ting Wu",
  url: URL,
  image: `${URL}/profile.jpg`,
  jobTitle: "Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of California, Riverside",
  },
  email: "twu062604@gmail.com",
  knowsAbout: [
    "Software Engineering",
    "Full-Stack Development",
    "React Native",
    "Next.js",
    "Python",
    "Three.js",
    "React.js",
    "TypeScript",
  ],
  sameAs: [
    "https://github.com/tingtingtingtin",
    "https://linkedin.com/in/tingxuanwu",
  ],
};
