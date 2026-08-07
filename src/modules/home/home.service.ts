import { prisma } from "../../lib/prisma";


const getHomeStatsFromDB = async () => {
  const [
    totalGear,
    totalProviders,
    totalRentals,
    completedRentals,
    ratingResult,
    happyRenters,
  ] = await Promise.all([
    prisma.gearItem.count(),

    prisma.user.count({
      where: {
        role: "PROVIDER",
      },
    }),

    prisma.rentalOrder.count(),
    prisma.rentalOrder.count({
      where: {
        status: "RETURNED",
      },
    }),

    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),
    prisma.rentalOrder.findMany({
      distinct: ["customerId"],
      select: {
        customerId: true,
      },
    }),
  ]);

  return {
    totalGear,
    totalProviders,
    totalRentals,
    completedRentals,
    happyRenters: happyRenters.length,
    averageRating: Number((ratingResult._avg.rating ?? 0).toFixed(1)),
  };
};

export const homeServices = {
  getHomeStatsFromDB,
};
