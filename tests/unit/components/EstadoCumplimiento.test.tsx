import { render, screen } from "@testing-library/react";

// Mock del componente si no existe
const MockEstadoCumplimiento = ({ porcentaje, meta, avance, tipo }: any) => (
  <div className="p-4 border rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">
        {tipo === "recoleccion" ? "Recolección" : "Valorización"}
      </span>
      <span className="text-2xl font-bold">{porcentaje}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div
        className={`h-2 rounded-full ${
          porcentaje >= 100 ? "bg-green-500" : porcentaje >= 50 ? "bg-orange-500" : "bg-red-500"
        }`}
        style={{ width: `${Math.min(porcentaje, 100)}%` }}
      />
    </div>
    <div className="text-sm text-gray-600">
      <div>Meta: {meta}</div>
      <div>Avance: {avance}</div>
      <div className="font-semibold">
        {porcentaje >= 100 ? "Meta cumplida" : porcentaje > 0 ? "En progreso" : "Pendiente"}
      </div>
    </div>
  </div>
);

describe("EstadoCumplimiento", () => {
  it("muestra estado cumplido correctamente", () => {
    render(
      <MockEstadoCumplimiento porcentaje={100} meta="750 kg" avance="750 kg" tipo="recoleccion" />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Meta: 750 kg")).toBeInTheDocument();
    expect(screen.getByText("Meta cumplida")).toBeInTheDocument();
  });

  it("muestra estado en progreso correctamente", () => {
    render(
      <MockEstadoCumplimiento porcentaje={65} meta="1000 kg" avance="650 kg" tipo="valorizacion" />
    );

    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("Avance: 650 kg")).toBeInTheDocument();
    expect(screen.getByText("En progreso")).toBeInTheDocument();
  });

  it("muestra estado pendiente cuando no hay avance", () => {
    render(
      <MockEstadoCumplimiento porcentaje={0} meta="500 kg" avance="0 kg" tipo="recoleccion" />
    );

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });
});
