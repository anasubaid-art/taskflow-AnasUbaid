import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, Folder, CheckSquare, LogOut, Sun, Moon, } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { setTheme } from "../features/ui/uiSlice";
import { useGetProjectsQuery } from "../features/projects/projectsapi";
import "../styles/sidebar.css";

function Sidebar () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) =>  state.auth.user);
    const theme = useSelector((state) => state.ui.theme);
    const { data: projects = [] } = useGetProjectsQuery();
    const handleThemeChange = () => {
        dispatch(setTheme(theme === "dark" ? "light" : "dark"));
    };
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };
    const initials = user?.name 
    ? user.name
    .split(" ")
    .map((word) => word[0])
    .join(" ")
    .slice(0, 2)
    .toUpperCase()
    : "U";

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-title">TF</div>
                <span>TaskFlow</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({isActive}) =>
                isActive ? "sidebar-link" : "sidebar-link"}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
                </NavLink>
                <NavLink to="/projects" className={({isActive}) =>
                isActive ? "sidebar-link active" : "sidebar-link"}>
                <Folder size={18} />
                <span>Projects</span>
                </NavLink>
                <NavLink to="/my-tasks" className={({isActive}) =>
                isActive ? "sidebar-link active" : "sidebar-link"}>
                <CheckSquare size={18} />
                <span>My Tasks</span>
                </NavLink>
            </nav>
            <div className="sidebar-projects">
                <p className="sidebar-section-title">Projects</p>
                {projects.map((project) =>(
                    <NavLink key={project.id} to={`/projects/${project.id}`} className="sidebare-projects-link">
                        <span className="project-dot" style={{backgroundColor: project.color || "var(--primary)"}} />
                        <span>{project.name}</span>
                    </NavLink>
                ))}
            </div>
            <div className="sidebare-bottom">
                <div className="theme-row">
                    <span>{theme === "dark" ? "Dark theme" : "Light theme"}</span>
                    <button type="button" className={`theme-switch ${theme === "light" ? "theme-switch-on" : ""}`} onClick={handleThemeChange} aria-label="Toggle theme">
                        <span className="theme-switch-knob">{theme === "dark" ? (
                            <Moon size={14} />
                        ) : (
                            <Sun size={14} />
                        )}
                        </span>
                    </button>
                </div>
                <div className="sidebare-user">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-details">
                        <strong>{user?.name || "User"}</strong>
                        <span>{user?.role || "Member"}</span>
                    </div>
                    <button type="button" className="logout-button" onClick={handleLogout} aria-label="Logout" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;