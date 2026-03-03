import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  medidas: string;
  categoria: {
    id: string;
    nombre: string;
  };
}

export interface Movimiento {
  id: string;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  motivo: string;
  fechaMovimiento: string;
}

export interface Inventario {
  id: string;
  producto: Producto;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string | null;
  fechaActualizacion: string;
  ultimosMovimientos: Movimiento[];
  totalMovimientos: number;
}

export interface ResumenInventario {
  totalProductos: number;
  totalUnidades: number;
  productosBajoStock: number;
}

export function useInventario() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inventarios, setInventarios] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [productos, setProductos] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [resumen, setResumen] = useState<ResumenInventario | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadInventario = useCallback(async () => {
    try {
      const response = await fetch("/api/inventario/stock");
      if (response.ok) {
        const data = await response.json();
        setInventarios(data.data.inventarios);
        setResumen(data.data.resumen);
      } else {
        toast.error("Error al cargar el inventario");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProductos = useCallback(async () => {
    try {
      const response = await fetch("/api/inventario/productos");
      if (response.ok) {
        const data = await response.json();
        setProductos(data.data);
      }
    } catch (error: unknown) {
      console.error("Error al cargar productos:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session) {
      loadInventario();
      loadProductos();
    }
  }, [status, session, router, loadInventario, loadProductos]);

  const handleAddProducto = async (data: ReturnType<typeof JSON.parse>) => {
    try {
      const response = await fetch("/api/inventario/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Producto agregado al inventario");
        loadInventario();
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al agregar producto");
        return false;
      }
    } catch {
      toast.error("Error de conexión");
      return false;
    }
  };

  const handleMovement = async (data: ReturnType<typeof JSON.parse>) => {
    try {
      const response = await fetch("/api/inventario/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Movimiento de ${data.tipo.toLowerCase()} registrado`);
        loadInventario();
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al registrar movimiento");
        return false;
      }
    } catch {
      toast.error("Error de conexión");
      return false;
    }
  };

  const filteredInventarios = inventarios.filter((inventario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inventario.producto.nombre.toLowerCase().includes(searchLower) ||
      inventario.producto.marca.toLowerCase().includes(searchLower) ||
      inventario.producto.modelo.toLowerCase().includes(searchLower)
    );
  });

  return {
    inventarios: filteredInventarios,
    allInventarios: inventarios,
    productos,
    resumen,
    loading,
    searchTerm,
    setSearchTerm,
    handleAddProducto,
    handleMovement,
    refresh: loadInventario,
  };
}
