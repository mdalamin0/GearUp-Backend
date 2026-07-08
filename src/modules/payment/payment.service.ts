import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import axios from "axios";
import { randomUUID } from "crypto";
import config from "../../config";
import { Prisma } from "../../../generated/prisma/client";

const initiatePayment = async (orderId: string, user: JwtPayload) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.customerId !== user.id) {
    throw new Error("Forbidden. You are not the owner of this order.");
  }

  // const existingPayment = await prisma.payment.findFirst({
  //   where: {
  //     orderId,
  //     status: "PENDING",
  //   },
  // });

  // // if (existingPayment) {
  // //   throw new Error("Payment already initiated for this order.");
  // // }

  const tranId = `TRNX_${randomUUID()}`;

  const paymentData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_password,
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.app_url}/api/payment?orderId=${order.id}&tranId=${tranId}&status=success`,
    fail_url: `${config.app_url}/api/payment?orderId=${order.id}&tranId=${tranId}&status=fail`,
    cancel_url: `${config.app_url}/api/payment?orderId=${order.id}&tranId=${tranId}&status=cancel`,
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: 1000,
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
  };

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    paymentData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  const data = await response.data;

  const GatewayPageURL = data.GatewayPageURL;
  if (!data?.GatewayPageURL) {
    throw new Error("Failed to initialize payment");
  }

  await prisma.payment.create({
    data: {
      transactionId: tranId,
      orderId: order.id,
      amount: order.totalAmount,
    },
  });

  return { PayementUrl: GatewayPageURL };
};

const verifyPayment = async (
  orderId: string,
  tranId: string,
  status: string,
  payload: Record<string, unknown>,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: tranId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

   if (status === "cancel") {
     await prisma.$transaction(async (tx) => {
       await tx.rentalOrder.update({
         where: {
           id: orderId,
         },
         data: {
           status: "CANCELLED",
         },
       });

       await tx.payment.update({
         where: {
           transactionId: tranId,
         },
         data: {
           status: "CANCELLED",
           meta: payload as Prisma.InputJsonValue,
         },
       });
     });

     return "cancel";
   }

  const valId = payload.val_id as string;

  const response = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${config.ssl_commerz_store_id}&store_passwd=${config.ssl_commerz_store_password}&format=json`,
  );

  const data = response.data;

  if (data.status === "VALID" || data.status === "VALIDATED") {
    await prisma.$transaction(async (tx) => {
      await tx.rentalOrder.update({
        where: { id: orderId },
        data: {
          status: "PAID",
        },
      });

      await tx.payment.update({
        where: { transactionId: tranId },
        data: {
          status: "PAID",
          paidAt: new Date(),
          meta: payload as Prisma.InputJsonValue,
        },
      });
    });

    return "success";
  }

  await prisma.$transaction(async (tx) => {
    await tx.rentalOrder.update({
      where: { id: orderId },
      data: {
        status: "FAILED",
      },
    });

    await tx.payment.update({
      where: { transactionId: tranId },
      data: {
        status: "FAILED",
        meta: payload as Prisma.InputJsonValue,
      },
    });
  });

  return "failed";
};

export const paymentServices = {
  initiatePayment,
  verifyPayment,
};
