import {createBrowserRouter, RouterProvider} from "react-router";
import {CourseManagementListPage} from "../../pages/course-management-list-page";
import {CourseManagementDetailsPage} from "../../pages/course-management-details-page";
import {App} from "../../app";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        path: "",
        index: true,
        element: <CourseManagementListPage />
      },
      {
        path: "/new",
        element: <CourseManagementDetailsPage isEdit={false}/>
      },
      {
        path: "/:id",
        element: <CourseManagementDetailsPage isEdit={true}/>
      }
    ]
  },
]);

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  );
};


export default AppRouter;