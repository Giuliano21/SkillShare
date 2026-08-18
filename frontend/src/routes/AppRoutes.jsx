import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/tutor/availability" element={
                        <ProtectedRoute allowedRoles={['tutor']}>
                            <TutorAvailabilityForm />
                        </ProtectedRoute>
                    } />

                    <Route path="/tutors/search" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <TutorSearchPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/tutors/:id" element={
                        <ProtectedRoute>
                            <TutorDetailsPage />
                        </ProtectedRoute>
                    } />

                    </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
