// components/SearchBar.tsx

import React, { useState } from 'react';
import StringFilter from '@shared/components/searchBar/components/StringFilter';
import BooleanFilter from '@shared/components/searchBar/components/BooleanFilter';
import { FilterData, JsonKeyType } from '../types/search';

interface SearchBarProps {
    jsonKeyTypes: JsonKeyType;
    onSearch: (filters: FilterData[]) => void;
}

const FILTER_COMPONENTS = {
    string: StringFilter,
    boolean: BooleanFilter,
    // Puedes agregar más tipos aquí
};

const SearchBar: React.FC<SearchBarProps> = ({ jsonKeyTypes, onSearch }) => {
    const [filters, setFilters] = useState<FilterData[]>([]);
    const [availableFields] = useState(() =>
        Object.entries(jsonKeyTypes).map(([key, value]) => ({
            key,
            type: value.type,
            defaultValue: value.defaultValue
        }))
    );

    const addNewFilter = (key: string) => {
        const keyConfig = jsonKeyTypes[key];
        const newFilter: FilterData = {
            id: Date.now().toString(),
            key,
            value: keyConfig.defaultValue ?? '',
            type: keyConfig.type,
            isValid: false
        };

        setFilters([...filters, newFilter]);
    };

    const updateFilter = (filterData: FilterData) => {
        setFilters(filters.map(filter =>
            filter.id === filterData.id ? filterData : filter
        ));
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter(filter => filter.id !== id));
    };

    const handleSearch = () => {
        if (filters.every(filter => filter.isValid)) {
            onSearch(filters);
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Búsqueda Avanzada</h3>
                <select
                    onChange={(e) => addNewFilter(e.target.value)}
                    value=""
                    className="p-2 border rounded"
                >
                    <option value="">Agregar filtro...</option>
                    {availableFields.map(({ key, type }) => (
                        <option key={key} value={key}>
                            {key} ({type})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                {filters.map((filter) => {
                    const FilterComponent = FILTER_COMPONENTS[filter.type];
                    return (
                        <FilterComponent
                            key={filter.id}
                            id={filter.id}
                            fieldKey={filter.key}
                            onDelete={() => removeFilter(filter.id)}
                            onChange={updateFilter}
                            initialValue={filter.value}
                        />
                    );
                })}
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSearch}
                    disabled={!filters.every(f => f.isValid)}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded
            ${filters.every(f => f.isValid)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
                >
                    Buscar
                </button>
            </div>
        </div>
    );
};

export default SearchBar;