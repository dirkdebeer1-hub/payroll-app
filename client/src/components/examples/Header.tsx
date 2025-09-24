import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header 
      onToggleSidebar={() => console.log('Toggle sidebar triggered')}
    />
  );
}