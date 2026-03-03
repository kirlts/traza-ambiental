import { limpiarRUT, validarRUT, formatearRUT } from "@/lib/helpers/validarRUT";

describe("validarRUT", () => {
  describe("limpiarRUT", () => {
    it("removes dots from RUT", () => {
      expect(limpiarRUT("12.345.678-5")).toBe("123456785");
    });

    it("removes dashes from RUT", () => {
      expect(limpiarRUT("12345678-5")).toBe("123456785");
    });

    it("removes spaces from RUT", () => {
      expect(limpiarRUT("12 345 678 5")).toBe("123456785");
    });

    it("converts k to K", () => {
      expect(limpiarRUT("11111111-k")).toBe("11111111K");
    });

    it("handles empty string", () => {
      expect(limpiarRUT("")).toBe("");
    });

    it("handles null/undefined", () => {
      expect(limpiarRUT(null as unknown as string)).toBe("");
      expect(limpiarRUT(undefined as unknown as string)).toBe("");
    });

    it("removes all formatting at once", () => {
      expect(limpiarRUT("  12.345.678 - k  ")).toBe("12345678K");
    });
  });

  describe("validarRUT", () => {
    it("validates correct RUTs", () => {
      expect(validarRUT("12345678-5")).toBe(true);
      expect(validarRUT("11111111-1")).toBe(true);
      expect(validarRUT("123456785")).toBe(true); // without dash
      expect(validarRUT("111111111")).toBe(true); // without dash
    });

    it("rejects invalid RUTs", () => {
      expect(validarRUT("12345678-6")).toBe(false); // wrong check digit
      expect(validarRUT("11111111-0")).toBe(false); // wrong check digit
      expect(validarRUT("12345678")).toBe(false); // too short
      expect(validarRUT("")).toBe(false); // empty
    });

    it("validates RUTs with formatting", () => {
      expect(validarRUT("12.345.678-5")).toBe(true);
      expect(validarRUT("  12.345.678 - 5  ")).toBe(true);
    });
  });

  describe("formatearRUT", () => {
    it("formats RUT correctly", () => {
      expect(formatearRUT("123456785")).toBe("12.345.678-5");
      expect(formatearRUT("111111111")).toBe("11.111.111-1");
    });

    it("handles already formatted RUTs", () => {
      expect(formatearRUT("12.345.678-5")).toBe("12.345.678-5");
    });

    it("handles short RUTs", () => {
      expect(formatearRUT("12345678")).toBe("1.234.567-8");
    });
  });
});
