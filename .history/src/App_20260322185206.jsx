import React, { useMemo, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Download,
  Layers3,
  Smartphone,
  Palette,
  FolderKanban,
  Send,
  Menu,
  X,
  CheckCircle2,
  SunMoon,
  Wand2,
  Zap,
  MonitorSmartphone,
} from "lucide-react";

const navItems = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const projects = [
  {
    title: "FocusTrail",
    type: "Mobile Productivity App",
    status: "In Development",
    description:
      "A student-focused app that helps users discover nearby study spots, track study sessions, and reflect on productivity through focus analytics.",
    highlights: [
      "Google Places API integration",
      "Study session tracking",
      "Focus rating analytics",
      "Mobile-first user flow",
    ],
    icon: Smartphone,
    github: "https://github.com/yakshxo/FocusTrail",
    live: null,
  },
  {
    title: "AI Flashcard Generator",
    type: "AI Study Tool",
    status: "Built",
    description:
      "An AI-powered study assistant that turns topics or notes into flashcards, making revision faster and more interactive.",
    highlights: [
      "AI-powered generation",
      "Dynamic learning flow",
      "Fast input-to-output experience",
      "Scalable for student use",
    ],
    icon: Sparkles,
    github: "https://github.com/yakshxo/flashcard",
    live: "https://flaschard.vercel.app/",
  },
  {
    title: "Job Marketplace Mobile App",
    type: "Academic Mobile Project",
    status: "Completed",
    description:
      "A mobile app where users can post jobs, browse opportunities, apply for work, and process payments in a more structured way.",
    highlights: [
      "Job filtering system",
      "Payment integration",
      "RecyclerView UI",
      "Testing with Espresso",
    ],
    icon: Briefcase,
    github: null,
    live: null,
  },
  {
    title: "Student Observation System",
    type: "Web Platform",
    status: "Completed",
    description:
      "A web system for tutors and teaching assistants to record observations, track progress, and manage student feedback.",
    highlights: [
      "Academic record management",
      "Performance tracking",
      "Structured feedback workflow",
      "Usability-focused interface",
    ],
    icon: FolderKanban,
    github: null,
    live: null,
  },
];

const skillGroups = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Libraries",
    icon: Layers3,
    skills: ["React", "Node.js", "REST APIs", "Expo", "Firebase"],
  },
  {
    title: "Databases & Tools",
    icon: Briefcase,
    skills: ["MySQL", "SQLite", "Firestore", "MongoDB", "Git", "GitHub", "AWS", "Jira"],
  },
  {
    title: "Design & UX",
    icon: Palette,
    skills: [
      "UI/UX Design",
      "Usability Thinking",
      "User Flows",
      "Navigation Design",
      "Product Thinking",
    ],
  },
];

const strengths = [
  {
    title: "Code",
    text: "I build across web, mobile, APIs, and full product flows with a strong technical base.",
    icon: Code2,
  },
  {
    title: "Design",
    text: "I care about how products look, feel, and communicate clearly to users.",
    icon: Palette,
  },
  {
    title: "User Experience",
    text: "I combine development with usability thinking so products are practical and intuitive.",
    icon: Sparkles,
  },
];

