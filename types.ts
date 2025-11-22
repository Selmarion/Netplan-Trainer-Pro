export interface TaskConfig {
  serverLanIp: string; // IP of the server on LAN
  clientRange: string; // CIDR range for clients
  clientIp: string;    // Specific IP of the testing client
  wanIp: string;       // Simulated WAN IP
}

export interface ValidationResponse {
  isValidYaml: boolean;
  syntaxCorrect: boolean;
  connectionSuccessful: boolean;
  errors: string[];
  explanation: string;
  correctedYaml?: string;
}

export enum SimulationStatus {
  IDLE = 'idle',
  CHECKING = 'checking',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const DEFAULT_TASK: TaskConfig = {
  serverLanIp: '192.168.10.1/24',
  clientRange: '192.168.10.0/24',
  clientIp: '192.168.10.5',
  wanIp: '203.0.113.10/24'
};

export const INITIAL_YAML = `# Конфигурация Netplan
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0: # WAN Интерфейс
      dhcp4: true
    enp4s0: # LAN Интерфейс (настройте этот)
      dhcp4: no
`;