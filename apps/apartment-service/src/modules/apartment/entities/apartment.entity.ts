import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ nullable: true })
  description: string;
}