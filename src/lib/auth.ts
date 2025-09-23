import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { loginSchema } from './validations';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials);

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              school: true
            }
          });

          if (!user) {
            throw new Error('Email không tồn tại');
          }

          // For OAuth users who don't have password
          if (!user.password) {
            throw new Error('Vui lòng đăng nhập bằng Google');
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Mật khẩu không chính xác');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            schoolId: user.schoolId || undefined,
            schoolName: user.school?.name
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),

    // Google Provider (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                email: profile.email,
                name: profile.name,
                avatar: profile.picture,
                role: 'STUDENT' // Default role for OAuth users
              };
            }
          })
        ]
      : [])
  ],

  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Store user info in JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.schoolId = user.schoolId || undefined;
        token.schoolName = user.schoolName;
      }

      // Handle OAuth sign-in
      if (account?.provider === 'google' && user) {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { school: true }
          });

          if (existingUser) {
            token.id = existingUser.id;
            token.role = existingUser.role;
            token.schoolId = existingUser.schoolId || undefined;
            token.schoolName = existingUser.school?.name;
          } else {
            // Create new user for OAuth
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                avatar: user.image,
                role: 'STUDENT' // Default role
              },
              include: { school: true }
            });

            token.id = newUser.id;
            token.role = newUser.role;
            token.schoolId = newUser.schoolId || undefined;
            token.schoolName = newUser.school?.name;
          }
        } catch (error) {
          console.error('Error handling OAuth user:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.schoolId = token.schoolId as string | undefined;
        session.user.schoolName = token.schoolName as string | undefined;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  events: {
    async signIn({ user, account }) {
      console.log('User signed in:', { 
        user: user.email, 
        provider: account?.provider 
      });
    },
    async signOut({ session }) {
      console.log('User signed out:', session?.user?.email);
    }
  },

  debug: process.env.NODE_ENV === 'development'
};

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    role: string;
    schoolId?: string | undefined;
    schoolName?: string;
    password?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      schoolId?: string | undefined;
      schoolName?: string | undefined;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    schoolId?: string | undefined;
    schoolName?: string | undefined;
  }
}