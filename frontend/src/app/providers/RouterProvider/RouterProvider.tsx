import { RootLayout } from "@/app/layout/RootLayout/RootLayout";
import { LoginPage, RegisterPage } from "@/pages/auth/ui";
import { CommentsPage } from "@/pages/comment/ui/CommentsPage/CommentsPage";
import { OrderedPartsPage } from "@/pages/ordered-part/ui/OrderedPartsPage/OrderedPartsPage";
import { RequestDetailPageWrapper } from "@/pages/request/ui/RequestDetailPage/RequestDetailPage";
import { RequestPage } from "@/pages/request/ui/RequestPage/RequestPage";
import { StatisticsPage } from "@/pages/statistic/ui/StatisticsPage/StatisticsPage";
import { UsersManagementPage } from "@/widgets/user/ui/UsersManagementPage/UsersManagementPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { RequireAuth } from "../RequireAuth/RequireAuth";

export const RouterProvider = () => {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<RequestPage />} />
          <Route path="/request/:requestId" element={<RequestDetailPageWrapper />} />
          <Route path="/users" element={<UsersManagementPage />} />
          <Route path="statistics" element={<StatisticsPage />} />

            {/* <Route path="notifications" element={<NotificationsPage />} /> */}

            <Route path="parts" element={<OrderedPartsPage />} />

            <Route path="comments" element={<CommentsPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
)}