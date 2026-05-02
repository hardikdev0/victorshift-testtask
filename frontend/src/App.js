import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <PipelineToolbar />
      <main className="app-main">
        <PipelineUI />
      </main>
      <footer className="app-footer">
        <SubmitButton />
      </footer>
    </div>
  );
}

export default App;
