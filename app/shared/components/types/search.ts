export type FilterType = 'string' | 'boolean' | 'number' | 'date' | 'custom';

export interface FilterData {
    id: string;
    key: string;
    value: unknown;
    type: FilterType;
    isValid: boolean;
}

export interface JsonKeyType {
    [key: string]: {
        type: FilterType;
        defaultValue?: unknown;
        label?: string;
    };
}

export interface FilterComponentProps {
    id: string;
    fieldKey: string;
    onDelete: () => void;
    onChange: (filterData: FilterData) => void;
    initialValue: unknown;
}
