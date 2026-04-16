"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditTaskForm from "@/components/EditTaskForm";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
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
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
  }, [router, fetchTasks, fetchClients, fetchUsers]);

  const doneTasks = tasks.filter((task) => task.status.toLowerCase() === "done").length;

  const handleCreated = async () => {
    await fetchTasks();
    setIsCreateOpen(false);
  };

  const handleUpdated = async () => {
    await fetchTasks();
    setEditingTask(null);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/tasks/${deletingTask.id}`);
      await fetchTasks();
      setDeletingTask(null);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      alert(error?.response?.data?.detail || "Failed to delete task");
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
          { label: "Status", value: loading ? "Loading" : "Ready" },
        ]}
      />

      <PageActions buttonText="+ New Task" onClick={() => setIsCreateOpen(true)} />

      {loading ? (
        <p className="text-slate-500">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          clients={clients}
          users={users}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
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
    </AppShell>
  );
}