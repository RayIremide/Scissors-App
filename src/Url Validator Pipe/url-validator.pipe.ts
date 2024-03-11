
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUrlDto } from '../dto/create-url.dto';

// @Injectable()
// export class UrlValidationPipe implements PipeTransform {
//   async transform(value: any, metadata: ArgumentMetadata) {
//     const object = plainToClass(CreateUrlDto, value);
//     const errors = await validate(object);
//     if (errors.length > 0) {
//       const errorMessage = errors
//         .map(error => Object.values(error.constraints).join(', '))
//         .join('; ');
//       throw new BadRequestException(errorMessage);
//     }
//     return value;
//   }
// }


@Injectable()
export class UrlValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid input data');
    }

    const object = plainToClass(CreateUrlDto, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const errorMessage = errors.map(error => Object.values(error.constraints).join(', ')).join('; ');
      throw new BadRequestException(errorMessage);
    }

    // If you want to return the validated DTO instead of the original value, you can do so
    return object;
  }
}

