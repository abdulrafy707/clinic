import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Login API
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Compare the password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return NextResponse.json({ token, user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed. ' + error.message }, { status: 500 });
    }
}
