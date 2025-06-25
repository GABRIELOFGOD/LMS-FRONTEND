// import { Course } from "@/types/course";


// export const courses = [
//   {
//     id: 1,
//     title: "News Fact-checking",
//     description: "This course is all about fact-checking news",
//     by: {
//       name: "FACT-CHECK AFRICA",
//       logo: "/images/Factcheck_Elections.png"
//     },
//     rating: {
//       vote: 20,
//       total: 32
//     },
//     chapters: 13,
//     price: null
//   },
//   {
//     id: 2,
//     title: "News Fact-checking",
//     description: "This course is all about fact-checking news",
//     by: {
//       name: "FACT-CHECK AFRICA",
//       logo: "/images/Factcheck_Elections.png"
//     },
//     rating: {
//       vote: 20,
//       total: 32
//     },
//     chapters: 13,
//     price: null
//   },
//   {
//     id: 3,
//     title: "News Fact-checking",
//     description: "This course is all about fact-checking news",
//     by: {
//       name: "FACT-CHECK AFRICA",
//       logo: "/images/Factcheck_Elections.png"
//     },
//     rating: {
//       vote: 20,
//       total: 32
//     },
//     chapters: 13,
//     price: null
//   },
// ]

// const courses: Course[] = [
//   {
//     title: "TypeScript for Beginners",
//     description: "Master TypeScript fundamentals and apply them in real-world JavaScript projects.",
//     overview: "This beginner-friendly course introduces TypeScript syntax, types, and its integration with JavaScript. Ideal for developers transitioning from JS.",
//     syllabus: [
//       { title: "Introduction", description: "Why TypeScript? Setting up your environment." },
//       { title: "Module 1: Basic Types", description: "Learn about string, number, boolean, array, and tuples." },
//       { title: "Module 2: Functions and Interfaces", description: "Create reusable and typed functions with interfaces." },
//       { title: "Module 3: Classes & Objects", description: "Apply object-oriented principles in TypeScript." },
//       { title: "Module 4: Type Inference and Advanced Types", description: "Understand type inference, unions, intersections, and type aliases." },
//     ],
//     instructor: {
//       name: "Sarah Lin",
//       role: "Senior Software Engineer",
//       description: "Sarah is a full-stack developer specializing in modern JavaScript and TypeScript with over 8 years of experience.",
//       image: "https://example.com/images/sarah-lin.jpg"
//     }
//   },

//   {
//     title: "Advanced TypeScript Patterns",
//     description: "Deep dive into generics, decorators, and advanced typing strategies.",
//     overview: "This course is for developers familiar with TypeScript looking to explore advanced features and patterns in enterprise-grade apps.",
//     syllabus: [
//       { title: "Introduction", description: "Scope of advanced TypeScript and review of foundational concepts." },
//       { title: "Module 1: Generics in Practice", description: "Implement generic functions and classes effectively." },
//       { title: "Module 2: Utility Types", description: "Use built-in utility types to reduce boilerplate code." },
//       { title: "Module 3: Custom Decorators", description: "Create and apply decorators in TypeScript projects." },
//       { title: "Module 4: Design Patterns", description: "Leverage patterns like Factory, Singleton, and Observer." }
//     ],
//     instructor: {
//       name: "Daniel Kross",
//       role: "Lead Frontend Architect",
//       description: "Daniel designs scalable front-end systems with a strong emphasis on maintainability and type safety.",
//       image: "https://example.com/images/daniel-kross.jpg"
//     }
//   },

