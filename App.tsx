import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, RefreshCw, BookOpen, HelpCircle } from 'lucide-react';
import { TaskInput } from './components/TaskInput';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { CodeEditor } from './components/CodeEditor';
import { validateNetplanConfig, explainNetplanConcepts } from './services/geminiService';
import { 
  TaskConfig, 
  ValidationResponse, 
  SimulationStatus, 
  DEFAULT_TASK, 
  INITIAL_YAML 
} from './types';

const App: React.FC = () => {
  const [task, setTask] = useState<TaskConfig>(DEFAULT_TASK);
  const [yamlCode, setYamlCode] = useState<string>(INITIAL_YAML);
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiConcept, setAiConcept] = useState<string>("");
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const handleSimulate = async () => {
    setStatus(SimulationStatus.CHECKING);
    setResult(null);
    
    const validation = await validateNetplanConfig(yamlCode, task);
    
    setResult(validation);
    if (validation.connectionSuccessful) {
      setStatus(SimulationStatus.SUCCESS);
    } else {
      setStatus(SimulationStatus.ERROR);
    }
  };

  const handleReset = () => {
    setYamlCode(INITIAL_YAML);
    setStatus(SimulationStatus.IDLE);
    setResult(null);
  };

  const handleExplainConcept = async (concept: string) => {
      setAiConcept(concept);
      setAiModalOpen(true);
      setLoadingExplanation(true);
      setAiExplanation("");
      const explanation = await explainNetplanConcepts(concept);
      setAiExplanation(explanation);
      setLoadingExplanation(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Netplan Trainer Pro
                </h1>
                <p className="text-slate-400 text-sm mt-1">Симулятор настройки сети Ubuntu с поддержкой AI</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
                <button 
                    onClick={() => window.open('https://netplan.io/examples', '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
                >
                    <BookOpen className="w-4 h-4" /> Документация
                </button>
            </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Task & Editor (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Task Panel */}
                <TaskInput 
                    task={task} 
                    onTaskChange={setTask} 
                    disabled={status === SimulationStatus.CHECKING}
                />

                {/* Editor Panel */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg flex flex-col min-h-[500px] shadow-xl overflow-hidden">
                    <div className="bg-slate-800 p-3 flex items-center justify-between border-b border-slate-700">
                        <span className="text-sm font-mono text-slate-400 ml-2">/etc/netplan/01-netcfg.yaml</span>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleReset}
                                className="p-2 hover:bg-slate-700 rounded text-slate-400" 
                                title="Сбросить код"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                             <button 
                                onClick={() => handleExplainConcept("ethernets")}
                                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition"
                            >
                                <HelpCircle className="w-3 h-3" /> ethernets?
                            </button>
                             <button 
                                onClick={() => handleExplainConcept("dhcp4")}
                                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition"
                            >
                                <HelpCircle className="w-3 h-3" /> dhcp4?
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <CodeEditor 
                            code={yamlCode} 
                            onChange={setYamlCode} 
                            disabled={status === SimulationStatus.CHECKING}
                        />
                    </div>

                    <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                            Нажмите "netplan apply" для проверки
                        </div>
                        <button
                            onClick={handleSimulate}
                            disabled={status === SimulationStatus.CHECKING}
                            className={`
                                flex items-center gap-2 px-6 py-2 rounded font-bold shadow-lg transition-all
                                ${status === SimulationStatus.CHECKING 
                                    ? 'bg-slate-600 cursor-wait' 
                                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25 active:scale-95'}
                            `}
                        >
                            {status === SimulationStatus.CHECKING ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Анализ...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-current" />
                                    sudo netplan apply
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Visuals & Feedback (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Network Visualization */}
                <NetworkVisualizer 
                    connected={status === SimulationStatus.SUCCESS}
                    task={task}
                />

                {/* Feedback Panel */}
                <div className={`
                    flex-1 rounded-lg border p-6 transition-all duration-500
                    ${status === SimulationStatus.IDLE ? 'bg-slate-900 border-slate-800' : ''}
                    ${status === SimulationStatus.SUCCESS ? 'bg-green-900/20 border-green-500/50' : ''}
                    ${status === SimulationStatus.ERROR ? 'bg-red-900/20 border-red-500/50' : ''}
                `}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        {status === SimulationStatus.IDLE && <span className="text-slate-500">Ожидание ввода...</span>}
                        {status === SimulationStatus.SUCCESS && <><CheckCircle className="text-green-500" /> Конфигурация применена</>}
                        {status === SimulationStatus.ERROR && <><AlertTriangle className="text-red-500" /> Ошибка конфигурации</>}
                        {status === SimulationStatus.CHECKING && <span className="text-blue-400 animate-pulse">Проверка конфигурации...</span>}
                    </h3>

                    {result && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-black/30 rounded p-4 font-mono text-sm">
                                <p className="text-slate-300 mb-2 border-b border-slate-700 pb-2 font-bold">Журнал системы:</p>
                                <ul className="space-y-1">
                                    <li className={result.isValidYaml ? 'text-green-400' : 'text-red-400'}>
                                        [{result.isValidYaml ? 'OK' : 'FAIL'}] Синтаксис YAML
                                    </li>
                                    <li className={result.syntaxCorrect ? 'text-green-400' : 'text-red-400'}>
                                        [{result.syntaxCorrect ? 'OK' : 'FAIL'}] Параметры Netplan
                                    </li>
                                    <li className={result.connectionSuccessful ? 'text-green-400' : 'text-red-400'}>
                                        [{result.connectionSuccessful ? 'OK' : 'FAIL'}] IP Адрес назначен верно
                                    </li>
                                </ul>
                            </div>

                            {result.errors.length > 0 && (
                                <div className="bg-red-950/50 border border-red-900/50 p-4 rounded">
                                    <h4 className="text-red-400 font-bold text-sm mb-2">Обнаруженные проблемы:</h4>
                                    <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                                        {result.errors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded">
                                <h4 className="text-blue-400 font-bold text-sm mb-2">Анализ AI:</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {result.explanation}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* AI Help Modal */}
      {aiModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="text-blue-500"/> {aiConcept}
                  </h3>
                  {loadingExplanation ? (
                      <div className="flex justify-center py-8">
                          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                  ) : (
                      <p className="text-slate-300 leading-relaxed mb-6">
                          {aiExplanation}
                      </p>
                  )}
                  <button 
                    onClick={() => setAiModalOpen(false)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-600 transition"
                  >
                      Закрыть
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;