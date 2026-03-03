/**
 * @jest-environment jsdom
 * Tests unitarios para helper de validación de RUT chileno
 * HU-003B: Crear Solicitud de Retiro
 */

import {
  validarRUT,
  formatearRUT,
  limpiarRUT,
  calcularDigitoVerificador,
} from "@/lib/helpers/validarRUT";

describe("validarRUT", () => {
  describe("RUTs válidos", () => {
    it("debe validar RUT sin formato", () => {
      expect(validarRUT("12345678-5")).toBe(true);
    });

    it("debe validar RUT con puntos", () => {
      expect(validarRUT("12.345.678-5")).toBe(true);
    });

    it("debe validar RUT con K mayúscula", () => {
      expect(validarRUT("11111111-K")).toBe(true);
    });

    it("debe validar RUT con k minúscula", () => {
      expect(validarRUT("11111111-k")).toBe(true);
    });

    it("debe validar RUT corto válido", () => {
      expect(validarRUT("1234567-K")).toBe(true);
    });

    it("debe validar RUT largo válido", () => {
      expect(validarRUT("25.456.789-6")).toBe(true);
    });

    it("debe validar RUT solo números", () => {
      expect(validarRUT("123456785")).toBe(true);
    });

    // RUTs reales de prueba
    it("debe validar RUTs reales comunes", () => {
      expect(validarRUT("11.111.111-1")).toBe(true);
      expect(validarRUT("22.222.222-2")).toBe(true);
      expect(validarRUT("33.333.333-3")).toBe(true);
    });
  });

  describe("RUTs inválidos", () => {
    it("debe rechazar RUT con dígito verificador incorrecto", () => {
      expect(validarRUT("12345678-9")).toBe(false);
    });

    it("debe rechazar RUT vacío", () => {
      expect(validarRUT("")).toBe(false);
    });

    it("debe rechazar RUT null", () => {
      expect(validarRUT(null as any)).toBe(false);
    });

    it("debe rechazar RUT undefined", () => {
      expect(validarRUT(undefined as any)).toBe(false);
    });

    it("debe rechazar RUT con solo letras", () => {
      expect(validarRUT("abcdefgh-i")).toBe(false);
    });

    it("debe rechazar RUT con caracteres especiales", () => {
      expect(validarRUT("12@456#8-5")).toBe(false);
    });

    it("debe rechazar RUT demasiado corto", () => {
      expect(validarRUT("123-4")).toBe(false);
    });

    it("debe rechazar RUT demasiado largo", () => {
      expect(validarRUT("123456789012-3")).toBe(false);
    });

    it("debe rechazar RUT con formato incorrecto", () => {
      expect(validarRUT("12.345.678/5")).toBe(false);
    });

    it("debe rechazar RUT con múltiples guiones", () => {
      expect(validarRUT("12-345-678-5")).toBe(false);
    });
  });

  describe("Casos límite", () => {
    it("debe validar RUT con espacios", () => {
      expect(validarRUT("  12345678-5  ")).toBe(true);
    });

    it("debe rechazar RUT solo con guión", () => {
      expect(validarRUT("-")).toBe(false);
    });

    it("debe rechazar RUT solo con dígito verificador", () => {
      expect(validarRUT("-5")).toBe(false);
    });

    it("debe rechazar RUT con ceros al inicio", () => {
      expect(validarRUT("00000001-9")).toBe(false);
    });
  });
});

