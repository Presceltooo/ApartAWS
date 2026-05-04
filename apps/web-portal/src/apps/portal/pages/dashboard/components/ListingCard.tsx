import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { HeartOutlined, StarFilled } from '@ant-design/icons';
import {
  ListingCard as StyledCard,
  ListingImgWrapper,
  ListingImg,
  FavoriteBtn,
  ExclusiveBadge,
  ListingContent,
  ListingHeaderRow,
  ListingTitle,
  ListingRating,
  ListingLocation,
  ListingFooter,
  PriceLabel,
  PriceRow,
  PriceAmount,
  ViewDetailsBtn,
} from '../styles/styled';
import image404 from '@assets/images/404.png';

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  isExclusive: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({ to: `/apartment/$id`, params: { id: listing.id } });
  };

  return (
    <StyledCard onClick={handleViewDetails}>
      <ListingImgWrapper>
        <ListingImg 
          className="listing-img" 
          src={listing.imageUrl} 
          alt={listing.title} 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = image404;
          }}
        />
        <FavoriteBtn>
          <HeartOutlined />
        </FavoriteBtn>
        {listing.isExclusive && <ExclusiveBadge>Exclusive</ExclusiveBadge>}
      </ListingImgWrapper>
      <ListingContent>
        <ListingHeaderRow>
          <ListingTitle>{listing.title}</ListingTitle>
          <ListingRating>
            <StarFilled className="star" />
            <span>{listing.rating.toFixed(2)}</span>
          </ListingRating>
        </ListingHeaderRow>
        <ListingLocation>{listing.location}</ListingLocation>
        
        <ListingFooter>
          <PriceLabel>Starting from</PriceLabel>
          <PriceRow>
            <PriceAmount>${listing.price} <span>/ night</span></PriceAmount>
            <ViewDetailsBtn onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}>View Details</ViewDetailsBtn>
          </PriceRow>
        </ListingFooter>
      </ListingContent>
    </StyledCard>
  );
};

export default ListingCard;
