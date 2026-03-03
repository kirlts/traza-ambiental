/**
 * Mock de AWS S3 para tests
 */

// Test básico para que Jest no falle
describe("AWS S3 Mock", () => {
  it("debe existir", () => {
    expect(mockS3Client).toBeDefined();
    expect(mockS3Send).toBeDefined();
  });
});

export const mockS3Send = jest.fn();
export const mockS3Client = jest.fn(() => ({
  send: mockS3Send,
}));

export const mockPutObjectCommand = jest.fn();

// Mock por defecto: upload exitoso
mockS3Send.mockResolvedValue({
  ETag: '"mock-etag-12345"',
  Location: "https://mock-bucket.s3.amazonaws.com/mock-key",
  Key: "mock-key",
  Bucket: "mock-bucket",
});

export const S3Client = mockS3Client;
export const PutObjectCommand = mockPutObjectCommand;
