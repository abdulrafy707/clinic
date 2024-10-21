import prisma from '../../../../lib/prisma';

export async function PUT(request) {
  const { userId, name, phone, city, state, country, address } = await request.json();

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      name,
      phone,
      city,
      state,
      country,
      address,
    },
  });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
  });
}
