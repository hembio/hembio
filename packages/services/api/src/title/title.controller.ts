import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { DeleteTitleResponse } from "./dto/delete.response.dto";
import { TitleNotFoundException } from "./exceptions/TitleNotFoundException";
import { TitleService } from "./title.service";

@Controller("titles")
export class TitleController {
  public constructor(private readonly titlesService: TitleService) {}

  @Delete("/delete/:titleId")
  public async delete(
    @Param() { titleId }: { titleId: string },
  ): Promise<DeleteTitleResponse> {
    try {
      await this.titlesService.deleteOneById(titleId);
      return { id: titleId };
    } catch (e) {
      switch (e.constructor) {
        case TitleNotFoundException:
          throw new NotFoundException(e.message);
        default:
          throw new InternalServerErrorException("Unknown error");
      }
    }
  }
}
