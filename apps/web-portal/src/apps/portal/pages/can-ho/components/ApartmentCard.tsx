import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
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
  onView: (id: string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onView }) => {
  const { t, i18n } = useTranslation('portal');
  const imageUrl = apartment.images?.[0] ?? image404;

  const getPriceLabel = () => {
    const formattedPrice = Number(apartment.pricePerNight).toLocaleString('vi-VN');
    if (i18n.language === 'vi') {
      return `${formattedPrice} ₫/đêm`;
    } else if (i18n.language === 'ja') {
      return `${formattedPrice} ₫/泊`;
    } else {
      return `${formattedPrice} ₫/night`;
    }
  };

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
        <PriceBadge>{getPriceLabel()}</PriceBadge>
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
              <Tag key={am} color="default" style={{ fontSize: '1.2rem', margin: 0 }}>
                {am}
              </Tag>
            ))}
            {apartment.amenities.length > 3 && (
              <Tag style={{ fontSize: '1.2rem', margin: 0 }}>
                +{apartment.amenities.length - 3}
              </Tag>
            )}
          </AmenitiesRow>
        )}

        <CardFooter>
          <RatingInfo>
            {apartment.averageRating !== undefined && apartment.averageRating !== null ? (
              <>
                <StarFilled className="ant-star" style={{ marginRight: '4px' }} />
                <span>
                  {Number(apartment.averageRating).toFixed(1)}
                  {apartment.reviewCount ? ` (${apartment.reviewCount})` : ''}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: 500, color: '#e0a96d' }}>
                {t('details.new_rating', 'Mới')}
              </span>
            )}
          </RatingInfo>
          <ViewBtn
            id={`view-apartment-${apartment.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onView(apartment.id);
            }}
          >
            {t('details.view_details', 'Xem chi tiết')}
          </ViewBtn>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default ApartmentCard;
