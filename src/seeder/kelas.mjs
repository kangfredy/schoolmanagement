import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const mockData = [
    { namaKelas: "X IPA 1" },
    { namaKelas: "X IPA 2" },
    { namaKelas: "X IPA 3" },
    { namaKelas: "X IPA 4" },
];

export const seedKelas = async () => {
    await prisma.kelas.createMany({
        data: mockData,
    });
};

seedKelas()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
