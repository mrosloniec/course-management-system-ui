import {useCallback, useEffect, useState} from "react";

import courseManagementService from "../services/course-management-service";
import {Button, Space, Table, TablePaginationConfig, App, Dropdown, MenuProps} from "antd";
import {CourseManagement} from "../models/course-management-model";
import {ColumnsType} from "antd/es/table";
import {FilterValue} from "antd/es/table/interface";
import { SendOutlined, NotificationOutlined, MailOutlined, DownOutlined, StopOutlined, FileZipOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router";
import {StatusesMapping} from "../utils/constants";

export const CourseManagementListPage = () => {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const [coursesList, setCoursesList] = useState<CourseManagement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredStatus, setFilteredStatus] = useState<string>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    position: ["bottomCenter"],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
  });

  const loadReports = useCallback(async (
    status?: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    try {
      setLoading(true);
      const response= await courseManagementService.getAllCourses(
        status,
        page,
        pageSize
      );
      setCoursesList(response.content);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response.page.totalElements
      }));
    } catch (error) {
      modal.error({
        title: 'Error',
        content: error.message,
      })
    } finally {
      setLoading(false)
    }
  }, []);

  const handleEdit = useCallback((id: number) => {
    navigate(`/${id}`);
  }, [navigate]);

  async function handleStatusChange(id: number, status: string) {
    try {
      setLoading(true);
      await courseManagementService.updateCourseStatus(id, status);
      // Reload the current page
      await loadReports(
        filteredStatus,
        pagination.current,
        pagination.pageSize
      );
    } catch (error) {
      modal.error({
        title: 'Error',
        content: error.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDraftStatus = async (id: number) => await handleStatusChange(id, 'DRAFT');
  const handleReviewStatus = async (id: number) => await handleStatusChange(id, 'REVIEW');
  const handleCancelStatus = async (id: number) => await handleStatusChange(id, 'CANCELLED');
  const handlePublishedStatus = async (id: number) => await handleStatusChange(id, 'ARCHIVED');

  const handlePublish = useCallback((id: number) => {
    modal.confirm({
      title: 'Are you sure you want to publish this course?',
      content: 'Once published the course is going to be visible',
      okText: 'Yes, publish',
      okType: 'success',
      cancelText: 'No, cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await courseManagementService.publishCourse(id);
          // Reload the current page
          loadReports(
            filteredStatus,
            pagination.current,
            pagination.pageSize
          );
        } catch (error) {
          modal.error({
            title: 'Error',
            content: error.response?.data?.message
          });
        } finally {
          setLoading(false);
        }
      }
    });
  }, [modal, filteredStatus, pagination.current, pagination.pageSize, loadReports]);

  useEffect(() => {
    loadReports(
      filteredStatus,
      pagination.current,
      pagination.pageSize
    );
  }, [loadReports, filteredStatus, pagination.current, pagination.pageSize]);

  const handleTableChange = useCallback((
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    const statusFilter = filters.status?.[0] as string | undefined;
    setFilteredStatus(statusFilter);
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  }, []);

  const newMenuDropdown = (recordId: number): MenuProps['items'] => [
    {
      label: 'Draft',
      key: '1',
      icon: <MailOutlined />,
      onClick: () => handleDraftStatus(recordId)
    },
    {
      label: 'Review',
      key: '2',
      icon: <NotificationOutlined />,
      onClick: () => handleReviewStatus(recordId)
    },
    {
      label: 'Cancel',
      key: '3',
      icon: <StopOutlined />,
      onClick: () => handleCancelStatus(recordId)
    },
  ]

  const draftMenuDropdown = (recordId: number): MenuProps['items'] => [
    {
      label: 'Review',
      key: '1',
      icon: <NotificationOutlined />,
      onClick: () => handleReviewStatus(recordId)
    },
    {
      label: 'Cancel',
      key: '2',
      icon: <StopOutlined />,
      onClick: () => handleCancelStatus(recordId)
    },
  ];

  const reviewMenuDropdown = (recordId: number): MenuProps['items'] => [
    {
      label: 'Draft',
      key: '1',
      icon: <MailOutlined />,
      onClick: () => handleDraftStatus(recordId)
    },
    {
      label: 'Publish',
      key: '2',
      icon: <SendOutlined />,
      onClick: () => handlePublish(recordId)
    },
    {
      label: 'Cancel',
      key: '3',
      icon: <StopOutlined />,
      onClick: () => handleCancelStatus(recordId)
    },
  ];

  const publishedMenuDropdown = (recordId: number): MenuProps['items'] => [
    {
      label: 'Archive',
      key: '1',
      icon: <FileZipOutlined />,
      onClick: () => handlePublishedStatus(recordId)
    },
  ];

  const getMenuItems = (status: string, recordId: number): MenuProps['items'] => {
    switch (status) {
      case 'NEW':
        return newMenuDropdown(recordId);
      case 'DRAFT':
        return draftMenuDropdown(recordId);
      case 'REVIEW':
        return reviewMenuDropdown(recordId);
      case 'PUBLISHED':
        return publishedMenuDropdown(recordId);
      default:
        return [];
    }
  };

  const columns: ColumnsType<CourseManagement> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <a onClick={() => handleEdit(record.id)}>{record.title}</a>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Published At',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (_, record) => {
        return record.status === 'PUBLISHED' ? new Date(record.publishedAt).toLocaleDateString() : '';
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: Array.from(StatusesMapping.entries()).map(([key, value]) => ({
        text: value,
        value: key
      })),
      render: (status: string) => StatusesMapping.get(status) || status,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => {
        const menuItems = getMenuItems(record.status, record.id);
        return menuItems.length > 0 && (
            <Space size="middle">
              <Dropdown menu={{items: menuItems}}>
                <Button>
                  <Space>
                    Actions <DownOutlined/>
                  </Space>
                </Button>
              </Dropdown>
            </Space>
        );
      },
    }
  ];

  return (
    <Table<CourseManagement>
      dataSource={coursesList}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};