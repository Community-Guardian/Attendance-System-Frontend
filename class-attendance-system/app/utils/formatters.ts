import dayjs from "dayjs";

export function formatCurrency(amount: number | string) {
  return `KSh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: string) {
  return dayjs(date).format("DD MMM YYYY");
}
