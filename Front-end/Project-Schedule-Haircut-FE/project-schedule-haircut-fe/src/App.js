import React from "react";
import { RouterProvider } from 'react-router-dom';
import { Provider } from "react-redux";
import router from "./routers/routes";
import store from "./stores";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
            <ToastContainer position="bottom-right" autoClose={3000} pauseOnHover={false} />
        </div>
    );
}

export default App;
