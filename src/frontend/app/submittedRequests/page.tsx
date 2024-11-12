'use client';

import React, { useEffect, useState } from 'react';

const endpoint = 'http://localhost:3001/data';

interface FormTypes {
    id: number;
    name: string;
    receipt: string;
}

function SubmittedRequestsPage() {
    const [data, setData] = useState<FormTypes[]>([]);

    useEffect(() => {
        fetch(endpoint)
            .then(response => response.json())
            .then((data: FormTypes[]) => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className='p-10'>
            {data.map(form => (
                <div key={form.id}>
                    <p>Name: {form.name}</p>
                    <p>Receipt: {form.receipt}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default SubmittedRequestsPage;
