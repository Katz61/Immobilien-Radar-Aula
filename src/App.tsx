import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MapView } from './components/map/MapView';
import { Toast } from './components/common/Toast';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-bg text-text overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MapView />
      </div>
      <Toast />
    </div>
  );
}
