'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

const endpoint = 'http://localhost:3001/form';

interface FormData {
    name: string;
    receipt: string;
}

function SubmitRequestPage() {
    const [formInput, setFormInput] = useState<FormData>({
        name: '',
        receipt: '',
    });


    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormInput(prevState => ({
            ...prevState,
            [name]: name === 'id' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(formInput),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: FormData) => {
                setFormInput({
                    name: '',
                    receipt: '',
                });
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });
    };


    return (
        <div className='p-10'>
            <h2>Submit New Request</h2>
            <form onSubmit={handleSubmit}>
                <div className='p-4'>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formInput.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md
                       bg-white text-black"
                    />
                </div>
                <div className='p-4'>
                    <label>Receipt:</label>
                    <input
                        type="text"
                        name="receipt"
                        value={formInput.receipt}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md
                       bg-white text-black"
                    />
                </div>
                <div className='p-4'>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>

            </form>
        </div>
    );
}

export default SubmitRequestPage;
