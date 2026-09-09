import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import App from "../App";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { PublicProfilePage } from "../pages/PublicProfilePage";
import { TutorSearchPage } from "../pages/TutorSearchpage";
import { TutorDetailPage } from "../pages/TutorDetailPage";
import { TutorAvailabilityPage } from "../pages/TutorAvailabilityPage";
import { TutorDashboardPage } from "../pages/TutorDashboardPage";
import { BookingsPage } from "../pages/BookingsPage";
import { ChatPage } from "../pages/ChatPage";
import { MyReviewsPage } from "../pages/MyReviewsPage";
import { GuestRoute, ProtectedRoute } from "./ProtectedRoute";

const UnauthorizedPage = () => (
  <div className="content-page narrow-page">
    <p className="eyebrow">Accesso negato</p>
    <h1>Non puoi entrare in questa pagina.</h1>
    <p className="lead">
      Il tuo ruolo non dispone dei permessi necessari per questa area.
    </p>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/tutors/:id"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <TutorDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutors/search"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <TutorSearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <PublicProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["tutor"]}>
                  <TutorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/mine"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyReviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor/availability"
              element={
                <ProtectedRoute allowedRoles={["tutor"]}>
                  <TutorAvailabilityPage />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
