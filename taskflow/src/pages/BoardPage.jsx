import { useParams, useNavigate } from "react-router-dom";
import { useGetTasksByProjectQuery } from "../features/tasks/tasksApi";
import { useGetProjectsQuery } from "../features/projects/projectsapi";
import "../styles/board.css";

const columns = [
    {
        id: "todo",
        title: "To Do",
    },
    {
        id: "inprogress",
        title: "In Progress",
    },
    {
        id: "review",
        title: "In Review",
    },
    {
        id: "done",
        title: "Done"
    },
];

function BoardPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const {
        data: tasks = [],
        isLoading,
        isError,
        refetch,
    } = useGetTasksByProjectQuery(projectId);
    const { data:projects = [] } = useGetProjectsQuery();
    const project = projects.find(
        (item) =>  item.id === projectId
    );

    if (isLoading) {
        return (
            <div className="board-page">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="board-page">
            <p>Failed to load tasks.</p>
            <button onClick={refetch}>Retry</button>
            </div>
        );
    }
    return (
        <div className="board-page">
            <div className="board-header">
                <div>
                    <button className="back-button" onClick={() => navigate("/projects")}>Back to Projects</button>
                    <h1>{project?.name || "kanban Board"}</h1>
                    <p>Manage your projects tasks</p>
                </div>
                <button className="btn btn-primary">+ Create Task</button>
            </div>
            <div className="kanban-board">
                {columns.map((column) => {
                    const columnTasks = tasks.filter(
                        (task) => task.status === column.id
                    );
                    return (
                        <div className="kanban-column" key={column.id}>
                            <div className="column-header">
                                <h3>{column.title}</h3>
                                <span>
                                    {columnTasks.length}
                                </span>
                            </div>
                            <div className="column-tasks">
                                {columnTasks.length === 0 ? (
                                    <p className="empty-column">No tasks yet</p>
                                ) : (
                                    columnTasks.map((task) => (
                                        <div className="task-card" key={task.id}>
                                            <h4>{task.title}</h4>
                                            <p>{task.description}</p>
                                            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                                            <p className="task-date">Due: {task.dueDate}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BoardPage;