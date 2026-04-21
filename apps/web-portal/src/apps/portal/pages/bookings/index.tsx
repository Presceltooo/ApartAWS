import React from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import {
  BookingsPageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  TabsRow,
  TabBtn,
  BookingsList,
  EmptyState,
} from './styles/styled';
import BookingCard from './components/BookingCard';
import { useBookingsData } from './hooks/useData';
import { useBookingsActions, type BookingStatus } from './hooks/useActions';

const Bookings: React.FC = () => {
  const { bookings, isLoading } = useBookingsData();
  const { activeTab, handleTabChange } = useBookingsActions();

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const getTabCount = (status: BookingStatus) => {
    return bookings.filter(b => b.status === status).length;
  };

  if (isLoading) {
    return <div>Loading your journeys...</div>;
  }

  return (
    <BookingsPageWrapper>
      <PageHeader>
        <PageTitle>Your Reservations</PageTitle>
        <PageSubtitle>Manage your upcoming stays and review past experiences.</PageSubtitle>
      </PageHeader>

      <TabsRow>
        <TabBtn $active={activeTab === 'upcoming'} onClick={() => handleTabChange('upcoming')}>
          Upcoming ({getTabCount('upcoming')})
        </TabBtn>
        <TabBtn $active={activeTab === 'completed'} onClick={() => handleTabChange('completed')}>
          Completed ({getTabCount('completed')})
        </TabBtn>
        <TabBtn $active={activeTab === 'cancelled'} onClick={() => handleTabChange('cancelled')}>
          Cancelled ({getTabCount('cancelled')})
        </TabBtn>
      </TabsRow>

      {filteredBookings.length > 0 ? (
        <BookingsList>
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </BookingsList>
      ) : (
        <EmptyState>
          <CalendarOutlined style={{ fontSize: '4rem', color: '#e5e2dd', marginBottom: '1.5rem' }} />
          <h3>No {activeTab} reservations</h3>
          <p>You don't have any {activeTab} reservations at the moment. Explore our curated collection to find your next sanctuary.</p>
          <button onClick={() => window.location.href = '/'}>Explore Sanctuaries</button>
        </EmptyState>
      )}
    </BookingsPageWrapper>
  );
};

export default Bookings;