//   {
//     title: "TypeScript with React",
//     description: "Build scalable React applications using TypeScript for strong typing and developer safety.",
//     overview: "A practical course combining TypeScript with modern React, covering props, state, hooks, and component patterns.",
//     syllabus: [
//       { title: "Introduction", description: "Why TypeScript with React? Project setup and tools." },
//       { title: "Module 1: Typing Props and State", description: "Use interfaces and types with components." },
//       { title: "Module 2: Hooks with TypeScript", description: "Implement typed useState, useEffect, and custom hooks." },
//       { title: "Module 3: Context & Reducers", description: "Manage global state with Context API and useReducer." },
//       { title: "Module 4: Patterns & Testing", description: "Best practices for scalable React+TS codebases." }
//     ],
//     instructor: {
//       name: "Maya Chen",
//       role: "React Developer & Educator",
//       description: "Maya teaches modern React development with a focus on TypeScript and clean code practices.",
//       image: "https://example.com/images/maya-chen.jpg"
//     }
//   },

//   {
//     title: "Node.js with TypeScript",
//     description: "Create robust backend APIs using Node.js and TypeScript.",
//     overview: "This course walks you through building Express.js APIs with TypeScript, including validation, middlewares, and testing.",
//     syllabus: [
//       { title: "Introduction", description: "Setting up Node.js with TypeScript." },
//       { title: "Module 1: Express with TS", description: "Typing routes, requests, and responses." },
//       { title: "Module 2: Middlewares", description: "Implement and type middleware functions." },
//       { title: "Module 3: Validation & Errors", description: "Use Zod or Yup for input validation." },
//       { title: "Module 4: Testing APIs", description: "Unit and integration testing using Jest." }
//     ],
//     instructor: {
//       name: "Luis Ortega",
//       role: "Backend Engineer",
//       description: "Luis builds fast and scalable APIs and is passionate about developer tooling and testing.",
//       image: "https://example.com/images/luis-ortega.jpg"
//     }
//   },

//   {
//     title: "TypeScript in Monorepos",
//     description: "Manage TypeScript projects at scale using Nx, Turborepo, and modern tooling.",
//     overview: "Understand how to structure large-scale applications with TypeScript in a monorepo setup.",
//     syllabus: [
//       { title: "Introduction", description: "What are monorepos? Advantages & challenges." },
//       { title: "Module 1: Setting Up with Nx", description: "Create a workspace and structure applications." },
//       { title: "Module 2: Type Sharing", description: "Use libraries to share types across projects." },
//       { title: "Module 3: Build & Lint Pipelines", description: "Maintain consistency and enforce standards." },
//       { title: "Module 4: CI/CD Integration", description: "Deploy and test using GitHub Actions." }
//     ],
//     instructor: {
//       name: "Amara Smith",
//       role: "DevOps & TypeScript Specialist",
//       description: "Amara focuses on TypeScript infrastructure and developer experience in large organizations.",
//       image: "https://example.com/images/amara-smith.jpg"
//     }
//   },

//   {
//     title: "Functional Programming in TypeScript",
//     description: "Explore functional concepts like immutability, higher-order functions, and monads in TypeScript.",
//     overview: "Take your JavaScript to the next level using TypeScript to write functional, pure, and reusable code.",
//     syllabus: [
//       { title: "Introduction", description: "Why functional programming? Core principles." },
//       { title: "Module 1: Immutability & Pure Functions", description: "Avoid side effects and ensure predictability." },
//       { title: "Module 2: Higher-Order Functions", description: "Compose and reuse logic with map, filter, reduce." },
//       { title: "Module 3: Currying & Composition", description: "Build flexible code using functional techniques." },
//       { title: "Module 4: FP Libraries", description: "Intro to fp-ts and practical examples." }
//     ],
//     instructor: {
//       name: "Jonas Reaves",
//       role: "Functional Programmer",
//       description: "Jonas has been building functional-first web applications using TypeScript and Scala.",
//       image: "https://example.com/images/jonas-reaves.jpg"
//     }
//   },

