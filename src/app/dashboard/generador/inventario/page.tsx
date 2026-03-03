"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, History } from "lucide-react";
import Link from "next/link";
import { InventarioGuard } from "@/components/inventario/InventarioGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useInventario, Inventario } from "@/hooks/useInventario";
import { InventoryStats } from "@/components/inventario/InventoryStats";
import { InventoryTable } from "@/components/inventario/InventoryTable";

export default function InventarioPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const {
    inventarios,
    productos,
    resumen,
    loading,
    searchTerm,
    setSearchTerm,
    handleAddProducto,
    handleMovement,
  } = useInventario();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState<Inventario | null>(null);

  // Form states
  const [selectedProducto, setSelectedProducto] = useState("");
  const [cantidadInicial, setCantidadInicial] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // Movement form states
  const [movementType, setMovementType] = useState<"ENTRADA" | "SALIDA">("ENTRADA");
  const [movementCantidad, setMovementCantidad] = useState("");
  const [movementMotivo, setMovementMotivo] = useState("");
  const [movementReferencia, setMovementReferencia] = useState("");
  const [movementNotas, setMovementNotas] = useState("");

  const onAddProducto = async () => {
    const success = await handleAddProducto({
      productoId: selectedProducto,
      cantidadInicial: parseInt(cantidadInicial),
      stockMinimo: parseInt(stockMinimo) || 0,
      ubicacion: ubicacion.trim() || null,
    });
    if (success) {
      setShowAddDialog(false);
      setSelectedProducto("");
      setCantidadInicial("");
      setStockMinimo("");
      setUbicacion("");
    }
  };

  const onRegisterMovement = async () => {
    if (!selectedInventario) return;
    const success = await handleMovement({
      inventarioId: selectedInventario.id,
      tipo: movementType,
      cantidad: parseInt(movementCantidad),
      motivo: movementMotivo.trim(),
      referencia: movementReferencia.trim() || null,
      notas: movementNotas.trim() || null,
    });
    if (success) {
      setShowMovementDialog(false);
      setMovementType("ENTRADA");
      setMovementCantidad("");
      setMovementMotivo("");
      setMovementReferencia("");
      setMovementNotas("");
      setSelectedInventario(null);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || loading) {
    return (
      <DashboardLayout
        title="Inventario Digital"
        subtitle="Controla en tiempo real el stock de tus neumáticos"
      >
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-500 mx-auto"></div>
            <p className="mt-4 text-[#2b3b4c] font-medium">
              {status === "loading" ? "Verificando sesión..." : "Cargando inventario..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Inventario Digital"
      subtitle="Controla en tiempo real el stock de tus neumáticos y genera movimientos con trazabilidad"
    >
      <InventarioGuard>
        <div className="w-full space-y-6">
          <InventoryStats resumen={resumen} />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por marca, modelo o nombre..."
                value={searchTerm}
                onChange={(e: unknown) =>
                  setSearchTerm((e as ReturnType<typeof JSON.parse>).target.value)
                }
                className="pl-10 h-11 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm rounded-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <Link href="/dashboard/generador/inventario/movimientos">
                <Button
                  variant="outline"
                  className="h-11 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 rounded-lg"
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver movimientos
                </Button>
              </Link>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm hover:shadow-md rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="text-emerald-900 font-bold">
                      Agregar al inventario
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                      Selecciona un producto existente y define el stock inicial y ubicación.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="producto">Producto</Label>
                      <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                        <SelectTrigger className="h-11 border-gray-300">
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200 shadow-lg">
                          {productos.map((producto: ReturnType<typeof JSON.parse>) => (
                            <SelectItem
                              key={producto.id}
                              value={producto.id}
                              className="hover:bg-emerald-50 focus:bg-emerald-50"
                            >
                              {producto.marca} {producto.modelo} • {producto.medidas}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cantidad">Stock inicial</Label>
                        <Input
                          id="cantidad"
                          type="number"
                          value={cantidadInicial}
                          onChange={(e: unknown) =>
                            setCantidadInicial((e as ReturnType<typeof JSON.parse>).target.value)
                          }
                          className="h-11 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stockMinimo">Stock mínimo</Label>
                        <Input
                          id="stockMinimo"
                          type="number"
                          value={stockMinimo}
                          onChange={(e: unknown) =>
                            setStockMinimo((e as ReturnType<typeof JSON.parse>).target.value)
                          }
                          className="h-11 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="ubicacion">Ubicación</Label>
                      <Input
                        id="ubicacion"
                        placeholder="Ej: Bodega principal"
                        value={ubicacion}
                        onChange={(e: unknown) =>
                          setUbicacion((e as ReturnType<typeof JSON.parse>).target.value)
                        }
                        className="h-11 border-gray-300"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddDialog(false)}
                        className="h-11 border-gray-300"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={onAddProducto}
                        className="h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm overflow-hidden"
                      >
                        Registrar producto
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-emerald-900">Productos en inventario</h2>
                <p className="text-sm text-gray-600">
                  Gestiona el stock y los movimientos asociados
                </p>
              </div>
              <Badge
                variant="outline"
                className="px-3 py-1 text-xs font-semibold border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {inventarios.length} registros
              </Badge>
            </div>

            <InventoryTable
              inventarios={inventarios}
              onMovement={(inv) => {
                setSelectedInventario(inv);
                setShowMovementDialog(true);
              }}
              onAddFirst={() => setShowAddDialog(true)}
            />
          </div>

          <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-emerald-900 font-bold">
                  Registrar Movimiento
                </DialogTitle>
                <DialogDescription>
                  {selectedInventario &&
                    `Ajuste para ${selectedInventario.producto.marca} ${selectedInventario.producto.modelo}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={movementType}
                    onValueChange={(v: ReturnType<typeof JSON.parse>) => setMovementType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                      <SelectItem value="ENTRADA">Entrada (+)</SelectItem>
                      <SelectItem value="SALIDA">Salida (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      value={movementCantidad}
                      onChange={(e: unknown) =>
                        setMovementCantidad((e as ReturnType<typeof JSON.parse>).target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Motivo</Label>
                    <Select value={movementMotivo} onValueChange={setMovementMotivo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                        {[
                          "Producción",
                          "Importación",
                          "Venta",
                          "Entrega REP",
                          "Devolución",
                          "Pérdida",
                          "Ajuste",
                          "Otro",
                        ].map((m: ReturnType<typeof JSON.parse>) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Referencia (opcional)</Label>
                  <Input
                    value={movementReferencia}
                    onChange={(e: unknown) =>
                      setMovementReferencia((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Notas (opcional)</Label>
                  <Textarea
                    value={movementNotas}
                    onChange={(e: unknown) =>
                      setMovementNotas((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowMovementDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={onRegisterMovement}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Registrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </InventarioGuard>
    </DashboardLayout>
  );
}
