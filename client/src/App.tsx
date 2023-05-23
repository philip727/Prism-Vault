import "./App.scss";
import { Route, Router, Routes } from "@solidjs/router";
import RootLayout from "./components/layouts/RootLayout";
import Startup from "./views/Startup";
import Login from "./views/__startup/Login";
import Register from "./views/__startup/Register";

function App() {
//    invoke("warframe_api").then(data => console.log(data))


    return (
        <Router>
            <Routes>
                <Route path="/" component={RootLayout}>
                    <Route path="" component={Startup} />
                    <Route path="register" component={Register} />
                    <Route path="login"component={Login} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
