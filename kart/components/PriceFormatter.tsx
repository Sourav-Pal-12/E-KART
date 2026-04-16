import { twMerge } from "tailwind-merge";
import { convertUsdToInr } from "@/constants/convertUsdToInr";

interface Props {
  amount: number | undefined; // USD price
  className?: string;
}

const PriceFormatter = ({ amount = 0, className }: Props) => {
  // Convert USD → INR
  const inrAmount = convertUsdToInr(amount);

  // Format in Indian currency
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inrAmount);

  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-darkColor",
        className
      )}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
