import React from 'react';
import { Server, Globe, Monitor, Router } from 'lucide-react';
import { TaskConfig } from '../types';

interface NetworkVisualizerProps {
  connected: boolean;
  task: TaskConfig;
}

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ connected, task }) => {
  return (
    <div className="h-full bg-slate-900 border border-slate-700 rounded-lg p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-12">
        
        {/* Cloud / WAN */}
        <div className="flex flex-col items-center animate-pulse">
           <Globe className="w-12 h-12 text-blue-500 mb-2" />
           <span className="text-xs font-mono text-slate-400">Internet (WAN)</span>
           <span className="text-[10px] font-mono text-slate-500">{task.wanIp}</span>
        </div>

        {/* Connection Line WAN -> Server */}
        <div className="h-12 w-0.5 bg-blue-500/50 -my-2"></div>

        {/* Server */}
        <div className="relative group">
            <div className="w-32 h-24 bg-slate-800 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center shadow-2xl z-20 relative">
                <Server className="w-8 h-8 text-slate-200 mb-1" />
                <span className="text-xs font-bold text-slate-200">SERVER</span>
                <div className="flex gap-2 mt-2 w-full justify-center px-2">
                    <div className="text-[9px] bg-blue-900/50 text-blue-300 px-1 rounded border border-blue-800" title="WAN">enp3s0</div>
                    <div className={`text-[9px] px-1 rounded border transition-colors duration-500 ${connected ? 'bg-green-900/50 text-green-300 border-green-800' : 'bg-slate-700 text-slate-400 border-slate-600'}`} title="LAN">enp4s0</div>
                </div>
            </div>
            {/* NIC Indicators */}
            <div className="absolute -right-3 top-4 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
        </div>

        {/* Connection Line Server -> Client (LAN) */}
        <div className="relative h-16 w-full flex justify-center">
             {/* Cable */}
             <div className={`h-full w-1 transition-colors duration-1000 ${connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}></div>
             
             {/* Data packets animation (only when connected) */}
             {connected && (
                 <div className="absolute top-0 w-2 h-2 bg-white rounded-full animate-[bounce_1s_infinite]"></div>
             )}
        </div>

        {/* Client */}
        <div className="flex flex-col items-center relative">
            <div className="relative">
                {/* Monitor Stand */}
                <div className="w-24 h-20 bg-slate-700 rounded-t-lg border-4 border-slate-600 flex items-center justify-center relative overflow-hidden">
                     {/* Screen */}
                     <div className={`w-full h-full transition-colors duration-700 flex items-center justify-center ${connected ? 'bg-green-500/20' : 'bg-black'}`}>
                        {connected ? (
                             <div className="text-center">
                                <div className="text-green-400 font-mono text-[10px] mb-1">CONNECTED</div>
                                <div className="text-green-500 font-mono text-[9px]">{task.serverLanIp}</div>
                             </div>
                        ) : (
                            <div className="w-full h-0.5 bg-slate-800/50 rotate-45"></div>
                        )}
                     </div>
                </div>
                <div className="w-32 h-3 bg-slate-600 rounded-b mx-auto -mt-1 shadow-lg"></div>
                <div className="w-12 h-6 bg-slate-600 mx-auto"></div>
                <div className="w-20 h-1 bg-slate-600 mx-auto rounded-full opacity-50"></div>
            </div>
            
            <div className="mt-3 text-center">
                <div className="flex items-center gap-2 justify-center text-slate-300 font-bold text-sm">
                    <Monitor className="w-4 h-4" /> Client 01
                </div>
                <div className="font-mono text-xs text-slate-500 mt-1">{task.clientIp}</div>
                <div className={`text-[10px] mt-1 transition-colors ${connected ? 'text-green-400' : 'text-red-400'}`}>
                    {connected ? 'ONLINE' : 'NO SIGNAL'}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};