describe("formatearRUT", () => {
  it("debe formatear RUT sin formato a formato estándar", () => {
    expect(formatearRUT("123456785")).toBe("12.345.678-5");
  });

  it("debe formatear RUT con guión pero sin puntos", () => {
    expect(formatearRUT("12345678-5")).toBe("12.345.678-5");
  });

  it("debe mantener RUT ya formateado", () => {
    expect(formatearRUT("12.345.678-5")).toBe("12.345.678-5");
  });

  it("debe formatear RUT con K mayúscula", () => {
    expect(formatearRUT("11111111K")).toBe("11.111.111-K");
  });

  it("debe formatear RUT con k minúscula a mayúscula", () => {
    expect(formatearRUT("11111111k")).toBe("11.111.111-K");
  });

  it("debe formatear RUT corto", () => {
    expect(formatearRUT("1234567K")).toBe("1.234.567-K");
  });

  it("debe manejar RUT con espacios", () => {
    expect(formatearRUT("  12345678 5  ")).toBe("12.345.678-5");
  });

  it("debe retornar string vacío si RUT es inválido", () => {
    expect(formatearRUT("abcdefgh")).toBe("");
  });

  it("debe retornar string vacío si RUT es null", () => {
    expect(formatearRUT(null as any)).toBe("");
  });
});

describe("limpiarRUT", () => {
  it("debe remover puntos y guión", () => {
    expect(limpiarRUT("12.345.678-5")).toBe("123456785");
  });

  it("debe remover espacios", () => {
    expect(limpiarRUT("  12 345 678-5  ")).toBe("123456785");
  });

  it("debe convertir k minúscula a mayúscula", () => {
    expect(limpiarRUT("11111111-k")).toBe("11111111K");
  });

  it("debe manejar RUT ya limpio", () => {
    expect(limpiarRUT("123456785")).toBe("123456785");
  });

  it("debe retornar string vacío para entrada vacía", () => {
    expect(limpiarRUT("")).toBe("");
  });

  it("debe manejar solo caracteres especiales", () => {
    expect(limpiarRUT(".-.-.-")).toBe("");
  });
});

describe("calcularDigitoVerificador", () => {
  it("debe calcular DV correcto para RUT común", () => {
    expect(calcularDigitoVerificador("12345678")).toBe("5");
  });

  it("debe calcular DV = K cuando corresponde", () => {
    expect(calcularDigitoVerificador("11111111")).toBe("K");
  });

  it("debe calcular DV = 0 cuando corresponde", () => {
    expect(calcularDigitoVerificador("8888888")).toBe("0");
  });

  it("debe calcular DV para RUT corto", () => {
    expect(calcularDigitoVerificador("1234567")).toBe("K");
  });

  it("debe calcular DV para RUT largo", () => {
    expect(calcularDigitoVerificador("25456789")).toBe("6");
  });

  it("debe retornar null para entrada inválida", () => {
    expect(calcularDigitoVerificador("")).toBeNull();
    expect(calcularDigitoVerificador("abc")).toBeNull();
    expect(calcularDigitoVerificador(null as any)).toBeNull();
  });

  it("debe ignorar entrada con DV incluido", () => {
    // Debe tomar solo la parte numérica
    expect(calcularDigitoVerificador("12345678")).toBe("5");
  });

  // Casos específicos conocidos
  it("debe validar casos reales conocidos", () => {
    expect(calcularDigitoVerificador("11111111")).toBe("K");
    expect(calcularDigitoVerificador("22222222")).toBe("2");
    expect(calcularDigitoVerificador("33333333")).toBe("3");
  });
});

describe("Integración RUT completo", () => {
  const casosValidos = [
    { input: "12345678-5", formatted: "12.345.678-5", clean: "123456785" },
    { input: "11111111-K", formatted: "11.111.111-K", clean: "11111111K" },
    { input: "25.456.789-6", formatted: "25.456.789-6", clean: "254567896" },
    { input: "1234567-K", formatted: "1.234.567-K", clean: "1234567K" },
  ];

  casosValidos.forEach(({ input, formatted, clean }) => {
    it(`debe validar, formatear y limpiar correctamente: ${input}`, () => {
      expect(validarRUT(input)).toBe(true);
      expect(formatearRUT(input)).toBe(formatted);
      expect(limpiarRUT(input)).toBe(clean);
    });
  });
});
