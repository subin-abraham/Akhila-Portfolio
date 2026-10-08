import { HomePage } from '@/features/home/components/HomePage';
import { getHomepageData } from '@/features/home/lib/get-homepage-data';

export default async function Home() {
  const data = await getHomepageData();

  return <HomePage data={data} />;
}
