import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Roles } from "src/users/decorators/user.role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { CreateReviewDto } from "./dto/createReview.dto";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getAll(
    @Param("pageNumber") pageNumber: number,
    @Param("reviewPerPage") reviewPerPage: number
  ) {
    return this.reviewsService.getAll(pageNumber, reviewPerPage);
  }

  @Get(":productId/:reviewId")
  getReviewById(
    @Param("productId", ParseIntPipe) productId: number,
    @Param("reviewId", ParseIntPipe) reviewId: number
  ) {
    return this.reviewsService.getReviewById(reviewId, productId);
  }

  @Post(":productId")
  @Roles(UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  createReview(
    @Param("productId", ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser("id", ParseIntPipe) userId: number
  ) {
    return this.reviewsService.createReview(userId, productId, createReviewDto);
  }

  @Delete(":productId/:reviewId")
  @Roles(UserType.NORMAL_USER, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  deleteReview(
    @CurrentUser("id", ParseIntPipe) userId: number,
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Param("productId") productId
  ) {
    return this.reviewsService.deleteReview(reviewId, productId, userId);
  }
}
