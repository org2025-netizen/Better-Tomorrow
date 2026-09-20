import { v4 as uuidv4 } from 'uuid';

export const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = uuidv4().slice(0, 8).toUpperCase();
  return `RCP-${year}${month}-${random}`;
};

export const generateAdmissionNumber = (sequence: number): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = sequence.toString().padStart(4, '0');
  return `ADM${year}${seq}`;
};

export const generateEmployeeNumber = (sequence: number): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = sequence.toString().padStart(4, '0');
  return `EMP${year}${seq}`;
};