function SectionHeader({ label, title, text }) {
  return (
    <div className="section-header">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [creativeMode, setCreativeMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Mobile", "AI", "Web"];

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    return projects.filter((project) => {
      const text = `${project.title} ${project.type} ${project.description}`.toLowerCase();
      if (activeFilter === "Mobile") return text.includes("mobile");
      if (activeFilter === "AI") return text.includes("ai");
      if (activeFilter === "Web") return text.includes("web");
      return true;
    });
  }, [activeFilter]);

  return (
    <div className={creativeMode ? "app-shell creative-mode" : "app-shell recruiter-mode"}>
      <div className="bg-layer bg-one"></div>
      <div className="bg-layer bg-two"></div>
      <div className="bg-layer bg-three"></div>
      <div className="grid-overlay"></div>

      <header className="site-header">
        <div className="container nav-wrap">
          <div className="brand">Yaksh Thakar</div>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="mode-toggle"
              onClick={() => setCreativeMode((prev) => !prev)}
              type="button"
            >
              <SunMoon size={16} />
              {creativeMode ? "Creative Mode" : "Recruiter Mode"}
            </button>

            <a href="mailto:yaksh@dal.ca" className="nav-cta">
              Let’s Talk <ArrowRight size={16} />
            </a>

            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-nav">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero container">
          <div className="hero-copy">
            <div className="hero-pill">
              <Sparkles size={16} />
              Seeking Fall Co-op Opportunities
            </div>

            <p className="hero-kicker">Applied Computer Science × Web/Mobile × UX</p>

            <h1 className={creativeMode ? "hero-title creative-title" : "hero-title recruiter-title"}>
              Building digital products that feel <span>clean, creative, and useful.</span>
            </h1>

            <p className="hero-text">
              I’m <strong>Yaksh Thakar</strong>, a 4th-year Bachelor of Applied Computer Science student
              at Dalhousie University, also pursuing certifications in
              <strong> Web & Mobile Development</strong> and
              <strong> User Experience Design & Evaluation</strong>.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                View Projects <ArrowRight size={18} />
              </a>

              <a href="/Yaksh-Thakar-Resume.pdf" className="btn btn-secondary">
                Download Resume <Download size={18} />
              </a>
            </div>

            <div className="hero-badges">
              <span>React</span>
              <span>Mobile Apps</span>
              <span>AI Tools</span>
              <span>UX Thinking</span>
            </div>

            {creativeMode && (
              <>
                <div className="creative-strip">
                  <div className="creative-strip-track">
                    <span><Wand2 size={14} /> UI/UX Focused</span>
                    <span><Zap size={14} /> Problem Solver</span>
                    <span><MonitorSmartphone size={14} /> Web + Mobile Builder</span>
                    <span><Sparkles size={14} /> Product Thinking</span>
                    <span><Wand2 size={14} /> UI/UX Focused</span>
                    <span><Zap size={14} /> Problem Solver</span>
                    <span><MonitorSmartphone size={14} /> Web + Mobile Builder</span>
                    <span><Sparkles size={14} /> Product Thinking</span>
                  </div>
                </div>

                <div className="floating-mini-cards">
                  <div className="floating-card float-one">
                    <Sparkles size={16} />
                    <span>Creative Builder</span>
                  </div>
                  <div className="floating-card float-two">
                    <Code2 size={16} />
                    <span>Code + UX</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hero-panel">
            <div className="hero-panel-top">
              <div>
                <p className="section-label">Profile Snapshot</p>
                <h3>{creativeMode ? "Code × Design × Experience" : "Co-op Candidate Snapshot"}</h3>
              </div>
              <div className="panel-icon">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="strength-grid">
              {strengths.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="strength-card" key={item.title}>
                    <div className="strength-title">
                      <div className="mini-icon">
                        <Icon size={18} />
                      </div>
                      <h4>{item.title}</h4>
                    </div>
                    <p>{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="availability-box">
              Available for software development, frontend, web, mobile, and UX-aware co-op roles.
            </div>
          </div>
        </section>

        <section id="about" className="section container">
          <SectionHeader
            label="About Me"
            title="A student developer with both technical depth and design awareness."
            text="I enjoy building products that are not only functional, but also polished and intuitive. My work is shaped by development experience, curiosity, and a strong interest in how people actually interact with digital products."
          />

          <div className="info-grid three-col">
            <div className="info-card">
              <h3>Builder Mindset</h3>
              <p>
                I like taking an idea from concept to working product, whether that means coding the
                interface, connecting APIs, or refining the user flow.
              </p>
            </div>

            <div className="info-card">
              <h3>User-Centered Thinking</h3>
              <p>
                I pay attention to clarity, usability, and structure so the final result feels complete
                and easy to use.
              </p>
            </div>

            <div className="info-card">
              <h3>Co-op Ready</h3>
              <p>
                I’m looking for a Fall co-op where I can contribute to meaningful projects and grow as a
                developer in a strong team environment.
              </p>
            </div>
          </div>
        </section>

        <section id="education" className="section container">
          <SectionHeader
            label="Education"
            title="Computer science with added focus on web, mobile, and user experience."
            text="My degree and certifications reflect a balance between software development fundamentals and thoughtful digital product design."
          />

          <div className="education-layout">
            <div className="edu-main-card">
              <div className="edu-head">
                <div className="panel-icon">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3>Dalhousie University</h3>
                  <p>Bachelor of Applied Computer Science</p>
                  <span>Halifax, Nova Scotia</span>
                </div>
              </div>

              <div className="course-block">
                <p className="section-label">Relevant Areas</p>
                <div className="chip-wrap">
                  <span>Web Development</span>
                  <span>Mobile Computing</span>
                  <span>Data Structures</span>
                  <span>Database Systems</span>
                  <span>Usable Security</span>
                </div>
              </div>
            </div>

            <div className="side-stack">
              <div className="info-card">
                <p className="section-label">Certification 01</p>
                <h3>Web & Mobile Development</h3>
                <p>
                  Strengthening my ability to build responsive web interfaces and mobile-friendly
                  experiences across different platforms.
                </p>
              </div>

              <div className="info-card">
                <p className="section-label">Certification 02</p>
                <h3>User Experience Design & Evaluation</h3>
                <p>
                  Helping me think beyond code by focusing on usability, structure, and interface quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section container">
          <SectionHeader
            label="Projects"
            title="Work that reflects both technical execution and product thinking."
            text="These projects show the kinds of products I enjoy building — practical, structured, and designed with users in mind."
          />

          <div className="filter-row">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "filter-btn active" : "filter-btn"}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => {
              const Icon = project.icon;

              return (
                <div className="project-card" key={project.title}>
                  <div className="project-top">
                    <div className="project-icon">
                      <Icon size={22} />
                    </div>
                    <span className="project-status">{project.status}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p className="project-type">{project.type}</p>
                  <p className="project-desc">{project.description}</p>

                  <ul className="project-points">
                    {project.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <button className="project-link" type="button">
                    View Summary <ExternalLink size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section id="skills" className="section container">
          <SectionHeader
            label="Skills"
            title="Technical skills backed by adaptability and product awareness."
            text="I enjoy working across development and design-oriented tasks, from coding interfaces and APIs to shaping cleaner user flows."
          />

          <div className="skills-grid">
            {skillGroups.map((group) => {
              const Icon = group.icon;

              return (
                <div className="skill-card" key={group.title}>
                  <div className="skill-head">
                    <div className="mini-icon">
                      <Icon size={18} />
                    </div>
                    <h3>{group.title}</h3>
                  </div>

                  <div className="chip-wrap">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section container">
          <SectionHeader
            label="What I Bring"
            title="More than code — I bring clarity, polish, and team value."
            text="I aim to contribute work that is thoughtful, clean, and useful. I care about both technical quality and how the final product feels."
          />

          <div className="info-grid three-col">
            <div className="info-card">
              <h3>Fast Learner</h3>
              <p>I adapt quickly to new tools, project structures, and team workflows.</p>
            </div>
            <div className="info-card">
              <h3>Team-Oriented</h3>
              <p>I enjoy collaboration, feedback, and building better results with others.</p>
            </div>
            <div className="info-card">
              <h3>Detail-Focused</h3>
              <p>I care about presentation, usability, spacing, and finishing work properly.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section container">
          <SectionHeader
            label="Contact"
            title="Let’s build something meaningful."
            text="I’m currently looking for Fall co-op opportunities and would love to connect with teams creating strong digital products."
          />

          <div className="contact-layout">
            <div className="contact-card">
              <h3>Get in Touch</h3>

              <div className="contact-links">
                <a href="mailto:yaksh@dal.ca">
                  <Mail size={18} />
                  yaksh@dal.ca
                </a>

                <a href="https://github.com/yakshxo" target="_blank" rel="noreferrer">
                  <Github size={18} />
                  github.com/yakshxo
                </a>

                <a href="https://www.linkedin.com/in/yaksh-thakar" target="_blank" rel="noreferrer">
                  <Linkedin size={18} />
                  linkedin.com/in/yaksh-thakar
                </a>

                <div>
                  <MapPin size={18} />
                  Halifax, Nova Scotia
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your name" />
              <input type="email" placeholder="Your email" />
              <textarea rows="6" placeholder="Your message"></textarea>
              <button type="submit" className="btn btn-primary">
                Send Message <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <p>© 2026 Yaksh Thakar. Built with React.</p>

          <div className="footer-links">
            <a href="https://github.com/yakshxo" target="_blank" rel="noreferrer">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/yaksh-thakar" target="_blank" rel="noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="mailto:yaksh@dal.ca">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}