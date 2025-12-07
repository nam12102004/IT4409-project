import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/mockService';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};