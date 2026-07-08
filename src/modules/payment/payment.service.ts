import { prisma } from "../../lib/prisma";

const createPayment = async (orderId: string, usreId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
  });

  if(!order){
    throw new Error("Order not found.")
  }

  if(order.customerId !== usreId){
    throw new Error("Forbidden. You are not the owner of this order.")
  }
  
};
