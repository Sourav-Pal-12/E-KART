// Static exchange rate (can be updated from API later)
const USD_TO_INR_RATE = 92.62; // example live rate

export const convertUsdToInr = (usdAmount: number = 0) => {
  return usdAmount * USD_TO_INR_RATE;
};