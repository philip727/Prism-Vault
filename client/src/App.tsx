import "./App.scss";
import { Route, Router, Routes } from "@solidjs/router";
import RootLayout from "./components/layouts/RootLayout";
import Startup from "./views/Startup";
import Login from "./views/__startup/Login";
import Register from "./views/__startup/Register";
import Dashboard from "./views/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" component={RootLayout}>
                    <Route path="" component={Startup} />
                    <Route path="register" component={Register} />
                    <Route path="login" component={Login} />
                    <Route path="dashboard">
                        <Route path="" component={Dashboard} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
