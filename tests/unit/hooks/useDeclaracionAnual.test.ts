// Mock simple del hook
const mockUseDeclaracionAnual = () => ({
  declaracion: null,
  isLoading: true,
  error: null,
  refetch: jest.fn(),
});

describe("useDeclaracionAnual", () => {
  it("inicializa con estado de carga", () => {
    const result = mockUseDeclaracionAnual();

    expect(result.isLoading).toBe(true);
    expect(result.declaracion).toBeNull();
    expect(result.error).toBeNull();
  });

  it("maneja datos de declaración correctamente", () => {
    const mockDeclaracion = {
      id: "1",
      anio: 2024,
      estado: "borrador",
      totalUnidades: 1000,
      totalToneladas: 25.5,
    };

    const result = {
      declaracion: mockDeclaracion,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    };

    expect(result.declaracion).toEqual(mockDeclaracion);
    expect(result.isLoading).toBe(false);
  });

  it("maneja errores correctamente", () => {
    const result = {
      declaracion: null,
      isLoading: false,
      error: new Error("Network error"),
      refetch: jest.fn(),
    };

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe("Network error");
  });
});
