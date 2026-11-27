import { useParams, useNavigate } from "react-router-dom";
import { useGetTasksByProjectQuery } from "../features/tasks/tasksApi";
import { useGetProjectsQuery } from "../features/projects/projectsapi"
import TaskCard from "../components/TaskCard";
import "../styles/board.css";

const columns = [
    {
        id: "todo",
        title: "To Do",
    },
    {
        id: "inprogress",
        title: "In Progress",
        limit: 5,
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
    const { data:projects = [],
    } = useGetProjectsQuery();
    const project = projects.find(
        (item) =>  String(item.id) === String(projectId)
    );

    if (isLoading) {
        return (
            <div className="board-page">
                <p>Loading Board...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="board-page">
            <h1>Something went wrong</h1>
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
                    <p>{project?.members?.length || 0} members {" . "} {tasks.length} tasks</p>
                </div>
                <button className="create-task-button">+ Create Task</button>
            </div>
            <div className="kanban-board">
                {columns.map((column) => {
                    const columnTasks = tasks
                    .filter(
                        (task) => task.status === column.id
                    )
                    .sort(
                        (a, b) => (a.order || 0) - (b.order || 0)
                    );
                    return (
                        <div className="kanban-column" key={column.id}>
                            <div className="column-header">
                                <h3>{column.title}</h3>
                                <div className="column-count">
                                    <span>
                                        {columnTasks.length}
                                    </span>
                                    {column.limit && (
                                        <span className="wip-limit">
                                            / {column.limit}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="column-tasks">
                                {columnTasks.length === 0 ? (
                                    <p className="empty-column">No tasks yet</p>
                                ) : (
                                    columnTasks.map((task) => (
                                        <TaskCard key={task.id} task={task}/>
                                    ))
                                )}
                            </div>
                            <button className="add-task-link">+  Add task </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BoardPage;