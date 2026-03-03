"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";

import { User, UserFormData, Role } from "./types";

export default function UsersAdminPage() {
  const { data: _session, status } = useSession();
  const _router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    rut: "",
    email: "",
    password: "",
    image: "",
    active: true,
    cuentaAprobada: false,
    tipoEmpresa: "",
    capacidadProcesamiento: "",
    tipoPlanta: "",
    idRETC: "",
    direccionComercial: "",
    direccionCasaMatriz: "",
    tipoProductorREP: "",
    tiposResiduos: [],
    roleIds: [],
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
      fetchRoles();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error: unknown) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error: unknown) {
      console.error("Error al cargar roles:", error);
    }
  };

  const handleOpenModal = async (user?: User) => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const fullUserData = await response.json();
          setEditingUser(fullUserData);
          setFormData({
            name: fullUserData.name || "",
            rut: fullUserData.rut || "",
            email: fullUserData.email,
            password: "",
            image: fullUserData.image || "",
            active: fullUserData.active,
            cuentaAprobada: fullUserData.cuentaAprobada || false,
            tipoEmpresa: fullUserData.tipoEmpresa || "",
            capacidadProcesamiento: fullUserData.capacidadProcesamiento?.toString() || "",
            tipoPlanta: fullUserData.tipoPlanta || "",
            idRETC: fullUserData.idRETC || "",
            direccionComercial: fullUserData.direccionComercial || "",
            direccionCasaMatriz: fullUserData.direccionCasaMatriz || "",
            tipoProductorREP: fullUserData.tipoProductorREP || "",
            tiposResiduos: fullUserData.tiposResiduos || [],
            roleIds: fullUserData.roles.map((r: ReturnType<typeof JSON.parse>) => r.id),
          });
        }
      } catch (error: unknown) {
        console.error("Error al cargar datos del usuario:", error);
      }
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        rut: "",
        email: "",
        password: "",
        image: "",
        active: true,
        cuentaAprobada: false,
        tipoEmpresa: "",
        capacidadProcesamiento: "",
        tipoPlanta: "",
        idRETC: "",
        direccionComercial: "",
        direccionCasaMatriz: "",
        tipoProductorREP: "",
        tiposResiduos: [],
        roleIds: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        ...formData,
        capacidadProcesamiento: formData.capacidadProcesamiento
          ? parseFloat(formData.capacidadProcesamiento)
          : null,
      };

      if (!formData.password && editingUser) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchUsers();
        handleCloseModal();
        toast.success(editingUser ? "Usuario actualizado" : "Usuario creado");
      }
    } catch (error: unknown) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (response.ok) {
          await fetchUsers();
          toast.success("Eliminado");
        }
      } catch {
        toast.error("Error");
      }
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout title="Cargando...">
        <div className="flex items-center justify-center py-12 animate-pulse font-mono">
          CARGANDO NÚCLEO...
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { label: "Usuarios", href: "/dashboard/admin/users", active: true },
    { label: "Roles", href: "/dashboard/admin/roles", active: false },
  ];

  return (
    <DashboardLayout
      title="Administración de Usuarios"
      subtitle="Gestiona los privilegios del sistema"
      tabs={tabs}
      actions={
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Usuario</span>
        </button>
      }
    >
      <div className="space-y-6">
        <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDelete} />
      </div>

      <UserModal
        show={showModal}
        editingUser={editingUser}
        formData={formData}
        roles={roles}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        setFormData={setFormData}
        handleRoleToggle={handleRoleToggle}
      />
    </DashboardLayout>
  );
}
