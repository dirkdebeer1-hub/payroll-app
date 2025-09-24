import Sidebar from '../Sidebar';

export default function SidebarExample() {
  return (
    <div className="h-screen">
      <Sidebar 
        isOpen={true}
        onClose={() => console.log('Sidebar close triggered')}
      />
    </div>
  );
}