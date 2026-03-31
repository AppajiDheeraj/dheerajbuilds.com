const person = {
  firstName: "Appaji",
  lastName: "Dheeraj",
  fullName: "Appaji Dheeraj",
  email: "dheeraj.nagaraja@gmail.com",
};

export const siteConfig = {
  person,
  contact: {
    header: "Let’s Build Together",
    description:
      "Open to full-time roles, freelance projects, and collaboration on AI, systems, and full-stack products. Let’s discuss how I can help.",
    cta: {
      label: "Get in Touch",
      to: "/contact",
    },
    form: {
      eyebrow: "Let’s connect",
      scene: "(Update — 07)",
      copyright: "© 2026",
      title: "Start a Project",
      description:
        "Have a product idea, an AI workflow, or a system challenge? Share the details and I’ll reply with next steps.",
      availability: ["Open to opportunities", "Remote or on-site"],
      placeholders: {
        name: "Name",
        email: "Email",
        message: "Message",
      },
      submitLabel: "Send Message",
    },
  },
  home: {
    stickyNav: ["About Me", "Let’s Connect"],
    stickyFooter: ["Engineering with Intent", "Open to Collaborations"],
    stickyTitles: [
      "I build AI-first products and full-stack systems that solve real problems.",
      "Each project is driven by clarity, performance, and strong UX.",
      "This portfolio is a snapshot of the tools, systems, and products I ship.",
    ],
    workHeaderSuffix: "selects",
    hobbies: ["Systems", "AI", "Web", "Product"],
  },
  about: {
    establishedLabel: "Est",
    establishedYear: "1997",
    intro: [
      "I'm " + person.fullName + " — a computer science student and full-stack developer focused on systems and AI. I enjoy building practical products with clean architecture and strong UX.",
      "I care about clarity, performance, and scalable design. Whether it’s an AI workflow, a SaaS app, or a developer tool, I aim for reliability and impact.",
      "Every project is a chance to learn, iterate, and ship. If it solves a real problem and feels solid to use, it’s a win.",
    ],
  },
  footer: {
    brandLine1: person.firstName,
    brandLine2: person.lastName,
    copyrightYear: "2026",
    templateCredit: "Made with Love",
  },
};
