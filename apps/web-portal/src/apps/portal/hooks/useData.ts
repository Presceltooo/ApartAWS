import { useMemo } from 'react';

export const RESIDENCES = [
  {
    id: 1,
    title: 'The Azure Monolith Loft',
    price: 240,
    rating: 4.92,
    desc: 'High-ceiling architectural marvel in the heart of the business district.',
    status: 'available',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB33KplIECxarCRTLjdAGIg6vwqG5fo1clf0ImTsAWnkoKBhAmKy5NhXlV-BTRfkyAiER5yTx53S5tl2jLJ4OEGURIV6ZtglJVvo7UlVF9MVzLMwgILm3-SGyk9HWF3lWLL2aXUAuBMZyV42NHa6Z1QWi6QoOu0bpMcRN-yMJbDQEPOBkFt7out2sBue_QCDMEdNMYeItmuQ87-dRwS0JAUwj4OpF5ti0Rag4xLf25yMQVb50MW2mnG9eHu3NU_YAUU1p992gr2Cvuu'
  },
  {
    id: 2,
    title: 'Serene Garden Suite',
    price: 185,
    rating: 4.85,
    desc: 'A peaceful escape with private terrace and floor-to-ceiling glass walls.',
    status: 'rare',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWG9U6_z895GF3u0DtFtbw9pmjaZQ-zdQqe8zKkfhYK9PUEE_K2_ztlZOgfx19rv_E8swwgcjrEj0M2tPBMayLsv_klghbMhfRvyu5mhC7i1Q1bxBAY1jVdtwfi24izfFQvipTbBJRBrU_Oxa-4O5mhTjorBkW7urSYo2GQkol-dEvyi5tE_5CHtGyWZjwdl-JO2NU1TPOyreYqDRrPHgG5eUuBjNp_3-zKwhkH4swnfNMuILx-O-LsTQPQdTYjpVKu4Duh6ZJJzHg'
  },
  {
    id: 3,
    title: 'Skyline Penthouse',
    price: 420,
    rating: 5.0,
    desc: 'Panoramic views of the metropolitan skyline with premium butler service.',
    status: 'verified',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDttcnz37zBl_F8r3Jvt_vnY3L6AiYrlRmsZ4MjtXoKrxTgV9Ld0AKBUjt3h4iGNuQ-MkRlf8CcgVglm7cJsM6zf7mcPE0DiFwwDqI1gT0QWNkUPdHf-BpzMGKlw9dGa7iQWQfgsor48eK6sWLjKZvVPc97Rw_E7UdU0bitkI1trDCZU4temojkzI0sTFLK-EWEQZoPijfzgTzmEdSot39Di_D99ZocXrGpunnGGTTsxzAhXen9vRZHcENRaNNdTkh47XUeSeKhohqZ'
  },
  {
    id: 4,
    title: 'The Canvas Studio',
    price: 120,
    rating: 4.78,
    desc: 'Clean lines and curated art pieces define this urban sanctuary.',
    status: 'new',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXDAC1wH6JAHuVLj3nIVE8sd401szpa6cOpJFrd5kVs1q-iOGLtXV6lGSlT7SdMDnGITgAQjCZcTrkMfNKhyUsf9E3S8v3Py4CsXtYsnKMQoUOcWvgsuAIghobhYCJ7VnWJLv688BbeQakJpMoqdzd0H2a0pIlbO_jA7nJ_eH4JVxyuwBBkWb3HB_OAxSlY-gKG04PRsm6HHB4WndXuQnmzLcZvutXtFr0jIzs21qR80qeRowURQKr-9hpbmQ152O6W6LO_hIz2W8'
  }
];

export const useData = () => {
  const residences = useMemo(() => RESIDENCES, []);
  
  return {
    residences
  };
};
