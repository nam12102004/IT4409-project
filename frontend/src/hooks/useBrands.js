import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../api/mockService";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
};
