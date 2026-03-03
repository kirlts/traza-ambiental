"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Search, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ModalProducto from "@/components/inventario/ModalProducto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminProducto {
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
  _count?: {
    inventarios: number;
  };
}

export default function AdminProductosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("TODAS");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProducto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Memoizar parámetros de búsqueda para evitar re-renders innecesarios
  const queryParams = useMemo(
    () => ({
      page: page.toString(),
      limit: "10",
      search,
      ...(categoriaFilter !== "TODAS" && { categoria: categoriaFilter }),
    }),
    [page, search, categoriaFilter]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin-productos", page, search, categoriaFilter],
    queryFn: async () => {
      const params = new URLSearchParams(queryParams);
      const res = await fetch(`/api/admin/productos?${params}`);
      if (!res.ok) throw new Error("Error cargando productos");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/productos?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error((error as ReturnType<typeof JSON.parse>).error || "Error eliminando");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Producto eliminado");
      queryClient.invalidateQueries({ queryKey: ["admin-productos"] });
      setDeleteId(null);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
      setDeleteId(null);
    },
  });

  const handleEdit = (producto: AdminProducto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const handleCreate = useCallback(() => {
    setSelectedProduct(null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProduct(null);
    queryClient.invalidateQueries({ queryKey: ["admin-productos"] });
  }, [queryClient]);

  return (
    <DashboardLayout title="Gestión de Catálogo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Catálogo Maestro de Productos</h1>
          <Button
            onClick={handleCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
            <CardTitle className="text-emerald-900">Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 pt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, marca o modelo..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas las categorías</SelectItem>
                <SelectItem value="A">Categoría A</SelectItem>
                <SelectItem value="B">Categoría B</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-50 border-b border-emerald-100 hover:bg-emerald-50">
                    <TableHead className="text-emerald-900 font-semibold">Nombre</TableHead>
                    <TableHead className="text-emerald-900 font-semibold">Marca / Modelo</TableHead>
                    <TableHead className="text-emerald-900 font-semibold">Categoría</TableHead>
                    <TableHead className="text-emerald-900 font-semibold">Medidas</TableHead>
                    <TableHead className="text-center text-emerald-900 font-semibold">
                      Uso en Inventarios
                    </TableHead>
                    <TableHead className="text-right text-emerald-900 font-semibold">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : data?.productos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron productos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.productos.map((producto: AdminProducto) => (
                      <TableRow
                        key={producto.id}
                        className="hover:bg-emerald-50/30 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {producto.nombre}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {producto.marca} - {producto.modelo}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              producto.categoria.nombre === "A"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-emerald-200 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            Categoría {producto.categoria.nombre}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{producto.medidas}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {producto._count?.inventarios || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(producto)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8"
                              title="Editar producto"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                              onClick={() => setDeleteId(producto.id)}
                              title="Eliminar producto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Paginación simple */}
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600 font-medium px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
            Página {page} de {data?.pages || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.pages || 1)}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>

      <ModalProducto
        key={selectedProduct?.id || (modalOpen ? "new" : "closed")}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        productoToEdit={selectedProduct}
        onSuccess={handleCloseModal}
        categorias={[
          { id: "A", nombre: "Categoría A" },
          { id: "B", nombre: "Categoría B" },
        ]}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto del catálogo maestro. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
