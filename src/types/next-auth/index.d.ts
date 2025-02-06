// Global type additions to Next Auth's session

declare module "next-auth" {
  interface Session {
    data: {
      accessToken: string;
    };
  }
}
