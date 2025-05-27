import { ChartConfig } from "@/components/ui/chart";

export const chartData = [
  { month: "March", In_Progress: 237, In_Review: 120, On_Hold: 70, Completed: 150, Development: 180, Testing: 70, Bugs: 37 },
  { month: "April", In_Progress: 73, In_Review: 190, On_Hold: 30, Completed: 100, Development: 120, Testing: 60, Bugs: 33 },
  { month: "May", In_Progress: 209, In_Review: 130, On_Hold: 60, Completed: 140, Development: 160, Testing: 65, Bugs: 29 },
  { month: "June", In_Progress: 214, In_Review: 140, On_Hold: 80, Completed: 160, Development: 170, Testing: 75, Bugs: 34 },
  { month: "July", In_Progress: 250, In_Review: 150, On_Hold: 65, Completed: 170, Development: 190, Testing: 80, Bugs: 35 },
  { month: "August", In_Progress: 190, In_Review: 100, On_Hold: 45, Completed: 130, Development: 140, Testing: 55, Bugs: 30 },
  { month: "September", In_Progress: 270, In_Review: 180, On_Hold: 85, Completed: 190, Development: 200, Testing: 90, Bugs: 45 },
  { month: "October", In_Progress: 150, In_Review: 110, On_Hold: 55, Completed: 140, Development: 130, Testing: 60, Bugs: 30 },
  { month: "November", In_Progress: 230, In_Review: 160, On_Hold: 75, Completed: 180, Development: 180, Testing: 80, Bugs: 40 },
  { month: "December", In_Progress: 200, In_Review: 140, On_Hold: 60, Completed: 160, Development: 150, Testing: 70, Bugs: 35 },
];

export const chartConfig: ChartConfig = {
  In_Progress: { label: "In Progress", color: "#9d9bfe" },
  In_Review: { label: "In Review", color: "#ECA7FE" },
  On_Hold: { label: "On Hold", color: "#F6BC54" },
  Completed: { label: "Completed", color: "#5DD66A" },
};

export const categoryChartConfig: ChartConfig = {
  Development: { label: "Development", color: "#FF6B6B" },
  Testing: { label: "Testing", color: "#45B7D1" },
  Bugs: { label: "Bugs", color: "#96CEB4" },
};

