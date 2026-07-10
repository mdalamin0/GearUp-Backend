import { prisma } from "../../lib/prisma";
import { IReviewPayload, IUpdateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: IReviewPayload,
) => {
  const { gearItemId, rating, comment } = payload;
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
        omit: { password: true },
      },
      gearItem: true,
    },
  });

  return review;
};

const getReviews = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new Error("Gear item not found!");
  }

  const reviews = await prisma.review.findMany({
    where: {
      gearItemId: gearId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return reviews;
};

const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: IUpdateReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.customerId !== customerId) {
    throw new Error("Forbidden. You are not the owner of this review.");
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
  });

  return updatedReview;
};

const deleteReview = async (reviewId: string, customerId: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.customerId !== customerId) {
    throw new Error("Forbidden. You are not the owner of this review");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

};

export const reviewServices = {
  createReviewIntoDB,
  getReviews,
  updateReview,
  deleteReview
};
