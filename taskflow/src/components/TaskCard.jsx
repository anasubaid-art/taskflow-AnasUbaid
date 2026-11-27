function TaskCard({ task }) {
    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate && task.dueDate <today;
    const subtasks = task.subtasks || [];
    const completed = subtasks.filter(
        (item) => item.completed
    ).length;
    const progress = subtasks.length
    ? Math.round((completed / subtasks.length) * 100)
    : 0;
    return (
        <div className="task-card">
            <div className="task-card-top">
                <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                <span className={`task-date ${isOverdue ? "overdue" : ""}`}>
                    {task.dueDate || "No due date"}
                    {isOverdue && " . Overdue"}
                </span>
            </div>
            <h4>{task.title}</h4>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-labels">
                {(task.labels || []).map((label, index) => (
                    <span className="task-label" key={index}>{label}</span>
                ))}
            </div>
            <div className="task-subtasks">
                <div className="subtask-info">
                    <span>{completed} of {subtasks.length}</span>
                </div>
                {subtasks.length > 0 && (
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%`}}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskCard;