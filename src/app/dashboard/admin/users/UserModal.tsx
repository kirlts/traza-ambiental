"use client";

import React from "react";

import { User, Role, UserFormData } from "./types";

interface UserModalProps {
  show: boolean;
  editingUser: User | null;
  formData: UserFormData;
  roles: Role[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  handleRoleToggle: (roleId: string) => void;
}

export function UserModal({
  show,
  editingUser,
  formData,
  roles,
  onClose,
  onSubmit,
  setFormData,
  handleRoleToggle,
}: UserModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
          <form onSubmit={onSubmit} className="divide-y divide-gray-200 text-left">
            {/* Header */}
            <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-xl border-b border-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
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
                          d={
                            editingUser
                              ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              : "M12 4v16m8-8H4"
                          }
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </h3>
                    <p className="text-sm text-emerald-50 mt-0.5">
                      {editingUser ? "Modifica los datos del usuario" : "Registra un nuevo usuario"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white hover:text-emerald-100 transition-colors p-1 rounded-full hover:bg-emerald-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="px-6 py-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                    Información Personal
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">RUT</label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Contraseña{" "}
                    {editingUser && <span className="text-gray-500 font-normal">(opcional)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                    required={!editingUser}
                  />
                </div>

                {/* Empresa Info */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Información de Empresa
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Tipo de Empresa
                  </label>
                  <select
                    value={formData.tipoEmpresa}
                    onChange={(e) => setFormData({ ...formData, tipoEmpresa: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Transportista">Transportista</option>
                    <option value="Gestor">Gestor</option>
                    <option value="Generador">Generador</option>
                    <option value="Productor">Productor</option>
                  </select>
                </div>

                {formData.tipoEmpresa === "Gestor" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Tipo de Planta
                      </label>
                      <select
                        value={formData.tipoPlanta}
                        onChange={(e) => setFormData({ ...formData, tipoPlanta: e.target.value })}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Valorización energética">Valorización energética</option>
                        <option value="Reciclaje">Reciclaje</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Roles Checkboxes */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Roles y Permisos
                  </h4>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center space-x-2 cursor-pointer p-1"
                      >
                        <input
                          type="checkbox"
                          checked={formData.roleIds.includes(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                          className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        />
                        <span className="text-xs text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 mt-4 flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <span className="text-xs font-medium text-gray-700">Usuario Activo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.cuentaAprobada}
                      onChange={(e) =>
                        setFormData({ ...formData, cuentaAprobada: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-xs font-medium text-gray-700">Cuenta Aprobada</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
