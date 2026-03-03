"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Plus, Search, Edit, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModalProducto from "@/components/inventario/ModalProducto";

interface Producto {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  medidas: string;
  categoria: {
    id: string;
    nombre: string;
  };
  descripcion?: string;
  activo: boolean;
}

export default function ProductosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [productos, setProductos] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [categorias, setCategorias] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session) {
      loadProductos();
      loadCategorias();
    }
  }, [status, session, router]);

  const loadProductos = async () => {
    try {
      const response = await fetch("/api/inventario/productos");
      if (response.ok) {
        const data = await response.json();
        setProductos(data.data);
      } else {
        toast.error("Error al cargar productos");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await fetch("/api/inventario/categorias");
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.data);
      } else {
        console.error("Error en la respuesta de categorías:", response.status);
      }
    } catch (error: unknown) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleDeleteProducto = async (productoId: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.",
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
      const response = await fetch(`/api/inventario/productos/${productoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Producto eliminado exitosamente");
        loadProductos();
      } else {
        const error = await response.json();
        toast.error(
          (error as ReturnType<typeof JSON.parse>).message || "Error al eliminar producto"
        );
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const openAddDialog = () => {
    setSelectedProducto(null);
    setShowModal(true);
  };

  const openEditDialog = (producto: ReturnType<typeof JSON.parse>) => {
    setSelectedProducto(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProducto(null);
  };

  const handleSuccess = () => {
    loadProductos();
  };

  const filteredProductos = productos.filter((producto: ReturnType<typeof JSON.parse>) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(searchLower) ||
      producto.marca.toLowerCase().includes(searchLower) ||
      producto.modelo.toLowerCase().includes(searchLower) ||
      producto.categoria.nombre.toLowerCase().includes(searchLower)
    );
  });

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || loading) {
    return (
      <DashboardLayout
        title="Catálogo de Productos"
        subtitle="Administra las referencias de neumáticos asociadas a tu inventario"
      >
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-500 mx-auto"></div>
            <p className="mt-4 text-[#2b3b4c] font-medium">
              {status === "loading" ? "Verificando sesión..." : "Cargando productos..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Catálogo de Productos"
      subtitle="Administra la información técnica de los neumáticos que declaras en la plataforma"
    >
      <div className="w-full space-y-6">
        {/* Barra de búsqueda y acciones */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos por nombre, marca, modelo o categoría..."
              value={searchTerm}
              onChange={(e: unknown) =>
                setSearchTerm((e as ReturnType<typeof JSON.parse>).target.value)
              }
              className="pl-9 h-11 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
          <Button
            onClick={openAddDialog}
            className="h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar producto
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProductos.map((producto: ReturnType<typeof JSON.parse>) => (
            <Card
              key={producto.id}
              className="hover:shadow-xl transition-shadow border border-[#e2e8f0]"
            >
              <CardHeader className="pb-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-[#1f2937]">
                      {producto.marca} {producto.modelo}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[#64748b] font-medium">
                      {producto.nombre}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(producto)}
                      className="h-8 w-8 p-0 text-[#1f3556] hover:text-[#16314b]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProducto(producto.id)}
                      className="h-8 w-8 p-0 text-[#e11d48] hover:text-[#b91c1c]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Medidas:</span>
                    <Badge variant="outline" className="border-[#cbd5f0] text-[#1f3556]">
                      {producto.medidas}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Categoría:</span>
                    <Badge variant="secondary" className="bg-[#eef9f2] text-[#2f6f4a]">
                      {producto.categoria.nombre}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Estado:</span>
                    <div className="flex items-center">
                      <CheckCircle
                        className={`h-4 w-4 mr-1 ${producto.activo ? "text-green-600" : "text-gray-400"}`}
                      />
                      <span
                        className={`text-sm ${producto.activo ? "text-green-600" : "text-gray-400"}`}
                      >
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                  {producto.descripcion && (
                    <div className="pt-2 border-t border-[#e2e8f0]">
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {producto.descripcion}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProductos.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white border border-[#e2e8f0] rounded-2xl shadow-inner">
              <Package className="mx-auto h-12 w-12 text-[#cbd5f0]" />
              <h3 className="mt-3 text-lg font-semibold text-[#1f2937]">
                {searchTerm ? "No se encontraron productos" : "Aún no registras productos"}
              </h3>
              <p className="mt-1 text-sm text-[#64748b] max-w-md mx-auto">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Agrega productos para llevar un control preciso de tus neumáticos y facilitar tus declaraciones REP"}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button
                    onClick={openAddDialog}
                    className="h-11 bg-[#459e60] hover:bg-[#367d4c] font-bold shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar primer producto
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <ModalProducto
          key={selectedProducto?.id || (showModal ? "new" : "closed")}
          isOpen={showModal}
          onClose={closeModal}
          onSuccess={handleSuccess}
          productoToEdit={selectedProducto}
          categorias={categorias}
        />
      </div>
    </DashboardLayout>
  );
}
