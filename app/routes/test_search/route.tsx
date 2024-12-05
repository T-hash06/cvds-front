
import React from 'react';
import SearchBar from '@shared/components/searchBar/SearchBar';
import { JsonKeyType } from '@shared/components/types/search';

const YourPage: React.FC = () => {
    const jsonKeyTypes: JsonKeyType = {
        nombre: { type: 'string', defaultValue: '' },
        activo: { type: 'boolean', defaultValue: true },
        edad: { type: 'number', defaultValue: 0 }
    };

    const handleSearch = (filters) => {
        console.log('Filtros aplicados:', filters);
    };

    return (
        <div className="p-4">
            <SearchBar
                jsonKeyTypes={jsonKeyTypes}
                onSearch={handleSearch}
            />
        </div>
    );
};

export default YourPage;