import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsService } from "src/products/products.service";
import { UserType } from "src/utils/enums";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/createReview.dto";
import { Review } from "./review.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductsService
  ) {}

  getAll(pageNumber: number, reviewPerPage: number) {
    return this.reviewRepository.find({
      skip: pageNumber && reviewPerPage ? reviewPerPage * (pageNumber - 1) : 0,
      take: pageNumber && reviewPerPage ? reviewPerPage : 0,
      order: { createdAt: "DESC" },
      relations: { user: true, product: true },
    });
  }

  async createReview(
    userId: number,
    productId: number,
    createReviewDto: CreateReviewDto
  ) {
    await this.productService.getOneById(productId);

    const review = this.reviewRepository.create({
      product: { id: productId },
      user: { id: userId },
      ...createReviewDto,
    });

    if (!review) {
      throw new BadRequestException(
        "An error occured while trying to create a new review"
      );
    }

    return await this.reviewRepository.save(review);
  }

  async getReviewById(reviewId: number, productId: number) {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
        product: { id: productId },
      },
      relations: { user: true, product: true },
    });

    if (!review) {
      throw new NotFoundException("This review is not exist");
    }

    return review;
  }

  async deleteReview(reviewId: number, productId: number, userId: number) {
    const review = await this.getReviewById(reviewId, productId);

    if (review.user.userType !== UserType.ADMIN && review.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to delete this review.`
      );
    }

    await this.reviewRepository.remove(review);

    return { message: "Review deleted successfully" };
  }
}
