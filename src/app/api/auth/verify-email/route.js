import prisma from "../../../../../lib/prisma";

export async function GET(request, res) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 400,
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  return new Response(JSON.stringify({ message: 'Email verified successfully' }), {
    status: 200,
  });
}
