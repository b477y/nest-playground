import { Exclude } from "class-transformer";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { CURRENT_TIMESTAMP } from "src/utils/constants";
import { UserType } from "src/utils/enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: "150", nullable: true })
  username: string;

  @Column({ type: "varchar", length: "150", nullable: true })
  name: string;

  @Column({ type: "varchar", length: "250", unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: "enum", enum: UserType, default: UserType.NORMAL_USER })
  userType: UserType;

  @Column({ type: "boolean", default: false })
  isAccountVerified: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  profileImage: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
