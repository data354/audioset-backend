import { IsString } from "class-validator";
import { Expose } from "class-transformer";

export class createSoundDTO {
  @Expose()
  @IsString()
  public soundId?: string;

  @Expose()
  @IsString()
  public userId?: string;
}
