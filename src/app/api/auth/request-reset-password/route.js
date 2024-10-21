import prisma from '../../../../../lib/prisma';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../../../../../lib/sendResetPasswordEmail';

export async function POST(request) {
  const { email } = await request.json();

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token and expiration date in the database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send the reset password email
    await sendResetPasswordEmail(email, resetToken);

    return new Response(JSON.stringify({ message: 'Password reset email sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return new Response(JSON.stringify({ error: 'Failed to send password reset email' }), {
      status: 500,
    });
  }
}
