import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TutorSearchPage } from '../pages/TutorSearchpage';
import { TutorDetailPage } from '../pages/TutorDetailPage';
import { TutorAvailabilityPage } from '../pages/TutorAvailabilityPage';
import { BookingsPage } from '../pages/BookingsPage';
import { ChatPage } from '../pages/ChatPage';
import { MyReviewsPage } from '../pages/MyReviewsPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<App />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/tutors/:id" element={<ProtectedRoute allowedRoles={['student']}><TutorDetailPage /></ProtectedRoute>} />
                        <Route path="/tutors/search" element={<TutorSearchPage />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                        <Route path="/reviews/mine" element={<ProtectedRoute allowedRoles={['student']}><MyReviewsPage /></ProtectedRoute>} />
                        <Route path="/tutor/availability" element={<ProtectedRoute allowedRoles={['tutor']}><TutorAvailabilityPage /></ProtectedRoute>} />
                        <Route path="*" element={<HomePage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
