import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: string;
  nombre: string;
}

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
}

interface ModalProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productoToEdit?: Producto | null;
  categorias: Categoria[];
}

export default function ModalProducto({
  isOpen,
  onClose,
  onSuccess,
  productoToEdit,
  categorias,
}: ModalProductoProps) {
  const isEditing = !!productoToEdit;

  const [formData, setFormData] = useState({
    nombre: productoToEdit?.nombre || "",
    marca: productoToEdit?.marca || "",
    modelo: productoToEdit?.modelo || "",
    medidas: productoToEdit?.medidas || "",
    categoriaId: productoToEdit?.categoria?.id || "",
    descripcion: productoToEdit?.descripcion || "",
  });

  const handleSubmit = async () => {
    if (
      !formData.nombre ||
      !formData.marca ||
      !formData.modelo ||
      !formData.medidas ||
      !formData.categoriaId
    ) {
      toast.error("Todos los campos obligatorios deben estar completos");
      return;
    }

    try {
      const url = isEditing
        ? `/api/inventario/productos/${productoToEdit.id}`
        : "/api/inventario/productos";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Producto ${isEditing ? "actualizado" : "agregado"} exitosamente`);
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.message || `Error al ${isEditing ? "actualizar" : "agregar"} producto`);
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-[#e2e8f0] shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-[#1f2937] flex items-center">
            <div
              className={`w-8 h-8 ${isEditing ? "bg-[#e7f7f2]" : "bg-[#e0f2e9]"} rounded-lg flex items-center justify-center mr-3`}
            >
              {isEditing ? (
                <Edit className="w-5 h-5 text-[#2f6f4a]" />
              ) : (
                <Plus className="w-5 h-5 text-[#2f6f4a]" />
              )}
            </div>
            {isEditing ? "Editar producto" : "Registrar nuevo producto"}
          </DialogTitle>
          <DialogDescription className="text-[#475569] mt-2">
            {isEditing
              ? "Actualiza la información del producto seleccionado para mantener tu catálogo al día."
              : "Completa la información técnica del neumático para añadirlo a tu inventario digital."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <h3 className="text-sm font-semibold text-[#1f2937] mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-[#e0f2e9] rounded-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#2f6f4a] rounded-full"></div>
              </div>
              Información del producto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-semibold text-[#1f2937]">
                  Nombre del producto *
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Neumático Radial"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="h-11 border-[#d7e3db] focus:ring-0 focus:border-[#459e60]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-sm font-semibold text-[#1f2937]">
                  Marca *
                </Label>
                <Input
                  id="marca"
                  placeholder="Ej: Michelin"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="h-11 border-[#d7e3db] focus:ring-0 focus:border-[#459e60]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-sm font-semibold text-[#1f2937]">
                  Modelo *
                </Label>
                <Input
                  id="modelo"
                  placeholder="Ej: Pilot Sport 4"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className="h-11 border-[#d7e3db] focus:ring-0 focus:border-[#459e60]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medidas" className="text-sm font-semibold text-[#1f2937]">
                  Medidas *
                </Label>
                <Input
                  id="medidas"
                  placeholder="Ej: 205/55R16"
                  value={formData.medidas}
                  onChange={(e) => setFormData({ ...formData, medidas: e.target.value })}
                  className="h-11 border-[#d7e3db] focus:ring-0 focus:border-[#459e60]"
                />
              </div>
            </div>
          </div>

          {/* Clasificación y detalles */}
          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <h3 className="text-sm font-semibold text-[#1f2937] mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-[#d9f5ff] rounded-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#0ea5e9] rounded-full"></div>
              </div>
              Clasificación y Detalles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-semibold text-[#1f2937]">
                  Categoría *
                </Label>
                <Select
                  value={formData.categoriaId}
                  onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
                >
                  <SelectTrigger className="h-11 border-[#d7e3db] focus:ring-0 focus:border-[#459e60]">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200 shadow-xl">
                    {!categorias || categorias.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No hay categorías disponibles</div>
                    ) : (
                      categorias.map((categoria) => (
                        <SelectItem
                          key={categoria.id}
                          value={categoria.id}
                          className="text-gray-900 hover:bg-emerald-50"
                        >
                          {categoria.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-semibold text-[#1f2937]">
                  Descripción (opcional)
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Agregue una descripción detallada del producto, características técnicas, usos recomendados, etc."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="min-h-[90px] border-[#d7e3db] focus:ring-0 focus:border-[#459e60]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[#e2e8f0]">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 border-[#cbd5f0] text-[#1f3556] font-semibold"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-11 bg-[#459e60] hover:bg-[#367d4c] text-white font-bold shadow-md"
          >
            {isEditing ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Actualizar producto
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Registrar producto
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
