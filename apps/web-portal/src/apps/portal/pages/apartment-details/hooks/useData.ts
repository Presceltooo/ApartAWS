import { useMemo } from 'react';

const MOCK_DETAIL = {
  title: 'The Glass House at Ridgeview',
  location: 'Carmel Valley, California',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIEHrWcc9uhi-Vd-OeQBFIeX27vMCRqYZJ7P28wWQv3sG9lZ-ra_3wjqImdWdEjmHqD35WsQsJXNN2WA1nGm1nJMLrvEUpHDQV3dijPymMyedGbS6tDbhi2rN1E58fKOt7jZbGsqla7gksVKq6xVHRYn8wNzYbgPi_yvCGVzOw7NR8QdbkmsGfWAVLAbxISUxb5omoKYoqw9zR4lK3k_Qr9Hz1GGxKXSsIUFVRN35d_kzLnN5CLSKRWn1FZJNopfjiVuhek3UQfj8',
  price: 850
};

export const useData = () => {
  // In Phase 2, this will fetch based on route params using useQuery
  const apartment = useMemo(() => MOCK_DETAIL, []);
  const isLoading = false;

  return {
    apartment,
    isLoading,
  };
};
