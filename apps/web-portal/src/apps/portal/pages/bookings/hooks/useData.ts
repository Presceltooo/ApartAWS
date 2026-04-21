import { useMemo } from 'react';

const MOCK_BOOKINGS = [
  {
    id: 'AH-8X9Y2L',
    property: 'The Glass House at Ridgeview',
    location: 'Carmel Valley, California',
    status: 'upcoming',
    checkIn: 'Oct 12, 2024',
    checkOut: 'Oct 26, 2024',
    guests: 2,
    totalPrice: 13000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIEHrWcc9uhi-Vd-OeQBFIeX27vMCRqYZJ7P28wWQv3sG9lZ-ra_3wjqImdWdEjmHqD35WsQsJXNN2WA1nGm1nJMLrvEUpHDQV3dijPymMyedGbS6tDbhi2rN1E58fKOt7jZbGsqla7gksVKq6xVHRYn8wNzYbgPi_yvCGVzOw7NR8QdbkmsGfWAVLAbxISUxb5omoKYoqw9zR4lK3k_Qr9Hz1GGxKXSsIUFVRN35d_kzLnN5CLSKRWn1FZJNopfjiVuhek3UQfj8'
  },
  {
    id: 'AH-3M4N5P',
    property: 'Heritage Timber Loft',
    location: 'Copenhagen, Denmark',
    status: 'completed',
    checkIn: 'Aug 05, 2024',
    checkOut: 'Aug 12, 2024',
    guests: 2,
    totalPrice: 2240,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6MIazBc72H6a5qCJ0J-Nsa4PNTb6tA_BYVGzFy69wqFpC7d55YuTlzQz-pQxiK77GkZQ0G483GXad1ZwypNfVSgHApdYdc5inOPb87cydfBPqfE0B0c7s5wGpq_CAqCOBNK6Cc0MHR9eGxzpEPqX9x-JNH21cr7FPP-Z-Jnb_1UNcv4yOQJ0VqLPyOJX9-DZD9jKDihj9jt04pziMjf6D07DwaWkfSg9aUuB6L5ot8rfFybD7maBhlUE3n2Rz2By0oZykaXbd0peP'
  }
];

export const useBookingsData = () => {
  const bookings = useMemo(() => MOCK_BOOKINGS, []);
  const isLoading = false;
  
  return {
    bookings,
    isLoading
  };
};
