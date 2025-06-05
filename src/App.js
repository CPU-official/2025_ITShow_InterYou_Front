import { Routes, Route } from 'react-router-dom';
import Q1 from './Question/first';
import Speak from './Answer/speaking';

function Speaking() {
  return <Speak />;
}

function Question() {
  return <Q1 />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Question />} />
      <Route path="/speaking" element={<Speaking />} />
    </Routes>
  );
}

export default App;