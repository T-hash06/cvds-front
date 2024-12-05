// components/BooleanFilter.tsx

import React, { useState } from 'react';
import { FilterComponentProps } from '@shared/components/types/search';

const BooleanFilter: React.FC<FilterComponentProps> = ({
                                                           id,
                                                           fieldKey,
                                                           onDelete,
                                                           onChange,
                                                           initialValue = false
                                                       }) => {
    const [value, setValue] = useState(initialValue);

    // Actualiza el filtro solo cuando el valor cambie
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value === 'true';
        setValue(newValue);
        // Llama a onChange con el nuevo valor, sin necesidad de usar useEffect
        onChange({
            id,
            key: fieldKey,
            value: newValue,
            type: 'boolean',
            isValid: true // Los filtros booleanos siempre son válidos
        });
    };

    return (
        <div className="flex flex-row gap-4 items-center w-full">
            <div className="flex-1">
                <select
                    value={value.toString()}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>
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

export default BooleanFilter;
