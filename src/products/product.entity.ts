import { Review } from 'src/reviews/review.entity';
import { User } from 'src/users/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product, { eager: true })
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
