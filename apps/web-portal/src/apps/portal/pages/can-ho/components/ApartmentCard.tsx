import React from 'react';
import { Tag } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  StarFilled,
} from '@ant-design/icons';
import type { IApartment } from '@apps/portal/services/types';
import {
  Card,
  CardImgWrapper,
  CardImg,
  CardImgFallback,
  WishlistBtn,
  PriceBadge,
  CardBody,
  CardTitle,
  CardLocation,
  AmenitiesRow,
  CardFooter,
  RatingInfo,
  ViewBtn,
} from '../styles/styled';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
];

interface ApartmentCardProps {
  apartment: IApartment;
  index: number;
  onView: (id: string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, index, onView }) => {
  const imageUrl = apartment.images?.[0] ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const priceLabel = `$${apartment.pricePerNight.toLocaleString()} / night`;

  return (
    <Card onClick={() => onView(apartment.id)}>
      <CardImgWrapper>
        {imageUrl ? (
          <CardImg
            className="card-img"
            src={imageUrl}
            alt={apartment.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <CardImgFallback>🏠</CardImgFallback>
        )}
        <WishlistBtn onClick={(e) => e.stopPropagation()}>
          <HeartOutlined />
        </WishlistBtn>
        <PriceBadge>{priceLabel}</PriceBadge>
      </CardImgWrapper>

      <CardBody>
        <CardTitle title={apartment.title}>{apartment.title}</CardTitle>
        <CardLocation>
          <EnvironmentOutlined />
          {apartment.location}
        </CardLocation>

        {apartment.amenities?.length > 0 && (
          <AmenitiesRow>
            {apartment.amenities.slice(0, 3).map((am) => (
              <Tag key={am} color="default" style={{ fontSize: '0.7rem', margin: 0 }}>
                {am}
              </Tag>
            ))}
            {apartment.amenities.length > 3 && (
              <Tag style={{ fontSize: '0.7rem', margin: 0 }}>
                +{apartment.amenities.length - 3}
              </Tag>
            )}
          </AmenitiesRow>
        )}

        <CardFooter>
          <RatingInfo>
            <StarFilled className="ant-star" />
            <span>4.85</span>
          </RatingInfo>
          <ViewBtn
            id={`view-apartment-${apartment.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onView(apartment.id);
            }}
          >
            View Details
          </ViewBtn>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default ApartmentCard;
