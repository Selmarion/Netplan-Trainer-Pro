import React from 'react';
import { TaskConfig } from '../types';
import { Settings, Server, Users, Monitor } from 'lucide-react';

interface TaskInputProps {
  task: TaskConfig;
  onTaskChange: (newTask: TaskConfig) => void;
  disabled: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ task, onTaskChange, disabled }) => {
  const handleChange = (key: keyof TaskConfig, value: string) => {
    onTaskChange({ ...task, [key]: value });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Условия задачи</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Server Config */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
            <Server className="w-3 h-3" /> Целевой IP Сервера (LAN)
          </label>
          <input
            type="text"
            value={task.serverLanIp}
            onChange={(e) => handleChange('serverLanIp', e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-900 border border-slate-600 text-green-400 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Client Range */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
            <Users className="w-3 h-3" /> Диапазон Клиентов
          </label>
          <input
            type="text"
            value={task.clientRange}
            onChange={(e) => handleChange('clientRange', e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-900 border border-slate-600 text-blue-200 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Specific Client */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
            <Monitor className="w-3 h-3" /> IP Клиента №1
          </label>
          <input
            type="text"
            value={task.clientIp}
            onChange={(e) => handleChange('clientIp', e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-900 border border-slate-600 text-purple-300 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 italic">
        * Настройте конфигурацию Netplan ниже так, чтобы сервер получил указанный IP адрес.
      </p>
    </div>
  );
};