import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { token, newPassword } = await request.json();

  try {
    // Check if the reset token is valid and not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }, // Token must not be expired
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 400,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and remove the reset token and expiration
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return new Response(JSON.stringify({ message: 'Password reset successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return new Response(JSON.stringify({ error: 'Failed to reset password' }), {
      status: 500,
    });
  }
}
