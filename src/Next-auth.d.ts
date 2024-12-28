import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      mid: string;
      email?: string | null;
      image?: string | null;
      status?: string | null;
      cid?: string | null;
    };
  }

  interface User {
    id: string;
  }
}
