import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import "../styles/projects.css";
import { useGetProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation, } from "../features/projects/projectsapi";
import { useGetUsersQuery } from "../features/users/usersApi";

function ProjectsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name,  setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#6D5EFC");
    const { data: users = [] } = useGetUsersQuery();
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const openModal = () => {
        setIsModalOpen (true);
        setSelectedMembers([user.id]);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setColor("#6D5EFC");
        setSelectedMembers([]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            alert("Project name has at least 3 characters");
            return;
        }

        try {
            await createProject({
                name: name.trim(),
                description: description.trim(),
                color,
                members: selectedMembers,
                createdBy: user.id,
            }).unwrap();
            closeModal();
        } catch (err) {
            console.error("Create failed:", err);
            alert("Project Can not create");
        }
    };
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
    const [confirmDelete, setConfirmDelete] = useState(null);
    const openDeletConfirm = (project) => {
        setConfirmDelete(project);
    };
    const closeDeleteConfirm = () => {
        setConfirmDelete(null);
    };
    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await deleteProject(confirmDelete.id).unwrap();
            closeDeleteConfirm();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("The project could not be deleted");
        }
    };

    const {
        data: projects = [],
        isLoading,
        isError,
        refetch,
    } = useGetProjectsQuery();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="projects-page">
                <h1>Projects</h1>
                <p className="state-message">Loading projects...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="projects-page">
                <h1>Projects</h1>
                <p className="error-message">Failed to load projects.</p>
                <button className="btn-secondary" onClick={refetch}>Retry</button>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="projects-page">
                <h1>Projects</h1>
                <p className="state-message">No projects found.</p>
                {user?.role === "admin" && (
                    <button className="btn-primary" onClick={openModal}>Create Project</button>
                )}
            </div>
        );
    }

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>Projects</h1>
                <div className="user-info">
                    <span>{user?.name} ({user?.role})</span>
                    <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>
       {user?.role === "admin" && (
        <button className="btn btn-primary" onClick={openModal}>Create Project</button>
       )}

       <div className="projects-grid">
        {projects.map((project) => (
            <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {user?.role === "admin" && (
                    <div className="project-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => openDeletConfirm(project)}>Delete</button>
                    </div>
                )}
            </div>
        ))}
       </div>
       {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Projct</h2>
                    <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                </div>
                <form onSubmit={handleCreate}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Project Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <div className="color-options">{["#6D5EFC", "#2DD4BF", "#FF6B4A", "#60A5FA", "#8B7CFF"].map((c) => (
                                <div key={c} className={`color-option ${color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
                                )
                              )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Members</label>
                            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                {users.map((u) => (
                                    <label key={u.id} style={{
                                        display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "var(--text-primary)",
                                    }}>
                                        <input type="checkbox" checked={selectedMembers.includes(u.id)} onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedMembers([...selectedMembers, u.id]);
                                            } else {
                                                setSelectedMembers(
                                                    selectedMembers.filter((id) => id !== u.id)
                                                );
                                            }
                                        }}
                                        />
                                        {u.name} ({u.role})
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancle</button>
                    <button type="submit" className="btn btn-primary" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    </div>
    )}
    {confirmDelete && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Delete Project</h2>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this project?</p>
                    <p className="project-name">"{confirmDelete.name}"</p>
                    <p>This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>Cancle</button>
                    <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</button>
                </div>
            </div>
        </div>
    )}
    </div>
  );
}

export default ProjectsPage;