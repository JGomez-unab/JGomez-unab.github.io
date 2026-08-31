// Edit this single file to keep projects, publications, people, and profile links current.
const SITE_DATA = {
  profiles: {
    github: "https://github.com/",
    scholar: "https://scholar.google.com/",
    orcid: "https://orcid.org/0000-0002-6507-1462"
  },
  research: [
    { number: "01", title: "Distributed & networked control", text: "Coordination strategies that let many local controllers achieve reliable system-level behavior." },
    { number: "02", title: "Microgrids & smart grids", text: "Resilient operation, ancillary services, and energy management across AC, DC, and hybrid microgrids." },
    { number: "03", title: "Cyber-physical energy systems", text: "Digital twins, data-driven decision making, and interoperable architectures for modern electrical networks." }
  ],
  projects: [
    { code: "AS·MG", status: "Active", title: "Ancillary services between microgrids and power grids", description: "Control and coordination methods that enable microgrids to support the wider power system.", tags: ["Control", "Microgrids", "Simulation"], url: "#" },
    { code: "DT·GRID", status: "Active", title: "Digital twins for smart electrical grids", description: "An experimental platform for monitoring, validation, and intelligent fault prediction in electrical networks.", tags: ["Digital twins", "AI", "HIL"], url: "#" },
    { code: "H₂·EMS", status: "Research", title: "Hydrogen-based flexibility services", description: "Energy management methods for hydrogen microgrids and flexible, low-carbon energy systems.", tags: ["Hydrogen", "Optimization", "EMS"], url: "#" }
  ],
  publications: [
    { year: "2026", type: "Journal", title: "Technical Aspects for Smart Grids Interoperability: IoT and IEC 61850 as Key Enablers", venue: "IEEE Access", doi: "https://doi.org/10.1109/ACCESS.2026.3680294" },
    { year: "2026", type: "Journal", title: "Distributed Wide-Area Frequency Control for Inverter-Dominated Power Systems", venue: "IEEE Access", doi: "https://doi.org/10.1109/ACCESS.2026.3695782" },
    { year: "2025", type: "Journal", title: "Enhanced Microgrid Reliability through Software-Defined Networking and Distributed Predictive Control", venue: "Sustainable Energy, Grids and Networks", doi: "https://doi.org/10.1016/j.segan.2025.101635" },
    { year: "2023", type: "Journal", title: "Consensus-based secondary control and optimal dispatch in hybrid AC/DC microgrids", venue: "IEEE Transactions on Smart Grid", doi: "https://doi.org/10.1109/TSG.2023.3261569" }
  ],
  people: [
    { initials: "01", name: "Student name", role: "Graduate researcher", topic: "Microgrid control and energy management", linkLabel: "GitHub profile", url: "#" },
    { initials: "02", name: "Student name", role: "Undergraduate researcher", topic: "Digital twins for electrical networks", linkLabel: "GitHub profile", url: "#" },
    { initials: "03", name: "Student name", role: "Thesis student", topic: "Data-driven fault prediction", linkLabel: "GitHub profile", url: "#" },
    { initials: "04", name: "Student name", role: "Thesis student", topic: "Hydrogen microgrid operation", linkLabel: "GitHub profile", url: "#" }
  ]
};
