import axios from 'axios';
import $axios from 'src/api/axios';
import { API_URL, getAdminUrl, getCourseUrl } from 'src/config/api.config';
import { CourseType } from 'src/interfaces/course.interface';
import { InstructorType } from 'src/interfaces/instructor.interface';
import { UserType } from 'src/interfaces/user.interface';

export const AdminService = {

	async pushStudentCourse(courseId: string, email: string) {
		const { data } = await axios.post(`${API_URL}${getAdminUrl('push-student')}`, {
			courseId,
			email,
		});
		return data;
	},
	
	async getAllCourses() {
		const { data } = await axios.get<CourseType[]>(
			`${API_URL}${getCourseUrl('admin-all-courses')}`
		);

		return data;
	},
	async getAllInstructors(token?: string) {
		const { data } = await axios.get<InstructorType[]>(
			`${API_URL}${getAdminUrl('all-instructors')}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return data;
	},
	async approveInstructor(instructorId: string) {
		const { data } = await $axios.put<'Success'>(`${getAdminUrl('approve-instructor')}`, {
			instructorId,
		});

		return data;
	},

	async deleteInstructor(instructorId: string) {
		const { data } = await $axios.put<'Success'>(`${getAdminUrl('delete-instructor')}`, {
			instructorId,
		});

		return data;
	},

	async getUsers(limit: string, token?: string) {
		const { data } = await axios.get<UserType[]>(`${API_URL}${getAdminUrl('all-users')}`, {
			params: { limit },
			headers: { Authorization: `Bearer ${token}` },
		});

		return data;
	},

	async searchUsers(query: string, limit: string) {
		const { data } = await $axios.get<UserType[]>(`${getAdminUrl('search-users')}`, {
			params: { email: query, limit },
		});

		return data;
	},

	async deleteCourse(courseId: string) {
		const { data } = await $axios.delete<CourseType[]>(`${getAdminUrl('delete-course')}`, {
			params: { courseId },
		});

		return data;
	},
};
