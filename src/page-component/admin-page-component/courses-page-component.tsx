import { Box, Card, CardBody, Flex, Grid, HStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { AdminCourseCard, ErrorAlert } from 'src/components';
import SectionTitle from 'src/components/section-title/section-title';
import { useActions } from 'src/hooks/useActions';
import { useAuth } from 'src/hooks/useAuth';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { LaunchCourseIcon } from 'src/icons';
import { CourseType } from 'src/interfaces/course.interface';

const CoursesPageComponent = () => {
	const { courses } = useTypedSelector(state => state.admin);
	const { error } = useTypedSelector(state => state.admin);
	const { clearAdminError } = useActions();
	const { t } = useTranslation();

	return (
		<>
			<Card mt={10}>
				<CardBody>
					<HStack>
						<Box w={'30%'}>
							<SectionTitle
								title={t('courses_section_title', { ns: 'admin' })}
								subtitle={t('courses_section_descr', { ns: 'admin' })}
							/>
						</Box>
						<Flex w={'70%'} justify={'flex-end'}>
							<LaunchCourseIcon />
						</Flex>
					</HStack>
				</CardBody>
			</Card>
			<>{error && <ErrorAlert title={error as string} clearHandler={clearAdminError} />}</>
			<Grid gridTemplateColumns={'repeat(3, 1fr)'} gap={4}>
				{courses.map(c => (
					<AdminCourseCard key={c._id} course={c} />
				))}
			</Grid>
		</>
	);
};

export default CoursesPageComponent;
