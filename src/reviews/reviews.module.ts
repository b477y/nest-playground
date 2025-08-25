import { forwardRef, Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { JwtModule } from "@nestjs/jwt";
import { ProductsModule } from "src/products/products.module";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    UsersModule,
    JwtModule,
    ProductsModule,
  ],
})
export class ReviewsModule {}
