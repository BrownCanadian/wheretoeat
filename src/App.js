import logo from './logo.svg';
import './App.css';
import Input from './Input.js';
function App() {
  return (<>
    <p>
      <h1 className="text-7xl font-mono font-extrabold text-[#987D9A]  flex justify-center mt-24">
        Where To Eat
      </h1>
      <p className="flex justify-center text-sm text-[#BB9AB1]   p-4"> A solution to WHERE SHOULD WE EAT problems</p>
    </p>
    <div className="flex justify-center "><Input className=" "/>
    </div>
    
    
    
    </>
  );
}

export default App;
