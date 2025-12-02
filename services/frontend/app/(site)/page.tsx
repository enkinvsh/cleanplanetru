import { Metadata } from "next";
import HomePageContent from "@/components/home/HomePageContent";

export const metadata: Metadata = {
    title: "Вывоз металлолома в Екатеринбурге | Чистая Планета",
    description: "Приём чёрного и цветного металла с вывозом. Работаем 22 года. Собственный автопарк, оценка по телефону, выезд в день обращения.",
};

export default function HomePage() {
    return <HomePageContent />;
}
