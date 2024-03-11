import { Controller, Post, Body, Get, Param, UsePipes,NotFoundException,Res,Query,UseGuards,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { UrlService,UrlProfileService } from './app.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlValidationPipe } from './Url Validator Pipe/url-validator.pipe';
import { Response } from 'express'; 
import { QrCodeService } from './qr-code.util';
import { AuthGuard } from '@nestjs/passport';


// import { UrlMapping } from './database/url-mapping.schema';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() response: Response): void {
    this.appService.renderIndex(response);
  }
}


@Controller()
export class ShortURLController {
  constructor() {}

  @Get('/short-url')
  renderShortURL(@Res() res: Response) {
    return res.render('shortenURL');
  }
}



@Controller('urls')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly qrCodeService: QrCodeService,
  ) {}

  @Post()
  @UsePipes(new UrlValidationPipe())
  async create(@Body() createUrlDto: CreateUrlDto): Promise<any> {
    const createdUrl = await this.urlService.create(createUrlDto);
    // Generate QR code data URL
    const qrCodeDataURL = await this.qrCodeService.generateQrCode(createdUrl.shortId);
    return { shortenedUrl: createdUrl.shortId, qrCodeDataURL };
  }

  @Get(':shortUrl')
  async redirectToLongUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    const longUrl = await this.urlService.findByShortUrl(shortUrl);
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      throw new NotFoundException();
    }
  }
}




// Controller for the Profile Route

// @Controller('url')
// export class UrlProfileController {
//   constructor(private readonly urlProfileService: UrlProfileService) {}

//   @Post()
//   async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
//     const createdUrl = await this.urlProfileService.create(createUrlDto);
//     return { shortUrl: createdUrl.shortId, longUrl: createdUrl.longUrl };
//   }

//   @Get(':shortUrl')
//   async redirectToLongUrl(@Param('shortUrl') shortUrl: string) {
//     const longUrl = await this.urlService.findByShortUrl(shortUrl);
//     if (longUrl) {
//       return { redirect: longUrl };
//     } else {
//       return { error: 'Short URL not found' };
//     }
//   }
// }

@Controller()
export class ShortURLProfileController {
  constructor() {}

  @Get('/newUrl')
  renderShortURL(@Res() res: Response) {
    return res.render('createNewUrl');
  }
}



@Controller('urls')
export class UrlProfileController {
  constructor(private readonly urlProfileService: UrlProfileService) {}

  @UseGuards(AuthGuard('google'))
  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto, @Request() req) {
    try {
      // Extract user ID from the authenticated user
      const userId = req.user.id; 
      console.log(userId)

      // Now you can use the userId to associate the user with the created URL
      const createdUrl = await this.urlProfileService.create(createUrlDto, userId);
      console.log(createdUrl)
      return { shortenedUrl: createdUrl.shortId };
    } catch (error) {
      // Handle error appropriately, possibly log it
      return { error: 'Failed to create short URL' };
    }
  }

  @Get(':shortProfileUrl')
  async redirectToLongUrl(@Param('shortProfileUrl') shortUrl: string, @Res() res) {
    try {
      const longUrl = await this.urlProfileService.findByShortUrl(shortUrl);
      if (!longUrl) {
        // If short URL is not found, return 404 Not Found
        return res.status(404).json({ error: 'Short URL not found' });
      }
      // Redirect to the long URL
      return res.redirect(longUrl);
    } catch (error) {
      // Handle error appropriately, possibly log it
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}




// @Controller('urls')
// export class UrlProfileController {
//   constructor(private readonly urlProfileService: UrlProfileService) {}

//   @UseGuards(AuthGuard('google'))
//   @Post()
//   async createShortUrl(@Body() createUrlDto: CreateUrlDto, @Request() req) {
//     try {
//       // Extract user ID from the authenticated user
//       const userId = req.user.id; 
      
//       // Check if custom short URL is provided
//       if (createUrlDto.customShortId) {
//         // Validate custom short URL if needed
//         // Here you can add validation logic to ensure the custom short URL meets your requirements
//         // For example, check if it's unique, alphanumeric, etc.
        
//         // Now you can use the custom short URL provided by the user
//         const createdUrl = await this.urlProfileService.create(createUrlDto, userId);
//         return { shortenedUrl: createdUrl.shortId };
//       } else {
//         // If custom short URL is not provided, generate a random one
//         const createdUrl = await this.urlProfileService.create(createUrlDto, userId);
//         return { shortenedUrl: createdUrl.shortId };
//       }
//     } catch (error) {
//       // Handle error appropriately, possibly log it
//       return { error: 'Failed to create short URL' };
//     }
//   }

//   @Get(':shortProfileUrl')
//   async redirectToLongUrl(@Param('shortProfileUrl') shortUrl: string, @Res() res) {
//     try {
//       const longUrl = await this.urlProfileService.findByShortUrl(shortUrl);
//       if (!longUrl) {
//         // If short URL is not found, return 404 Not Found
//         return res.status(404).json({ error: 'Short URL not found' });
//       }
//       // Redirect to the long URL
//       return res.redirect(longUrl);
//     } catch (error) {
//       // Handle error appropriately, possibly log it
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// }
