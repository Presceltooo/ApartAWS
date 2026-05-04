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
import image404 from '@assets/images/404.png';

interface ApartmentCardProps {
  apartment: IApartment;
  index: number;
  onView: (id: string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, index, onView }) => {
  const imageUrl = apartment.images?.[0] ?? image404;
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
              const target = e.currentTarget as HTMLImageElement;
              target.src = image404;
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
