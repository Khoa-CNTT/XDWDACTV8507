import React from "react";
import { RouterProvider } from 'react-router-dom';
import router from "./routers/routes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './stores/context/AuthContext';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <ToastContainer position="bottom-right" autoClose={3000} pauseOnHover={false} />
        </div>
    );
}

export default App;
