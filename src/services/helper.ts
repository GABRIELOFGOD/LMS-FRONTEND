export function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(value);
}

export function removeFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
}

export const yearJoined = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  return year;
}


export function isError(err: unknown): err is Error {
  return err instanceof Error;
}
