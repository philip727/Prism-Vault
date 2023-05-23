import "./App.scss";
import { Route, Router, Routes } from "@solidjs/router";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./views/Home";

function App() {
//    invoke("warframe_api").then(data => console.log(data))


    return (
        <Router>
            <Routes>
                <Route path="/" component={RootLayout}>
                    <Route path="" component={Home} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
