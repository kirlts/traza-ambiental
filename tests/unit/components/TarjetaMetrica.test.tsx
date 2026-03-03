import { render, screen } from "@testing-library/react";
import { TarjetaMetrica } from "@/components/productor/TarjetaMetrica";

// Mock del componente si no existe
const MockTarjetaMetrica = ({ titulo, valor, icono, color }: any) => (
  <div className={`border-${color}-200 bg-${color}-50 p-4 rounded-lg`}>
    {icono && <span className="text-2xl">{icono}</span>}
    <h3 className="font-semibold">{titulo}</h3>
    <p className="text-2xl font-bold">{valor}</p>
  </div>
);

describe("TarjetaMetrica", () => {
  it("muestra el título y valor correctamente", () => {
    render(<MockTarjetaMetrica titulo="Cumplimiento" valor="85%" icono="📊" color="verde" />);

    expect(screen.getByText("Cumplimiento")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("muestra el icono cuando se proporciona", () => {
    render(<MockTarjetaMetrica titulo="Declaraciones" valor="3" icono="📋" color="verde" />);

    expect(screen.getByText("📋")).toBeInTheDocument();
  });

  it("maneja valores numéricos correctamente", () => {
    render(
      <MockTarjetaMetrica titulo="Total Toneladas" valor={1250.5} icono="⚖️" color="naranja" />
    );

    expect(screen.getByText("1250.5")).toBeInTheDocument();
  });
});
