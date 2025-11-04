export interface Message{
    severity: 'info' | 'success' | 'warning' | 'danger';
    title: string;
    message: string;
    icon?: string;
}