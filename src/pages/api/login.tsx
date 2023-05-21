import {PrismaClient} from '@prisma/client'
import { encodeData, decodeData, key } from '@/helper/util/saltPassword';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { username },
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Return a success message or user data
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
