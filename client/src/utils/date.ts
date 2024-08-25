export const getDateInYMDFormat = (isoDateString?: string) => {
  if (!isoDateString) {
    return getCurrentDateInYMDFormat();
  }

  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getCurrentDateInYMDFormat = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDateInISOFormat = (date: string | undefined) => {
  if (!date) {
    return getCurrentDateInYMDFormat();
  }

  return new Date(date).toISOString();
};

export const getCurrentDateTime = () => {
  const now = new Date();

  const padToTwoDigits = (num: number) => num.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = padToTwoDigits(now.getMonth() + 1); // getMonth() is zero-based
  const day = padToTwoDigits(now.getDate());

  const hours = padToTwoDigits(now.getHours());
  const minutes = padToTwoDigits(now.getMinutes());
  const seconds = padToTwoDigits(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
