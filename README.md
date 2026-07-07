# Troy Wu's Technical Portfolio

M.Eng Computer Science student at Cornell University (Expected Dec 2026), focused on backend systems, full-stack engineering, and applied optimization/ML. This portfolio highlights my current professional and academic work.

📍 Ithaca, NY
🔗 GitHub: https://github.com/troythetre
🔗 LinkedIn: https://www.linkedin.com/in/wu-troy

---

## Professional Experience

### Backend Software Engineer Intern — GBCS SkyIT
*Remote | May – Aug 2025 | Ranked 2nd of 30 interns*

Contributed to Voop, an internal RFP management platform, as part of a structured 30-intern program with weekly QA and leadership reviews.
- Built a PDF export pipeline (Puppeteer + pdf-lib) for the Voop proposal platform
- Implemented full CRUD REST APIs for a price quote module (Node.js, Express, Prisma ORM, Azure SQL)
- Debugged and resolved a broken version-restore feature by tracing section version history logic

**Tech:** Node.js, Express, Prisma ORM, Azure SQL, Puppeteer, pdf-lib, SendGrid

### Mobile Engineer Intern — Splitz
*Remote | Sep – Dec 2025*

Splitz is a fintech startup building underwriting and risk-scoring infrastructure for creator contracts.
- Built the client-side UI for the underwriting module from scratch in React Native (Expo)
- Built an end-to-end document ingestion flow (PDF/DOCX/image upload, client-side compression, base64 encoding) posting to a backend API

**Tech:** React Native (Expo), TypeScript, REST APIs

---

## Featured Projects

### 🌾 OpenET Agricultural Water Use Analysis Platform
*Cornell M.Eng Research Project, in collaboration with Cornell's School of Integrative Plant Science (NASA-funded) | May 2026 – Present*

A full-stack geospatial analytics platform layering custom analysis on top of the OpenET satellite evapotranspiration API. Built for agricultural water-use monitoring, with a pilot planned on Cornell's campus vineyard.

- Interactive map (Leaflet.js) with polygon/rectangle drawing and 9-point multi-point sampling
- ET heatmap overlay, NDVI vegetation layer, multi-year comparison charts
- Seasonal anomaly detection (scikit-learn) with normalized-baseline reporting and CSV export
- PostgreSQL/PostGIS caching layer with query logging to preserve API quota
- AI chatbot (Claude API) for natural-language queries over ET data

**Tech:** FastAPI, PostgreSQL + PostGIS, SQLAlchemy, Leaflet.js, Chart.js, scikit-learn, Claude API
**Repo:** [github.com/troythetre/openet-platform](https://github.com/troythetre/openet-platform)

### 🚌 Electric Bus Fleet Charging Scheduler
*Cornell M.Eng Capstone, 8-person graduate team | Jan - May 2026*

A Django + Gurobi system that generates optimized EV fleet charging schedules against real transit data and operational constraints.

- Built a Django REST API endpoint to bulk-ingest GTFS charging-window datasets into PostgreSQL, feeding the team's Gurobi optimization pipeline
- Designed a dataset-prefixing scheme to merge multiple GTFS datasets without primary-key collisions, wrapped in atomic transactions
- Contributed to the core LP scheduler in Python/Gurobi — time-slot duration logic, minimum charging-window constraints, and the discrete-time block library

**Tech:** Django, Python, Gurobi, PostgreSQL
**PR:** [Block Library — GTFS charging window loader](https://github.com/Zhaoyao999/e-bus-charging-software-2026-Spring/pull/23) *(team repo — see note below)*

### 📅 Zulip Meeting Scheduling System
*Software Engineering Project | Jan – May 2026*

Designed meeting state models and built interactive TypeScript UI components with real-time RSVP updates, integrated into Zulip's event-driven architecture.

**Tech:** TypeScript, Zulip event system

---

### 🤖 Warm-Starting SAC with Behavioral Cloning for Robot Manipulation
*Cornell CS 5335 — Robot Learning, 3-person team | RLBench / CoppeliaSim*

Tested whether pretraining a Soft Actor-Critic agent on Behavioral Cloning weights accelerates learning on a cluttered robotic obstacle-sorting task. Implemented the SAC and BC-warm-started training loops and ran all experiments (400K environment steps per condition); root-caused a gripper-control failure mode via direct inspection of the action-output distribution, driving a fix to the BC policy's architecture.

**Tech:** Python, PyTorch, RLBench, PyRep, CoppeliaSim
**Repo:** [github.com/troythetre/sac-bc-manipulation](https://github.com/troythetre/sac-bc-manipulation) *(create this repo — see note below)*

---

## Earlier Coursework & Side Projects

Additional coursework projects — including [`pigeon`](https://github.com/troythetre/pigeon), a compiler built for Compiler & Interpreter Design — along with earlier mobile apps and class assignments, are available in my [repositories](https://github.com/troythetre?tab=repositories).
