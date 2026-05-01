"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditTaskForm from "@/components/EditTaskForm";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { Task } from "@/types/task";
import { User } from "@/types/user";

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get("/clients/");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setUsers([]);
        return;
      }

      console.error("Failed to fetch users:", error);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    fetchTasks();
    fetchClients();
    fetchUsers();
    fetchCurrentUser();
  }, [router, fetchTasks, fetchClients, fetchUsers, fetchCurrentUser]);

  const doneTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "done",
  ).length;

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ||
        task.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesMine = !onlyMine || task.user_id === currentUserId;

      const client = clients.find((c) => c.id === task.client_id);
      const user = users.find((u) => u.id === task.user_id);

      const matchesSearch =
        query === "" ||
        task.title.toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query) ||
        (client?.name || "").toLowerCase().includes(query) ||
        (client?.company || "").toLowerCase().includes(query) ||
        (user?.name || "").toLowerCase().includes(query);

      return matchesStatus && matchesMine && matchesSearch;
    });
  }, [tasks, clients, users, statusFilter, onlyMine, currentUserId, search]);

  const handleCreated = async () => {
    await fetchTasks();
    setIsCreateOpen(false);
    showToast("Task created successfully", "success");
  };

  const handleUpdated = async () => {
    await fetchTasks();
    setEditingTask(null);
    showToast("Task updated successfully", "success");
  };

  const handleComplete = async (taskId: number) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      await fetchTasks();
      showToast("Task marked as completed", "success");
    } catch (error: any) {
      console.error("Failed to complete task:", error);
      showToast(
        error?.response?.data?.detail || "Failed to complete task",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/tasks/${deletingTask.id}`);
      await fetchTasks();
      setDeletingTask(null);
      showToast("Task deleted successfully", "success");
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      showToast(
        error?.response?.data?.detail || "Failed to delete task",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppShell title="Tasks" subtitle="Track follow-ups and team actions.">
      <StatsCards
        items={[
          { label: "Total Tasks", value: tasks.length },
          { label: "Completed", value: doneTasks },
          { label: "Visible", value: filteredTasks.length },
        ]}
      />

      <PageActions
        buttonText="+ New Task"
        onClick={() => setIsCreateOpen(true)}
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks, clients, companies, users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setStatusFilter("open")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "open"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Open
        </button>

        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "in_progress"
              ? "bg-orange-500 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => setStatusFilter("done")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "done"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Done
        </button>

        <button
          onClick={() => setOnlyMine((prev) => !prev)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            onlyMine
              ? "bg-purple-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          My Tasks
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? "No tasks yet" : "No tasks found"}
          description={
            tasks.length === 0
              ? "Create your first task to organize follow-ups, reminders, and daily CRM work."
              : "Try changing your search, status filter, or My Tasks filter."
          }
          action={
            tasks.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                + Create Task
              </button>
            ) : null
          }
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          clients={clients}
          users={users}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
          onComplete={handleComplete}
        />
      )}

      <Modal
        open={isCreateOpen}
        title="Create New Task"
        onClose={() => setIsCreateOpen(false)}
      >
        <TaskForm onCreated={handleCreated} />
      </Modal>

      <Modal
        open={!!editingTask}
        title="Edit Task"
        onClose={() => setEditingTask(null)}
      >
        {editingTask && (
          <EditTaskForm task={editingTask} onUpdated={handleUpdated} />
        )}
      </Modal>

      <Modal
        open={!!deletingTask}
        title="Delete Task"
        onClose={() => setDeletingTask(null)}
      >
        {deletingTask && (
          <DeleteConfirm
            title="Delete task?"
            description={`Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`}
            confirmText="Delete Task"
            loading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setDeletingTask(null)}
          />
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppShell>
  );
}
