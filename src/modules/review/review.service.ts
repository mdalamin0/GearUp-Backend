import { prisma } from "../../lib/prisma";
import { IReviewPayload } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: IReviewPayload,
) => {
  const {gearItemId, rating, comment} = payload;
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gear) {
    throw new Error("Gear item not found.");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const completedOrder = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearItemId: gearItemId,
      status: "RETURNED",
    },
  });

  if (!completedOrder) {
    throw new Error("You can review only after returning the rented gear.");
  }


  const review = await prisma.review.create({
    data: {
      customerId,
      gearItemId,
      rating: Number(rating),
      comment,
    },
    include: {
      customer: {
        omit: {password: true}
      },
       gearItem: true
    }
  });

  return review;
};

export const reviewServices = {
  createReviewIntoDB,
};
