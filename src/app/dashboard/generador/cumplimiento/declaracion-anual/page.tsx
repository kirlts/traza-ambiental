"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  usePeriodoActivo,
  useGuardarDeclaracion,
  useEnviarDeclaracion,
} from "@/hooks/useDeclaracionAnual";
import { useCalcularMetas } from "@/hooks/useCalcularMetas";
import { CATEGORIAS_NEUMATICOS } from "@/lib/validations/declaracion-anual";
import { toast } from "sonner";

interface CategoriaForm {
  tipo: "A" | "B";
  nombre: string;
  descripcion: string;
  cantidadUnidades: number;
  pesoToneladas: number;
}

export default function DeclaracionAnualPage() {
  const { data: periodo, isLoading: loadingPeriodo } = usePeriodoActivo();
  const guardarMutation = useGuardarDeclaracion();
  const enviarMutation = useEnviarDeclaracion();

  if (loadingPeriodo) {
    return (
      <DashboardLayout title="Declaración Anual" subtitle="Cargando...">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#459e60]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Declaración Anual de Neumáticos"
      subtitle={`Declare los neumáticos introducidos al mercado durante el año ${periodo?.anio || new Date().getFullYear() - 1}`}
    >
      <DeclaracionFormInner
        key={periodo?.declaracionExistente?.id || "nuevo"}
        periodo={periodo}
        guardarMutation={guardarMutation}
        enviarMutation={enviarMutation}
      />
    </DashboardLayout>
  );
}

function DeclaracionFormInner({
  periodo,
  guardarMutation,
  enviarMutation,
}: ReturnType<typeof JSON.parse>) {
  const [categorias, setCategorias] = useState<ReturnType<typeof JSON.parse>[]>(() => {
    if (periodo?.declaracionExistente?.categorias?.length > 0) {
      const catA = periodo.declaracionExistente.categorias.find(
        (c: ReturnType<typeof JSON.parse>) => c.nombre.includes("liviano")
      );
      const catB = periodo.declaracionExistente.categorias.find(
        (c: ReturnType<typeof JSON.parse>) => c.nombre.includes("pesado")
      );
      return [
        {
          tipo: "A",
          nombre: CATEGORIAS_NEUMATICOS.A.nombre,
          descripcion: CATEGORIAS_NEUMATICOS.A.descripcion,
          cantidadUnidades: catA?.cantidadUnidades || 0,
          pesoToneladas: catA?.pesoToneladas || 0,
        },
        {
          tipo: "B",
          nombre: CATEGORIAS_NEUMATICOS.B.nombre,
          descripcion: CATEGORIAS_NEUMATICOS.B.descripcion,
          cantidadUnidades: catB?.cantidadUnidades || 0,
          pesoToneladas: catB?.pesoToneladas || 0,
        },
      ];
    }
    return [
      {
        tipo: "A",
        nombre: CATEGORIAS_NEUMATICOS.A.nombre,
        descripcion: CATEGORIAS_NEUMATICOS.A.descripcion,
        cantidadUnidades: 0,
        pesoToneladas: 0,
      },
      {
        tipo: "B",
        nombre: CATEGORIAS_NEUMATICOS.B.nombre,
        descripcion: CATEGORIAS_NEUMATICOS.B.descripcion,
        cantidadUnidades: 0,
        pesoToneladas: 0,
      },
    ];
  });

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const totalUnidades = categorias.reduce(
    (sum, cat: ReturnType<typeof JSON.parse>) => sum + (cat.cantidadUnidades || 0),
    0
  );
  const totalToneladas = categorias.reduce(
    (sum, cat: ReturnType<typeof JSON.parse>) => sum + (cat.pesoToneladas || 0),
    0
  );
  useCalcularMetas(periodo?.anio || 2024, totalToneladas);

  const handleCategoriaChange = (
    index: number,
    field: keyof CategoriaForm,
    value: string | number
  ) => {
    const nuevasCategorias = [...categorias];
    nuevasCategorias[index] = { ...nuevasCategorias[index], [field]: value };
    setCategorias(nuevasCategorias);
  };

  const handleGuardarBorrador = async () => {
    if (!periodo) return;
    try {
      const categoriasConDatos = categorias.filter(
        (cat) => cat.cantidadUnidades > 0 || cat.pesoToneladas > 0
      );
      if (categoriasConDatos.length === 0) {
        toast.error("Debe ingresar al menos una categoría con datos");
        return;
      }
      await guardarMutation.mutateAsync({ anio: periodo.anio, categorias: categoriasConDatos });
      toast.success("Borrador guardado exitosamente");
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleEnviar = () => {
    if (totalUnidades === 0 || totalToneladas === 0) {
      toast.error("Debe ingresar al menos una categoría");
      return;
    }
    setMostrarConfirmacion(true);
  };

  const confirmarEnvio = async () => {
    try {
      if (!periodo?.declaracionExistente) await handleGuardarBorrador();
      const declaracionId = periodo?.declaracionExistente?.id;
      if (declaracionId) {
        await enviarMutation.mutateAsync(declaracionId);
        toast.success("Declaración enviada exitosamente");
        setMostrarConfirmacion(false);
      }
    } catch {
      toast.error("Error al enviar");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ... (resto del JSX actual adaptado para usar props y estado local) ... */}
      {/* He simplificado un poco las alertas directas al DOM por toast para mayor limpieza */}

      {periodo && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900">Período: {periodo.anio}</p>
              <p className="text-xs text-emerald-700">
                Límite: {new Date(periodo.fechaLimite).toLocaleDateString("es-CL")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-5">
          {categorias.map((categoria, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50/50">
              <h3 className="font-bold mb-2">{categoria.nombre}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={categoria.cantidadUnidades || ""}
                  onChange={(e: unknown) =>
                    handleCategoriaChange(
                      index,
                      "cantidadUnidades",
                      parseInt((e as ReturnType<typeof JSON.parse>).target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Unidades"
                />
                <input
                  type="number"
                  step="0.01"
                  value={categoria.pesoToneladas || ""}
                  onChange={(e: unknown) =>
                    handleCategoriaChange(
                      index,
                      "pesoToneladas",
                      parseFloat((e as ReturnType<typeof JSON.parse>).target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Toneladas"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-600 rounded-xl p-6 text-white text-center">
        <p className="text-lg">Total: {totalToneladas.toFixed(2)} Toneladas</p>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          onClick={handleGuardarBorrador}
          disabled={guardarMutation.isPending}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          {guardarMutation.isPending ? "Guardando..." : "Guardar Borrador"}
        </button>
        <button
          onClick={handleEnviar}
          disabled={enviarMutation.isPending || totalToneladas <= 0}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          {enviarMutation.isPending ? "Enviando..." : "Enviar Declaración"}
        </button>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirmar Envío</h3>
            <p className="mb-6">
              ¿Seguro que desea enviar la declaración? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEnvio}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
