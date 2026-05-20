import KitsPage from '@/components/views/KitsPage';
import { PV_DATA } from '@/lib/data';
export default function KitsRoute() {
  return <KitsPage kits={PV_DATA.kits} />;
}
