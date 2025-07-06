import axios from 'axios';
import {Constants} from "../utils/constants";
import {CourseManagement} from "../models/course-management-model";
import {PaginatedResponse} from "../models/paginated-response";

class CourseManagementService {

  // Fetch all courses
  async getAllCourses(
    status?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<CourseManagement>> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}`;
    const params = { status, page: page - 1, size: pageSize };
    const response = await axios.get(url, {params});
    return response.data;
  }

  // Fetch a single course by ID
  async getCourseById(courseId: number): Promise<CourseManagement> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}/${courseId}`;
    const response = await axios.get(url);
    return response.data;
  }

  // Create new course
  async createCourse(courseData: Partial<CourseManagement>): Promise<CourseManagement> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}`;
    const response = await axios.post(url, courseData);
    return response.data;
  }

  // Edit a course by ID
  async updateCourse(courseId: number, courseData: Partial<CourseManagement>): Promise<CourseManagement> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}/${courseId}`;
    const response = await axios.put(url, courseData);
    return response.data;
  }

  // Edit a course status
  async updateCourseStatus(courseId: number, status: string): Promise<CourseManagement> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}/${courseId}/status`;
    const response = await axios.patch(url, status, {headers: { 'Content-Type': 'application/json' }});
    return response.data;
  }

  // Edit a course by ID
  async publishCourse(courseId: number): Promise<CourseManagement> {
    const url = `${Constants.BASE_URL}/${Constants.COURSES_URL}/${courseId}/publish`;
    const response = await axios.patch(url);
    return response.data;
  }
}

const courseManagementService = new CourseManagementService();

export default courseManagementService;
