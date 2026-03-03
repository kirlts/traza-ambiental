import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, TrendingDown, Package, AlertCircle } from "lucide-react";
import { Inventario } from "@/hooks/useInventario";

interface InventoryTableProps {
  inventarios: Inventario[];
  onMovement: (inventario: Inventario) => void;
  onAddFirst: () => void;
}

export function InventoryTable({ inventarios, onMovement, onAddFirst }: InventoryTableProps) {
  if (inventarios.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No hay productos</h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
          Comienza agregando productos a tu inventario para gestionar el stock y los movimientos.
        </p>
        <Button
          onClick={onAddFirst}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm hover:shadow-md"
        >
          Agregar Primer Producto
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {inventarios.map((inventario) => (
        <div key={inventario.id} className="p-6 hover:bg-emerald-50/30 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4">
                <div
                  className={`w-4 h-4 rounded-full mt-1.5 flex-shrink-0 ${
                    inventario.stockActual <= inventario.stockMinimo
                      ? "bg-red-500"
                      : inventario.stockActual <= inventario.stockMinimo * 1.5
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {inventario.producto.marca} {inventario.producto.modelo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {inventario.producto.nombre} • {inventario.producto.medidas}
                      </p>
                    </div>
                    {inventario.stockActual <= inventario.stockMinimo && (
                      <Badge variant="destructive" className="text-xs flex-shrink-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Stock Bajo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      {inventario.producto.categoria.nombre}
                    </Badge>
                    {inventario.ubicacion && (
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {inventario.ubicacion}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 lg:border-l lg:border-gray-200 lg:pl-6">
              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold text-gray-900">{inventario.stockActual}</div>
                <div className="text-sm text-gray-600 font-medium">unidades</div>
                <div className="text-xs text-gray-500 mt-1">
                  Mínimo: <span className="font-semibold">{inventario.stockMinimo}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMovement(inventario)}
                  className="text-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  Registrar Movimiento
                </Button>
              </div>
            </div>
          </div>

          {inventario.ultimosMovimientos.length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-gray-500" />
                Últimos movimientos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {inventario.ultimosMovimientos.map((movimiento) => (
                  <div
                    key={movimiento.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${movimiento.tipo === "ENTRADA" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {movimiento.tipo === "ENTRADA" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold ${movimiento.tipo === "ENTRADA" ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {movimiento.tipo === "ENTRADA" ? "+" : "-"}
                        {Math.abs(movimiento.cantidad)} unidades
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-0.5">{movimiento.motivo}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(movimiento.fechaMovimiento).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
