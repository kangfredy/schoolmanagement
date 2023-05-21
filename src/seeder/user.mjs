import {PrismaClient} from '@prisma/client'
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

const mockData = [
    {username: 'SuperAdmin', password: await bcrypt.hash('Admin123', 10), role: 'admin'},
    {username: 'user1', password: await bcrypt.hash('User123',10), role: 'user'},
]

export const seedUser = async() => {
    await prisma.user.createMany({
        data: mockData,
    })
}

seedUser().catch((error) => {console.error(error);}).finally(async () => {await prisma.$disconnect();});