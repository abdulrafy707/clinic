import prisma from '../../../../../lib/prisma';
import { sendVerificationEmail } from '../../../../../lib/sendVerificationEmail'; // Import the function
import crypto from 'crypto'; // For generating tokens
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

export async function POST(request) {
  const { name, email, password, phone, city, state, country, address } = await request.json();

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
      });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        city,
        state,
        country,
        address,
        verificationToken,
        verificationTokenExpires,
        isEmailVerified: false, // Initially, the email is not verified
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    return new Response(JSON.stringify({ message: 'User created successfully, please verify your email' }), {
      status: 201,
    });

  } catch (error) {
    console.error('Error during sign-up:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
    });
  }
}
