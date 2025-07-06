export const Constants = {
  BASE_URL: 'http://localhost:8080/v1',
  COURSES_URL: 'courses'
}

export const StatusesMapping = new Map<string, string>([
  ["NEW", "New"],
  ["DRAFT", "Draft"],
  ["REVIEW", "Review"],
  ["PUBLISHED", "Published"],
  ["CANCELLED", "Cancelled"],
  ["ARCHIVED", "Archived"],
]);
