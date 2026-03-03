import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { ResumenInventario } from "@/hooks/useInventario";

interface InventoryStatsProps {
  resumen: ResumenInventario | null;
}

export function InventoryStats({ resumen }: InventoryStatsProps) {
  if (!resumen) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border border-emerald-100 shadow-sm bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">
            Total Productos
          </CardTitle>
          <div className="p-2.5 bg-emerald-600 rounded-lg shadow-sm">
            <Package className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-emerald-900 mb-1">{resumen.totalProductos}</div>
          <p className="text-xs font-medium text-gray-600">Referencia única por marca/modelo</p>
        </CardContent>
      </Card>

      <Card className="border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
            Unidades Totales
          </CardTitle>
          <div className="p-2.5 bg-blue-600 rounded-lg shadow-sm">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-900 mb-1">
            {resumen.totalUnidades.toLocaleString()}
          </div>
          <p className="text-xs font-medium text-gray-600">Stock disponible en almacenaje</p>
        </CardContent>
      </Card>

      <Card className="border border-amber-100 shadow-sm bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold text-amber-900 uppercase tracking-wide">
            Alertas de Stock
          </CardTitle>
          <div className="p-2.5 bg-amber-600 rounded-lg shadow-sm">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-amber-900 mb-1">{resumen.productosBajoStock}</div>
          <p className="text-xs font-medium text-gray-600">Productos requieren reposición</p>
        </CardContent>
      </Card>
    </div>
  );
}
