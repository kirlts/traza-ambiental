"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  userCount: number;
  users: User[];
}

interface RoleFormData {
  name: string;
  description: string;
  active: boolean;
}

export default function RolesAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isAdmin(session)) {
      // Si está autenticado pero no es admin, redirigir al dashboard
      router.push("/dashboard");
    }
  }, [status, router, session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRoles();
    }
  }, [status]);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error: unknown) {
      console.error("Error al cargar roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || "",
        active: role.active,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        description: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      active: true,
    });
  };

  const handleShowUsers = (role: Role) => {
    setSelectedRole(role);
    setShowUsersModal(true);
  };

  const handleSubmit = async (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    try {
      const url = editingRole ? `/api/roles/${editingRole.id}` : "/api/roles";
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRoles();
        handleCloseModal();
        toast.success(editingRole ? "Rol actualizado exitosamente" : "Rol creado exitosamente");
      } else {
        const error = await response.json();
        toast.error((error as ReturnType<typeof JSON.parse>).error || "Error al guardar rol");
      }
    } catch (error: unknown) {
      console.error("Error al guardar rol:", error);
      toast.error("Error al guardar rol");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este rol? Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRoles();
        toast.success("Rol eliminado exitosamente");
      } else {
        const error = await response.json();
        toast.error((error as ReturnType<typeof JSON.parse>).error || "Error al eliminar rol");
      }
    } catch (error: unknown) {
      console.error("Error al eliminar rol:", error);
      toast.error("Error al eliminar rol");
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout title="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !isAdmin(session)) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta sección.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    {
      label: "Usuarios",
      href: "/dashboard/admin/users",
      active: false,
      onClick: () => router.push("/dashboard/admin/users"),
    },
    {
      label: "Roles",
      href: "/dashboard/admin/roles",
      active: true,
      onClick: () => router.push("/dashboard/admin/roles"),
    },
  ];

  return (
    <DashboardLayout
      title="Administración de Roles"
      subtitle="Gestiona los roles y permisos del sistema"
      tabs={tabs}
      actions={
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Rol</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      role.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {role.active ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">
                  {role.description || "Sin descripción"}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>
                    {role.userCount} usuario{role.userCount !== 1 ? "s" : ""}
                  </span>
                  {role.userCount > 0 && (
                    <button
                      onClick={() => handleShowUsers(role)}
                      className="ml-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      (ver)
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Creado: {new Date(role.createdAt).toLocaleDateString("es-ES")}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(role)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay roles</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo rol.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create/Edit Role */}
      {showModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop difuso */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
              onClick={handleCloseModal}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl border-b border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                          {editingRole ? (
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-900">
                          {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
                        </h3>
                        <p className="text-sm text-emerald-700 mt-0.5">
                          {editingRole
                            ? "Modifica los datos del rol seleccionado"
                            : "Registra un nuevo rol en el sistema"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-emerald-100"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del Rol */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Información del Rol
                      </h4>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Rol *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e: unknown) =>
                            setFormData({
                              ...formData,
                              name: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-gray-50 focus:bg-white"
                          placeholder="Ej: Administrador, Operador, Supervisor"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.description}
                          onChange={(e: unknown) =>
                            setFormData({
                              ...formData,
                              description: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          rows={4}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                          placeholder="Describe las responsabilidades y permisos de este rol"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Proporciona una descripción clara de las funciones de este rol
                      </p>
                    </div>

                    {/* Estado del Rol */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Estado del Rol
                      </h4>

                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${formData.active ? "bg-emerald-500" : "bg-gray-400"}`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.active ? "Rol Activo" : "Rol Inactivo"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formData.active
                                ? "Los usuarios pueden tener este rol"
                                : "Rol temporalmente deshabilitado"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, active: !formData.active })}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                            formData.active ? "bg-emerald-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Nota:</span> Los cambios se aplicarán
                      inmediatamente al guardar.
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{editingRole ? "Actualizar Rol" : "Crear Rol"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Show Users */}
      {showUsersModal && selectedRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
              onClick={() => setShowUsersModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Usuarios con el rol &quot;{selectedRole.name}&quot;
                </h3>

                <div className="space-y-3">
                  {selectedRole.users.map((user) => (
                    <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || "Sin nombre"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowUsersModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
