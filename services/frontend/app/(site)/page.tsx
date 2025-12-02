import { Metadata } from "next";
import HomePageContent from "@/components/home/HomePageContent";

export const metadata: Metadata = {
    title: "Вывоз металлолома в Алматы | Чистая Планета",
    description: "Быстрый и выгодный вывоз металлолома в Алматы. Приедем в течение 24 часов, честные весы, высокие цены. Оставьте заявку на сайте!",
};

export default function HomePage() {
    return <HomePageContent />;
}
