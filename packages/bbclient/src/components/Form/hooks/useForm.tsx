"use client";

import { useRef } from "react";

export const useForm = <T extends Record<string, any>>() => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const getValues = (): T => {
    if (!formRef.current) throw new Error("Form ref not found");

    const formData = new FormData(formRef.current);
    console.log({ formData });

    const data: Partial<T> = {};

    formData.forEach((value, key) => {
      console.log({ value, key });

      const str = value.toString();

      if (!isNaN(Number(str)) && str.trim() !== "") {
        data[key as keyof T] = Number(str) as any;
      } else {
        data[key as keyof T] = str as any;
      }
    });

    return data as T;
  };

  return { formRef, getValues };
};