//   {
//     title: "TypeScript with GraphQL",
//     description: "Build typed GraphQL APIs and clients using TypeScript and tools like Apollo.",
//     overview: "From schema definitions to consuming APIs in frontend apps, this course covers end-to-end GraphQL in TypeScript.",
//     syllabus: [
//       { title: "Introduction", description: "Intro to GraphQL and typed schemas." },
//       { title: "Module 1: Schema and Resolvers", description: "Type-safe backend using code-first GraphQL." },
//       { title: "Module 2: Apollo Client Setup", description: "Typed queries and mutations in the frontend." },
//       { title: "Module 3: Error Handling", description: "Gracefully handle GraphQL errors and validation." },
//       { title: "Module 4: Tooling & Caching", description: "Use GraphQL Codegen and manage caching strategies." }
//     ],
//     instructor: {
//       name: "Riya Nair",
//       role: "Full Stack Engineer",
//       description: "Riya creates full stack apps with a strong emphasis on type safety and API contract-first development.",
//       image: "https://example.com/images/riya-nair.jpg"
//     }
//   },

//   {
//     title: "Testing TypeScript Applications",
//     description: "Learn how to write reliable unit, integration, and E2E tests in TypeScript.",
//     overview: "Master the art of test-driven development and automated testing workflows in TypeScript projects.",
//     syllabus: [
//       { title: "Introduction", description: "Why testing matters? Overview of testing layers." },
//       { title: "Module 1: Unit Testing", description: "Test functions, classes, and services using Jest." },
//       { title: "Module 2: Integration Testing", description: "Test API endpoints and component integration." },
//       { title: "Module 3: E2E Testing", description: "Use Playwright or Cypress for end-to-end workflows." },
//       { title: "Module 4: Mocking & CI", description: "Mock dependencies and set up test automation." }
//     ],
//     instructor: {
//       name: "Noah Patel",
//       role: "QA Automation Engineer",
//       description: "Noah has worked with top tech firms to establish comprehensive testing strategies.",
//       image: "https://example.com/images/noah-patel.jpg"
//     }
//   },

//   {
//     title: "Building UI Libraries with TypeScript",
//     description: "Develop reusable UI components using TypeScript and tools like Storybook.",
//     overview: "Learn to design, type, test, and publish reusable UI libraries for scalable front-end systems.",
//     syllabus: [
//       { title: "Introduction", description: "UI design systems and why they matter." },
//       { title: "Module 1: Component Architecture", description: "Structure, types, and style separation." },
//       { title: "Module 2: Props and Slots", description: "Flexible component interfaces." },
//       { title: "Module 3: Storybook Integration", description: "Document and test visually with Storybook." },
//       { title: "Module 4: Publishing & Versioning", description: "Publish to npm and manage updates." }
//     ],
//     instructor: {
//       name: "Elena Kovacs",
//       role: "UI Engineer",
//       description: "Elena specializes in building design systems and accessible UI libraries using TypeScript.",
//       image: "https://example.com/images/elena-kovacs.jpg"
//     }
//   },

//   {
//     title: "Migrating JavaScript Projects to TypeScript",
//     description: "Step-by-step guide for safely converting existing JavaScript projects into TypeScript.",
//     overview: "Learn strategies and tools for gradual migration, ensuring stability and productivity during the transition.",
//     syllabus: [
//       { title: "Introduction", description: "Why migrate? What to expect and how to plan." },
//       { title: "Module 1: TypeScript Configuration", description: "Set up `tsconfig.json` and build tools." },
//       { title: "Module 2: JS to TS Conversion", description: "Rename files and fix common issues." },
//       { title: "Module 3: Incremental Typing", description: "Add types gradually with JSDoc and TS files." },
//       { title: "Module 4: Refactoring and Linting", description: "Clean code with ESLint, Prettier, and TS rules." }
//     ],
//     instructor: {
//       name: "Tariq Abedi",
//       role: "Migration Consultant",
//       description: "Tariq helps companies adopt TypeScript with minimal disruption and maximum efficiency.",
//       image: "https://example.com/images/tariq-abedi.jpg"
//     }
//   }
// ];
