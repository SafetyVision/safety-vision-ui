import graphs from 'assets/graphs.jpg';

export default function DashboardPage() {
  return (
    <div>
      <h2>
        Dashboard Page
      </h2>
      <img src={graphs} alt="graphs" className="w-75 mx-auto" />
    </div>
  );
}
