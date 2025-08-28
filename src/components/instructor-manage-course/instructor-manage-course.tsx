import { Box, Button, Flex, FormLabel, Icon, Stack, Text } from '@chakra-ui/react';
import { Form, Formik, FormikValues } from 'formik';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { GiSave } from 'react-icons/gi';
import 'react-quill/dist/quill.snow.css';
import { courseCategory, courseLevel, courseLng, coursePrice } from 'src/config/constants';
import { editorModules } from 'src/config/editor.config';
import { loadImage } from 'src/helpers/image.helper';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { CourseType } from 'src/interfaces/course.interface';
import { FileService } from 'src/services/file.service';
import { CourseValidation, manageCourseValues } from 'src/validations/course.validation';
import ErrorAlert from '../error-alert/error-alert';
import SelectField from '../select-field/select-field';
import TagField from '../tag-field/tag-field';
import TextAreaField from '../text-area-field/text-area-field';
import TextFiled from '../text-filed/text-filed';
import { InstructorManageCourseProps } from './instructor-manage-course.props';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const InstructorManageCourse = ({
	submitHandler,
	titleBtn,
	courseValues,
}: InstructorManageCourseProps) => {
	const [file, setFile] = useState<File | string | null>();
	const [errorFile, setErrorFile] = useState('');
	const [initialValues, setInitialValues] = useState(manageCourseValues);

	const { error, isLoading } = useTypedSelector(state => state.course);
	const { t } = useTranslation();
	const { clearCourseError, startLoading } = useActions();

	const handleChange = (file: File) => {
		setFile(file);
	};

	const onSubmit = async (formValues: FormikValues) => {
		if (!file) {
			setErrorFile('Preview image is required');
			return;
		}
		let imageUrl = file;
		if (typeof file !== 'string') {
			startLoading();
			const formData = new FormData();
			formData.append('image', file as File);
			const response = await FileService.fileUpload(formData, 'preview-image');
			imageUrl = response.url;
		}
		const data = { ...formValues, previewImage: imageUrl } as CourseType;
		submitHandler(data);
	};

	useEffect(() => {
		if (courseValues) {
			setInitialValues(courseValues);
			setFile(courseValues.previewImage);
		}
	}, [courseValues]);

	return (
		<>
			<Formik
				onSubmit={onSubmit}
				initialValues={initialValues}
				validationSchema={CourseValidation.create}
				enableReinitialize
			>
				{formik => (
					<Form>
						<Flex mt={12} gap={4}>
							<Box w={'70%'}>
								<Stack spacing={5}>
									<TextFiled name='title' label={t('title', { ns: 'instructor' })} />
									<TextAreaField
										name='exerpt'
										height={'150px'}
										label={t('excerpt', { ns: 'instructor' }) || 'Exerpt'}
									/>
									<TagField
										label={t('what_students_will_learn', { ns: 'instructor' })}
										name='learn'
										values={formik.values.learn}
										placeholder=''
										formik={formik}
										errorMessage={formik.touched.learn ? (formik.errors.learn as string) : ''}
									/>
									<TagField
										label={t('requirements', { ns: 'instructor' })}
										name='requirements'
										values={formik.values.requirements}
										placeholder=''
										formik={formik}
										errorMessage={
											formik.touched.requirements ? (formik.errors.requirements as string) : ''
										}
									/>
									<TagField
										label={t('course_tags', { ns: 'instructor' })}
										name='tags'
										values={formik.values.tags}
										placeholder='JavaScript...'
										formik={formik}
										errorMessage={formik.touched.tags ? (formik.errors.tags as string) : ''}
									/>
									<Box>
										<FormLabel mb={3}>
											{t('description', { ns: 'instructor' })}{' '}
											<Box as={'span'} color={'red.300'}>
												*
											</Box>
										</FormLabel>
										<ReactQuill
											modules={editorModules}
											onChange={data => formik.setFieldValue('description', data)}
											value={formik.values.description}
										/>
										{formik.errors.description && formik.touched.description && (
											<Text mt={2} fontSize='14px' color='red.500'>
												{formik.errors.description as string}
											</Text>
										)}
									</Box>
									<>
										{error && (
											<ErrorAlert title={error as string} clearHandler={clearCourseError} />
										)}
									</>
									<Button
										w={'full'}
										type={'submit'}
										h={14}
										colorScheme={'blue'}
										rightIcon={<GiSave />}
										isLoading={isLoading}
										loadingText={`${t('loading', { ns: 'global' })}`}
									>
										{titleBtn}
									</Button>
								</Stack>
							</Box>
							<Box w={'30%'}>
								<Stack spacing={5}>
									<SelectField
										name='level'
										label={t('level', { ns: 'instructor' })}
										placeholder='-'
										arrOptions={courseLevel}
									/>
									<SelectField
										name='category'
										label={t('category', { ns: 'instructor' })}
										placeholder='-'
										arrOptions={courseCategory}
									/>
									<SelectField
										name='price'
										label={t('price', { ns: 'instructor' })}
										placeholder='-'
										arrOptions={coursePrice}
									/>
									<SelectField
										name='language'
										label={t('language', { ns: 'instructor' })}
										placeholder='-'
										arrOptions={courseLng}
									/>
									<FormLabel>
										{t('course_preview_image', { ns: 'instructor' })}{' '}
										<Box as={'span'} color={'red.300'}>
											*
										</Box>
									</FormLabel>
									{file ? (
										<Box pos={'relative'} w={'full'} h={200}>
											<Image
												src={
													typeof file === 'string'
														? loadImage(file as string)
														: URL.createObjectURL(file)
												}
												alt={'preview image'}
												fill
												style={{ objectFit: 'cover', borderRadius: '8px' }}
											/>
											<Icon
												as={FaTimes}
												fontSize={20}
												pos={'absolute'}
												right={2}
												top={2}
												cursor={'pointer'}
												onClick={() => setFile(null)}
											/>
										</Box>
									) : (
										<Box>
											<FileUploader
												handleChange={handleChange}
												name='file'
												types={['JPG', 'PNG', 'GIF']}
												style={{ minWidth: '100%' }}
											/>
											{errorFile && (
												<Text mt={2} fontSize='14px' color='red.500'>
													{errorFile}
												</Text>
											)}
										</Box>
									)}
								</Stack>
							</Box>
						</Flex>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default InstructorManageCourse;
