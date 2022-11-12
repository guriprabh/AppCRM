import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/Admin";
import Customer from "./pages/Customer";
import Engineer from "./pages/Engineer";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import Unauth from "./pages/Unauthorized";

import "@coreui/coreui/dist/js/coreui.min.js";
import "@coreui/coreui/dist/css/coreui.min.css";
import "react-circular-progressbar/dist/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  ENGINEER: "ENGINEER",
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.ENGINEER]} />}> */}
        <Route path="/engineer" element={<Engineer />} />
        {/* </Route> */}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}> */}
        <Route path="/admin" element={<Admin />} />
        {/* </Route> */}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.CUSTOMER]} />}> */}
        <Route path="/customer" element={<Customer />} />
        {/* </Route> */}
        <Route path="/*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauth />} />
      </Routes>
    </Router>
  );
}

export default App;
