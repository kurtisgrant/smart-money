import Button from './components/Button';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Button onClick={() => console.log('clicked')} />
    </div>
  );
}

export default App;