export const tasks = [
  {
    id: 1,
    category: "Development",
    title: "Develop Backoffice panel",
    priority: "High",
    duedate: "14 Nov 2021",
    status: "In Progress",
    description: {
      summary: "Create a backoffice panel for admin users to manage content and users.",
      details: "The backoffice panel should include a dashboard with key metrics, a user management section, and content editing capabilities. Ensure the UI is responsive and follows the design system.",
      acceptanceCriteria: [
        "Dashboard displays real-time metrics (e.g., user count, active sessions).",
        "User management allows CRUD operations.",
        "Content editing supports rich text and media uploads.",
        "Responsive design works on mobile and desktop.",
      ],
      notes: "Coordinate with the design team for UI components. Use Next.js for the frontend and Node.js for the backend."
    },
  },
  {
    id: 2,
    category: "Development",
    title: "Implement API endpoints",
    priority: "Medium",
    duedate: "15 Nov 2021",
    status: "In Review",
    description: {
      summary: "Develop RESTful API endpoints for the backoffice panel.",
      details: "Implement endpoints for user authentication, content retrieval, and data updates. Ensure endpoints are secure with JWT authentication and follow REST best practices.",
      acceptanceCriteria: [
        "Endpoints support GET, POST, PUT, DELETE operations.",
        "JWT authentication is implemented.",
        "Error handling returns appropriate status codes.",
        "API documentation is updated in Swagger.",
      ],
      notes: "Test endpoints with Postman before review. Ensure rate limiting is applied."
    },
  },
  {
    id: 3,
    category: "Development",
    title: "Optimize database queries",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Improve performance of database queries for the backoffice panel.",
      details: "Analyze slow queries using database profiling tools. Optimize indexes and rewrite queries to reduce execution time. Focus on user and content retrieval queries.",
      acceptanceCriteria: [
        "Query execution time reduced by at least 30%.",
        "Indexes are added for frequently queried fields.",
        "No performance regressions in existing features.",
      ],
      notes: "Use EXPLAIN to analyze query plans. Document changes in the database schema."
    },
  },
  // Add descriptions for remaining tasks following the same structure
  {
    id: 4,
    category: "Testing",
    title: "Test user authentication",
    priority: "High",
    duedate: "14 Nov 2021",
    status: "In Progress",
    description: {
      summary: "Perform comprehensive testing of user authentication flows.",
      details: "Test login, logout, password reset, and session management. Include edge cases like invalid credentials and expired tokens.",
      acceptanceCriteria: [
        "All authentication flows pass unit and integration tests.",
        "Edge cases are handled with appropriate error messages.",
        "Test coverage exceeds 90% for authentication module.",
      ],
      notes: "Use Jest for unit tests and Cypress for end-to-end tests."
    },
  },
  {
    id: 5,
    category: "Testing",
    title: "Run performance tests",
    priority: "High",
    duedate: "15 Nov 2021",
    status: "On Hold",
    description: {
      summary: "Conduct performance tests for the backoffice panel.",
      details: "Simulate high user load to identify bottlenecks. Test API response times and database query performance under stress.",
      acceptanceCriteria: [
        "API response times remain under 200ms for 95% of requests.",
        "System handles 1000 concurrent users without crashing.",
        "Performance report is generated and shared.",
      ],
      notes: "Use JMeter for load testing. On hold until API endpoints are finalized."
    },
  },
  // Add similar descriptions for tasks 6-18
  {
    id: 6,
    category: "Testing",
    title: "Validate UI responsiveness",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Ensure the backoffice panel UI is responsive across devices.",
      details: "Test the UI on various screen sizes, including mobile, tablet, and desktop. Verify that all components adapt correctly and maintain usability.",
      acceptanceCriteria: [
        "UI renders correctly on screen widths from 320px to 1920px.",
        "All interactive elements remain accessible.",
        "No visual regressions compared to design mockups.",
      ],
      notes: "Use BrowserStack for cross-device testing."
    },
  },
  {
    id: 7,
    category: "Bugs",
    title: "Fix login crash issue",
    priority: "High",
    duedate: "14 Nov 2021",
    status: "In Review",
    description: {
      summary: "Resolve application crash during login attempts.",
      details: "Investigate the root cause of crashes when users attempt to log in with invalid credentials. Likely related to unhandled exceptions in the authentication module.",
      acceptanceCriteria: [
        "Login with invalid credentials displays an error message.",
        "Application remains stable with no crashes.",
        "Fix is verified with automated tests.",
      ],
      notes: "Check server logs for stack traces. Reproduce issue in staging environment."
    },
  },
  {
    id: 8,
    category: "Bugs",
    title: "Optimize User Experience",
    priority: "High",
    duedate: "15 Nov 2021",
    status: "In Progress",
    description: {
      summary: "Enhance UX for the backoffice panel.",
      details: "Address user feedback about slow navigation and confusing workflows. Simplify menu structure and improve button visibility.",
      acceptanceCriteria: [
        "Navigation time reduced by 20%.",
        "User feedback scores improve by 15%.",
        "All buttons have consistent styling.",
      ],
      notes: "Conduct user testing sessions to validate changes."
    },
  },
  {
    id: 9,
    category: "Bugs",
    title: "Correct UI alignment bug",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Fix misalignment of UI elements in the backoffice panel.",
      details: "Correct padding and margin issues in the dashboard and user management sections. Ensure consistency across browsers.",
      acceptanceCriteria: [
        "All UI elements are aligned per design specs.",
        "Fixes are verified in Chrome, Firefox, and Safari.",
        "No new alignment issues introduced.",
      ],
      notes: "Use Tailwind CSS to standardize spacing."
    },
  },
  {
    id: 10,
    category: "Bugs",
    title: "Correct UI alignment bug",
    priority: "Medium",
    duedate: "16 Nov 2021",
    status: "On Hold",
    description: {
      summary: "Fix alignment issues in the content editing section.",
      details: "Address misaligned text inputs and buttons in the content editor. Likely caused by incorrect flexbox properties.",
      acceptanceCriteria: [
        "Text inputs and buttons are aligned correctly.",
        "Fixes are consistent across screen sizes.",
        "No performance impact from CSS changes.",
      ],
      notes: "On hold until design team approves new layout."
    },
  },
  // Placeholder for tasks 11-18 (same structure, different content)
  {
    id: 11,
    category: "Bugs",
    title: "Correct UI alignment bug",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Resolve minor alignment issues in the user profile section.",
      details: "Fix spacing between profile fields and buttons. Ensure consistency with the design system.",
      acceptanceCriteria: [
        "Profile fields are evenly spaced.",
        "Buttons align with input fields.",
        "Fixes pass visual regression tests.",
      ],
      notes: "Verify changes in dark mode."
    },
  },
  {
    id: 12,
    category: "Bugs",
    title: "Correct UI alignment bug",
    priority: "Medium",
    duedate: "16 Nov 2021",
    status: "In Progress",
    description: {
      summary: "Fix alignment of dashboard widgets.",
      details: "Correct overlapping widgets on smaller screens. Adjust grid layout to accommodate dynamic content.",
      acceptanceCriteria: [
        "Widgets display without overlap on all screen sizes.",
        "Grid layout adapts to content size.",
        "No performance degradation.",
      ],
      notes: "Test with dynamic data sets."
    },
  },
  {
    id: 13,
    category: "Bugs",
    title: "Correct UI alignment bug",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "In Review",
    description: {
      summary: "Fix alignment of footer elements.",
      details: "Correct misaligned links and icons in the footer. Ensure consistency across pages.",
      acceptanceCriteria: [
        "Footer elements are centered and spaced evenly.",
        "Fixes are consistent across all pages.",
        "No new bugs introduced.",
      ],
      notes: "Check for accessibility compliance."
    },
  },
  {
    id: 14,
    category: "Development",
    title: "Optimize database queries",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Enhance query performance for content retrieval.",
      details: "Optimize SQL queries for content search and filtering. Add caching for frequently accessed data.",
      acceptanceCriteria: [
        "Search query time reduced by 25%.",
        "Caching implemented for top 10 queries.",
        "No data consistency issues.",
      ],
      notes: "Use Redis for caching."
    },
  },
  {
    id: 15,
    category: "Development",
    title: "Optimize database queries",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "On Hold",
    description: {
      summary: "Improve query performance for user analytics.",
      details: "Optimize queries for user activity reports. Consider denormalizing data for faster access.",
      acceptanceCriteria: [
        "Report generation time reduced by 20%.",
        "No impact on database integrity.",
        "Changes documented in schema.",
      ],
      notes: "On hold until analytics requirements are finalized."
    },
  },
  {
    id: 16,
    category: "Development",
    title: "Optimize database queries",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "In Progress",
    description: {
      summary: "Optimize queries for audit logs.",
      details: "Improve performance of audit log retrieval queries. Add indexes and archive old logs.",
      acceptanceCriteria: [
        "Log retrieval time reduced by 30%.",
        "Indexes added without locking tables.",
        "Archiving process is automated.",
      ],
      notes: "Test archiving script in staging."
    },
  },
  {
    id: 17,
    category: "Testing",
    title: "Validate UI responsiveness",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "Completed",
    description: {
      summary: "Verify responsive design of user management section.",
      details: "Test the user management UI across devices. Ensure tables and forms adapt to screen size.",
      acceptanceCriteria: [
        "UI is usable on all tested devices.",
        "Tables are scrollable on mobile.",
        "No visual glitches reported.",
      ],
      notes: "Include tests for low-resolution displays."
    },
  },
  {
    id: 18,
    category: "Testing",
    title: "Validate UI responsiveness",
    priority: "Low",
    duedate: "16 Nov 2021",
    status: "In Review",
    description: {
      summary: "Test responsiveness of content editor.",
      details: "Verify that the content editor UI adapts to different screen sizes. Focus on rich text input and media uploads.",
      acceptanceCriteria: [
        "Editor is fully functional on mobile and desktop.",
        "Media uploads work without errors.",
        "UI matches design mockups.",
      ],
      notes: "Pending final approval from design team."
    },
  },
];