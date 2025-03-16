import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt" as "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();

        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        // 🔹 Find user by username
        const user = await employeeAuth.findOne({
          username: credentials.username,
        });

        if (!user) {
          throw new Error("⚠️ User not found");
        }

        // 🔹 Validate password
        const isValidPassword = await bcryptjs.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("❌ Incorrect password");
        }

        // ✅ Return additional user fields (including profile photo)
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          profilePhoto: user.profilePhoto || null, // 🔥 Include profile photo
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      console.log("🔑 JWT Callback - Before:", token);

      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.image = user.profilePhoto || null; // ✅ Include profile photo in JWT
      }

      console.log("🔑 JWT Callback - After:", token);
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log("📂 Session Callback - Before:", session);

      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.image || null; // ✅ Assign image from token

        delete session.user.name;
      }

      console.log("📂 Session Callback - After:", session);
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
