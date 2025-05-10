import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { env } from '../config/env';

const client = new OAuth2Client(env.googleClientId || 'test');
const userRepository = AppDataSource.getRepository(User);

export async function googleAuth(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await userRepository.findOne({
      where: [{ email }, { googleId }],
    });

    if (!user) {
      // Create new user
      user = userRepository.create({
        email,
        name,
        googleId,
      });
      await userRepository.save(user);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
