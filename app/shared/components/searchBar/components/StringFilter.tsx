import React, { useState, useEffect } from 'react';
import { FilterComponentProps } from '@shared/components/types/search';

const StringFilter: React.FC<FilterComponentProps> = ({
                                                          id,
                                                          fieldKey,
                                                          onDelete,
                                                          onChange,
                                                          initialValue = ''
                                                      }) => {
    const [value, setValue] = useState(initialValue);
    const [isValid, setIsValid] = useState(value.trim() !== '');

    useEffect(() => {
        // Solo llamar a onChange si el estado de validez ha cambiado
        if (isValid !== (value.trim() !== '')) {
            setIsValid(value.trim() !== '');
            onChange({
                id,
                key: fieldKey,
                value,
                type: 'string',
                isValid: value.trim() !== ''
            });
        }
    }, [value, id, fieldKey, onChange, isValid]); // Dependencias del useEffect

    return (
        <div className="flex flex-row gap-4 items-center w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ingrese texto..."
                className="flex-1 p-2 border rounded"
            />
            <span className="text-gray-600 w-[200px]">{fieldKey}</span>
            <button
                onClick={onDelete}
                className="w-10 h-10 flex items-center justify-center border-none bg-transparent cursor-pointer text-red-500"
            >
                <b>-</b>
            </button>
        </div>
    );
};

export default StringFilter;
