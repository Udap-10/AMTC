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

        // ✅ Ensure username is correctly assigned in the returned object
        return {
          id: user._id.toString(), // Ensures NextAuth recognizes the user ID
          username: user.username, // Ensures username is passed instead of name
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      console.log("🔑 JWT Callback - Before:", token); // Debugging

      // ✅ Assign username and email correctly
      if (user) {
        token.id = user.id;
        token.username = user.username; // Ensure username is used
        token.email = user.email;
      }

      console.log("🔑 JWT Callback - After:", token); // Debugging
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log("📂 Session Callback - Before:", session); // Debugging

      // ✅ Correctly set session.user with username instead of name
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;

        // 🔹 Remove unwanted 'name' field if it exists
        delete session.user.name;
      }

      console.log("📂 Session Callback - After:", session); // Debugging
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
