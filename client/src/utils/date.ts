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

const getCurrentDateInYMDFormat = () => {
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
