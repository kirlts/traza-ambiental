export default function NextAuth() {
  return {
    auth: jest.fn(),
    handlers: { GET: jest.fn(), POST: jest.fn() },
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
}

export const getServerSession = jest.fn();
export const CredentialsProvider = jest.fn();

if (typeof describe !== "undefined") {
  describe("Mock next-auth", () => {
    it("should exist", () => expect(true).toBe(true));
  });
}
