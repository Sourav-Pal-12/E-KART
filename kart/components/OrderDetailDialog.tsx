import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";

type MongoProduct = {
  productId?: string;
  sanityProductId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
};

type MongoOrder = {
  _id?: string;
  orderNumber?: string;
  clerkUserId?: string;
  customerName?: string;
  email?: string;
  products?: MongoProduct[];
  totalPrice?: number;
  currency?: string;
  amountDiscount?: number;
  address?: {
    state?: string;
    zip?: string;
    city?: string;
    address?: string;
    name?: string;
  };
  status?: string;
  orderDate?: string;
  invoice?: {
    id?: string;
    number?: string;
    hosted_invoice_url?: string;
  };
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
};

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | MongoOrder | null;
  isOpen: boolean;
  onClose: () => void;
}
const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize text-green-600 font-medium">
              {order.status}
            </span>
          </p>
          <p>
            <strong>Invoice Number:</strong> {order?.invoice?.number}
          </p>
          {order?.invoice && (
            <Button className="bg-transparent border text-darkColor/80 mt-2 hover:text-darkColor hover:border-darkColor hover:bg-darkColor/10 hoverEffect ">
              {order?.invoice?.hosted_invoice_url && (
                <Link href={order?.invoice?.hosted_invoice_url} target="_blank">
                  Download Invoice
                </Link>
              )}
            </Button>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products?.map((product, index) => {
              const isMongoDB = 'productId' in product || 'sanityProductId' in product;
              return (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {!isMongoDB && product?.product?.images ? (
                    <Image
                      src={urlFor(product?.product?.images[0]).url()}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="border rounded-sm"
                    />
                  ) : isMongoDB && product?.image ? (
                    <Image
                      src={product.image}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="border rounded-sm"
                    />
                  ) : null}

                  {isMongoDB ? product?.name : product?.product?.name}
                </TableCell>
                <TableCell>{product?.quantity}</TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={isMongoDB ? product?.price : product?.product?.price}
                    className="text-black font-medium"
                  />
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        <div className="mt-4 text-right flex items-center justify-end">
          <div className="w-44 flex flex-col gap-1">
            {order?.amountDiscount !== 0 && (
              <div className="w-full flex items-center justify-between">
                <strong>Discount: </strong>
                <PriceFormatter
                  amount={order?.amountDiscount}
                  className="text-black font-bold"
                />
              </div>
            )}
            {order?.amountDiscount !== 0 && (
              <div className="w-full flex items-center justify-between">
                <strong>Subtotal: </strong>
                <PriceFormatter
                  amount={
                    (order?.totalPrice as number) +
                    (order?.amountDiscount as number)
                  }
                  className="text-black font-bold"
                />
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <strong>Total: </strong>
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-black font-bold"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
