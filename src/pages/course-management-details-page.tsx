import {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import {Button, Form, Input, Spin, App, Card} from 'antd';
import {CourseManagement} from '../models/course-management-model';
import courseManagementService from '../services/course-management-service';

interface CourseManagementDetailsPageProps {
  isEdit: boolean
}

export const CourseManagementDetailsPage = (props: CourseManagementDetailsPageProps) => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {modal} = App.useApp();
  const [form] = Form.useForm();
  const [isReadonly, setIsReadonly] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCourse = useCallback(async () => {
    try {
      setLoading(true);
      const course = await courseManagementService.getCourseById(Number(id));
      form.setFieldsValue({
        title: course.title,
        description: course.description,
        duration: course.duration
      });
      setIsReadonly(course.status === 'ARCHIVED');
    } catch (error) {
      modal.error({
        title: 'Error',
        content: error.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  }, [id, form, modal]);

  useEffect(() => {
    if (!props.isEdit) return;
    loadCourse();
  }, [loadCourse, props.isEdit]);

  const onFinish = async (values: Partial<CourseManagement>) => {
    if (props.isEdit) {
      await editExistingCourse(values);
    } else {
      await createNewCourse(values);
    }
  };

  const editExistingCourse = async (values: Partial<CourseManagement>) => {
    try {
      setLoading(true);
      await courseManagementService.updateCourse(Number(id), values);
      modal.success({
        title: 'Success',
        content: 'Course updated successfully',
      });
      navigate('/');
    } catch (error) {
      modal.error({
        title: 'Error',
        content: error.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewCourse = async (values: Partial<CourseManagement>) => {
    try {
      setLoading(true);
      await courseManagementService.createCourse(values);
      modal.success({
        title: 'Success',
        content: 'Course created successfully',
      });
      navigate('/');
    } catch (error) {
      modal.error({
        title: 'Error',
        content: error.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 800, margin: '0 auto', padding: '24px'}}>
      <Card title="Edit Course">
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{required: true, message: 'Please input the title!'}]}
            >
              <Input disabled={isReadonly}/>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{required: true, message: 'Please input the description!'}]}
            >
              <Input.TextArea rows={4} disabled={isReadonly}/>
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
            >
              <Input disabled={isReadonly}/>
            </Form.Item>

            <Form.Item>
              <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                <Button onClick={() => navigate('/')}>
                  Cancel
                </Button>
                {!isReadonly && (
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};