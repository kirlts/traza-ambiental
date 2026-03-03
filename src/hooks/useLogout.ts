import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

export function useLogout() {
  const logout = async () => {
    const result = await Swal.fire({
      title: "Cerrar Sesión",
      text: "¿Estás seguro de que deseas cerrar tu sesión actual?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669", // --primary
      cancelButtonColor: "#6b7280", // Gray-500 for neutral cancel
      confirmButtonText: "Cerrar Sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "rounded-full px-6 py-2 font-medium",
        cancelButton: "rounded-full px-6 py-2 font-medium",
      },
    });

    if (result.isConfirmed) {
      await signOut({ redirect: false });
      window.location.href = `${window.location.origin}/login`;
    }
  };

  return logout;
}
