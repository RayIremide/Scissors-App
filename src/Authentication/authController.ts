import {
    Controller,
    Get,
    UseGuards,
    Request,
    Res,
    Req,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Response } from 'express';
  import { AuthService } from './authService';
  import { CheckTokenExpiryGuard } from './auth.guard';
  import { UrlMapping } from '../database/url-mapping.schema'
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {}
  
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Request() req, @Res() res: Response) {
      const googleToken = req.user.accessToken;
      const googleRefreshToken = req.user.refreshToken;
  
      res.cookie('access_token', googleToken, { httpOnly: true });
      res.cookie('refresh_token', googleRefreshToken, {
        httpOnly: true,
      });
  
      res.redirect('http://localhost:3000/auth/profile');
    }

  
    @UseGuards(CheckTokenExpiryGuard)
  
    @Get('profile')
  async getProfile(@Req() req, @Res() res: Response) {
    try {
      const accessToken = req.cookies['access_token'];
      if (!accessToken) {
        throw new UnauthorizedException('No access token');
      }

      // Get user data from your AuthService
      const userData = await this.authService.getProfile(accessToken);

      // Render the profile view passing the user data to it
      res.render('profile', { userData });

    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  
    @Get('logout')
    logout(@Req() req, @Res() res: Response) {
      const refreshToken = req.cookies['refresh_token'];
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      this.authService.revokeGoogleToken(refreshToken);
      res.redirect('http://localhost:3000/');
    }
  }