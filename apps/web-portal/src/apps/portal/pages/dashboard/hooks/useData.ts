import { useMemo } from 'react';

const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'The Glass Pavilion',
    location: 'Kyoto, Japan',
    price: 450,
    rating: 4.96,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIEHrWcc9uhi-Vd-OeQBFIeX27vMCRqYZJ7P28wWQv3sG9lZ-ra_3wjqImdWdEjmHqD35WsQsJXNN2WA1nGm1nJMLrvEUpHDQV3dijPymMyedGbS6tDbhi2rN1E58fKOt7jZbGsqla7gksVKq6xVHRYn8wNzYbgPi_yvCGVzOw7NR8QdbkmsGfWAVLAbxISUxb5omoKYoqw9zR4lK3k_Qr9Hz1GGxKXSsIUFVRN35d_kzLnN5CLSKRWn1FZJNopfjiVuhek3UQfj8',
    isExclusive: false,
  },
  {
    id: 2,
    title: 'Heritage Timber Loft',
    location: 'Copenhagen, Denmark',
    price: 320,
    rating: 4.85,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6MIazBc72H6a5qCJ0J-Nsa4PNTb6tA_BYVGzFy69wqFpC7d55YuTlzQz-pQxiK77GkZQ0G483GXad1ZwypNfVSgHApdYdc5inOPb87cydfBPqfE0B0c7s5wGpq_CAqCOBNK6Cc0MHR9eGxzpEPqX9x-JNH21cr7FPP-Z-Jnb_1UNcv4yOQJ0VqLPyOJX9-DZD9jKDihj9jt04pziMjf6D07DwaWkfSg9aUuB6L5ot8rfFybD7maBhlUE3n2Rz2By0oZykaXbd0peP',
    isExclusive: false,
  },
  {
    id: 3,
    title: 'Terracotta Reserve',
    location: 'Tuscany, Italy',
    price: 850,
    rating: 5.0,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPcVx2VvT4rO3DhcyA28ghtP-z_dOBmVaT38xhDfKVhqgLYWmzgBQhvI0JkG1ND4oI2bJFZZFeJlvyOEHDnC0YWySFOXc5xCqbrjZaTJoxX85V2uhLREeniGtjj5mYXbumetnfBj0QveYkbj2KjO5o88C9kNoDA-txi9BWVfVisexRRiEDXzNRQEY2BsSRzkLYgMnfOWKdh8jqqghP79y9XpswWskvMYUJS1kbtNQppl8IwoqEEcnPAn5xDHc_JSI8-2qQ935pHiam',
    isExclusive: true,
  }
];

export const useData = () => {
  // In Phase 2, this will use useQuery from @tanstack/react-query
  const listings = useMemo(() => MOCK_LISTINGS, []);
  const isLoading = false;
  const isError = false;

  return {
    listings,
    isLoading,
    isError,
  };
};