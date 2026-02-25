import { useEffect, useState } from 'react'

function App() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/apartments')
      .then(res => res.json())
      .then(data => setApartments(data));
  }, []);

  return (
    <div>
      <h1>Danh sách căn hộ (Cloud-Native App)</h1>
      <ul>
        {apartments.map((apt: any) => (
          <li key={apt.id}>{apt.name} - {apt.price} VNĐ</li>
        ))}
      </ul>
    </div>
  )
}
export default App