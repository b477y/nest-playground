import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import { CURRENT_TIMESTAMP } from "src/utils/constants";
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ForeignKey,
  OneToMany,
  ManyToOne,
} from "typeorm";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  rating: number;

  @Column("text")
  comment: string;

  @CreateDateColumn({ type: "timestamp", default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE",
  })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  user: User;
}
