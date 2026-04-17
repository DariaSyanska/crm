"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditNoteForm from "@/components/EditNoteForm";
import Modal from "@/components/Modal";
import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get("/notes/");
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
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

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    fetchNotes();
    fetchClients();
    fetchUsers();
  }, [router, fetchNotes, fetchClients, fetchUsers]);

  const handleCreated = async () => {
    await fetchNotes();
    setIsCreateOpen(false);
    showToast("Note created successfully", "success");
  };

  const handleUpdated = async () => {
    await fetchNotes();
    setEditingNote(null);
    showToast("Note updated successfully", "success");
  };

  const handleDelete = async () => {
    if (!deletingNote) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/notes/${deletingNote.id}`);
      await fetchNotes();
      setDeletingNote(null);
      showToast("Note deleted successfully", "success");
    } catch (error: any) {
      console.error("Failed to delete note:", error);
      showToast(
        error?.response?.data?.detail || "Failed to delete note",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppShell title="Notes" subtitle="Store client notes and communication history.">
      <StatsCards
        items={[
          { label: "Total Notes", value: notes.length },
          { label: "Visible Notes", value: notes.length },
          { label: "Status", value: loading ? "Loading" : "Ready" },
        ]}
      />

      <PageActions buttonText="+ New Note" onClick={() => setIsCreateOpen(true)} />

      {loading ? (
        <p className="text-slate-500">Loading notes...</p>
      ) : (
        <NoteList
          notes={notes}
          clients={clients}
          users={users}
          onEdit={setEditingNote}
          onDelete={setDeletingNote}
        />
      )}

      <Modal
        open={isCreateOpen}
        title="Create New Note"
        onClose={() => setIsCreateOpen(false)}
      >
        <NoteForm onCreated={handleCreated} />
      </Modal>

      <Modal
        open={!!editingNote}
        title="Edit Note"
        onClose={() => setEditingNote(null)}
      >
        {editingNote && (
          <EditNoteForm note={editingNote} onUpdated={handleUpdated} />
        )}
      </Modal>

      <Modal
        open={!!deletingNote}
        title="Delete Note"
        onClose={() => setDeletingNote(null)}
      >
        {deletingNote && (
          <DeleteConfirm
            title="Delete note?"
            description="Are you sure you want to delete this note? This action cannot be undone."
            confirmText="Delete Note"
            loading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setDeletingNote(null)}
          />
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppShell>
  );
}